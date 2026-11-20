import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {localizePreviewLinks} from '../study-navigation.mjs';

const w=await readFile(new URL('../w.html',import.meta.url),'utf8');
const x=await readFile(new URL('../x.html',import.meta.url),'utf8');
const remainingPage=page=>page.slice(page.indexOf('<section class="i-following"'));
assert.equal(remainingPage(x),localizePreviewLinks(remainingPage(w).replaceAll('Villow · Homepage W','Villow · Homepage X')),'W content after the hero is preserved');
const hero=x.match(/<section class="i-hero[\s\S]*?<\/section>/)[0];
assert.ok(!/\.webp|\.png|ig-viewer-pose|w-hero-feet|mask:url/.test(hero),'No raster artwork or pose patches in X hero');
assert.equal((hero.match(/data-ig-cinema=/g)||[]).length,1);
assert.ok(hero.includes('data-ig-seek')&&hero.includes('data-ig-reflection'),'Existing accessible cinema interactions remain');
assert.ok(w.includes('assets/w-hero-feet-v1.webp'),'W retains its own artwork');
assert.ok(!w.includes('href="x-clear-horizons.css"'),'X styling stays isolated');
assert.ok(x.includes('href="x-clear-horizons.css"'));
console.log('X: hero has no raster patches; remaining W content and cinema controls preserved.');
