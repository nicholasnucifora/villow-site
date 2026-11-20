import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSupporterFeed } from '../help-support-feed.js';
import { feedFixture } from './support-feed-fixture.mjs';

test('a slow pre-confirmation feed cannot erase the newly published message', async t => {
  const { root } = feedFixture(t);
  const pending = [];
  const feed = mountSupporterFeed(root, { request: () => new Promise(resolve => pending.push(resolve)), examples: () => null });
  const before = feed.load(), after = feed.load();
  pending[1]({ supporters: [{ displayName: 'New supporter', message: 'Now visible', date: '2026-11-16', kind: 'once' }] });await after;
  pending[0]({ supporters: [] });await before;
  assert.equal(root.querySelector('[data-support-notes]').hidden, false);
  assert.equal(root.querySelector('[data-supporters]').children.length, 1);
  assert.equal(root.querySelector('[data-supporters]').children[0].children[1].textContent, 'Now visible');
});
