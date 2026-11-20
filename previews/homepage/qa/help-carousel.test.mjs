import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSupporterFeed } from '../help-support-feed.js';
import { feedFixture } from './support-feed-fixture.mjs';
const messages = ['Alex', 'Sam', 'Jamie', 'Taylor', 'Morgan', 'Riley'].map(displayName => ({ displayName, message: 'Thank you!', date: '2026-11-15', kind: 'once' }));
const mount = (fixture, supporters) => mountSupporterFeed(fixture.root, { request: async () => ({ supporters }), examples: () => null });
const translation = (f, suffix = '') => Number(f.get(`[data-supporters${suffix}]`).style.transform.match(/translate3d\(([-.\d]+)px/)?.[1] || 0);
const originals = (f, suffix = '') => f.get(`[data-supporters${suffix}]`).children.filter(card => card.getAttribute('aria-hidden') !== 'true');
const names = (f, suffix = '') => originals(f, suffix).map(card => card.children[0].children[0].textContent);
const key = (f, value, suffix = '') => f.get(`[data-message-viewport${suffix}]`).emit('keydown', { key: value, preventDefault() {} });

test('empty and single-message feeds stay static without copies or a second row', async t => {
  const f = feedFixture(t);await mount(f, []).load();f.inView(true);assert(f.get('[data-support-notes]').hidden);
  await mount(f, messages.slice(0, 1)).load();f.inView(true);
  assert(!f.get('[data-support-notes]').hidden);assert(f.get('[data-message-viewport-secondary]').hidden);
  assert.equal(f.get('[data-supporters]').children.length, 1);
  f.advance(60000);assert.equal(translation(f), 0);
});

test('two distinct rows start immediately and drift in opposite directions', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);
  assert.deepEqual(names(f), ['Alex', 'Jamie', 'Morgan']);assert.deepEqual(names(f, '-secondary'), ['Sam', 'Taylor', 'Riley']);
  for (const suffix of ['', '-secondary']) {
    assert.equal(originals(f, suffix).length, 3);
    assert(f.get(`[data-supporters${suffix}]`).children.filter(card => card.inert).every(card => card.getAttribute('aria-hidden') === 'true'));
  }
  const first = translation(f), second = translation(f, '-secondary');f.advance(1000);
  assert(translation(f) > first + 20 && translation(f) < first + 26);
  assert(translation(f, '-secondary') < second - 20 && translation(f, '-secondary') > second - 26);
  f.advance(60000);
  for (const suffix of ['', '-secondary']) assert(translation(f, suffix) >= -1338 && translation(f, suffix) <= 0);
  assert.equal(f.get('[data-message-announcement]').textContent, '');
});

test('keyboard browsing wraps within its row and Space resumes without visible playback buttons', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);
  key(f, 'ArrowRight');assert.match(f.get('[data-message-announcement]').textContent, /Jamie/);
  key(f, 'ArrowRight');assert.match(f.get('[data-message-announcement]').textContent, /Morgan/);
  key(f, 'ArrowRight');assert.match(f.get('[data-message-announcement]').textContent, /Alex/);
  key(f, 'ArrowLeft');assert.match(f.get('[data-message-announcement]').textContent, /Morgan/);
  const stopped = translation(f);f.advance(1000);assert.equal(translation(f), stopped);
  key(f, ' ');f.advance(1000);assert.notEqual(translation(f), stopped);
  key(f, 'ArrowRight', '-secondary');assert.match(f.get('[data-message-announcement]').textContent, /Taylor/);
});

test('pointer hovering, dragging and background clicks never pause or reposition the row', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);
  const viewport = f.get('[data-message-viewport]'), before = translation(f);
  const pointer = { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 200, clientY: 20, preventDefault() {} };
  viewport.emit('pointerenter', pointer);viewport.emit('pointerdown', pointer);
  viewport.emit('pointermove', { ...pointer, clientX: 300 });assert.equal(translation(f), before);assert(!viewport.hasPointerCapture(1));
  f.advance(1000);assert(translation(f) > before);
  const moving = translation(f);
  viewport.emit('pointermove', { ...pointer, clientX: 180 });assert.equal(translation(f), moving);
  viewport.emit('pointerup', pointer);viewport.emit('click');assert(!viewport.hasPointerCapture(1));
  f.advance(1000);assert(translation(f) > moving);
  viewport.emit('click');const clicked = translation(f);f.advance(1000);assert(translation(f) > clicked);
  viewport.emit('pointerdown', pointer);viewport.emit('pointermove', { ...pointer, clientX: 240 });viewport.emit('pointercancel', pointer);
  const afterCancel = translation(f);f.advance(1000);assert(translation(f) > afterCancel);
});

