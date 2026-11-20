import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {conceptsPageBodyB} from '../concepts-page-b.mjs';
import {conceptStudies} from '../site-routes.js';

const section = conceptsPageBodyB().match(/<section class="cb-section cb-ai"[\s\S]*?<\/section>/)[0];
const ids = ['ai-chapters', 'ai-video-conversations', 'ai-community-notes'];
for (const [preset] of conceptStudies) {
 const preview = await readFile(new URL(`../concepts-${preset}.html`, import.meta.url), 'utf8');
 assert.ok(preview.includes(`class="secondary-preview concepts-preview concepts-b-preview concepts-ai-${preset}"`));
 assert.ok(preview.includes(section), `Preset ${preset} keeps the full copy and shared tabs`);
}
assert.match(section, /role="tablist" aria-label="Generative AI ideas" hidden/);
assert.deepEqual([...section.matchAll(/<article class="cb-ai-panel" id="([^"]+)"/g)].map(match => match[1]), ids);
assert.deepEqual([...section.matchAll(/aria-controls="(ai-[^"]+)"/g)].map(match => match[1]), ids);
assert.doesNotMatch(section, /<details\b/);
assert.match(section, /how to keep what makes social media worthwhile/);
assert.match(section, /how many people asked and could write the chapters/);
assert.match(section, /AI can sound confident while missing context/);
assert.match(section, /That is a lot to ask without help/);
assert.match(section, /“Request AI fact-check,” focusing the work/);
assert.match(section, /href="#ai-community-notes"/);
assert.match(section, /support\.google\.com\/youtube\/answer\/9884579/);
assert.match(section, /reddit\.com\/r\/youtube\/comments\/1wnppn8/);
assert.match(section, /communitynotes\.x\.com\/guide/);

const source = (await readFile(new URL('../concepts-b-interactions.js', import.meta.url), 'utf8')).replace(/^import[^\n]+\n/gm, '');
function fixture(id, attributes = {}) {
 return {
  id, attributes, events: {}, hidden: false, focused: false,
  setAttribute(name, value) { this.attributes[name] = value; },
  getAttribute(name) { return this.attributes[name]; },
  addEventListener(type, callback) { this.events[type] = callback; },
  focus() { this.focused = true; },
 };
}
function setup(hash, contentFit = false) {
 const location = {hash};
 const tabs = ids.map(id => fixture(`ai-tab-${id.slice(3)}`, {'aria-controls': id}));
 const panels = ids.map((id, index) => ({
  ...fixture(id), height: 300 + 50 * index, getBoundingClientRect() { return {height: this.height}; },
 }));
 const surfaceProps = new Map();
 const reader = {
  ...fixture('reader'),
  closest(selector) { assert.equal(selector, '.concepts-ai-g'); return contentFit ? this : null; },
  querySelector() { return {style: {setProperty: (key, value) => surfaceProps.set(key, value)}}; },
  dispatchEvent(event) { assert.equal(event.type, 'ai-idea-change'); },
 };
 const tablist = {hidden: true, querySelectorAll: () => tabs, parentElement: reader};
 const window = fixture('window');
 const document = {
  querySelector: selector => selector === '.cb-ai-tabs' ? tablist : null,
  querySelectorAll: () => [],
  getElementById: id => panels.find(panel => panel.id === id),
 };
 vm.runInNewContext(source, {document, location, window, Event});
 assert.equal(tablist.hidden, false);
 return {location, tabs, panels, reader, window, surfaceProps};
}
function assertSelection({tabs, panels}, index) {
 assert.deepEqual(tabs.map(tab => tab.attributes['aria-selected']), tabs.map((_, i) => String(i === index)));
 assert.deepEqual(tabs.map(tab => tab.tabIndex), tabs.map((_, i) => i === index ? 0 : -1));
 assert.deepEqual(panels.map(panel => panel.hidden), panels.map((_, i) => i !== index));
 assert.deepEqual(panels.map(panel => panel.inert), panels.map((_, i) => i !== index));
 assert.deepEqual(panels.map(panel => panel.attributes['aria-labelledby']), tabs.map(tab => tab.id));
}

const initial = setup('#ai');
assertSelection(initial, 0);
initial.tabs[0].events.keydown({key: 'ArrowLeft', preventDefault() {}});
assertSelection(initial, 2);
assert.equal(initial.tabs[2].focused, true);
initial.tabs[1].events.click();
assertSelection(initial, 1);

const linked = setup('#ai-community-notes');
assertSelection(linked, 2);
linked.location.hash = '#ai-video-conversations';
linked.window.events.hashchange();
assertSelection(linked, 1);
linked.reader.events.click({target: {closest: () => ({hash: '#ai-community-notes'})}});
assertSelection(linked, 2);
assert.equal(linked.panels[2].focused, true);
const contentFit = setup('#ai-community-notes', true);
assert.equal(contentFit.surfaceProps.get('--cb-ai-surface-height'), '400px');
contentFit.tabs[1].events.click();
assert.equal(contentFit.surfaceProps.get('--cb-ai-surface-height'), '350px');
contentFit.panels[1].height=410;
contentFit.window.events.resize();
assert.equal(contentFit.surfaceProps.get('--cb-ai-surface-height'), '410px');
console.log('AI concepts: fuller wording, exclusive selection, keyboard navigation and deep links passed.');
