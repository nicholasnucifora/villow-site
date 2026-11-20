// Run with the local preview on port 4411.
const assert = require('node:assert/strict');
const { join } = require('node:path');
const { tmpdir, homedir } = require('node:os');
const { chromium, devices } = require(join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const url = 'http://127.0.0.1:4411/w.html#feed-to-watch-later';

async function open(browser, options, input) {
  const page = await browser.newPage(options);
  page.on('pageerror', error => { throw error; });
  await page.goto(url);
  await page.locator(`[data-wf-input="${input}"]`).waitFor();
  const image = page.locator('.ifs-front .ifs-card-image');
  await image.scrollIntoViewIfNeeded();
  return {page, image, feed: page.locator('[data-thumbnail-feed]')};
}

async function waitCount(page, count) {
  await page.locator(`[data-wf-count="${count}"] [data-ifs-stack][aria-busy="false"]`).waitFor({state: 'attached'});
}

async function checkDesktop(browser) {
  const {page, image, feed} = await open(browser, {viewport: {width: 1280, height: 900}}, 'pointer');
  const save = image.locator('[data-ifs-action="save"]');
  const remove = image.locator('[data-ifs-action="remove"]');
  const css = (el, name) => el.evaluate((node, prop) => getComputedStyle(node)[prop], name);
  await page.mouse.move(0, 0);
  assert.equal(await css(save, 'opacity'), '0');
  await image.hover({position: {x: 42, y: 36}});
  assert.equal(await css(save, 'width'), '54px');
  assert.equal(await css(save, 'opacity'), '1');
  await remove.hover();
  assert.equal(await css(remove, 'width'), '60px');
  assert.equal(await css(remove.locator('svg'), 'width'), '33px');
  for (const action of [save, remove]) {
    assert.equal((await action.textContent()).trim(), '');
    assert.equal(await action.getAttribute('title'), null);
  }
  await feed.screenshot({path: join(tmpdir(), 'w-feed-desktop.png')});

  const box = await image.boundingBox();
  const x = Math.round(box.x + 53);
  const y = Math.round(box.y + 80);
  for (let i = 0; i < 3; i++) await page.mouse.click(x + 16*i, y + 6*i);
  const centres = await image.locator('.wf-tap-ripple').evaluateAll(nodes => nodes.map(node => {
    const box = node.getBoundingClientRect();
    return [box.x + box.width / 2, box.y + box.height / 2];
  }));
  assert.equal(centres.length, 3);
  centres.forEach(([cx, cy], i) => assert(Math.hypot(cx - x - 16*i, cy - y - 6*i) < 1.5));
  await image.locator('.wf-tap-ripple').first().waitFor({state: 'detached'});
  const front = page.locator('.ifs-front');
  const transform = await css(front, 'transform');
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x+120,y, {steps: 8});
  assert.equal(await css(front, 'transform'), transform);
  await page.mouse.up();
  assert.equal(await image.locator('.wf-tap-ripple').count(), 0);
  assert.equal(await feed.getAttribute('data-wf-count'), '5');
  assert.equal(page.url(), url);
  await image.hover();
  await save.click();
  await waitCount(page, 4);
  assert.equal(await feed.getAttribute('data-wf-saved'), '1');
  await page.setViewportSize({width: 380, height: 720});
  assert.equal(await page.locator('.t-swipe-cue').isVisible(), false);

  await page.keyboard.press('Tab');
  await remove.focus();
  assert.equal(await css(remove, 'opacity'), '1');
  for (let count = 3; count >= 0; count--) {
    await page.keyboard.press('Enter');
    await waitCount(page, count);
  }
  assert.equal(await page.locator('[data-wf-complete] h3').evaluate(el => el === document.activeElement), true);
  await page.close();
}

async function checkTouch(browser) {
  const {page, image, feed} = await open(browser, devices['Pixel 7'], 'touch');
  assert(await page.locator('.t-swipe-cue').isVisible());
  assert.equal(await image.locator('[data-ifs-action="save"]').evaluate(el => getComputedStyle(el).opacity), '0');
  const box = await image.boundingBox();
  const x = Math.round(box.x + box.width / 2);
  const y = Math.round(box.y + box.height / 2);
  await page.touchscreen.tap(x, y);
  await page.touchscreen.tap(x+12, y+12);
  assert.equal(await image.locator('.wf-tap-ripple').count(), 2);
  assert.equal(await feed.getAttribute('data-wf-count'), '5');
  await feed.screenshot({path: join(tmpdir(), 'w-feed-touch.png')});
  const session = await page.context().newCDPSession(page);
  async function swipe(distance) {
    await session.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[{x, y}]});
    for (let i = 1; i <= 5; i++) {
      await session.send('Input.dispatchTouchEvent', {type:'touchMove', touchPoints:[{x:x+distance*i/5, y}]});
    }
    await session.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]});
  }
  await image.locator('.wf-tap-ripple').first().waitFor({state:'detached'});
  await swipe(32);
  assert.equal(await image.locator('.wf-tap-ripple').count(), 0);
  assert.equal(await feed.getAttribute('data-wf-count'), '5');
  await swipe(115);
  await waitCount(page, 4);
  // A phone can omit the compatibility click on the first tap after swiping.
  // Drop that event and check the touch itself still produces exactly one wave.
  await page.evaluate(() => {
    window.addEventListener('click', event => event.stopImmediatePropagation(), {capture:true, once:true});
  });
  await page.touchscreen.tap(x, y);
  assert.equal(await image.locator('.wf-tap-ripple').count(), 1);
  await image.locator('.wf-tap-ripple').waitFor({state:'detached'});
  await swipe(-115);
  await waitCount(page, 3);
  assert.equal(await feed.getAttribute('data-wf-saved'), '1');
  assert.equal(page.url(), url);
  await page.close();
}

async function checkReduced(browser) {
  const {page, image} = await open(browser, {reducedMotion: 'reduce'}, 'pointer');
  await image.locator('.wf-sample').focus();
  await page.keyboard.press('Enter');
  const ripple = image.locator('.wf-tap-ripple');
  assert.deepEqual(await ripple.evaluate(el => {
    const style = getComputedStyle(el);
    return [style.width, style.height, style.animationDuration, Math.abs(parseFloat(el.style.left) - el.parentElement.clientWidth/2)];
  }), ['48px', '48px', '0.18s', 0]);
  await ripple.waitFor({state:'detached'});
  await page.getByRole('button', {name:'Preview motion', exact:true}).click();
  await image.locator('.wf-sample').click({position:{x:55, y:45}});
  const samples = await ripple.evaluate(el => {
    const animation = el.getAnimations()[0];
    animation.pause();
    return [100, 320].map(time => {
      animation.currentTime = time;
      const style = getComputedStyle(el);
      return {size:el.getBoundingClientRect().width, opacity:Number(style.opacity), duration:style.animationDuration};
    });
  });
  assert.equal(samples[0].duration, '0.65s');
  assert(samples[1].size > samples[0].size && samples[1].opacity < samples[0].opacity);
  await image.screenshot({path: join(tmpdir(), 'w-feed-expanded-ripple.png')});
  await ripple.evaluate(el => el.getAnimations()[0].play());
  await ripple.waitFor({state:'detached'});
  await page.close();
}

(async () => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    await checkDesktop(browser);
    await checkTouch(browser);
    await checkReduced(browser);
    console.log('Passed desktop, narrow desktop, mobile touch, keyboard and reduced-motion feed checks.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