test('vertical touch gestures keep native page scrolling', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);
  const viewport = f.get('[data-message-viewport]'), before = translation(f);
  const pointer = { pointerId: 2, pointerType: 'touch', button: 0, clientX: 100, clientY: 100, preventDefault() { assert.fail('Do not cancel native touch scrolling'); } };
  viewport.emit('pointerdown', pointer);viewport.emit('pointermove', { ...pointer, clientY: 140 });
  assert(!viewport.hasPointerCapture(2));assert.equal(translation(f), before);
  viewport.emit('pointermove', { ...pointer, clientX: 200, clientY: 145 });assert.equal(translation(f), before);
  f.advance(1000);assert(translation(f) > before);
});

test('hover keeps both rows moving; hidden tabs, offscreen rows and pagehide stop their work', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);
  const viewport = f.get('[data-message-viewport]');
  viewport.emit('pointerenter', { pointerType: 'mouse' });const before = translation(f), lower = translation(f, '-secondary');
  f.advance(1000);assert.notEqual(translation(f), before);assert.notEqual(translation(f, '-secondary'), lower);viewport.emit('pointerleave');
  for (const [stop, resume] of [
    [() => { f.doc.hidden = true;f.doc.emit('visibilitychange'); }, () => { f.doc.hidden = false;f.doc.emit('visibilitychange'); }],
    [() => f.inView(false), () => f.inView(true)],
    [() => f.win.emit('pagehide'), () => f.win.emit('pageshow')],
  ]) {
    stop();const before = translation(f);f.advance(1000);assert.equal(translation(f), before);
    resume();f.advance(1000);assert.notEqual(translation(f), before);
  }
  viewport.focusVisible = false;viewport.emit('focusin', { relatedTarget: null });
  const pointerFocused = translation(f);f.advance(1000);assert.notEqual(translation(f), pointerFocused);
  viewport.focusVisible = true;viewport.emit('focusin', { relatedTarget: null });
  const focused = translation(f);f.advance(1000);assert.equal(translation(f), focused);
  viewport.emit('focusout',{relatedTarget:null});f.advance(1000);assert.notEqual(translation(f), focused);
});

test('reduced motion uses the homepage Preview motion attribute to opt both rows in and out', async t => {
  const f = feedFixture(t, { reducedMotion: true });await mount(f, messages).load();f.inView(true);
  const first = translation(f), second = translation(f, '-secondary');f.advance(1000);assert.equal(translation(f), first);assert.equal(translation(f, '-secondary'), second);
  f.doc.body.toggleAttribute('data-r-preview-motion');f.advance(1000);assert.notEqual(translation(f), first);assert.notEqual(translation(f, '-secondary'), second);
  f.doc.body.toggleAttribute('data-r-preview-motion');const stopped = translation(f);f.advance(1000);assert.equal(translation(f), stopped);
  f.motion.matches = false;f.motion.emit('change');f.advance(1000);assert.notEqual(translation(f), stopped);
});

test('resizing preserves the selected row record; fewer than four records use one row', async t => {
  const f = feedFixture(t);await mount(f, messages).load();f.inView(true);key(f, 'ArrowRight');
  f.resize(360, 298);key(f, 'ArrowRight');assert.match(f.get('[data-message-announcement]').textContent, /Morgan/);
  f.resize(1100, 404);assert.equal(originals(f).length, 3);assert.equal(originals(f, '-secondary').length, 3);
  await mount(f, messages.slice(0, 3)).load();assert.equal(originals(f).length, 3);assert(f.get('[data-message-viewport-secondary]').hidden);
});

test('six local preview cards yield to genuine records; failed loads never become sample feeds', async t => {
  const f = feedFixture(t, { origin: 'http://127.0.0.1:4411' });
  let real = [{ displayName: 'Steve', message: 'Genuine note.', date: '2026-11-16' }];
  const feed = mountSupporterFeed(f.root, { request: async () => ({ supporters: real }), examples: () => null, previewSamples: () => messages });
  await feed.load();f.inView(true);
  assert.equal(originals(f).length + originals(f, '-secondary').length, 6);
  assert.equal(originals(f, '-secondary')[0].children[0].children[1].textContent, 'Sample');
  real = messages;await feed.load();
  assert([...originals(f), ...originals(f, '-secondary')].every(card => !card.children[0].children.some(child => child.textContent === 'Sample')));
  const failure = mountSupporterFeed(f.root, { request: async () => { throw new Error('unavailable'); }, examples: () => null, previewSamples: () => messages });
  await failure.load();assert(f.get('[data-support-notes]').hidden);
});
