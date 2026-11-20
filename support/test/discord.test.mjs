import test from 'node:test';
import assert from 'node:assert/strict';
import { database, environment, session, fakeStripe, event, project } from './helpers.mjs';
import { processEvent, queueDiscordForEvent, recentSupporters } from '../lib/events.mjs';
import { privateHash, digest, requestRemoval, confirmRemoval } from '../lib/privacy.mjs';
import { beginDiscord, discordCookieName, discordReady, disconnectDiscord, discordLinkStatus, finishDiscord, requestDiscordLink, supporterEntitlements, syncDiscordLink, syncDueDiscord } from '../lib/discord.mjs';
import { createWorker } from '../worker.mjs';

const now = 1800000000;
const userId = '1523582210056126494';
const roles = { supporter: '1567088430628737136', ongoing: '1567088983496982620', other: '1567088430628737137' };

test('local email links and OAuth return to their trusted origin without changing the public website', async () => {
  const db = database(); const env = configured(db); const local = 'http://127.0.0.1:4411';
  env.PROJECTS_JSON = JSON.stringify({ villow: { ...project, additional_origins: [local] } });
  await paid(db, env, { consent: true });
  const messages = []; const fake = provider();
  const worker = createWorker({ sendEmail: async message => messages.push(message), discordFetch: fake.fetcher, stripe: fakeStripe() });
  const send = (action, origin) => worker.fetch(new Request(`https://support.example/v1/projects/villow/${action}`, {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'sam@example.com', returnUrl: 'https://evil.example' }),
  }), env);
  for (const origin of [local, project.origin]) {
    assert.equal((await send('discord-request', origin)).status, 200);
    const link = new URL(messages.at(-1).url); assert.equal(link.origin, origin);
    const token = new URLSearchParams(link.hash.slice(1)).get('discord-link');
    const start = await worker.fetch(new Request('https://support.example/v1/projects/villow/discord-start', {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token, return_origin: 'https://evil.example' }),
    }), env);
    assert.equal(start.status, 303);
    const state = new URL(start.headers.get('Location')).searchParams.get('state');
    const cookie = start.headers.get('Set-Cookie').split(';')[0];
    const response = await worker.fetch(new Request(`${env.DISCORD_REDIRECT_URI}?state=${state}&code=code&iss=https%3A%2F%2Fdiscord.com`, { headers: { cookie } }), env);
    assert.equal(response.headers.get('Location'), `${origin}/support#discord=connected`);
    assert.equal((await send('removal-request', origin)).status, 200);
    assert.equal(new URL(messages.at(-1).url).origin, origin);
  }
  const token = await linkToken(db, env);
  await assert.rejects(beginDiscord(db, env, 'villow', token, now, 'https://evil.example'));
  assert.equal((await db.prepare('SELECT used_at FROM discord_tokens WHERE token_hash = ?').bind(await digest(token)).first()).used_at, null);
});
function configured(db) {
  return { ...environment(db), DISCORD_ENABLED: 'true', DISCORD_CLIENT_ID: '1567089987013312694',
    DISCORD_GUILD_ID: '1523582670867791882', DISCORD_SUPPORTER_ROLE_ID: roles.supporter,
    DISCORD_ONGOING_ROLE_ID: roles.ongoing, DISCORD_TEST_USER_ID: userId,
    DISCORD_CLIENT_SECRET: 'test-discord-secret', DISCORD_BOT_TOKEN: 'test-bot-token',
    DISCORD_REDIRECT_URI: 'https://support.example/v1/discord/callback' };
}
async function paid(db, env, { monthly = false, consent = false } = {}) {
  const s = session(monthly ? { id: 'cs_monthly', mode: 'subscription', payment_link: 'plink_ten', subscription: 'sub_1', invoice: 'in_first' } : {});
  if (!consent) s.custom_fields[2].dropdown.value = 'no';
  const stripe = fakeStripe(s);
  stripe.subscriptions.retrieve = async id => ({ id, status: 'active', cancel_at_period_end: false, items: { data: [{ current_period_end: now + 3600 }] } });
  await processEvent(db, env, stripe, event('checkout.session.completed', s));
  return { hash: await privateHash(env, 'email:sam@example.com'), stripe, s };
}
async function linkToken(db, env, timestamp = now) {
  let message;
  await requestDiscordLink(db, env, 'villow', project, 'sam@example.com', async data => { message = data; }, timestamp);
  return new URLSearchParams(new URL(message.url).hash.slice(1)).get('discord-link');
}
function provider({ user = userId, memberRoles = [], pending = false, failure = false, onRole = () => {} } = {}) {
  const current = new Set(memberRoles); const calls = [];
  const fetcher = async (url, init = {}) => {
    const path = new URL(url).pathname; calls.push({ path, method: init.method || 'GET' });
    if (path === '/api/oauth2/token') return Response.json({ access_token: 'temporary-access', token_type: 'Bearer', scope: 'identify guilds.join' });
    if (path === '/api/oauth2/token/revoke') return new Response(null, { status: 200 });
    if (path === '/api/v10/users/@me') return Response.json({ id: user, username: 'not-stored' });
    if (path.endsWith(`/members/${userId}`)) return Response.json({ roles: [...current], pending });
    if (path.includes('/roles/')) {
      if (failure) return new Response(null, { status: 429 });
      const role = path.split('/').at(-1);
      if (init.method === 'PUT') current.add(role); else current.delete(role);
      await onRole(); return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected mock request: ${path}`);
  };
  return { fetcher, calls, current };
}
async function callback(db, env, token, fetcher, timestamp = now) {
  const start = await beginDiscord(db, env, 'villow', token, timestamp);
  const state = new URL(start.headers.get('Location')).searchParams.get('state');
  const cookie = start.headers.get('Set-Cookie').split(';')[0];
  const request = new Request(`${env.DISCORD_REDIRECT_URI}?state=${state}&code=test-code&iss=https%3A%2F%2Fdiscord.com`, { headers: { cookie } });
  return { request, response: await finishDiscord(db, env, request, { fetcher }, timestamp) };
}

test('Discord eligibility is permanent after payment, independent of consent and public removal', async () => {
  const db = database(); const env = configured(db); const { hash } = await paid(db, env, { consent: true });
  let removal;
  await requestRemoval(db, env, 'villow', project, 'sam@example.com', async data => { removal = data; });
  await confirmRemoval(db, 'villow', new URLSearchParams(new URL(removal.url).hash.slice(1)).get('remove'));
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  assert.deepEqual(await supporterEntitlements(db, hash, now), { supporter: true, ongoing: false, ongoingUntil: null });
  assert(await linkToken(db, env));
});

test('email link is purpose-specific, scoped, expiring, single use; GET does not consume it', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const token = await linkToken(db, env);
  await assert.rejects(beginDiscord(db, env, 'other', token, now));
  await assert.rejects(confirmRemoval(db, 'villow', token, now));
  assert.equal((await db.prepare('SELECT used_at FROM discord_tokens').first()).used_at, null);
  const response = await beginDiscord(db, env, 'villow', token, now);
  assert.match(response.headers.get('Set-Cookie'), /HttpOnly; Secure; SameSite=Lax/);
  assert.equal(new URL(response.headers.get('Location')).searchParams.get('scope'), 'identify guilds.join');
  await assert.rejects(beginDiscord(db, env, 'villow', token, now));
  const expired = await linkToken(db, env, now + 3600);
  await assert.rejects(beginDiscord(db, env, 'villow', expired, now + 5401));
});

test('OAuth state is bound to the browser, is single use, and token/profile data is not stored', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const token = await linkToken(db, env); const fake = provider({ memberRoles: [roles.other] });
  const start = await beginDiscord(db, env, 'villow', token, now);
  const state = new URL(start.headers.get('Location')).searchParams.get('state');
  const url = `${env.DISCORD_REDIRECT_URI}?state=${state}&code=test&iss=https%3A%2F%2Fdiscord.com`;
  await assert.rejects(finishDiscord(db, env, new Request(url), { fetcher: fake.fetcher }, now));
  await assert.rejects(finishDiscord(db, env, new Request(url, { headers: { cookie: `${discordCookieName}=${'a'.repeat(64)}` } }), { fetcher: fake.fetcher }, now));
  assert.equal(fake.calls.length, 0);
  const valid = new Request(url, { headers: { cookie: start.headers.get('Set-Cookie').split(';')[0] } });
  const response = await finishDiscord(db, env, valid, { fetcher: fake.fetcher }, now);
  assert.equal(response.headers.get('Location'), `${project.origin}/support#discord=connected`);
  assert.deepEqual([...fake.current].sort(), [roles.other, roles.supporter].sort());
  await assert.rejects(finishDiscord(db, env, valid, { fetcher: fake.fetcher }, now));
  const stored = await db.prepare('SELECT * FROM discord_links').first();
  assert.equal(stored.user_id, userId);
  assert(!JSON.stringify(stored).includes('temporary-access'));
  assert(!JSON.stringify(stored).includes('not-stored'));
  assert(fake.calls.some(call => call.path.endsWith('/revoke')));
});

test('connection status requires an unused verified email token and reveals no identity', async () => {
  const db = database(); const env = configured(db); const { hash } = await paid(db, env);
  const token = await linkToken(db, env);
  assert.deepEqual(await discordLinkStatus(db, env, 'villow', token, now), { eligible: true, connected: false, disconnecting: false });
  await db.prepare('INSERT INTO discord_links(email_hash,user_id,created_at) VALUES (?,?,?)').bind(hash, userId, now).run();
  assert.deepEqual(await discordLinkStatus(db, env, 'villow', token, now), { eligible: true, connected: true, disconnecting: false });
  assert.equal((await db.prepare('SELECT used_at FROM discord_tokens').first()).used_at, null);
  await assert.rejects(discordLinkStatus(db, env, 'other', token, now));
  await assert.rejects(discordLinkStatus(db, env, 'villow', token, now + 1801));
  await assert.rejects(discordLinkStatus(db, env, 'villow', 'invalid', now));
  const start = await beginDiscord(db, env, 'villow', token, now);
  assert.equal(start.status, 303);
  await assert.rejects(discordLinkStatus(db, env, 'villow', token, now));
});

test('connection status route rejects untrusted origins and never accepts an email as verification', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const token = await linkToken(db, env, Math.floor(Date.now() / 1000));
  const worker = createWorker();
  const req = (body, origin = project.origin) => new Request('https://support.example/v1/projects/villow/discord-status', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert.equal((await worker.fetch(req({ token }, 'https://attacker.example'), env)).status, 403);
  assert.equal((await worker.fetch(req({ email: 'sam@example.com' }), env)).status, 400);
  const response = await worker.fetch(req({ token }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { eligible: true, connected: false, disconnecting: false });
});

test('sandbox OAuth refuses every account except the configured owner before any role changes', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const fake = provider({ user: '1523582210056126495' });
  const { response } = await callback(db, env, await linkToken(db, env), fake.fetcher);
  assert.match(response.headers.get('Location'), /test-account-only$/);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_links').first()).n, 0);
  assert(!fake.calls.some(call => call.path.includes('/guilds/')));
  assert.equal(discordReady({ ...env, DISCORD_TEST_USER_ID: '' }), false);
});

test('ongoing role follows paid period and failed renewals; permanent role and unrelated roles stay', async () => {
  const db = database(); const env = configured(db); const { hash, stripe } = await paid(db, env, { monthly: true });
  const fake = provider({ memberRoles: [roles.other] });
  const { response } = await callback(db, env, await linkToken(db, env), fake.fetcher);
  assert.match(response.headers.get('Location'), /discord=connected&ongoing=1$/);
  assert(fake.current.has(roles.supporter)); assert(fake.current.has(roles.ongoing));
  // Scheduling cancellation must not remove ongoing recognition before the paid period ends.
  stripe.subscriptions.retrieve = async id => ({ id, status: 'active', cancel_at_period_end: true, items: { data: [{ current_period_end: now + 3600 }] } });
  const update = event('customer.subscription.updated', { id: 'sub_1' }, { created: now, id: 'evt_cancel_scheduled' });
  await processEvent(db, env, stripe, update); await queueDiscordForEvent(db, update);
  await syncDueDiscord(db, env, fake.fetcher, now + 100);
  assert(fake.current.has(roles.ongoing));
  await syncDueDiscord(db, env, fake.fetcher, now + 3601);
  assert(!fake.current.has(roles.ongoing)); assert(fake.current.has(roles.supporter)); assert(fake.current.has(roles.other));
  stripe.subscriptions.retrieve = async id => ({ id, status: 'past_due', items: { data: [{ current_period_end: now + 7200 }] } });
  const failed = event('invoice.payment_failed', { id: 'in_failed', subscription: 'sub_1' }, { id: 'evt_failed', created: now + 3602 });
  await processEvent(db, env, stripe, failed);
  assert.equal((await supporterEntitlements(db, hash, now + 3602)).ongoing, false);
});

test('role failures retry, membership screening is respected, and disconnect removes only dedicated roles', async () => {
  const db = database(); const env = configured(db); const { hash } = await paid(db, env);
  const failing = provider({ failure: true });
  const { response } = await callback(db, env, await linkToken(db, env), failing.fetcher);
  assert.match(response.headers.get('Location'), /pending$/);
  const screening = provider({ pending: true });
  assert.equal(await syncDiscordLink(db, env, hash, screening.fetcher, now + 901), 'screening');
  assert(!screening.calls.some(call => call.method === 'PUT'));
  const healthy = provider({ memberRoles: [roles.other] });
  await syncDueDiscord(db, env, healthy.fetcher, now + 1802);
  assert(healthy.current.has(roles.supporter));
  const token = await linkToken(db, env, now + 3600);
  assert.equal(await disconnectDiscord(db, env, 'villow', token, healthy.fetcher, now + 3600), 'disconnected');
  assert.deepEqual([...healthy.current], [roles.other]);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_links').first()).n, 0);
  assert.equal((await supporterEntitlements(db, hash, now)).supporter, true);
});

test('concurrent webhook or disconnect cannot be lost while roles are being synchronised', async () => {
  const db = database(); const env = configured(db); const { hash } = await paid(db, env);
  await db.prepare('INSERT INTO discord_links(email_hash,user_id,created_at) VALUES (?,?,?)').bind(hash, userId, now).run();
  const fake = provider({ onRole: async () => {
    await db.prepare('UPDATE discord_links SET disconnect_requested = 1, version = version + 1, sync_due = 0 WHERE email_hash = ?').bind(hash).run();
  } });
  await syncDiscordLink(db, env, hash, fake.fetcher, now);
  assert.equal((await db.prepare('SELECT sync_due FROM discord_links').first()).sync_due, 0);
  await syncDiscordLink(db, env, hash, provider({ memberRoles: [roles.supporter] }).fetcher, now + 1);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_links').first()).n, 0);
});

test('Discord API routes require trusted Origin and do not disclose payment-email membership', async () => {
  const db = database(); const env = configured(db); const messages = [];
  const worker = createWorker({ sendEmail: async data => messages.push(data) });
  const req = (email, origin = project.origin) => new Request('https://support.example/v1/projects/villow/discord-request', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
  });
  assert.equal((await worker.fetch(req('sam@example.com', 'https://attacker.example'), env)).status, 403);
  const absent = await (await worker.fetch(req('unknown@example.com'), env)).json();
  await paid(db, env);
  const present = await (await worker.fetch(req('sam@example.com'), env)).json();
  assert.deepEqual(present, absent); assert.equal(messages.length, 2);
  const spoof = await worker.fetch(new Request('https://support.example/v1/projects/villow/discord-start', {
    method: 'POST', headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'token=bad',
  }), env);
  assert.equal(spoof.status, 403);
});

