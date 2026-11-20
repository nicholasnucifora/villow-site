import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {setupPageBodyB} from '../setup-page-b.mjs';
import {setupInstructionsBodyB} from '../setup-instructions-page-b.mjs';
import {extensionGuideB} from '../setup-extension-guide-b.mjs';
import {previewPageURL} from '../preview-pages.js';

const transitions = [];
const createSetupTransition = container => {
 const controller = {container, calls:[], cancelled:0, run(change, options){this.calls.push(options);change();}, cancel(){this.cancelled++;},finish(){}};
 transitions.push(controller);
 return controller;
};

const body = setupPageBodyB();
assert.match(body, /name="youtube" value="yes"/);
assert.match(body, /name="youtube" value="no"/);
for (const path of ['web', 'extension', 'both']) assert.ok(body.includes(`setup-instructions-b.html?path=${path}`));
assert.doesNotMatch(body, /data-show-comparison/);
assert.match(body, /<h1 id="setup-title">Three ways to use Villow\./);
assert.match(body, /id="compare-options"><section/);
assert.ok(body.indexOf('id="compare-options"') < body.indexOf('id="setup-question"'));
assert.doesNotMatch(body, /Help me choose|Answer one question for a suggestion/);
assert.doesNotMatch(body, /Explore the Villow web app|Explore the extension/);
assert.doesNotMatch(body, /Browse setup options instead|Both work on their own/);
const instructions = setupInstructionsBodyB();
assert.match(instructions, /id="web-app"/);
assert.match(instructions, /id="extension"/);
assert.match(instructions, /id="use-together"/);
for (const path of ['web','extension','both']) assert.ok(instructions.includes(`data-instructions-path="${path}"`));

const panels = ['web', 'options'].map(result => ({dataset: {result}, hidden: true}));
const result = {hidden: true, querySelectorAll: () => panels};
let answer = null;
let onChange;
let onStoryToggle;
let storyInitialisations = 0;
const storyDevices = [];
const story = {};
const disclosure = {
 open: false,
 addEventListener(event, handler) {if (event === 'toggle') onStoryToggle = handler;},
};
const guide = {
 hidden: true,
 querySelector(selector) {
  if (selector === '#setup-recommendation') return result;
  if (selector === '.sg-story-overview') return story;
  if (selector === '#app-extension-flow') return disclosure;
  if (selector === 'input[name="youtube"]:checked') return answer ? {value: answer} : null;
  return null;
 },
 addEventListener(event, handler) {if (event === 'change') onChange = handler;},
};
const document = {
 querySelector: selector => selector === '#setup-guide' ? guide : null,
};
const guideScript = (await readFile(new URL('../setup-guide.js', import.meta.url), 'utf8')).replace(/^import[^\n]+\n/gm, '');
vm.runInNewContext(guideScript, {
 document, URLSearchParams, createRecommendationTransition:createSetupTransition,
 createStoryDisclosure:()=>({close(){disclosure.open=false;},finish(){}}), location: {hash: '', search: ''},
 window: {addEventListener(){}, matchMedia: () => ({matches: false, addEventListener() {}})},
 initialiseExtensionStory(element) {
  assert.equal(element, story);
  storyInitialisations++;
  return device => storyDevices.push(device);
 },
});
assert.equal(guide.hidden, false);
for (const [value, expected] of [['yes', 'options'], ['no', 'web']]) {
 answer = value; onChange();
 assert.deepEqual(panels.filter(panel => !panel.hidden).map(panel => panel.dataset.result), [expected]);
}
assert.equal(storyInitialisations, 0, 'Answering Yes does not load the walkthrough');
answer = 'yes'; onChange();
disclosure.open = true; onStoryToggle();
assert.equal(storyInitialisations, 1, 'Opening the walkthrough loads it');
assert.deepEqual(storyDevices, ['computer']);
disclosure.open = false; onStoryToggle();
disclosure.open = true; onStoryToggle();
assert.equal(storyInitialisations, 1, 'Reopening preserves the existing demo');
answer = 'no'; onChange();
assert.equal(disclosure.open, false, 'Changing the answer closes the walkthrough');
answer = 'yes'; onChange();
assert.equal(disclosure.open, false, 'Returning to Yes keeps the walkthrough optional');
assert.equal(storyInitialisations, 1);
assert.ok(transitions[0].calls.every(call=>call.animate), 'First answer and later answer changes request a transition');
assert.equal(transitions[0].calls[0].incoming(), result, 'The first answer fades in the entire result');

const script = (await readFile(new URL('../setup-instructions-b.js', import.meta.url), 'utf8')).replace(/^import[^\n]+\n/gm, '');
for (const [path, expected] of [['web', [false, true, true]], ['extension', [true, true, false]], ['both', [false, false, true]], ['all', [false, false, true]], ['', [false, false, true]]]) {
 const sections = ['web', 'connection', 'extension'].map(key => ({dataset: {instructionsSection: key}, hidden: false}));
 const title = {textContent: ''};
 const lead = {textContent: ''};
 const doc = {
  querySelector: selector => selector === '[data-instructions-title]' ? title : selector === '[data-instructions-lead]' ? lead : null,
  querySelectorAll: selector => selector === '[data-instructions-section]' ? sections : [],
  addEventListener() {},
 };
 vm.runInNewContext(script, {document: doc, createSetupTransition, previewPageURL, initialiseExtensionGuides() {}, URLSearchParams, location: {search: path ? `?path=${path}` : ''}, window:{addEventListener(){}}});
 assert.deepEqual(sections.map(section => section.hidden), expected);
}

