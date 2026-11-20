import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { FakeContext, FakeElement, Matrix, Path, installFakeBrowser } from './browser-fixture.mjs';

const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const bundle = await build({
  stdin: { contents: `export { config } from './core/config.ts';
    export { createSpider } from './core/spider.ts';
    export { createAnimations } from './core/animation.ts';
    export { createMood } from './core/mood.ts';
    export { neutralFace, drawEyes } from './core/face.ts';
    export { blankLook } from './core/wardrobe.ts';`, resolveDir: directory, loader: 'ts' },
  bundle: true, format: 'esm', platform: 'node', write: false,
  plugins: [{ name: 'local-svg-source', setup(builder) {
    builder.onResolve({ filter: /\.svg\?raw$/ }, (args) => ({ path: resolve(args.resolveDir, args.path.slice(0, -4)), namespace: 'raw-svg' }));
    builder.onLoad({ filter: /.*/, namespace: 'raw-svg' }, async ({ path }) => ({ contents: await readFile(path, 'utf8'), loader: 'text' }));
  } }],
});
const { config, createSpider, createAnimations, createMood, neutralFace, drawEyes, blankLook } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const originalConfig = JSON.stringify(config);
let browser;
afterEach(() => {
  assert.equal(JSON.stringify(config), originalConfig, 'per-instance profile must preserve every source config default');
  browser?.restore(); browser = null;
});

function stationary() {
  const tail = { x: 24, y: 10, px: 24, py: 10 };
  return {
    points: [tail], tail, length: 0,
    at() { return tail; },
    setLength() { throw new Error('Pinned profile may not simulate a rope'); },
    reset() { throw new Error('Pinned profile may not reset a rope'); },
    addVelocity() { throw new Error('Pinned profile may not add artificial velocity'); },
  };
}
const anchor = { x: 24, y: 10, unit: 100 };
function rig({ cursor = true } = {}) {
  const root = new FakeElement();
  const position = stationary();
  const animations = createAnimations(position, () => false, { listen: false, pinned: true });
  const face = neutralFace();
  const spider = createSpider(root, position, animations.state, face, blankLook(), { pinned: true, fixedLegs: true, showFavicon: false, cursor });
  return { spider, animations, face, root, position, dispose() { spider.dispose(); animations.dispose(); } };
}
function drawing(spider) {
  const ctx = new FakeContext(); spider.draw(ctx);
  const fills = ctx.operations.filter((operation) => operation.kind === 'fill' && operation.path instanceof Path && operation.path.d);
  assert.ok(fills.length >= 8, 'actual source paths should reach the canvas');
  return { ctx, fills, legs: fills.slice(0, 6), body: fills[6] };
}
function coordinates(d) { return [...d.matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi)].map((match) => Number(match[0])); }
function normalizedLegs(draw) {
  const bodyInverse = draw.body.matrix.inverse();
  return draw.legs.map((leg) => {
    const toBody = bodyInverse.multiply(leg.matrix);
    const numbers = coordinates(leg.path.d), result = [];
    for (let i = 0; i < numbers.length; i += 2) {
      const point = toBody.transformPoint({ x: numbers[i], y: numbers[i + 1] });
      result.push(point.x, point.y);
    }
    return result;
  });
}
function closeArrays(actual, expected, tolerance = 0.025) {
  assert.equal(actual.length, expected.length);
  actual.forEach((values, i) => {
    assert.equal(values.length, expected[i].length);
    values.forEach((value, j) => assert.ok(Math.abs(value - expected[i][j]) < tolerance, `leg ${i + 1}, coordinate ${j}: ${value} vs ${expected[i][j]}`));
  });
}