test('an inbox without a contribution receives verification, then learns no match without starting OAuth', async () => {
  const db = database(); const env = configured(db);
  const token = await linkToken(db, env);
  assert.deepEqual(await discordLinkStatus(db, env, 'villow', token, now), { eligible: false, connected: false, disconnecting: false });
  await assert.rejects(beginDiscord(db, env, 'villow', token, now), { status: 403 });
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_oauth_states').first()).n, 0);
  assert.equal((await db.prepare('SELECT used_at FROM discord_tokens').first()).used_at, null);
  // A delayed payment webhook can make the same verified link eligible.
  await paid(db, env);
  assert.equal((await discordLinkStatus(db, env, 'villow', token, now + 1)).eligible, true);
  assert.equal((await beginDiscord(db, env, 'villow', token, now + 1)).status, 303);
});

test('Discord email delivery failures return a useful failure and invalidate the token for any inbox', async t => {
  const db = database(); const env = configured(db); const logs = [];
  t.mock.method(console, 'error', (...values) => logs.push(values));
  const worker = createWorker({ sendEmail: async () => { throw new Error('provider detail containing private data'); } });
  const request = () => worker.fetch(new Request('https://support.example/v1/projects/villow/discord-request', {
    method: 'POST', headers: { Origin: project.origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'sam@example.com' }),
  }), env);
  const absent = await request(); assert.equal(absent.status, 503);
  await paid(db, env);
  const present = await request(); assert.equal(present.status, 503);
  assert.deepEqual(await absent.json(), await present.json());
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_tokens').first()).n, 0);
  assert.deepEqual(logs, [['support_discord_email_failed'], ['support_discord_email_failed']]);
});

