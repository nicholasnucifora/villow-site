import test from 'node:test';
import assert from 'node:assert/strict';
import Stripe from 'stripe';
import { amountCents, fieldMapping, publicFields, projectConfig, verifiedLink } from '../lib/config.mjs';
import { processEvent, recentSupporters } from '../lib/events.mjs';
import { confirmRemoval, requestRemoval, rateLimit } from '../lib/privacy.mjs';
import { createWorker } from '../worker.mjs';
import { database, environment, project, fields, session, event, fakeStripe, approve } from './helpers.mjs';

test('amounts enforce exact cents and the A$5 minimum, including direct API input', () => {
  for (const invalid of ['4.99', '0', '-5', '5e2', '5.001', '5.0.0', 'Infinity', '10000.01', '', 5]) assert.throws(() => amountCents(invalid));
  assert.equal(amountCents('5'), 500); assert.equal(amountCents('10.25'), 1025); assert.equal(amountCents('10000'), 1000000);
});
test('only the explicit configured Yes dropdown value permits text; blank and unknown values stay private', () => {
  const mapping = fieldMapping(fields);
  for (const value of [undefined, null, '', 'yes', 'true', 'no']) {
    const values = structuredClone(fields); values[2].dropdown.value = value;
    assert.deepEqual(publicFields(values, mapping), { consent: false, name: null, message: null });
  }
  assert.equal(publicFields(fields, mapping).consent, true);
  const unsafe = structuredClone(fields); unsafe[2].dropdown.default_value = 'explicit_yes_123';
  assert.throws(() => fieldMapping(unsafe));
  assert.throws(() => fieldMapping(fields.slice(0, 2)));
});
test('link validation rejects no minimum, wrong currency, price, mode and ambiguous project attribution', async () => {
  const db = database(); const env = environment(db);
  for (const badPrice of [{ currency: 'usd', custom_unit_amount: { minimum: 500 } }, { currency: 'aud', custom_unit_amount: {} }]) {
    const stripe = fakeStripe(); stripe.paymentLinks.listLineItems = async () => ({ data: [{ quantity: 1, price: badPrice }] });
    await assert.rejects(verifiedLink(stripe, env, project, 'once'));
  }
  const duplicate = { ...env, PROJECTS_JSON: JSON.stringify({ villow: project, fixtheweb: project }) };
  assert.throws(() => projectConfig(duplicate, 'villow'));
  assert.throws(() => projectConfig({ ...env, STRIPE_MODE: 'live' }, 'villow'));
});
test('successful payments need consent AND moderation; public response contains only approved fields', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  await processEvent(db, env, stripe, event('checkout.session.completed', session()));
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  await approve(db);
  const feed = await recentSupporters(db, 'villow');
  assert.equal(feed.length, 1); assert.equal(feed[0].displayName, 'Sam');
  assert.deepEqual(Object.keys(feed[0]), ['displayName', 'message', 'kind', 'monthlyStatus', 'date']);
  assert(!JSON.stringify(feed).includes('sam@example.com'));
  assert(!JSON.stringify(feed).includes('pi_once'));
  assert.deepEqual(await recentSupporters(db, 'fixtheweb'), []);
  await db.prepare("UPDATE contributions SET moderation = 'hidden'").run();
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
});
test('no consent means optional text is not stored, even after successful payment', async () => {
  const db = database(); const s = session(); delete s.custom_fields[2].dropdown.value;
  await processEvent(db, environment(db), fakeStripe(), event('checkout.session.completed', s));
  const row = await db.prepare('SELECT * FROM contributions').first();
  assert.equal(row.consent, 0); assert.equal(row.display_name, null); assert.equal(row.message, null);
  assert(!JSON.stringify(row).includes('sam@example.com'));
});
test('unpaid checkouts wait for async success; duplicate events and separate delivery IDs cannot duplicate records', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  await processEvent(db, env, stripe, event('checkout.session.completed', session({ payment_status: 'unpaid' })));
  await processEvent(db, env, stripe, event('checkout.session.async_payment_failed', session({ payment_status: 'unpaid' })));
  assert.equal((await db.prepare('SELECT count(*) n FROM contributions').first()).n, 0);
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 0);
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  const success = event('checkout.session.async_payment_succeeded', session());
  await processEvent(db, env, stripe, success); await processEvent(db, env, stripe, success);
  await processEvent(db, env, stripe, { ...success, id: 'evt_another_delivery' });
  assert.equal((await db.prepare('SELECT count(*) n FROM contributions').first()).n, 1);
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 1);
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  await approve(db);
  assert.equal((await recentSupporters(db, 'villow')).length, 1);
});
test('failed webhook batches roll back event deduplication and can be retried', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  db.sqlite.exec("CREATE TRIGGER fail_payment BEFORE INSERT ON payments BEGIN SELECT RAISE(ABORT, 'test failure'); END;");
  const e = event('checkout.session.completed', session());
  await assert.rejects(processEvent(db, env, stripe, e));
  assert.equal((await db.prepare('SELECT count(*) n FROM webhook_events').first()).n, 0);
  assert.equal((await db.prepare('SELECT count(*) n FROM contributions').first()).n, 0);
  db.sqlite.exec('DROP TRIGGER fail_payment');
  await processEvent(db, env, stripe, e);
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 1);
});
test('invoice before checkout, monthly renewals and cancellation remain one entry with current status', async () => {
  const db = database(); const env = environment(db);
  const s = session({ id: 'cs_monthly', mode: 'subscription', payment_link: 'plink_ten', subscription: 'sub_1', invoice: 'in_first', payment_intent: null });
  const stripe = fakeStripe(s);
  const invoice = { id: 'in_first', parent: { subscription_details: { subscription: 'sub_1' } }, status: 'paid', amount_paid: 1000, currency: 'aud', status_transitions: { paid_at: 1700000020 } };
  await processEvent(db, env, stripe, event('invoice.paid', invoice));
  await processEvent(db, env, stripe, event('checkout.session.completed', s));
  await approve(db);
  assert.equal((await recentSupporters(db, 'villow')).length, 1);
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 1);
  await processEvent(db, env, stripe, event('invoice.paid', { ...invoice, id: 'in_renewal', status_transitions: { paid_at: 1703000020 } }, { id: 'evt_renewal', created: 1703000020 }));
  assert.equal((await recentSupporters(db, 'villow'))[0].date, new Date(1703000020 * 1000).toISOString().slice(0, 10));
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 2);
  stripe.subscriptions.retrieve = async id => ({ id, status: 'canceled', cancel_at_period_end: false });
  await processEvent(db, env, stripe, event('customer.subscription.deleted', { id: 'sub_1' }, { created: 1703000030 }));
  stripe.subscriptions.retrieve = async id => ({ id, status: 'active', cancel_at_period_end: false });
  await processEvent(db, env, stripe, event('customer.subscription.updated', { id: 'sub_1' }, { created: 1700000001 }));
  assert.equal((await recentSupporters(db, 'villow'))[0].monthlyStatus, 'previous');
});
test('a failed renewal adds no payment or public contribution date, and recovery records only the paid invoice', async () => {
  const db = database(); const env = environment(db);
  const s = session({ id: 'cs_monthly', mode: 'subscription', payment_link: 'plink_ten', subscription: 'sub_1', invoice: 'in_first', payment_intent: null });
  const stripe = fakeStripe(s);
  await processEvent(db, env, stripe, event('checkout.session.completed', s));
  await approve(db);
  const firstDate = (await recentSupporters(db, 'villow'))[0].date;
  const invoice = { id: 'in_renewal', parent: { subscription_details: { subscription: 'sub_1' } }, status: 'open', amount_paid: 0, currency: 'aud' };
  stripe.subscriptions.retrieve = async id => ({ id, status: 'past_due', cancel_at_period_end: false });
  await processEvent(db, env, stripe, event('invoice.payment_failed', invoice, { created: 1703000000 }));
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 1);
  const failedFeed = await recentSupporters(db, 'villow');
  assert.equal(failedFeed[0].date, firstDate);
  assert.equal(failedFeed[0].monthlyStatus, 'previous');

  stripe.subscriptions.retrieve = async id => ({ id, status: 'active', cancel_at_period_end: false });
  const recovered = event('invoice.paid', { ...invoice, status: 'paid', amount_paid: 1000, status_transitions: { paid_at: 1703000020 } }, { created: 1703000020 });
  await processEvent(db, env, stripe, recovered);
  await processEvent(db, env, stripe, recovered);
  assert.equal((await db.prepare('SELECT count(*) n FROM payments').first()).n, 2);
  const recoveredFeed = await recentSupporters(db, 'villow');
  assert.equal(recoveredFeed.length, 1);
  assert.equal(recoveredFeed[0].date, new Date(1703000020 * 1000).toISOString().slice(0, 10));
  assert.equal(recoveredFeed[0].monthlyStatus, 'active');
});

