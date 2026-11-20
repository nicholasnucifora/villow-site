import { HttpError, projectConfig } from './config.mjs';
import { digest, randomToken, privateHash, rateLimit, nowSeconds } from './privacy.mjs';
import { reviewStatusSQL, reviewStates, censorSuggestion } from './message-review.mjs';
import { adminHTML, adminCSS, adminJS } from '../ui/moderation.mjs';

export const adminPath = '/admin/support';
const eligible = `consent = 1 AND removed_at IS NULL AND (display_name IS NOT NULL OR message IS NOT NULL)
  AND NOT EXISTS(SELECT 1 FROM suppressions s WHERE s.project = contributions.project AND s.email_hash = contributions.email_hash)`;
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY', 'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" };
const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { ...headers, 'Content-Type': 'application/json', ...extra } });
function cookieName(url) { return url.protocol === 'https:' ? '__Secure-villow_review' : 'villow_review_local'; }
function cookie(url, value, age = 28800) {
  return `${cookieName(url)}=${value}; Path=${adminPath}; HttpOnly; SameSite=Strict; Max-Age=${age}${url.protocol === 'https:' ? '; Secure' : ''}`;
}
function tokenFrom(request, url) {
  const value = (request.headers.get('cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName(url)}=`))?.split('=')[1];
  return /^[a-f0-9]{64}$/.test(value || '') ? value : null;
}
async function authenticate(request, env, url) {
  const token = tokenFrom(request, url);
  if (!token) throw new HttpError(401, 'Please sign in.');
  const hash = await digest(token);
  const valid = await env.DB.prepare('SELECT 1 FROM moderation_sessions WHERE token_hash = ? AND credential_version = ? AND expires_at > ?')
    .bind(hash, env.MODERATION_PASSWORD_HASH, nowSeconds()).first();
  if (!valid) throw new HttpError(401, 'Please sign in again.');
  return hash;
}
export async function moderationRoute(request, env, readJSON) {
  const url = new URL(request.url);
  // No fallback credentials. The loopback exception is exclusively an isolated
  // test environment; live mode always requires HTTPS and the configured host.
  const local = env.MODERATION_LOCAL_PREVIEW === 'true' && env.STRIPE_MODE === 'test' && ['127.0.0.1', 'localhost'].includes(url.hostname);
  if (env.MODERATION_ENABLED !== 'true' || !/^[a-f0-9]{64}$/.test(env.MODERATION_PASSWORD_HASH || '') ||
      url.origin !== env.MODERATION_ORIGIN || (url.protocol !== 'https:' && !local)) throw new HttpError(404, 'Not found.');
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Open the review page directly.');
  const path = url.pathname.slice(adminPath.length);
  if (request.method === 'GET' && ['', '/', '/app.js', '/app.css'].includes(path)) {
    const type = path === '/app.js' ? 'text/javascript' : path === '/app.css' ? 'text/css' : 'text/html';
    return new Response(path === '/app.js' ? adminJS : path === '/app.css' ? adminCSS : adminHTML(local), { headers: { ...headers, 'Content-Type': `${type}; charset=utf-8` } });
  }
  if (!path.startsWith('/api/')) throw new HttpError(404, 'Not found.');
  if (request.method !== 'GET' && request.method !== 'POST') throw new HttpError(405, 'Method not allowed.');
  if (request.method === 'POST' && request.headers.get('origin') !== url.origin) throw new HttpError(403, 'Origin not allowed.');
  if (path === '/api/login' && request.method === 'POST') {
    const ip = await privateHash(env, `admin-ip:${request.headers.get('cf-connecting-ip') || 'local'}`);
    await rateLimit(env.DB, `moderation-login:${ip}`, 5, 900);
    await rateLimit(env.DB, 'moderation-login:total', 100, 900);
    const body = await readJSON(request, 1024);
    if (typeof body?.password !== 'string' || body.password.length > 200) throw new HttpError(401, 'That password wasn’t recognised.');
    // The setup tool generates 256 random bits, not a human-chosen password.
    // Hash with a fresh nonce before comparison to avoid prefix timing leaks.
    const nonce = randomToken();
    if (await digest(nonce + await digest(body.password)) !== await digest(nonce + env.MODERATION_PASSWORD_HASH)) throw new HttpError(401, 'That password wasn’t recognised.');
    const token = randomToken();
    await env.DB.prepare('INSERT INTO moderation_sessions(token_hash, credential_version, expires_at) VALUES (?, ?, ?)')
      .bind(await digest(token), env.MODERATION_PASSWORD_HASH, nowSeconds() + 28800).run();
    return json({ signedIn: true }, 200, { 'Set-Cookie': cookie(url, token) });
  }
  const authHash = await authenticate(request, env, url);
  if (path === '/api/session' && request.method === 'GET') return json({ signedIn: true });
  if (path === '/api/logout' && request.method === 'POST') {
    await env.DB.prepare('DELETE FROM moderation_sessions WHERE token_hash = ?').bind(authHash).run();
    return json({ signedIn: false }, 200, { 'Set-Cookie': cookie(url, '', 0) });
  }
  // One configured project, never a project/Stripe identifier supplied by a visitor.
  const project = env.MODERATION_PROJECT || 'villow'; projectConfig(env, project);
  if (path === '/api/messages' && request.method === 'GET') {
    const state = url.searchParams.get('state') || 'unreviewed';
    const order = url.searchParams.get('order') || 'newest';
    const rawPage = url.searchParams.get('page') || '0';
    if (!['all', ...reviewStates].includes(state) || !['newest', 'oldest'].includes(order) || !/^\d{1,5}$/.test(rawPage)) throw new HttpError(400, 'Invalid filter.');
    const page = Number(rawPage), sort = order === 'oldest' ? 'ASC' : 'DESC';
    const where = `project = ? AND ${eligible}`;
    const { results: totals } = await env.DB.prepare(`SELECT ${reviewStatusSQL} AS status, COUNT(*) AS count FROM contributions WHERE ${where} GROUP BY status`).bind(project).all();
    const counts = Object.fromEntries(reviewStates.map(key => [key, 0]));
    for (const row of totals) counts[row.status] = row.count;
    counts.all = Object.values(counts).reduce((a, b) => a + b, 0);
    const { results } = await env.DB.prepare(`SELECT review_id AS id, display_name AS name, message, censored_name, censored_message, ${reviewStatusSQL} AS status, review_version AS version
      FROM contributions WHERE ${where} ${state === 'all' ? '' : `AND (${reviewStatusSQL}) = ?`}
      ORDER BY created_at ${sort}, review_id ${sort} LIMIT 25 OFFSET ?`).bind(project, ...(state === 'all' ? [] : [state]), page * 25).all();
    const messages = results.map(({ censored_name, censored_message, ...row }) => ({ ...row,
      publicName: censored_name ?? row.name, publicMessage: censored_message ?? row.message,
      censored: censored_name !== null || censored_message !== null, suggestion: censorSuggestion(row.name, row.message) }));
    return json({ messages, counts, page, hasMore: (page + 1) * 25 < counts[state] });
  }
  if (path === '/api/decision' && request.method === 'POST') {
    const body = await readJSON(request, 1024);
    if (!/^[a-f0-9]{32}$/.test(body?.id || '') || !reviewStates.includes(body.status) || !Number.isSafeInteger(body.version) || body.version < 0) throw new HttpError(400, 'Invalid review action.');
    const variant = body.variant || 'keep';
    if (!['keep', 'censored', 'original'].includes(variant) || (variant !== 'keep' && body.status !== 'approved')) throw new HttpError(400, 'Invalid message version.');
    let name = null, message = null;
    if (variant === 'censored') {
      const row = await env.DB.prepare(`SELECT display_name, message FROM contributions WHERE review_id = ? AND review_version = ? AND project = ? AND ${eligible}`).bind(body.id, body.version, project).first();
      if (!row) throw new HttpError(409, 'This message changed or was removed. Refresh the list before reviewing it.');
      const suggestion = censorSuggestion(row.display_name, row.message);
      if (!suggestion.changed) throw new HttpError(400, 'No suggested censorship for this message.');
      name = suggestion.name !== row.display_name ? suggestion.name : null;
      message = suggestion.message !== row.message ? suggestion.message : null;
    }
    const moderation = body.status === 'approved' ? 'approved' : body.status === 'hidden' ? 'hidden' : 'pending';
    const result = await env.DB.prepare(`UPDATE contributions SET moderation = ?, auto_publish = ?, review_version = review_version + 1
      ${variant === 'keep' ? '' : ', censored_name = ?, censored_message = ?'}
      WHERE review_id = ? AND review_version = ? AND project = ? AND ${eligible}`)
      .bind(moderation, body.status === 'unreviewed' ? 1 : 0, ...(variant === 'keep' ? [] : [name, message]), body.id, body.version, project).run();
    if (!result.meta.changes) throw new HttpError(409, 'This message changed or was removed. Refresh the list before reviewing it.');
    return json({ saved: true });
  }
  throw new HttpError(404, 'Not found.');
}
