import test from 'node:test';
import assert from 'node:assert/strict';
import { recentWindow, publicAmountLabel, relativeSupportDate, withPreviewSamples } from '../help-support-feed.js';
import { amountIssue } from '../help-currency.js';

test('browsing wraps through only the newest 50 messages', () => {
  const records = Array.from({ length: 70 }, (_, index) => index);
  assert.deepEqual(recentWindow(records, 0).records, [0]);
  assert.deepEqual(recentWindow(records, 50).records, [0]);
  assert.deepEqual(recentWindow(records, -1).records, [49]);
  assert.equal(recentWindow(records).total, 50);
  assert.equal(recentWindow([]).pages, 1);
  assert.equal(publicAmountLabel({ kind: 'monthly' }), '');
  assert.equal(publicAmountLabel({ amount: 500, currency: 'aud', kind: 'monthly' }), 'A$5 / month');
  assert.equal(publicAmountLabel({ amount: 1234, currency: 'aud', kind: 'once' }), 'A$12.34');
});

test('relative dates use the supplied day without inventing payment hours', () => {
  const now = Date.UTC(2026, 10, 16, 1);
  for (const [date, label] of [['2026-11-16','Today'],['2026-11-15','1 day ago'],['2026-11-13','3 days ago'],['2026-11-09','1 week ago'],['2026-11-02','2 weeks ago'],['2026-10-16','1 month ago'],['2025-11-16','1 year ago'],['2026-12-01','Today'],['invalid',''],[null,'']]) assert.equal(relativeSupportDate(date, now), label);
});

test('private samples yield to real messages and cannot fill a public feed', () => {
  const samples = ['Alex', 'Sam', 'Taylor', 'Riley', 'Casey', 'Robin'].map(displayName => ({ displayName, message: 'An example.' }));
  const real = ['Steve', 'Jordan', 'Morgan', 'Andy', 'Lee', 'Blair'].map(displayName => ({ displayName, message: 'Genuine note.' }));
  for (let count = 0; count <= 6; count++) {
    const feed = withPreviewSamples(real.slice(0, count), samples, 'http://127.0.0.1:4411');
    assert.equal(feed.length, 6);assert.equal(feed.filter(row => row.previewSample).length, 6 - count);
    assert.deepEqual(feed.slice(0, count), real.slice(0, count));
  }
  for (const origin of ['https://villow.app', 'https://fixtheweb.org', 'https://preview.example', 'http://127.0.0.1:9999', undefined]) {
    assert.deepEqual(withPreviewSamples(real.slice(0, 1), samples, origin), real.slice(0, 1));
  }
  assert.equal(withPreviewSamples([{ displayName: 'Alex' }], samples, 'http://localhost:4411')[1].displayName, 'Sam');
  assert(!samples.some(row => row.previewSample));
});

test('custom amount validity matches server limits without changing entered cents', () => {
  for (const value of ['', '4.99', '0', '-5', '5e2', '5.001', '5.0.0', 'Infinity', '10000.01']) assert(amountIssue(value));
  for (const value of ['5', '12.34', '10000']) assert.equal(amountIssue(value), '');
});
