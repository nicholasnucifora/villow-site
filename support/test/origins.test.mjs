import test from 'node:test';
import assert from 'node:assert/strict';
import { projectConfig } from '../lib/config.mjs';
import { processEvent } from '../lib/events.mjs';
import { createWorker } from '../worker.mjs';
import { database, environment, project, session, event, fakeStripe } from './helpers.mjs';

const local = 'http://127.0.0.1:4411';
function fixture() {
  const db = database();
  const liveProject = { ...project, portal: 'https://billing.stripe.com/p/login/live_portal', additional_origins: [local, 'http://localhost:4411'] };
  const env = { ...environment(db), STRIPE_MODE: 'live', STRIPE_SECRET_KEY: 'rk_live_fixture', PROJECTS_JSON: JSON.stringify({ villow: liveProject }) };
  const stripe = fakeStripe(); const retrieve = stripe.paymentLinks.retrieve;
  stripe.paymentLinks.retrieve = async id => ({ ...await retrieve(id), livemode: true });
  const worker = createWorker({ stripe });
  const post = (body, origin = local) => worker.fetch(new Request('https://support.example/v1/projects/villow/checkout', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }), env);
  return { db, env, stripe, worker, post, liveProject };
}

test('live local checkout uses exact allowlisted origins and ignores client return URLs', async () => {
  const { env, stripe, worker, post, liveProject } = fixture();
  for (const origin of ['http://127.0.0.1:4412', 'http://127.0.0.1.evil.example:4411', 'https://evil.example', 'null']) {
    const response = await post({ kind: 'once', amount: '5' }, origin);
    assert.equal(response.status, 403); assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  }
  for (const origin of [local, 'http://localhost:4411', project.origin]) {
    const preflight = await worker.fetch(new Request('https://support.example/v1/projects/villow/checkout', { method: 'OPTIONS', headers: { Origin: origin } }), env);
    assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin);
    const response = await post({ kind: 'once', amount: '12.34', returnUrl: 'https://evil.example' }, origin);
    assert.equal(response.status, 200);
    assert.equal(stripe.checkout.sessions.lastParams.success_url, `${origin}/support?payment=returned`);
    assert.equal(stripe.checkout.sessions.lastParams.cancel_url, `${origin}/support?payment=cancelled`);
    assert.equal(stripe.checkout.sessions.lastParams.line_items[0].price_data.unit_amount, 1234);
  }
  for (const extra of ['http://evil.example', `${local}/path`, 'https://user:pass@example.com', `${local}#fragment`]) {
    assert.throws(() => projectConfig({ ...env, PROJECTS_JSON: JSON.stringify({ villow: { ...liveProject, additional_origins: [extra] } }) }, 'villow'));
  }
});

test('local monthly checkout uses existing recurring prices; the public website keeps its Payment Links', async () => {
  const { stripe, post } = fixture();
  for (const [amount, price] of [['5', 'five'], ['10', 'ten'], ['20', 'twenty']]) {
    assert.equal((await post({ kind: 'monthly', amount })).status, 200);
    const params = stripe.checkout.sessions.lastParams;
    assert.equal(params.mode, 'subscription');
    assert.deepEqual(params.line_items, [{ price: `price_plink_${price}`, quantity: 1 }]);
    assert.equal(params.metadata.support_link, `plink_${price}`);
    assert.equal(params.custom_fields.length, 3); assert(params.custom_fields.every(f => f.optional));
    assert.equal(params.custom_fields[2].dropdown.default_value, undefined);
    assert.equal(params.success_url, `${local}/support?payment=returned`);
    assert.equal(params.adaptive_pricing.enabled, false);
  }
  const result = await (await post({ kind: 'monthly', amount: '10' }, project.origin)).json();
  assert.equal(new URL(result.url).origin, 'https://buy.stripe.com');
});

test('monthly sessions attributed by server metadata survive invoice-first and duplicate webhook delivery', async () => {
  const { db, env, stripe } = fixture();
  const checkout = session({ livemode: true, mode: 'subscription', payment_link: null, subscription: 'sub_live', invoice: 'in_live',
    metadata: { support_integration: 'ftw-support-v1', support_project: 'villow', support_link: 'plink_ten' } });
  stripe.checkout.sessions.list = async () => ({ data: [checkout] });
  const invoice = event('invoice.paid', { id: 'in_live', parent: { subscription_details: { subscription: 'sub_live' } }, status: 'paid', amount_paid: 1000, currency: 'aud', status_transitions: { paid_at: 1700000020 } }, { livemode: true });
  await processEvent(db, env, stripe, invoice);
  const complete = event('checkout.session.completed', checkout, { livemode: true });
  await processEvent(db, env, stripe, complete); await processEvent(db, env, stripe, complete);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM payments').first()).n, 1);
  const rows = (await db.prepare('SELECT project, kind, subscription_id FROM contributions').all()).results;
  assert.equal(rows.length, 1); assert.equal(rows[0].project, 'villow'); assert.equal(rows[0].kind, 'monthly'); assert.equal(rows[0].subscription_id, 'sub_live');
});
