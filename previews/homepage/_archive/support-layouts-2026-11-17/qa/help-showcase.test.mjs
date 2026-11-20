import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSupporterFeed } from '../help-support-feed.js';
import { noteReadingTime } from '../help-support-showcase.js';
import { feedFixture } from './support-feed-fixture.mjs';

const records = Array.from({ length: 14 }, (_, i) => ({ displayName:`Person ${i + 1}`, message:i ? 'A longer note '.repeat(18).slice(0,255) : 'Thank you!', date:'2026-11-16' }));
async function mount(t, layout, options = {}, messages = records) {
  const f = feedFixture(t, options);
  const feed = mountSupporterFeed(f.root, { request:async () => ({ supporters:messages }), examples:() => null, layout });
  await feed.load();
  const host = f.get('[data-support-notes]').children[0];
  const [, stage, people, foot] = host.children;
  return { ...f, host, stage, people, foot, pages:stage.children[0] };
}
const selected = f => f.pages.children.findIndex(item => item.dataset.active === 'true');
const key = (f, key) => f.stage.emit('keydown', { key, preventDefault() {} });

for (const layout of ['spotlight','letters','garden']) test(`${layout} keeps complete notes and browses beyond six with one accessible selection`, async t => {
  const f = await mount(t, layout, { reducedMotion:true });f.inView(true);
  assert.equal(f.pages.children.length, 14);
  assert.equal(f.pages.children[1].children[1].textContent, records[1].message);
  assert.equal(selected(f), 0);
  for (let i = 0; i < 8; i++) key(f, 'ArrowRight');
  assert.equal(selected(f), 8);
  assert.equal(f.pages.children.filter(item => !item.inert).length, 1);
  assert.equal(f.people.children[8].getAttribute('aria-pressed'), 'true');
  if (layout === 'garden') {
    assert(f.people.children[0].hidden);assert(!f.people.children[8].hidden);
    assert.equal(f.people.children.filter(button => !button.hidden).length, 6);
  }
  f.people.children[2].emit('click');assert.equal(selected(f), 2);
  key(f, 'ArrowLeft');assert.equal(selected(f), 1);
});

test('reading timer respects reduced motion, longer messages, hover, focus and hidden tabs', async t => {
  const f = await mount(t, 'spotlight', { reducedMotion:true });f.inView(true);
  f.advance(30000);assert.equal(selected(f), 0);
  f.doc.body.toggleAttribute('data-r-preview-motion');f.advance(9100);assert.equal(selected(f), 1);
  assert(noteReadingTime(records[1].message) > noteReadingTime(records[0].message));
  f.advance(9100);assert.equal(selected(f), 1, 'Long notes receive additional reading time');
  f.host.emit('pointerenter', { pointerType:'mouse' });f.advance(30000);assert.equal(selected(f), 1);
  f.host.emit('pointerleave');f.advance(22000);assert.equal(selected(f), 2);
  f.host.emit('focusin');f.advance(30000);assert.equal(selected(f), 2);
  f.host.emit('focusout', { relatedTarget:null });f.doc.hidden = true;f.doc.emit('visibilitychange');
  f.advance(30000);assert.equal(selected(f), 2);
  f.doc.hidden = false;f.doc.emit('visibilitychange');f.advance(22000);assert.equal(selected(f), 3);
});

test('letter swipes navigate while vertical touch scrolling and cancelled gestures keep their place', async t => {
  const f = await mount(t, 'letters', { reducedMotion:true });
  const pointer = { pointerId:1, button:0, clientX:150, clientY:100 };
  f.stage.emit('pointerdown', pointer);f.stage.emit('pointermove', { ...pointer, clientY:160 });
  assert(!f.stage.hasPointerCapture(1));f.stage.emit('pointerup', { ...pointer, type:'pointerup' });assert.equal(selected(f), 0);
  f.stage.emit('pointerdown', pointer);f.stage.emit('pointermove', { ...pointer, clientX:50 });
  f.stage.emit('pointerup', { ...pointer, type:'pointerup' });assert.equal(selected(f), 1);
  f.stage.emit('pointerdown', pointer);f.stage.emit('pointermove', { ...pointer, clientX:50 });
  f.stage.emit('pointercancel', { ...pointer, type:'pointercancel' });assert.equal(selected(f), 1);
});

test('a single genuine note stays static and exposes no browsing controls', async t => {
  const f = await mount(t, 'garden', {}, records.slice(0,1));f.inView(true);f.advance(60000);
  assert.equal(selected(f), 0);assert(f.people.hidden);assert(f.foot.children[1].hidden);
  assert.equal(f.stage.tabIndex, -1);
});
