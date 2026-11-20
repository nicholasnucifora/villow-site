import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mountPinnedFooterSpider } from '../pinned-footer-spider.js';
import { FakeElement, FakeCanvas, Path, installFakeBrowser } from './browser-fixture.mjs';

function fixture(options) {
  const browser = installFakeBrowser(options);
  const slot = new FakeElement('span');
  const fallback = new FakeElement('img', { class: 'footer-spidey-fallback' });
  slot.append(fallback);
  return { ...browser, slot, fallback };
}

function drawing(canvas) {
  return canvas.context.operations.map(({ kind, path, matrix, alpha, fill }) => ({
    kind, path: path?.d, matrix: matrix.values.map((value) => Math.round(value * 1e9) / 1e9), alpha, fill,
  }));
}

function sourceDrawing(canvas) {
  const fills = canvas.context.operations.filter(({ kind, path }) => kind === 'fill' && path instanceof Path && path.d);
  assert.ok(fills.length >= 8, 'actual bundled source paths reach the canvas');
  return { fills, body: fills[6] };
}

function pupilX(canvas) {
  const { fills, body } = sourceDrawing(canvas);
  assert.ok(fills[9], 'open source pupil is drawn');
  return body.matrix.inverse().multiply(fills[9].matrix).e;
}

function advance(f, frameCount, start = 0) {
  for (let frame = 0; frame < frameCount; frame++) {
    assert.equal(f.frames.size, 1, 'one visible source frame remains scheduled');
    f.flushFrame(start + frame * 1000 / 60);
  }
  return start + frameCount * 1000 / 60;
}

function assertDisposed(f) {
  assert.equal(f.frames.size, 0, 'all pending animation frames cancelled');
  assert.equal(f.window.listenerCount, 0, 'all window handlers removed');
  assert.equal(f.document.listenerCount, 0, 'all document handlers removed');
  assert.equal(f.document.documentElement.listenerCount, 0, 'all pointer-leave handlers removed');
  assert.equal(f.slot.listenerCount, 0, 'no link-slot interaction handlers remain');
  for (const media of f.media.values()) assert.equal(media.listenerCount, 0, 'media-query handlers removed');
  for (const observer of [...f.resizeObservers, ...f.intersectionObservers]) assert.equal(observer.targets.size, 0, 'observers disconnected');
  assert.equal(f.slot.querySelector('canvas'), null);
  assert.equal(f.fallback.hidden, false);
  assert.equal(f.fallback.style.visibility, '');
}

test('actual bundled adapter mounts once, draws source paths and releases every resource', () => {
  const f = fixture();
  try {
    for (let cycle = 0; cycle < 3; cycle++) {
      const spider = mountPinnedFooterSpider(f.slot);
      const canvas = f.slot.querySelector('canvas');
      assert.ok(canvas instanceof FakeCanvas);
      assert.equal(mountPinnedFooterSpider(f.slot), spider, 'duplicate mount shares one handle');
      assert.equal(f.slot.querySelectorAll('canvas').length, 1);
      assert.equal(f.frames.size, 1);
      assert.ok(canvas.context.operations.filter((operation) => operation.kind === 'fill').length >= 10);
      assert.equal(f.fallback.hidden, true, 'fallback hides only after source renderer succeeds');
      assert.equal(canvas.style.pointerEvents, 'none');
      for (const type of ['pointerdown', 'pointerup', 'click', 'spider:play', 'spider:reset']) {
        assert.equal(f.window.listeners.has(type), false);
        assert.equal(f.document.listeners.has(type), false);
        assert.equal(f.slot.listeners.has(type), false);
      }
      spider.dispose();
      spider.dispose();
      spider.setActive(true);
      assertDisposed(f);
    }
  } finally { f.restore(); }
});

test('offscreen, explicit and document pauses preserve the quiet drawing across long wall-clock gaps', () => {
  const f = fixture();
  let spider;
  try {
    spider = mountPinnedFooterSpider(f.slot);
    const canvas = f.slot.querySelector('canvas');
    f.flushFrame(1000);
    f.flushFrame(1016);
    const before = drawing(canvas);
    spider.setActive(false);
    assert.equal(f.frames.size, 0);
    f.pointer(1, 1);
    spider.setActive(true);
    assert.deepEqual(drawing(canvas), before);
    f.flushFrame(900000);
    assert.deepEqual(drawing(canvas), before, 'first resumed frame does not advance animation time');
    f.document.hidden = true;
    f.document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(f.frames.size, 0);
    f.document.hidden = false;
    f.document.dispatchEvent(new Event('visibilitychange'));
    f.flushFrame(1800000);
    assert.deepEqual(drawing(canvas), before);
    f.intersectionObservers[0].emit(false);
    assert.equal(f.frames.size, 0);
    f.intersectionObservers[0].emit(true);
    f.flushFrame(2700000);
    assert.deepEqual(drawing(canvas), before);
    assert.equal(f.frames.size, 1);
  } finally { spider?.dispose(); f.restore(); }
});