test('secure removal is scoped, expiring, single-use and stays removed after retries and later contributions', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  await processEvent(db, env, stripe, event('checkout.session.completed', session())); await approve(db);
  let email;
  await requestRemoval(db, env, 'villow', project, ' SAM@example.com ', async value => { email = value; });
  const token = new URLSearchParams(new URL(email.url).hash.slice(1)).get('remove');
  assert.equal(token.length, 64);
  assert(!JSON.stringify(await db.prepare('SELECT * FROM removal_tokens').first()).includes(token));
  await assert.rejects(confirmRemoval(db, 'fixtheweb', token));
  await assert.rejects(confirmRemoval(db, 'villow', token, Math.floor(Date.now() / 1000) + 1801));
  await confirmRemoval(db, 'villow', token);
  await assert.rejects(confirmRemoval(db, 'villow', token));
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  await processEvent(db, env, stripe, event('checkout.session.completed', session(), { id: 'evt_replayed' }));
  await processEvent(db, env, stripe, event('checkout.session.completed', session({ id: 'cs_new', payment_intent: 'pi_new' }), { id: 'evt_new' }));
  await approve(db);
  assert.deepEqual(await recentSupporters(db, 'villow'), []);
  const rows = (await db.prepare('SELECT * FROM contributions').all()).results;
  assert(rows.every(row => row.message === null && row.display_name === null && row.consent === 0));
});
test('unknown emails do not send messages; delivery failure invalidates the token; rate limits persist', async () => {
  const db = database(); const env = environment(db); let sent = 0;
  await requestRemoval(db, env, 'villow', project, 'unknown@example.com', async () => { sent++; });
  assert.equal(sent, 0);
  await processEvent(db, env, fakeStripe(), event('checkout.session.completed', session()));
  await assert.rejects(requestRemoval(db, env, 'villow', project, 'sam@example.com', async () => { throw new Error('offline'); }));
  assert.equal((await db.prepare('SELECT count(*) n FROM removal_tokens').first()).n, 0);
  await rateLimit(db, 'test', 1, 60, 120); await assert.rejects(rateLimit(db, 'test', 1, 60, 120)); await rateLimit(db, 'test', 1, 60, 180);
});
test('real Stripe SDK verifies signatures; tampering, stale signatures and live/test mismatch fail', async () => {
  const db = database(); const env = environment(db); const sdk = new Stripe('sk_test_fixture');
  const fake = fakeStripe(); fake.webhooks = sdk.webhooks;
  const worker = createWorker({ stripe: fake });
  const raw = JSON.stringify(event('unhandled.example', {}));
  const sign = (payload, timestamp) => sdk.webhooks.generateTestHeaderString({ payload, secret: env.STRIPE_WEBHOOK_SECRET, timestamp });
  const post = (payload, signature) => worker.fetch(new Request('https://support.example/v1/stripe/webhook', { method: 'POST', body: payload, headers: { 'Stripe-Signature': signature } }), env);
  assert.equal((await post(raw, sign(raw))).status, 200);
  assert.equal((await post(raw + ' ', sign(raw))).status, 400);
  assert.equal((await post(raw, sign(raw, 1000))).status, 400);
  const live = JSON.stringify(event('unhandled.example', {}, { livemode: true }));
  assert.equal((await post(live, sign(live))).status, 503);
});
test('API rejects untrusted origins and malformed amounts; creates exact AUD Checkout with optional consent fields', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe(); const worker = createWorker({ stripe });
  const post = (body, origin = project.origin) => worker.fetch(new Request('https://support.example/v1/projects/villow/checkout', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env);
  assert.equal((await post({ kind: 'once', amount: '10' }, 'https://evil.example')).status, 403);
  assert.equal((await post({ kind: 'once', amount: '4.99' })).status, 400);
  assert.equal((await post({ kind: 'monthly', amount: '99' })).status, 400);
  const response = await post({ kind: 'once', amount: '12.34', project: 'forged' });
  assert.equal(response.status, 200); assert.equal(response.headers.get('Access-Control-Allow-Origin'), project.origin);
  const params = stripe.checkout.sessions.lastParams;
  assert.equal(params.line_items[0].price_data.unit_amount, 1234);
  assert.equal(params.metadata.support_project, 'villow');
  assert.equal(params.custom_fields.length, 3); assert(params.custom_fields.every(f => f.optional));
  assert.equal(params.custom_fields[2].dropdown.default_value, undefined);
  assert.equal(new URL((await (await post({ kind: 'monthly', amount: '10' })).json()).url).searchParams.get('client_reference_id'), 'villow');
  env.PAYMENTS_ENABLED = 'false';
  assert.equal((await post({ kind: 'once', amount: '10' })).status, 503);
});

