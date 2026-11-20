import { HttpError } from './config.mjs';
const encoder = new TextEncoder();
export const nowSeconds = () => Math.floor(Date.now() / 1000);
export function normaliseEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw new HttpError(400, 'Enter a valid email address.');
  return value.trim().toLowerCase();
}
export async function digest(value) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}
export async function privateHash(env, value) {
  if ((env.EMAIL_HASH_SECRET || '').length < 32) throw new Error('Missing hashing secret');
  const key = await crypto.subtle.importKey('raw', encoder.encode(env.EMAIL_HASH_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}
function hex(bytes) { return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join(''); }
export function randomToken() { return hex(crypto.getRandomValues(new Uint8Array(32))); }
export async function rateLimit(db, bucket, limit, seconds, now = nowSeconds()) {
  const window = Math.floor(now / seconds);
  const row = await db.prepare(`INSERT INTO rate_limits (bucket, count, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(bucket) DO UPDATE SET count = count + 1 RETURNING count`).bind(`${bucket}:${window}`, (window + 1) * seconds).first();
  if (row.count > limit) throw new HttpError(429, 'Please wait before trying again.');
}
export async function requestRemoval(db, env, projectId, project, email, sendEmail) {
  const emailHash = await privateHash(env, `email:${normaliseEmail(email)}`);
  // Same email limit applies even when there are no records, to avoid enumeration.
  await rateLimit(db, `email:${projectId}:${emailHash}`, 3, 3600);
  const exists = await db.prepare('SELECT 1 FROM contributions WHERE project = ? AND email_hash = ? AND consent = 1 AND removed_at IS NULL LIMIT 1').bind(projectId, emailHash).first();
  if (!exists) return;
  const token = randomToken();
  const tokenHash = await digest(token);
  await db.prepare('INSERT INTO removal_tokens(token_hash, project, email_hash, expires_at) VALUES (?, ?, ?, ?)').bind(tokenHash, projectId, emailHash, nowSeconds() + 1800).run();
  try {
    // Fragment keeps the credential out of HTTP URLs, referrers and access logs.
    await sendEmail({ to: normaliseEmail(email), url: `${project.origin}/support#remove=${token}`, project: projectId });
  } catch (error) {
    await db.prepare('DELETE FROM removal_tokens WHERE token_hash = ?').bind(tokenHash).run();
    throw error;
  }
}
export async function confirmRemoval(db, project, token, now = nowSeconds()) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw new HttpError(400, 'This removal link is invalid or expired. Request a new one.');
  const hash = await digest(token);
  const valid = 'SELECT email_hash FROM removal_tokens WHERE token_hash = ? AND project = ? AND used_at IS NULL AND expires_at > ?';
  // D1 batch is transactional. Conditions are repeated inside the transaction:
  // concurrent requests cannot reuse the token or publish during removal.
  const result = await db.batch([
    db.prepare(`INSERT INTO suppressions(project, email_hash, removed_at) SELECT project, email_hash, ? FROM removal_tokens
      WHERE token_hash = ? AND project = ? AND used_at IS NULL AND expires_at > ?
      ON CONFLICT(project, email_hash) DO NOTHING`).bind(now, hash, project, now),
    db.prepare(`UPDATE contributions SET consent = 0, display_name = NULL, message = NULL, removed_at = ?
      WHERE project = ? AND email_hash IN (${valid})`).bind(now, project, hash, project, now),
    db.prepare(`UPDATE removal_tokens SET used_at = ? WHERE project = ? AND email_hash IN (${valid})`).bind(now, project, hash, project, now),
  ]);
  if (!result[2].meta.changes) throw new HttpError(400, 'This removal link is invalid or expired. Request a new one.');
}