test('disconnect invalidates outstanding emails and prevents an already-running OAuth callback from relinking', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const connectToken = await linkToken(db, env);
  const disconnectToken = await linkToken(db, env);
  const otherToken = await linkToken(db, env);
  const fake = provider();
  const fetcher = async (url, init) => {
    if (new URL(url).pathname === '/api/v10/users/@me') {
      assert.equal(await disconnectDiscord(db, env, 'villow', disconnectToken, fake.fetcher, now), 'disconnected');
    }
    return fake.fetcher(url, init);
  };
  const { response } = await callback(db, env, connectToken, fetcher);
  assert.match(response.headers.get('Location'), /cancelled$/);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM discord_links').first()).n, 0);
  assert(!fake.calls.some(call => call.path.includes('/guilds/')));
  await assert.rejects(beginDiscord(db, env, 'villow', otherToken, now));
});

test('scheduled cleanup does not interrupt an authenticated callback in progress', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const token = await linkToken(db, env);
  const fake = provider(); const worker = createWorker({ discordFetch: fake.fetcher });
  const fetcher = async (url, init) => {
    if (new URL(url).pathname === '/api/v10/users/@me') await worker.scheduled({}, env);
    return fake.fetcher(url, init);
  };
  const { response } = await callback(db, env, token, fetcher);
  assert.match(response.headers.get('Location'), /connected$/);
  assert(fake.current.has(roles.supporter));
});

