import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { LABELS } from '../lib/config.mjs';
export function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_support.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0002_discord.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0003_discord_return_origin.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0004_message_review.sql', import.meta.url), 'utf8'));
  sqlite.exec(readFileSync(new URL('../migrations/0005_censored_messages.sql', import.meta.url), 'utf8'));
  const db = {
    prepare(sql) {
      let params = [];
      return {
        bind(...values) { params = values; return this; },
        async first() { return sqlite.prepare(sql).get(...params) || null; },
        async all() { return { results: sqlite.prepare(sql).all(...params) }; },
        async run() { return { meta: { changes: Number(sqlite.prepare(sql).run(...params).changes) } }; },
      };
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const result = []; for (const statement of statements) result.push(await statement.run()); sqlite.exec('COMMIT'); return result; }
      catch (e) { sqlite.exec('ROLLBACK'); throw e; }
    },
    sqlite,
  };
  return db;
}
export const fields = [
  { key: 'displayname', label: { type: 'custom', custom: LABELS[0] }, type: 'text', optional: true, text: { value: 'Sam' } },
  { key: 'supportermessage', label: { type: 'custom', custom: LABELS[1] }, type: 'text', optional: true, text: { value: '<img src=x onerror=alert(1)> Thanks!' } },
  { key: 'permission', label: { type: 'custom', custom: LABELS[2] }, type: 'dropdown', optional: true,
    dropdown: { options: [{ label: 'Yes', value: 'explicit_yes_123' }, { label: 'No', value: 'no' }], value: 'explicit_yes_123' } },
];
export const project = { origin: 'https://villow.example', currency: 'aud', portal: 'https://billing.stripe.com/p/login/test_portal',
  links: { once: 'plink_once', monthly5: 'plink_five', monthly10: 'plink_ten', monthly20: 'plink_twenty' } };
export function environment(db) { return { DB: db, PROJECTS_JSON: JSON.stringify({ villow: project }), STRIPE_MODE: 'test', PAYMENTS_ENABLED: 'true',
  STRIPE_SECRET_KEY: 'sk_test_fixture', STRIPE_WEBHOOK_SECRET: 'whsec_testfixture', EMAIL_HASH_SECRET: 'test-hash-secret-with-at-least-32-characters', RESEND_API_KEY: 're_fixture', MAIL_FROM: 'test@example.com' }; }
export function session(overrides = {}) { return { id: 'cs_test_once', created: 1700000000, livemode: false, mode: 'payment', payment_status: 'paid',
  payment_link: 'plink_once', payment_intent: 'pi_once', amount_total: 1000, currency: 'aud', customer_details: { email: 'sam@example.com' },
  custom_fields: structuredClone(fields), ...overrides }; }
export function event(type, object, overrides = {}) { return { id: `evt_${type.replaceAll('.', '_')}`, created: 1700000010, livemode: false, type, data: { object }, ...overrides }; }
export function fakeStripe(checkout = session()) {
  return {
    paymentLinks: {
      async retrieve(id) { return { id, livemode: false, active: true, url: `https://buy.stripe.com/test_${id}`, custom_fields: structuredClone(fields) }; },
      async listLineItems(id) {
        const amounts = { plink_five: 500, plink_ten: 1000, plink_twenty: 2000 };
        return { has_more: false, data: [{ quantity: 1, price: { id: `price_${id}`, product: 'prod_support', currency: 'aud',
          ...(id === 'plink_once' ? { custom_unit_amount: { minimum: 500 } } : { unit_amount: amounts[id], recurring: { interval: 'month', interval_count: 1 } }) } }] };
      },
    },
    checkout: { sessions: {
      async list() { return { data: [checkout] }; },
      async create(params) { this.lastParams = params; return { id: checkout.id, url: 'https://checkout.stripe.com/c/pay/cs_test_fixture' }; },
      async retrieve() { return checkout; },
    } },
    subscriptions: { async retrieve(id) { return { id, status: 'active', cancel_at_period_end: false }; } },
  };
}
export async function approve(db) { await db.prepare("UPDATE contributions SET moderation = 'approved'").run(); }