// A visitor can change setup path without reloading or exposing a second guide.
const pathSections = ['web','connection','extension'].map(key=>({dataset:{instructionsSection:key},hidden:false}));
const pathChoices = ['web','extension','both'].map(path=>({
 dataset:{instructionsPath:path}, current:null,
 setAttribute(name,value){if(name==='aria-current')this.current=value;},
 removeAttribute(name){if(name==='aria-current')this.current=null;},
 addEventListener(type,handler){if(type==='click')this.click=handler;},
}));
const pathTitle = {textContent:''}, pathLead = {textContent:''};
const hostingLink = {href:''}, returnLink = {href:'setup-b.html'};
const pathLocation = {href:'http://localhost/setup-instructions-b.html?path=extension',search:'?path=extension'};
let onBack, pushes=0, initialisations=0;
const transitionContent = {}, transitionInner = {}, connectionSlot = {};
const pathDocument = {
 querySelector: selector => ({'[data-instructions-title]':pathTitle,'[data-instructions-lead]':pathLead,'[data-setup-content]':transitionContent,'[data-setup-content-inner]':transitionInner,'[data-connection-slot]':connectionSlot,'[data-instructions-section="connection"]':pathSections[1]})[selector],
 querySelectorAll: selector => ({'[data-instructions-section]':pathSections,'[data-instructions-path]':pathChoices,'[data-hosting-link]':[hostingLink],'.setup-instructions-back':[returnLink]})[selector]||[],
 addEventListener(){},
};
vm.runInNewContext(script,{
 document:pathDocument,URL,URLSearchParams,location:pathLocation,createSetupTransition,previewPageURL,
 initialiseExtensionGuides(){initialisations++;},
 history:{pushState(state,title,url){pushes++;pathLocation.href=String(url);pathLocation.search=new URL(url).search;}},
 window:{addEventListener(type,handler){if(type==='popstate')onBack=handler;}},
});
const switchPath = path => pathChoices.find(choice=>choice.dataset.instructionsPath===path).click({button:0,preventDefault(){},metaKey:false,ctrlKey:false,shiftKey:false,altKey:false});
assert.equal(pathChoices[1].current,'page');
switchPath('both');
assert.deepEqual(pathSections.map(section=>section.hidden),[false,false,true]);
assert.equal(hostingLink.href,`${previewPageURL('setup-hosting')}?path=both`);
const contentController = transitions.find(item=>item.container===transitionContent);
const connectionController = transitions.find(item=>item.container===connectionSlot);
const fullTransitions = contentController.calls.length;
const previousLead = pathLead.textContent;
switchPath('web');
assert.equal(contentController.calls.length, fullTransitions, 'App to combined never animates the shared app instructions');
assert.equal(connectionController.calls.at(-1).outgoing, pathSections[1], 'Only the connection section fades out');
assert.equal(pathLead.textContent, previousLead, 'The shared app heading stays the same');
assert.deepEqual(pathSections.map(section=>section.hidden),[false,true,true]);
assert.equal(returnLink.href,`${previewPageURL('setup')}?choice=no`);
assert.equal(pathChoices.filter(choice=>choice.current==='page').length,1);
pathLocation.search='?path=extension';onBack();
assert.deepEqual(pathSections.map(section=>section.hidden),[true,true,false]);
assert.equal(pathChoices[1].current,'page');
assert.equal(initialisations,1,'Changing route preserves the existing extension controls');
assert.equal(pushes,2,'Switches have native browser history entries');
switchPath('both');
assert.equal(contentController.calls.at(-1).incoming(), transitionInner, 'Leaving the extension-only guide changes the whole content');

// Without detection, computer offers text links only; mobile retains its steps.
for (const connected of [false,true]) {
 const html = extensionGuideB('test', connected);
 const computer = html.match(/data-install-panel="computer"[\s\S]*?<\/section>/)[0];
 assert.equal((computer.match(/<a /g)||[]).length,4);
 assert.match(computer,/data-store-badge hidden/);
 assert.match(computer,/>Chrome<\/a>/);
 assert.match(computer,/>Firefox<\/a>/);
 assert.match(computer,/>Edge<\/a>/);
 assert.doesNotMatch(computer,/sg-firefox|Coming soon/);
 assert.doesNotMatch(computer,/data-browser|<button|<ol/);
 const android = html.match(/data-install-panel="android"[\s\S]*?<\/section>/)[0];
 const ios = html.match(/data-install-panel="ios"[\s\S]*?<\/section>/)[0];
 assert.match(android,/sg-steps/); assert.match(android,/firefox-add-ons.png/);
 assert.match(ios,/sg-steps/); assert.match(ios,/Chrome Web Store/);
}
console.log('Setup routing, optional walkthrough, shared app content and desktop/mobile install guides passed.');
