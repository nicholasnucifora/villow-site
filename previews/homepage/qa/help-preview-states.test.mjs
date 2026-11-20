import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupportPreview, previewLocation, supportScenarios } from '../help-preview-scenarios.js';

test('state fixtures are opt-in, and malformed state IDs cannot fall back to live services', async t => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('A preview attempted a real network call'); });
  assert.equal(createSupportPreview(''), null);
  assert.equal(createSupportPreview('?preview-state=discord-supporter'), null);
  for (const state of [...supportScenarios.map(s => s.id), '', 'unknown', 'https://evil.example']) {
    const preview = createSupportPreview(new URLSearchParams({ 'support-preview': state }));
    assert(preview);
    if (preview.state.failure !== 'config') assert.equal((await preview.request('config')).mode, 'live');
    await assert.rejects(preview.request('unrecognised-mutation'));
  }
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});

test('the catalog covers real payment, private verification, joining, account and removal outcomes', async () => {
  const ids = supportScenarios.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const outcome of ['connected', 'pending', 'join-server', 'screening', 'cancelled', 'expired', 'unavailable', 'not-supported', 'test-account-only', 'already-linked', 'failed']) {
    assert(supportScenarios.some(s => new URLSearchParams(s.fragment).get('discord') === outcome), outcome);
  }
  const unknown = await createSupportPreview('?support-preview=discord-no-payment').request('discord-status');
  assert.deepEqual(unknown, { eligible: false, connected: false, disconnecting: false });
  await assert.rejects(createSupportPreview('?support-preview=discord-email-rate').request('discord-request'), { status: 429 });
  await assert.rejects(createSupportPreview('?support-preview=removal-expired').request('removal-confirm'), { status: 400 });
  const feed = createSupportPreview('?support-preview=messages');
  const first = await feed.request('supporters?page=0'); const second = await feed.request('supporters?page=1');
  assert.equal(first.supporters.length, 12); assert(first.hasMore);
  assert.equal(second.supporters.length, 12); assert(second.hasMore);
  const recent = await feed.request('supporters?recent=50');
  assert.equal(recent.supporters.length, 50); assert.equal(recent.supporters[0].amount, 500);
});

test('a frame URL keeps the local origin and discards real credentials and return state', () => {
  const url = previewLocation('discord-supporter', 'http://127.0.0.1:4411/support?payment=returned&example-messages=1#discord-link=secret');
  assert.equal(url.href, 'http://127.0.0.1:4411/support?support-preview=discord-supporter');
  assert(!url.href.includes('secret'));
});
