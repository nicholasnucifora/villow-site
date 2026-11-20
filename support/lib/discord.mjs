import { HttpError, projectConfig, projectOrigin } from './config.mjs';
import { digest, normaliseEmail, nowSeconds, privateHash, randomToken, rateLimit } from './privacy.mjs';

const id = value => typeof value === 'string' && /^\d{17,20}$/.test(value);
const tokenShape = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
export const discordCookieName = '__Host-ftw-discord';
export function discordReady(env) {
  return env.DISCORD_ENABLED === 'true' && id(env.DISCORD_CLIENT_ID) && id(env.DISCORD_GUILD_ID) &&
    id(env.DISCORD_SUPPORTER_ROLE_ID) && id(env.DISCORD_ONGOING_ROLE_ID) &&
    env.DISCORD_SUPPORTER_ROLE_ID !== env.DISCORD_ONGOING_ROLE_ID &&
    !!env.DISCORD_CLIENT_SECRET && !!env.DISCORD_BOT_TOKEN &&
    /^https:\/\/[a-z0-9.-]+\/v1\/discord\/callback$/.test(env.DISCORD_REDIRECT_URI || '') &&
    (env.STRIPE_MODE === 'live' || (env.STRIPE_MODE === 'test' && id(env.DISCORD_TEST_USER_ID)));
}
function requireReady(env) {
  if (!discordReady(env)) throw new HttpError(503, 'Discord linking is not available yet.');
}
export async function requestDiscordLink(db, env, projectId, project, email, sendEmail, now = nowSeconds()) {
  requireReady(env);
  const address = normaliseEmail(email);
  const emailHash = await privateHash(env, `email:${address}`);
  await rateLimit(db, `discord-email:${projectId}:${emailHash}`, 3, 3600, now);
  // Verify every inbox first. Only its owner can learn whether support exists;
  // the request page must not claim an email was sent when no payment matches.
  const token = randomToken(); const hash = await digest(token);
  await db.prepare('INSERT INTO discord_tokens(token_hash, project, email_hash, expires_at) VALUES (?, ?, ?, ?)')
    .bind(hash, projectId, emailHash, now + 1800).run();
  try {
    await sendEmail({ to: address, project: projectId, purpose: 'discord', url: `${project.origin}/support#discord-link=${token}` });
  } catch (error) {
    await db.prepare('DELETE FROM discord_tokens WHERE token_hash = ?').bind(hash).run(); throw error;
  }
}
async function consumeLinkToken(db, project, token, now) {
  if (!tokenShape(token)) throw new HttpError(400, 'This Discord link is invalid or expired. Request a new one.');
  const row = await db.prepare(`UPDATE discord_tokens SET used_at = ?
    WHERE token_hash = ? AND project = ? AND used_at IS NULL AND expires_at > ? RETURNING email_hash`)
    .bind(now, await digest(token), project, now).first();
  if (!row) throw new HttpError(400, 'This Discord link is invalid or expired. Request a new one.');
  return row.email_hash;
}
// A verified email link can inspect its own connection without consuming the
// token. Public email requests still never disclose whether an account exists.
export async function discordLinkStatus(db, env, project, token, now = nowSeconds()) {
  requireReady(env);
  if (!tokenShape(token)) throw new HttpError(400, 'This link has expired. Request a new email link.');
  const verified = await db.prepare(`SELECT email_hash FROM discord_tokens
    WHERE token_hash = ? AND project = ? AND used_at IS NULL AND expires_at > ?`)
    .bind(await digest(token), project, now).first();
  if (!verified) throw new HttpError(400, 'This link has expired. Request a new email link.');
  const linked = await db.prepare('SELECT disconnect_requested FROM discord_links WHERE email_hash = ?').bind(verified.email_hash).first();
  const entitlement = await supporterEntitlements(db, verified.email_hash, now);
  return { eligible: entitlement.supporter, connected: !!linked, disconnecting: linked?.disconnect_requested === 1 };
}
export async function beginDiscord(db, env, project, token, now = nowSeconds(), returnOrigin = projectConfig(env, project).origin) {
  requireReady(env);
  projectOrigin(projectConfig(env, project), returnOrigin);
  if (!(await discordLinkStatus(db, env, project, token, now)).eligible) throw new HttpError(403, 'No completed contribution was found for this email.');
  const emailHash = await consumeLinkToken(db, project, token, now);
  const state = randomToken(); const browserSecret = randomToken();
  await db.prepare(`INSERT INTO discord_oauth_states(state_hash, cookie_hash, project, email_hash, expires_at, return_origin)
    VALUES (?, ?, ?, ?, ?, ?)`).bind(await digest(state), await digest(browserSecret), project, emailHash, now + 600, returnOrigin).run();
  const target = new URL('https://discord.com/oauth2/authorize');
  target.search = new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, response_type: 'code',
    scope: 'identify guilds.join', state, redirect_uri: env.DISCORD_REDIRECT_URI, prompt: 'consent' }).toString();
  return new Response(null, { status: 303, headers: { Location: target.href, 'Cache-Control': 'no-store',
    'Referrer-Policy': 'no-referrer',
    'Set-Cookie': `${discordCookieName}=${browserSecret}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600` } });
}
export async function supporterEntitlements(db, emailHash, now = nowSeconds()) {
  const paid = await db.prepare(`SELECT MAX(CASE WHEN c.kind = 'monthly' AND s.status IN ('active', 'canceled')
    AND s.current_period_end > ? THEN s.current_period_end ELSE NULL END) AS ongoing_until,
    COUNT(*) AS payments FROM contributions c JOIN payments p
    ON p.session_id = c.session_id OR p.subscription_id = c.subscription_id
    LEFT JOIN subscriptions s ON s.subscription_id = c.subscription_id
    WHERE c.email_hash = ? AND p.amount >= 500 AND p.currency = 'aud'`).bind(now, emailHash).first();
  return { supporter: paid.payments > 0, ongoing: !!paid.ongoing_until, ongoingUntil: paid.ongoing_until };
}
async function discordFetch(env, fetcher, path, init = {}) {
  return fetcher(`https://discord.com/api/v10${path}`, {
    ...init, signal: AbortSignal.timeout(12000), headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      'User-Agent': 'FixTheWebSupport (https://fixtheweb.org, 1.0)', ...init.headers },
  });
}
export async function syncDiscordLink(db, env, emailHash, fetcher = fetch, now = nowSeconds(), joinToken = null) {
  requireReady(env);
  const row = await db.prepare(`UPDATE discord_links SET lease_until = ?
    WHERE email_hash = ? AND lease_until <= ? RETURNING *`).bind(now + 120, emailHash, now).first();
  if (!row) return 'pending';
  let result = 'pending'; let next = now + 900;
  try {
    // A real server is used for owner-only testing. Test payments never grant roles to other members.
    if (env.STRIPE_MODE === 'test' && row.user_id !== env.DISCORD_TEST_USER_ID) { result = 'test-account-only'; return result; }
    const memberPath = `/guilds/${env.DISCORD_GUILD_ID}/members/${row.user_id}`;
    let member = await discordFetch(env, fetcher, memberPath);
    if (member.status === 404 && !row.disconnect_requested && joinToken) {
      // Only the just-authorised OAuth callback can join someone. Cron never retains
      // a user token or adds a member back after they choose to leave the server.
      const joined = await discordFetch(env, fetcher, memberPath, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: joinToken }),
      });
      if (joined.ok) member = await discordFetch(env, fetcher, memberPath);
    }
    if (member.status === 404) {
      result = 'join-server';
      if (row.disconnect_requested) result = 'disconnected';
    } else {
      if (!member.ok) throw new Error('Discord member lookup failed');
      const account = await member.json();
      if (account.pending && !row.disconnect_requested) { result = 'screening'; return result; }
      const entitlement = row.disconnect_requested ? { supporter: false, ongoing: false } : await supporterEntitlements(db, emailHash, now);
      for (const [role, desired] of [[env.DISCORD_SUPPORTER_ROLE_ID, entitlement.supporter], [env.DISCORD_ONGOING_ROLE_ID, entitlement.ongoing]]) {
        if (account.roles?.includes(role) === desired) continue;
        const changed = await discordFetch(env, fetcher, `/guilds/${env.DISCORD_GUILD_ID}/members/${row.user_id}/roles/${role}`, {
          method: desired ? 'PUT' : 'DELETE', headers: { 'X-Audit-Log-Reason': 'Verified supporter account preference' },
        });
        if (!changed.ok) throw new Error('Discord role update failed');
      }
      result = row.disconnect_requested ? 'disconnected' : 'connected';
      next = Math.min(now + 86400, entitlement.ongoingUntil || now + 86400);
    }
    if (result === 'disconnected') {
      await db.prepare('DELETE FROM discord_links WHERE email_hash = ? AND version = ? AND disconnect_requested = 1')
        .bind(emailHash, row.version).run();
    }
  } catch { result = 'pending'; }
  finally {
    // A webhook or disconnect during the API calls keeps the row queued for another pass.
    await db.prepare(`UPDATE discord_links SET lease_until = 0, last_result = ?,
      sync_due = CASE WHEN version = ? THEN ? ELSE 0 END WHERE email_hash = ?`)
      .bind(result, row.version, next, emailHash).run();
  }
  return result;
}
export async function disconnectDiscord(db, env, project, token, fetcher = fetch, now = nowSeconds()) {
  requireReady(env);
  const emailHash = await consumeLinkToken(db, project, token, now);
  await db.batch([
    db.prepare('DELETE FROM discord_oauth_states WHERE email_hash = ?').bind(emailHash),
    db.prepare('UPDATE discord_tokens SET used_at = ? WHERE email_hash = ? AND used_at IS NULL').bind(now, emailHash),
    db.prepare('UPDATE discord_links SET disconnect_requested = 1, sync_due = 0, version = version + 1 WHERE email_hash = ?').bind(emailHash),
  ]);
  const existing = await db.prepare('SELECT 1 FROM discord_links WHERE email_hash = ?').bind(emailHash).first();
  if (!existing) return 'disconnected';
  return syncDiscordLink(db, env, emailHash, fetcher, now);
}
export async function finishDiscord(db, env, request, { fetcher = fetch, refreshSubscriptions = async () => {} } = {}, now = nowSeconds()) {
  requireReady(env);
  const url = new URL(request.url); const state = url.searchParams.get('state');
  const cookie = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${discordCookieName}=`))?.slice(discordCookieName.length + 1);
  if (!tokenShape(state) || !tokenShape(cookie)) throw new HttpError(400, 'Discord verification expired. Please request a new email link.');
  const binding = await db.prepare(`UPDATE discord_oauth_states SET used_at = ? WHERE state_hash = ? AND cookie_hash = ?
    AND used_at IS NULL AND expires_at > ? RETURNING project, email_hash, return_origin`)
    .bind(now, await digest(state), await digest(cookie), now).first();
  if (!binding) throw new HttpError(400, 'Discord verification expired. Please request a new email link.');
  const project = projectConfig(env, binding.project);
  const returnOrigin = projectOrigin(project, binding.return_origin || project.origin);
  let result = 'failed'; let accessToken; let ongoing = false;
  try {
    if (url.searchParams.get('error') === 'access_denied') result = 'cancelled';
    else {
      if (url.searchParams.get('iss') !== 'https://discord.com' || !url.searchParams.get('code')) throw new Error('Invalid OAuth response');
      const tokenResponse = await fetcher('https://discord.com/api/oauth2/token', {
        method: 'POST', signal: AbortSignal.timeout(12000), headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: env.DISCORD_REDIRECT_URI }),
      });
      if (!tokenResponse.ok) throw new Error('Discord exchange failed');
      const auth = await tokenResponse.json(); accessToken = auth.access_token;
      if (auth.token_type?.toLowerCase() !== 'bearer' || !accessToken || !auth.scope?.split(' ').includes('identify')) throw new Error('Invalid token response');
      const profile = await fetcher('https://discord.com/api/v10/users/@me', {
        signal: AbortSignal.timeout(12000), headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!profile.ok) throw new Error('Discord profile failed');
      const user = await profile.json();
      if (!id(user.id)) throw new Error('Invalid Discord identity');
      if (env.STRIPE_MODE === 'test' && user.id !== env.DISCORD_TEST_USER_ID) result = 'test-account-only';
      else {
        await refreshSubscriptions(binding.email_hash);
        const entitlement = await supporterEntitlements(db, binding.email_hash, now);
        ongoing = entitlement.ongoing;
        if (!entitlement.supporter) throw new Error('No confirmed payment');
        const existing = await db.prepare('SELECT email_hash, user_id, disconnect_requested FROM discord_links WHERE email_hash = ? OR user_id = ?')
          .bind(binding.email_hash, user.id).all();
        if (existing.results.some(row => row.email_hash !== binding.email_hash || row.user_id !== user.id || row.disconnect_requested)) result = 'already-linked';
        else {
          const saved = await db.prepare(`INSERT INTO discord_links(email_hash, user_id, created_at)
            SELECT ?, ?, ? WHERE EXISTS (SELECT 1 FROM discord_oauth_states WHERE state_hash = ? AND cookie_hash = ? AND used_at = ?)
            ON CONFLICT(email_hash) DO UPDATE SET sync_due = 0, version = version + 1
            WHERE discord_links.user_id = excluded.user_id AND disconnect_requested = 0`)
            .bind(binding.email_hash, user.id, now, await digest(state), await digest(cookie), now).run();
          result = saved.meta.changes ? await syncDiscordLink(db, env, binding.email_hash, fetcher, now,
            auth.scope.split(' ').includes('guilds.join') ? accessToken : null) : 'cancelled';
        }
      }
    }
  } catch { result = 'failed'; }
  finally {
    // Joining is confined to this authorised request. Never persist user tokens or profile data.
    if (accessToken) {
      try { await fetcher('https://discord.com/api/oauth2/token/revoke', { method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, token: accessToken, token_type_hint: 'access_token' }) }); } catch { /* Short-lived provider token is not retained. */ }
    }
  }
  return new Response(null, { status: 303, headers: { Location: `${returnOrigin}/support#discord=${result}${result === 'connected' && ongoing ? '&ongoing=1' : ''}`,
    'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
    'Set-Cookie': `${discordCookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` } });
}
export async function syncDueDiscord(db, env, fetcher = fetch, now = nowSeconds()) {
  if (!discordReady(env)) return;
  const { results } = await db.prepare('SELECT email_hash FROM discord_links WHERE sync_due <= ? AND lease_until <= ? ORDER BY sync_due LIMIT 12').bind(now, now).all();
  for (const row of results) await syncDiscordLink(db, env, row.email_hash, fetcher, now);
}
