import test from 'node:test';
import assert from 'node:assert/strict';
import { database, environment, fields, session, fakeStripe, event, approve } from './helpers.mjs';
import { processEvent, recentSupporters } from '../lib/events.mjs';
import { AMOUNT_CONSENT_LABEL, AMOUNT_CONSENT_VERSION, CONSENT_VERSION, checkoutFields, fieldMapping, publicFields } from '../lib/config.mjs';
import { createWorker } from '../worker.mjs';

test('new checkouts explicitly request amount sharing without preselecting consent', () => {
  const fresh = checkoutFields(fields);
  assert.equal(fresh[2].label.custom, AMOUNT_CONSENT_LABEL);
  assert(AMOUNT_CONSENT_LABEL.length <= 50);
  assert.equal(fresh[2].dropdown.default_value, undefined);
  assert(fresh.every(f => f.optional));
  assert.deepEqual(fresh[2].dropdown.options, fields[2].dropdown.options);
  assert.equal(fields[2].label.custom, 'Can we publicly display your name and message?');
  fieldMapping(fresh);
});

test('amount permission follows checkout wording, not later link edits, and remains explicitly opt-in', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  const original = stripe.paymentLinks.retrieve;
  stripe.paymentLinks.retrieve = async id => {
    const revised = checkoutFields(structuredClone(fields)); revised[2].key = 'newpermissionkey';
    revised[2].dropdown.options[0] = { label: 'Yes', value: 'newyesvalue' };
    return { ...await original(id), custom_fields: revised };
  };
  for (const [id, useNewLabel, choice] of [['old', false, 'explicit_yes_123'], ['new', true, 'explicit_yes_123'], ['no', true, 'no'], ['blank', true, undefined]]) {
    const paid = session({ id: `cs_${id}`, payment_intent: `pi_${id}`, amount_total: 1234 });
    if (useNewLabel) paid.custom_fields[2].label.custom = AMOUNT_CONSENT_LABEL;
    paid.custom_fields[2].dropdown.value = choice;
    await processEvent(db, env, stripe, event('checkout.session.completed', paid, { id: `evt_${id}` }));
  }
  await approve(db);
  assert.equal((await db.prepare("SELECT consent_version FROM contributions WHERE session_id = 'cs_old'").first()).consent_version, CONSENT_VERSION);
  assert.equal((await db.prepare("SELECT consent_version FROM contributions WHERE session_id = 'cs_new'").first()).consent_version, AMOUNT_CONSENT_VERSION);
  const rows = await recentSupporters(db, 'villow');
  assert.equal(rows.length, 2);
  assert.equal(rows.filter(row => Object.hasOwn(row, 'amount')).length, 1);
  assert.equal(rows.find(row => row.amount)?.amount, 1234);
  assert.equal(rows.find(row => row.amount)?.currency, 'aud');
  assert(!JSON.stringify(rows).includes('pi_'));
  assert(!JSON.stringify(rows).includes('sam@example.com'));
  await db.prepare("UPDATE contributions SET moderation = 'hidden' WHERE session_id = 'cs_new'").run();
  assert((await recentSupporters(db, 'villow')).every(row => !Object.hasOwn(row, 'amount')));
  assert.equal(publicFields(fields, fieldMapping(fields)).shareAmount, false);
});

test('recent feed stops at 50 approved entries and removal hides shared amounts too', async () => {
  const db = database(); const env = environment(db); const stripe = fakeStripe();
  for (let i = 0; i < 55; i++) {
    const paid = session({ id: `cs_${i}`, payment_intent: `pi_${i}` }); paid.custom_fields[2].label.custom = AMOUNT_CONSENT_LABEL;
    await processEvent(db, env, stripe, event('checkout.session.completed', paid, { id: `evt_${i}`, created: 1700000010 + i }));
  }
  await approve(db); const worker = createWorker();
  const response = await worker.fetch(new Request('https://support.example/v1/projects/villow/supporters?recent=50'), env);
  assert.equal((await response.json()).supporters.length, 50);
  await db.prepare('UPDATE contributions SET removed_at = 1').run();
  assert.equal((await recentSupporters(db, 'villow')).length, 0);
});
