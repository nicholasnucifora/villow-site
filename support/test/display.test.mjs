import test from 'node:test';
import assert from 'node:assert/strict';
import { database, environment, project, session, fakeStripe, event, approve } from './helpers.mjs';
import { processEvent } from '../lib/events.mjs';
import { createWorker } from '../worker.mjs';
import { exchangeRates } from '../lib/exchange.mjs';
import { roundedEstimate, money } from '../../previews/homepage/help-currency.js';

test('converted estimates use up to two decimals, respecting currencies without cents', () => {
  assert.equal(roundedEstimate(5, 0.657), 3.29);
  assert.equal(roundedEstimate(10, 0.657), 6.57);
  assert.equal(roundedEstimate(20, 0.657), 13.14);
  assert.equal(roundedEstimate(10, 100.123, 'JPY'), 1002);
  assert.equal(roundedEstimate(5, 0.6), 3);
  assert.equal(roundedEstimate(12.34, 0.657), 8.11);
  assert.match(money(10), /A\$10/);
  assert(!money(1002, 'JPY', true).includes('.'));
  for (const invalid of [0, -1, Infinity, NaN]) assert.throws(() => roundedEstimate(5, invalid));
});

test('exchange proxy accepts only recent valid AUD reference rates and caches them', async () => {
  const now = Date.UTC(2026, 10, 3); let requests = 0;
  const mock = async () => { requests++; return Response.json([
    { base: 'AUD', quote: 'USD', rate: 0.657, date: '2026-11-02' },
    { base: 'AUD', quote: 'JPY', rate: 100.123, date: '2026-11-02' },
    { base: 'AUD', quote: 'OLD', rate: 12, date: '2025-01-01' },
    { base: 'USD', quote: 'EUR', rate: 0.9, date: '2026-11-02' },
    { base: 'AUD', quote: 'BAD', rate: -5, date: '2026-11-02' },
    { base: 'AUD', quote: 'NEW', rate: 1, date: '2029-01-01' },
  ]); };
  const result = await exchangeRates(mock, now);
  assert.deepEqual(result.rates, { AUD: 1, USD: 0.657, JPY: 100.123 });
  assert.equal(result.dates.USD, '2026-11-02');
  await exchangeRates(mock, now + 1000); assert.equal(requests, 1);
  await assert.rejects(exchangeRates(async () => new Response('', { status: 503 }), now + 21600001));
});

test('supporter pagination shows more than ten while preserving consent, moderation and the public allowlist', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  for (let i = 0; i < 27; i++) await processEvent(db, env, stripe, event('checkout.session.completed',
    session({ id: `cs_${i}`, payment_intent: `pi_${i}` }), { id: `evt_${i}`, created: 1700000010 + i }));
  await approve(db);
  await db.prepare("UPDATE contributions SET moderation = 'hidden' WHERE session_id = 'cs_26'").run();
  await db.prepare("UPDATE contributions SET consent = 0 WHERE session_id = 'cs_25'").run();
  const worker = createWorker();
  const page = async value => (await worker.fetch(new Request(`https://support.example/v1/projects/villow/supporters${value}`), env)).json();
  assert.equal((await page('')).supporters.length, 10);
  const first = await page('?page=0'); const second = await page('?page=1'); const last = await page('?page=2');
  assert.equal(first.supporters.length, 12); assert.equal(first.hasMore, true); assert.equal(first.nextPage, 1);
  assert.equal(second.supporters.length, 12); assert.equal(second.hasMore, true);
  assert.equal(last.supporters.length, 1); assert.equal(last.hasMore, false);
  assert.deepEqual(Object.keys(first.supporters[0]), ['displayName', 'message', 'kind', 'monthlyStatus', 'date']);
  assert(!JSON.stringify(first).includes('pi_'));
  assert.equal((await worker.fetch(new Request('https://support.example/v1/projects/villow/supporters?page=-1'), env)).status, 400);
});