for (const reducedMotion of [false, true]) {
const motion = reducedMotion ? 'reduced motion' : 'normal motion';

test(`fixed placed legs ignore cursor, performances and expression articulation without disabling the eyes (${motion})`, () => {
  browser = installFakeBrowser({ reducedMotion });
  const r = rig();
  try {
    r.spider.update(anchor, 0, 0, 1, 1);
    const base = drawing(r.spider);
    browser.pointer(0, 12);
    Object.assign(r.animations.state, { legSwing: 1.4, legPhase: 2.8, grip: 1, pull: 1, stretchLeg: 2, stretchAmount: 1.2 });
    Object.assign(r.face, { spread: 1, tuck: 1 });
    r.spider.update(anchor, 0, 0, 1, 1);
    assert.deepEqual(drawing(r.spider).legs.map((leg) => leg.path.d), base.legs.map((leg) => leg.path.d));
    assert.equal(r.spider.rotation(), 0);
    assert.equal(r.root.style.transform, undefined, 'pinned instance must not move a DOM grab target');
    assert.ok(browser.window.listeners.has('pointermove'), 'cursor eyes remain enabled');
    assert.ok(!browser.window.listeners.has('pointerdown'), 'the source spider has no click handler');
  } finally { r.dispose(); }
  assert.equal(browser.window.listenerCount, 0);
  assert.equal(browser.document.documentElement.listenerCount, 0);
});

test(`fixed legs skip spring/fidget work and share the full body transform through breathing, squash and stretch (${motion})`, () => {
  browser = installFakeBrowser({ reducedMotion });
  const r = rig({ cursor: false });
  const random = Math.random;
  try {
    r.spider.update(anchor, 0, 0, 1, 1);
    const base = normalizedLegs(drawing(r.spider));
    Math.random = () => { throw new Error('fixed legs must not run their random fidget updates'); };
    for (let frame = 0; frame < 180; frame++) r.spider.update(anchor, 1 / 60, 0, 1, 1);
    const breathing = drawing(r.spider);
    closeArrays(normalizedLegs(breathing), base);
    if (reducedMotion) assert.equal(breathing.body.matrix.a, drawingAtRestScale(), 'reduced motion suppresses decorative body breathing');
    else assert.ok(Math.abs(breathing.body.matrix.a - drawingAtRestScale()) > 0.000001, 'normal mode retains the source body breathing');
    Object.assign(r.face, { squash: 0.24, squashAxis: [0.8, 0.6], pull: 0.65, pullAxis: [0.6, 0.8] });
    r.spider.update(anchor, 0, 0, 1, 1);
    const deformed = drawing(r.spider);
    assert.notDeepEqual(deformed.legs.map((leg) => leg.path.d), breathing.legs.map((leg) => leg.path.d), 'attached legs should transform with the deforming body');
    closeArrays(normalizedLegs(deformed), base);
    assert.equal(r.spider.rotation(), 0);
    assert.equal(r.position.tail.x, r.position.tail.px);
    assert.equal(r.position.tail.y, r.position.tail.py);
  } finally { Math.random = random; r.dispose(); }
});
function drawingAtRestScale() { return config.look.width * anchor.unit / 596 * config.body.scaleX; }

test(`source eyes approach the cursor gradually and settle in its direction (${motion})`, () => {
  browser = installFakeBrowser({ reducedMotion });
  const r = rig();
  const pupilX = () => {
    const draw = drawing(r.spider);
    const pupil = draw.fills[9];
    assert.ok(pupil, 'source pupil path is drawn');
    return draw.body.matrix.inverse().multiply(pupil.matrix).e;
  };
  try {
    // Let the source pupil-home preference settle before measuring cursor attention.
    for (let frame = 0; frame < 120; frame++) r.spider.update(anchor, 1 / 60, 0, 1, 1);
    const resting = pupilX();
    browser.pointer(100, 20);
    r.spider.update(anchor, 1 / 60, 0, 1, 1);
    const first = pupilX();
    for (let frame = 0; frame < 120; frame++) r.spider.update(anchor, 1 / 60, 0, 1, 1);
    const settled = pupilX();
    assert.ok(first > resting, `first frame starts looking toward the right-hand pointer: ${JSON.stringify({ resting, first, settled })}`);
    assert.ok(settled > first + 1, 'attention/interpolation continues gradually after the first frame');
    assert.ok(first - resting < (settled - resting) * 0.75, 'eyes must not snap immediately to the cursor');
    browser.pointer(-80, 20);
    for (let frame = 0; frame < 120; frame++) r.spider.update(anchor, 1 / 60, 0, 1, 1);
    assert.ok(pupilX() < resting, 'cursor eye tracking remains available in both directions');
  } finally { r.dispose(); }
});

test(`source blink timing runs while pinned, with clean squash closure and no crease stroke (${motion})`, () => {
  browser = installFakeBrowser({ reducedMotion });
  const r = rig({ cursor: false });
  try {
    assert.equal(config.blink.style, 'squash');
    const amounts = [];
    for (let frame = 0; frame < 180; frame++) {
      r.animations.update(anchor, 1 / 60, 0);
      amounts.push(r.animations.state.blink);
      assert.equal(r.animations.state.grip, 0);
      assert.equal(r.animations.state.tilt, 0);
      assert.equal(r.animations.state.stretchLeg, -1);
    }
    assert.ok(Math.max(...amounts) > 0.92, 'source ambient blink closes fully');
    assert.equal(amounts.at(-1), 0, 'source ambient blink opens again');
    const eyes = ['left', 'right'].map((side, index) => ({ side, center: [10 + index * 20, 10], radius: 8, extent: [9, 8], white: new Path(`M${index} 0L1 1Z`), pupil: new Path(`M${index} 1L2 2Z`), pupilCenter: [10 + index * 20, 10], look: [0, 0], slosh: [0, 0] }));
    const colors = { body: '#111', eyes: '#fff', pupils: '#111', mouth: '#fff' };
    const open = new FakeContext(); drawEyes(open, eyes, neutralFace(), 0, colors);
    assert.equal(open.operations.filter((operation) => operation.kind === 'fill').length, 4);
    const half = new FakeContext(); drawEyes(half, eyes, neutralFace(), 0.5, colors);
    assert.ok(half.operations.filter((operation) => operation.kind === 'clip').every((operation) => Math.abs(operation.matrix.d - 0.5) < 1e-8), 'blink squashes the source aperture');
    assert.equal(half.operations.filter((operation) => operation.kind === 'stroke').length, 0);
    const shut = new FakeContext(); drawEyes(shut, eyes, neutralFace(), 1, colors);
    assert.equal(shut.operations.length, 0, 'closed squash blink draws neither pale fringe nor an eye outline');
    r.animations.play('dropIn'); r.animations.update(anchor, 1 / 60, 0);
    assert.equal(r.animations.busy, false, 'pinned animations reject body/drop-in performances');
  } finally { r.dispose(); }
});

test(`pinned mood retains cursor emotions without click/grab/global controls or physical velocity (${motion})`, () => {
  browser = installFakeBrowser({ reducedMotion });
  const root = new FakeElement();
  const position = stationary();
  const animations = createAnimations(position, () => false, { listen: false, pinned: true });
  const mood = createMood(root, position, () => false, () => false, { listen: false, interactive: false, blink: () => animations.play('blink') });
  try {
    const frame = { unit: 100, anchor: [24, 9], center: [24, 24], radius: 24, foodNear: 0, busy: false, windUp: 0 };
    assert.equal(mood.current, null);
    browser.pointer(48, 24);
    const duration = config.faceSuspicious.after + 1.8;
    for (let i = 0; i < Math.ceil(duration * 60); i++) mood.update(1 / 60, frame);
    assert.equal(mood.current, 'suspicious', 'a cursor lingering nearby still provokes the source expression');
    assert.ok(mood.face.left.lid > 0.1, 'expression reaches the renderable source face');
    assert.equal(browser.window.listeners.has('pointerdown'), false);
    assert.equal(root.listenerCount, 0, 'pinned mood has no grab/release listeners');
    assert.equal(browser.document.listenerCount, 0, 'isolated instances have no page-wide spider controls');
    assert.equal(position.tail.x, position.tail.px);
    assert.equal(position.tail.y, position.tail.py);
  } finally { mood.dispose(); animations.dispose(); }
  assert.equal(browser.window.listenerCount, 0);
  assert.equal(browser.document.documentElement.listenerCount, 0);
});
}
