import test from 'node:test';
import assert from 'node:assert/strict';
import { mountSupporterFeed } from '../help-support-feed.js';
import { mountSupporterReader } from '../help-support-reader.js';
import { feedFixture } from './support-feed-fixture.mjs';

const message = 'A longer message with <b>literal text</b> that remains completely available when the excerpt is shortened. '.repeat(2);
const records = ['Alex','Sam','Jamie','Taylor'].map(displayName => ({ displayName, message, date:'2026-11-16' }));
async function setup(t, entries = records, options = {}) {
  const f = feedFixture(t, options);
  await mountSupporterFeed(f.root, { request:async () => ({ supporters:entries }), examples:() => null, readable:true }).load();
  const row = f.get('[data-message-viewport]'), list = f.get('[data-supporters]');
  const item = list.children.find(node => node.getAttribute('aria-hidden') !== 'true');
  item.querySelector('p').scrollHeight = 200;f.resize(1100);f.inView(true);
  return { ...f, row, list, item, dialog:f.get('[data-support-notes]').children[0] };
}

test('clipped cards open complete plain text, pause both rows and return focus on close', async t => {
  const f = await setup(t);
  assert.equal(f.item.dataset.readable, 'true');assert(!f.item.querySelector('button').hidden);
  f.row.emit('click', { target:f.item });assert(f.dialog.open);
  assert.equal(f.dialog.children[0].textContent, 'A note from Alex');
  assert.equal(f.dialog.children[2].textContent, message);
  assert.equal(f.dialog.children[2].children.length, 0, 'Donor markup is never interpreted');
  const upper = f.list.style.transform, lower = f.get('[data-supporters-secondary]').style.transform;
  f.advance(3000);assert.equal(f.list.style.transform, upper);assert.equal(f.get('[data-supporters-secondary]').style.transform, lower);
  f.dialog.children[3].emit('click');assert(!f.dialog.open);assert.equal(f.doc.activeElement, f.row);
  f.advance(1000);assert.notEqual(f.list.style.transform, upper);assert.notEqual(f.get('[data-supporters-secondary]').style.transform, lower);
});

test('closing a note resumes both rows even with focus restored and the pointer still over them', async t => {
  const f = await setup(t);
  f.row.emit('pointerenter',{pointerType:'mouse'});f.row.emit('click',{target:f.item});
  f.dialog.emit('click',{target:f.dialog,clientX:350,clientY:20});
  assert(!f.dialog.open, 'Clicking the backdrop dismisses the note');
  f.row.emit('pointerenter',{pointerType:'mouse'});
  const before = f.list.style.transform;f.advance(1000);assert.notEqual(f.list.style.transform,before);
  f.row.emit('pointermove',{pointerType:'mouse'});const hovered = f.list.style.transform;
  f.advance(1000);assert.notEqual(f.list.style.transform,hovered);
  f.row.emit('pointerleave');f.advance(1000);assert.notEqual(f.list.style.transform,hovered);
});

test('closing a note respects deliberate pause and reduced-motion preferences', async t => {
  const f = await setup(t);
  f.row.emit('keydown',{key:' ',preventDefault(){}});f.row.emit('click',{target:f.item});f.dialog.close();
  const paused = f.list.style.transform;f.advance(1000);assert.equal(f.list.style.transform,paused);
  f.row.emit('keydown',{key:' ',preventDefault(){}});f.motion.matches = true;f.motion.emit('change');
  f.row.emit('click',{target:f.item});f.dialog.close();
  const reduced = f.list.style.transform;f.advance(1000);assert.equal(f.list.style.transform,reduced);
});

test('anywhere on the card opens the note; Enter opens the selected note', async t => {
  const f = await setup(t);
  for (const target of [f.item, f.item.querySelector('p'), f.item.querySelector('strong'), f.item.querySelector('button')]) {
    f.row.emit('click', { target });assert(f.dialog.open);f.dialog.close();
  }
  f.row.emit('keydown', { key:'Enter', preventDefault() {} });assert(f.dialog.open);
});

test('short and single notes remain readable, with no visible reading caption', async t => {
  const f = await setup(t, records.slice(0,1));assert.equal(f.row.tabIndex, 0);
  f.row.emit('keydown', { key:'Enter', preventDefault() {} });assert(f.dialog.open);f.dialog.close();
  f.item.querySelector('p').scrollHeight = 24;f.resize(1200);
  assert.equal(f.item.dataset.readable, 'true');assert.equal(f.item.dataset.truncated, 'false');
  assert.equal(f.item.querySelector('button').textContent, '');
  assert.equal(f.item.querySelector('button').getAttribute('aria-label'), 'Read note from Alex');
  assert.equal(f.row.tabIndex, 0);
  f.row.emit('click',{target:f.item});assert(f.dialog.open);f.dialog.close();
  assert.equal(f.row.dataset.moving, 'false', 'A single note remains static');
});

test('visible looping copies open the same note without extra keyboard stops', t => {
  const f = feedFixture(t);const notes = f.get('[data-support-notes]');
  const reader = mountSupporterReader(notes, { amountLabel:() => '', dateLabel:() => '', onChange() {} });
  const copy = f.doc.createElement('li');copy.inert = true;copy.setAttribute('aria-hidden','true');
  const paragraph = f.doc.createElement('p');paragraph.textContent = message;paragraph.scrollHeight = 200;copy.append(paragraph);
  reader.decorate(copy, records[0], true);reader.measure([copy]);
  assert(!copy.inert);assert.equal(copy.getAttribute('aria-hidden'),'true');assert.equal(copy.querySelector('button').tabIndex,-1);
  assert(reader.openFrom(copy.querySelector('button'), f.get('[data-message-viewport]')));
  assert.equal(notes.children[0].children[2].textContent, message);
});