test('pausing checkout preserves portal access, and all public responses prohibit caching', async () => {
  const db = database(); const env = environment(db); env.PAYMENTS_ENABLED = 'false';
  const response = await createWorker().fetch(new Request('https://support.example/v1/projects/villow/config', { headers: { Origin: project.origin } }), env);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal((await response.json()).portal, project.portal);
});

test('configuration failures log only a category; Stripe error details never reach logs or public responses', async t => {
  const logs = [];
  t.mock.method(console, 'error', (...args) => logs.push(args));
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  const worker = createWorker({ stripe });
  const post = () => worker.fetch(new Request('https://support.example/v1/projects/villow/checkout', {
    method: 'POST', headers: { Origin: project.origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind: 'monthly', amount: '10' }),
  }), env);
  stripe.paymentLinks.listLineItems = async () => ({ data: [{ quantity: 1, price: { currency: 'usd' } }] });
  const configFailure = await post();
  assert.equal(configFailure.status, 503);
  assert.deepEqual(logs.pop(), ['support_link_configuration_failed', 'currency']);
  assert(!(await configFailure.text()).includes('currency'));
  const sensitive = 'private@example.com rk_test_sensitive_request_data';
  stripe.paymentLinks.retrieve = async () => { throw new Stripe.errors.StripePermissionError({ message: sensitive }); };
  const sdkFailure = await post();
  assert.equal(sdkFailure.status, 503);
  assert.deepEqual(logs, [['support_stripe_permission_failed']]);
  assert(!(await sdkFailure.text()).includes(sensitive));
});

test('removal invalidates other outstanding links for the same email', async () => {
  const db = database(); const env = environment(db);
  await processEvent(db, env, fakeStripe(), event('checkout.session.completed', session()));
  const tokens = [];
  const mail = async ({ url }) => { tokens.push(new URLSearchParams(new URL(url).hash.slice(1)).get('remove')); };
  await requestRemoval(db, env, 'villow', project, 'sam@example.com', mail);
  await requestRemoval(db, env, 'villow', project, 'sam@example.com', mail);
  await confirmRemoval(db, 'villow', tokens[0]);
  await assert.rejects(confirmRemoval(db, 'villow', tokens[1]));
});