test('initially offscreen keeps fallback and allocates no pupil renderer until visible', () => {
  const f = fixture();
  let spider;
  try {
    f.slot.rect = { ...f.slot.rect, top: 1200, bottom: 1248 };
    spider = mountPinnedFooterSpider(f.slot);
    assert.equal(f.frames.size, 0);
    assert.equal(f.fallback.hidden, false);
    assert.equal(f.window.listeners.has('pointermove'), false);
    f.slot.rect = { ...f.slot.rect, top: 300, bottom: 348 };
    f.intersectionObservers[0].emit(true);
    assert.equal(f.frames.size, 1);
    assert.equal(f.fallback.hidden, true);
  } finally { spider?.dispose(); f.restore(); }
});

for (const reducedMotion of [false, true]) {
test(`bundled footer stays still except eased nearby pupils (${reducedMotion ? 'reduced' : 'normal'} motion)`, () => {
  const f = fixture({ reducedMotion });
  let spider;
  try {
    spider = mountPinnedFooterSpider(f.slot);
    const canvas = f.slot.querySelector('canvas');
    assert.equal(f.fallback.hidden, true);
    assert.equal(canvas.style.visibility, 'visible');
    assert.equal(f.window.listeners.get('pointermove')?.size, 1, 'only source pupil tracking listens to the pointer');
    let time = advance(f, 600);
    const resting = pupilX(canvas);
    const still = drawing(canvas);
    for (let sample = 0; sample < 24; sample++) {
      time = advance(f, 30, time);
      assert.deepEqual(drawing(canvas), still, 'idle body, legs, mouth and eyes stay unchanged');
      assert.equal(Number(f.slot.getAttribute('data-spidey-blink')), 0, 'no blink is scheduled');
      assert.equal(Number(f.slot.getAttribute('data-spidey-blink-count')), 0);
    }
    f.pointer(72, 24);
    time = advance(f, 1, time);
    const first = pupilX(canvas);
    time = advance(f, 25, time);
    const right = pupilX(canvas);
    assert.ok(first > resting, `first frame notices the right-hand pointer: ${JSON.stringify({ resting, first, right })}`);
    assert.ok(right > first + 1, 'source attention and interpolation continue with live dt');
    assert.ok(first - resting < (right - resting) * 0.75, 'eyes ease toward the pointer');
    f.pointer(-24, 24);
    time = advance(f, 25, time);
    assert.ok(pupilX(canvas) < resting, 'source eyes also follow the left-hand pointer');

    // Holding a cursor near the face used to trigger suspicious lids and blinks.
    f.pointer(48, 24);
    time = advance(f, 600, time);
    const held = drawing(canvas);
    const eyePath = sourceDrawing(canvas).fills[7].path.d;
    for (let sample = 0; sample < 24; sample++) {
      time = advance(f, 30, time);
      assert.deepEqual(drawing(canvas), held, 'a stationary nearby pointer never starts ambient motion or emotions');
      const { body } = sourceDrawing(canvas);
      const aperture = canvas.context.operations.find(({ kind, path }) => kind === 'clip' && path?.d === eyePath);
      assert.ok(aperture, 'the eye remains open');
      const local = body.matrix.inverse().multiply(aperture.matrix);
      assert.ok(Math.abs(local.d / local.a - 1) < 1e-9, 'the eye is not squashed by a blink');
      assert.equal(canvas.context.operations.some(({ kind, path }) => kind === 'clip' && !path), false, 'no expression lid clips');
      assert.equal(canvas.context.operations.some(({ kind }) => kind === 'stroke'), false);
      assert.equal(Math.abs(body.matrix.b) + Math.abs(body.matrix.c), 0, 'body remains pinned and level');
      assert.equal(Number(f.slot.getAttribute('data-spidey-blink')), 0);
      assert.equal(Number(f.slot.getAttribute('data-spidey-blink-count')), 0);
    }

    f.pointer(1e8, 1e8);
    time = advance(f, 600, time);
    assert.ok(Math.abs(pupilX(canvas) - resting) < 1e-6, 'pupils return to rest when the pointer is far away');
    assert.deepEqual(drawing(canvas), still, 'the same quiet resting drawing returns');
    assert.equal(f.frames.size, 1);
  } finally { spider?.dispose(); assertDisposed(f); f.restore(); }
});
}

