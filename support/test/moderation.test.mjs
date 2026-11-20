import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { database, environment, session, event, fakeStripe } from './helpers.mjs';
import { processEvent, recentSupporters } from '../lib/events.mjs';
import { needsReview, reviewStatus, censorText } from '../lib/message-review.mjs';
import { digest, confirmRemoval, requestRemoval } from '../lib/privacy.mjs';
import { checkoutStatus } from '../lib/checkout-return.mjs';
import { createWorker } from '../worker.mjs';

const adminOrigin = 'https://fixtheweb.example';
const password = 'a-random-fixture-password-not-for-production';
async function setup() {
  const db = database();const stripe = fakeStripe();const worker = createWorker({ stripe });
  const env = { ...environment(db), AUTO_PUBLISH_MESSAGES: 'true', MODERATION_ENABLED: 'true', MODERATION_ORIGIN: adminOrigin, MODERATION_PASSWORD_HASH: await digest(password) };
  async function call(path, { body, cookie, origin = adminOrigin, method = body ? 'POST' : 'GET', target = adminOrigin, headers = {} } = {}) {
    return worker.fetch(new Request(target + '/admin/support/api/' + path, { method, headers: { ...(body ? { 'Content-Type': 'application/json', Origin: origin } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) }), env);
  }
  async function login() { const r = await call('login', { body: { password } });assert.equal(r.status, 200);return r.headers.get('set-cookie').split(';')[0]; }
  async function add(id, name = 'Sam', message = 'Thanks for building this.', consent = true) {
    const s = session({ id: 'cs_' + id, payment_intent: 'pi_' + id, created: 1700000000 + id.length });
    s.custom_fields[0].text.value = name;s.custom_fields[1].text.value = message;
    if (!consent) s.custom_fields[2].dropdown.value = 'no';
    await processEvent(db, env, stripe, event('checkout.session.completed', s, { id: 'evt_' + id }));return s;
  }
  return { db, stripe, env, worker, call, login, add };
}

test('screening catches names, slurs, accents, common substitutions and separated letters without substring false positives', () => {
  for (const value of ['FUCK', 'f.u.c.k', 'f u c k', 'fuuuck', 'f\u200buck', 'ｆｕｃｋ', 'fúck', 'sh1t', 'n1gg3r', 'faggot', 'kill yourself']) {
    assert(needsReview('Sam', value), value);assert(needsReview(value, 'Thank you'), value);
  }
  for (const value of ['Scunthorpe', 'Dickinson', 'assessment', 'classical', 'retarding oxidation', 'A kind contribution.']) assert(!needsReview(value, value), value);
});

test('censor suggestions mask only whole detected words and preserve surrounding original text', () => {
  assert.equal(censorText('Love this fucking project!'), 'Love this ♥♥♥ project!');
  assert.equal(censorText('Fuck, SH1T and f.u.c.k.'), '♥♥♥, ♥♥♥ and ♥♥♥.');
  for (const text of ['f\u200buck', 'ｆｕｃｋ', 'fúck', 'fuuuck', 'f u c k']) assert.equal(censorText(text), '♥♥♥');
  assert.equal(censorText('A n1gg3r, heil hitler'), 'A ♥♥♥, ♥♥♥');
  assert.equal(censorText('Scunthorpe, assessment. ❤️ Thank you!'), 'Scunthorpe, assessment. ❤️ Thank you!');
  assert.equal(censorText(null), null);
});

test('censored publication is explicit, preserves originals, rejects stale decisions and survives webhook replay', async () => {
  const { db, env, stripe, call, login, add } = await setup();const checkout = await add('mask', 'Shit', 'Love this fucking project!');const cookie = await login();
  let row = (await (await call('messages?state=needs_review', { cookie })).json()).messages[0];
  assert.equal(row.suggestion.name, '♥♥♥');assert.equal(row.suggestion.message, 'Love this ♥♥♥ project!');assert(!row.censored);
  assert.deepEqual(await recentSupporters(db, 'villow'), []); // Preview never publishes.
  const decision = { id: row.id, version: row.version, status: 'approved', variant: 'censored', message: 'injected rewrite' };
  assert.equal((await call('decision', { cookie, body: decision })).status, 200);
  assert.equal((await call('decision', { cookie, body: decision })).status, 409);
  row = (await (await call('messages?state=approved', { cookie })).json()).messages[0];
  assert.equal(row.message, 'Love this fucking project!');assert.equal(row.publicMessage, 'Love this ♥♥♥ project!');assert(row.censored);
  await processEvent(db, env, stripe, event('checkout.session.completed', checkout, { id: 'evt_mask_replay' }));
  const feed = await recentSupporters(db, 'villow');assert.equal(feed[0].displayName, '♥♥♥');assert.equal(feed[0].message, row.publicMessage);assert(!JSON.stringify(feed).includes('fucking'));
  assert.equal((await call('decision', { cookie, body: { id: row.id, version: row.version, status: 'approved', variant: 'original' } })).status, 200);
  assert.equal((await recentSupporters(db, 'villow'))[0].message, row.message);
});

test('withdrawal erases originals and censored copies and cannot race with a censored publication', async () => {
  const { db, env, call, login, add } = await setup();await add('erase', 'Shit', 'Fuck');const cookie = await login();
  const row = (await (await call('messages?state=needs_review', { cookie })).json()).messages[0];
  const body = { id: row.id, version: row.version, status: 'approved', variant: 'censored' };
  assert.equal((await call('decision', { cookie, body })).status, 200);let email;
  await requestRemoval(db, env, 'villow', JSON.parse(env.PROJECTS_JSON).villow, 'sam@example.com', async value => { email = value; });
  await confirmRemoval(db, 'villow', new URL(email.url).hash.slice(8));
  assert.equal((await call('decision', { cookie, body: { ...body, version: row.version + 1 } })).status, 409);
  const saved = await db.prepare('SELECT display_name, message, censored_name, censored_message FROM contributions').first();
  assert(Object.values(saved).every(value => value === null));assert.deepEqual(await recentSupporters(db, 'villow'), []);
});

test('new paid, consented messages publish unreviewed; held text and absent consent stay private', async () => {
  const { db, add } = await setup();await add('clean');await add('held', 'Sam', 'f.u.c.k');await add('name', 'Faggot', 'Hello');await add('private', 'Private', 'My private text', false);
  const feed = await recentSupporters(db, 'villow');assert.equal(feed.length, 1);assert.equal(feed[0].message, 'Thanks for building this.');
  assert.equal(reviewStatus(await db.prepare("SELECT * FROM contributions WHERE session_id = 'cs_clean'").first()), 'unreviewed');
  const withheld = await db.prepare("SELECT * FROM contributions WHERE session_id = 'cs_held'").first();assert.equal(reviewStatus(withheld), 'needs_review');assert.equal(withheld.message, 'f.u.c.k');
  const privateRow = await db.prepare("SELECT * FROM contributions WHERE session_id = 'cs_private'").first();assert.equal(privateRow.message, null);
});

test('admin data and writes require authentication; cookies expire, revoke on logout and password rotation', async () => {
  const { db, env, call, login, add } = await setup();await add('clean');
  assert.equal((await call('messages')).status, 401);
  assert.equal((await call('decision', { body: {} })).status, 401);
  assert.equal((await call('login', { body: { password: 'wrong' } })).status, 401);
  const result = await call('login', { body: { password } });const full = result.headers.get('set-cookie');
  assert.match(full, /HttpOnly/);assert.match(full, /SameSite=Strict/);assert.match(full, /Secure/);assert.match(full, /Path=\/admin\/support/);
  let cookie = full.split(';')[0];assert.equal((await call('session', { cookie })).status, 200);
  const stored = await db.prepare('SELECT * FROM moderation_sessions').first();assert(!JSON.stringify(stored).includes(cookie.split('=')[1]));assert(!JSON.stringify(stored).includes(password));
  assert.equal((await call('logout', { cookie, body: {} })).status, 200);assert.equal((await call('session', { cookie })).status, 401);
  cookie = await login();env.MODERATION_PASSWORD_HASH = await digest('different');assert.equal((await call('session', { cookie })).status, 401);
  env.MODERATION_PASSWORD_HASH = await digest(password);await db.prepare('UPDATE moderation_sessions SET expires_at = 0').run();assert.equal((await call('session', { cookie })).status, 401);
  assert.equal((await call('session', { cookie: '__Secure-villow_review=' + 'a'.repeat(64) })).status, 401);
});

test('admin denies foreign origins, other hosts, insecure live access, disabled setup and brute-force attempts', async () => {
  const { env, call, login } = await setup();const cookie = await login();
  assert.equal((await call('decision', { cookie, body: {}, origin: 'https://attacker.example' })).status, 403);
  assert.equal((await call('messages', { cookie, headers: { 'sec-fetch-site': 'cross-site' } })).status, 403);
  assert.equal((await call('session', { cookie, target: 'https://another.example' })).status, 404);
  env.MODERATION_ENABLED = 'false';assert.equal((await call('session', { cookie })).status, 404);env.MODERATION_ENABLED = 'true';
  env.MODERATION_ORIGIN = 'http://127.0.0.1:4411';env.MODERATION_LOCAL_PREVIEW = 'true';env.STRIPE_MODE = 'live';
  assert.equal((await call('session', { cookie, target: env.MODERATION_ORIGIN })).status, 404);
  env.MODERATION_ORIGIN = adminOrigin;env.STRIPE_MODE = 'test';
  for (let i = 0; i < 4; i++) assert.equal((await call('login', { body: { password: 'wrong' } })).status, 401);
  assert.equal((await call('login', { body: { password } })).status, 429);
});

test('filters and decisions return only name/message/status, update the public feed and reject stale decisions', async () => {
  const { db, add, call, login, stripe, env } = await setup();const checkout = await add('clean');await add('held', 'Held', 'fuck');const cookie = await login();
  let response = await call('messages?state=unreviewed', { cookie });assert.equal(response.headers.get('cache-control'), 'no-store');
  const first = await response.json();assert.equal(first.counts.unreviewed, 1);assert.equal(first.counts.needs_review, 1);
  const row = first.messages[0];assert.deepEqual(Object.keys(row).sort(), ['id', 'name', 'message', 'status', 'version', 'publicName', 'publicMessage', 'censored', 'suggestion'].sort());
  assert(!JSON.stringify(first).includes('cs_'));assert(!JSON.stringify(first).includes('sam@example.com'));assert(!JSON.stringify(first).includes('amount'));
  assert.equal((await call('decision', { cookie, body: { id: row.id, version: row.version, status: 'hidden' } })).status, 200);
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  assert.equal((await call('decision', { cookie, body: { id: row.id, version: row.version, status: 'approved' } })).status, 409);
  // Later Stripe events cannot undo a human decision.
  await processEvent(db, env, stripe, event('checkout.session.completed', checkout, { id: 'evt_retry' }));assert.deepEqual(await recentSupporters(db, 'villow'), []);
  const held = (await (await call('messages?state=needs_review', { cookie })).json()).messages[0];
  assert.equal((await call('decision', { cookie, body: { id: held.id, version: held.version, status: 'approved' } })).status, 200);assert.equal((await recentSupporters(db, 'villow')).length, 1);
  for (const status of ['unreviewed', 'needs_review', 'hidden', 'approved']) {
    const current = await db.prepare('SELECT review_version AS version FROM contributions WHERE review_id = ?').bind(held.id).first();
    assert.equal((await call('decision', { cookie, body: { id: held.id, version: current.version, status } })).status, 200);
    assert.equal((await recentSupporters(db, 'villow')).length, ['approved', 'unreviewed'].includes(status) ? 1 : 0);
  }
  for (const query of ['state=bogus', 'page=-1', 'order=DROP']) assert.equal((await call('messages?' + query, { cookie })).status, 400);
});

test('withdrawal wins over moderation and replay, including previously flagged messages', async () => {
  const { db, env, stripe, call, login, add } = await setup();const checkout = await add('clean');const cookie = await login();
  const row = (await (await call('messages', { cookie })).json()).messages[0];let message;
  await requestRemoval(db, env, 'villow', JSON.parse(env.PROJECTS_JSON).villow, 'sam@example.com', async value => { message = value; });
  await confirmRemoval(db, 'villow', new URL(message.url).hash.slice(8));
  assert.equal((await call('decision', { cookie, body: { id: row.id, version: row.version, status: 'approved' } })).status, 409);
  assert.equal((await (await call('messages?state=all', { cookie })).json()).messages.length, 0);
  await processEvent(db, env, stripe, event('checkout.session.completed', checkout, { id: 'evt_late' }));await add('later');assert.deepEqual(await recentSupporters(db, 'villow'), []);
});

test('pagination is bounded and stable in both sort directions', async () => {
  const { add, call, login } = await setup();for (let i = 0; i < 28; i++) await add(String(i), 'Name ' + i);const cookie = await login();
  const a = await (await call('messages?state=all', { cookie })).json(), b = await (await call('messages?state=all&page=1', { cookie })).json();
  assert.equal(a.messages.length, 25);assert(a.hasMore);assert.equal(b.messages.length, 3);assert(!b.hasMore);
  assert.equal(new Set([...a.messages, ...b.messages].map(row => row.id)).size, 28);
  const reversed = await (await call('messages?state=all&order=oldest', { cookie })).json();assert.equal(reversed.messages[0].id, b.messages.at(-1).id);
});

test('checkout confirmation is private, scoped, expiring and safely records paid sessions before the webhook', async () => {
  const { db, env, stripe } = await setup();const token = 'b'.repeat(64);
  await db.prepare('INSERT INTO checkout_returns VALUES (?, ?, ?, ?)').bind(await digest(token), 'cs_test_once', 'villow', 9999999999).run();
  assert.deepEqual(await checkoutStatus(db, env, stripe, 'villow', token), { payment: 'paid', sharing: 'published' });
  await processEvent(db, env, stripe, event('checkout.session.completed', session()));assert.equal((await db.prepare('SELECT COUNT(*) n FROM payments').first()).n, 1);
  await db.prepare("UPDATE contributions SET moderation = 'pending', auto_publish = 0").run();assert.equal((await checkoutStatus(db, env, stripe, 'villow', token)).sharing, 'review');
  await assert.rejects(checkoutStatus(db, env, stripe, 'another', token), { status: 400 });await assert.rejects(checkoutStatus(db, env, stripe, 'villow', 'a'.repeat(64)), { status: 400 });
  await db.prepare('UPDATE checkout_returns SET expires_at = 0').run();await assert.rejects(checkoutStatus(db, env, stripe, 'villow', token), { status: 400 });
});

test('unpaid or mismatched Stripe sessions never publish on a return', async () => {
  const { db, env } = await setup();const token = 'c'.repeat(64);
  await db.prepare('INSERT INTO checkout_returns VALUES (?, ?, ?, ?)').bind(await digest(token), 'cs_test_once', 'villow', 9999999999).run();
  assert.deepEqual(await checkoutStatus(db, env, fakeStripe(session({ payment_status: 'unpaid' })), 'villow', token), { payment: 'processing' });
  await assert.rejects(checkoutStatus(db, env, fakeStripe(session({ livemode: true })), 'villow', token), { status: 400 });
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
});

test('automatic monthly and one-time sessions receive scoped return tokens without exposing IDs', async () => {
  const { db, env, worker, stripe } = await setup();const origin = JSON.parse(env.PROJECTS_JSON).villow.origin;
  for (const kind of ['once', 'monthly']) {
    const response = await worker.fetch(new Request(origin + '/v1/projects/villow/checkout', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, amount: '5' }) }), env);
    assert.equal(response.status, 200);const success = new URL(stripe.checkout.sessions.lastParams.success_url);assert.match(success.hash, /^#checkout=[a-f0-9]{64}$/);assert(!success.href.includes('cs_'));
    const stored = await db.prepare('SELECT * FROM checkout_returns WHERE token_hash = ?').bind(await digest(success.hash.slice(10))).first();assert(stored);assert.equal(stored.project, 'villow');assert(!JSON.stringify(stored).includes(success.hash.slice(10)));
  }
});

test('migration preserves approvals, hides, consent and old held messages without publishing them', () => {
  const db = new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../migrations/0001_support.sql', import.meta.url), 'utf8'));
  for (const state of ['pending', 'approved', 'hidden']) db.prepare('INSERT INTO contributions(session_id, project, kind, consent, moderation, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(state, 'villow', 'once', 1, state, 0);
  db.exec(readFileSync(new URL('../migrations/0004_message_review.sql', import.meta.url), 'utf8'));
  const rows = db.prepare('SELECT * FROM contributions').all();assert.deepEqual(rows.map(row => reviewStatus(row)), ['needs_review', 'approved', 'hidden']);assert(rows.every(row => row.consent === 1 && /^[a-f0-9]{32}$/.test(row.review_id)));
});