test('one authorisation joins new members, respects rules screening, and never stores a join token', async () => {
  const db = database(); const env = configured(db); const { hash } = await paid(db, env);
  const fake = provider({ pending: true }); let member = false; let joined = 0;
  const fetcher = async (url, init = {}) => {
    if (new URL(url).pathname.endsWith(`/members/${userId}`)) {
      if (init.method === 'PUT') {
        assert.deepEqual(JSON.parse(init.body), { access_token: 'temporary-access' });
        member = true; joined++; return Response.json({ pending: true }, { status: 201 });
      }
      if (!member) return new Response(null, { status: 404 });
    }
    return fake.fetcher(url, init);
  };
  const { response } = await callback(db, env, await linkToken(db, env), fetcher);
  assert.match(response.headers.get('Location'), /screening$/); assert.equal(joined, 1);
  assert(!fake.current.has(roles.supporter));
  assert(!JSON.stringify(await db.prepare('SELECT * FROM discord_links').first()).includes('temporary-access'));
  const accepted = provider();
  await syncDiscordLink(db, env, hash, accepted.fetcher, now + 901);
  assert(accepted.current.has(roles.supporter));
  member = false;
  assert.equal(await syncDiscordLink(db, env, hash, fetcher, now + 1802), 'join-server');
  assert.equal(joined, 1, 'leaving is never undone by background reconciliation');
});

test('join permission failures fall back to an invitation without granting roles or losing the link', async () => {
  const db = database(); const env = configured(db); await paid(db, env);
  const fake = provider(); let joins = 0;
  const fetcher = async (url, init = {}) => {
    if (new URL(url).pathname.endsWith(`/members/${userId}`)) {
      if (init.method === 'PUT') { joins++; return new Response(null, { status: 403 }); }
      return new Response(null, { status: 404 });
    }
    return fake.fetcher(url, init);
  };
  const { response } = await callback(db, env, await linkToken(db, env), fetcher);
  assert.match(response.headers.get('Location'), /join-server$/); assert.equal(joins, 1);
  assert.equal((await db.prepare('SELECT last_result FROM discord_links').first()).last_result, 'join-server');
  assert(!fake.calls.some(call => call.path.includes('/roles/')));
  assert(fake.calls.some(call => call.path.endsWith('/revoke')));
});