test('normal and reduced motion render the identical quiet footer profile', () => {
  const sample = (reducedMotion) => {
    const f = fixture({ reducedMotion });
    let spider;
    try {
      spider = mountPinnedFooterSpider(f.slot);
      const canvas = f.slot.querySelector('canvas');
      let time = advance(f, 600);
      const views = [drawing(canvas)];
      for (const x of [72, -24]) {
        f.pointer(x, 24);
        time = advance(f, 90, time);
        views.push(drawing(canvas));
      }
      return views;
    } finally { spider?.dispose(); assertDisposed(f); f.restore(); }
  };
  assert.deepEqual(sample(false), sample(true), 'motion preference changes neither the resting face nor pointer-only response');
});

test('motion preference changes retain the same quiet pupil instance and release resources cleanly', () => {
  const f = fixture({ reducedMotion: true });
  let spider;
  try {
    spider = mountPinnedFooterSpider(f.slot);
    const canvas = f.slot.querySelector('canvas');
    let time = advance(f, 30);
    const handlers = [...f.window.listeners.get('pointermove')];
    f.pointer(72, 24);
    time = advance(f, 15, time);
    const before = drawing(canvas);
    f.setReducedMotion(false);
    assert.equal(f.frames.size, 1);
    assert.deepEqual([...f.window.listeners.get('pointermove')], handlers, 'preference changes preserve the running pupil instance');
    time = advance(f, 15, time);
    assert.notDeepEqual(drawing(canvas), before, 'pupil interpolation continues after preference changes');
    f.window.devicePixelRatio = 2;
    f.resizeObservers[0].emit();
    time = advance(f, 1, time);
    assert.equal(canvas.width, 96);
    assert.equal(canvas.height, 96);
    f.setReducedMotion(true);
    assert.equal(f.frames.size, 1);
    assert.deepEqual([...f.window.listeners.get('pointermove')], handlers);
    f.window.devicePixelRatio = 1;
    f.resizeObservers[0].emit();
    advance(f, 1, time);
    assert.equal(canvas.width, 48);
    assert.equal(canvas.height, 48);
    spider.dispose();
    assertDisposed(f);
  } finally { spider?.dispose(); f.restore(); }
});

test('scrolling and slot movement never invent body tilt or physical velocity', () => {
  const f = fixture({ reducedMotion: true });
  let spider;
  try {
    spider = mountPinnedFooterSpider(f.slot);
    const canvas = f.slot.querySelector('canvas');
    const original = drawing(canvas);
    f.window.scrollX = 18;
    f.window.scrollY = 400;
    f.slot.rect = { left: 220, right: 268, top: 150, bottom: 198, width: 48, height: 48 };
    f.resizeObservers[0].emit();
    assert.deepEqual(drawing(canvas), original, 'same local source drawing at a new document position');
  } finally { spider?.dispose(); f.restore(); }
});

test('context, first-draw and later frame failures report diagnostics, preserve fallback and release resources', () => {
  for (const failure of ['context', 'draw', 'frame']) {
    const f = fixture();
    const errors = [];
    const originalError = console.error;
    console.error = (...args) => errors.push(args);
    try {
      const error = new Error(`Synthetic ${failure} failure`);
      const createElement = f.document.createElement;
      f.document.createElement = (tag) => {
        const element = createElement(tag);
        if (tag === 'canvas') {
          if (failure === 'context') element.getContext = () => null;
          else if (failure === 'draw') element.context.fill = () => { throw error; };
        }
        return element;
      };
      const spider = mountPinnedFooterSpider(f.slot);
      if (failure === 'frame') {
        const canvas = f.slot.querySelector('canvas');
        assert.equal(f.fallback.hidden, true, 'first successful frame replaces the fallback');
        canvas.context.fill = () => { throw error; };
        f.flushFrame(1000);
      }
      assert.equal(errors.length, 1, `${failure} failure is reported once for development diagnosis`);
      assert.match(String(errors[0][0]), /spidey|spider/i);
      if (failure !== 'context') assert.ok(errors[0].includes(error), 'actual failure details are reported');
      else assert.ok(errors[0].some((value) => value instanceof Error), 'missing context has an explicit failure reason');
      assertDisposed(f);
      spider.dispose();
      assertDisposed(f);
    } finally { console.error = originalError; f.restore(); }
  }
});
