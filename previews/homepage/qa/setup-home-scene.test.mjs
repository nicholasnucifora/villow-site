import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the real parent adapter with an isolated frame boundary. A late
// iframe load or device switch must not lose videos that have already arrived.
const listeners = new Map();
const makeFrame = () => ({
 style: {}, events: new Map(),
 contentWindow: {messages: [], postMessage(message) {this.messages.push(message);}},
 cloneNode() {return makeFrame();},
 addEventListener(type, fn) {this.events.set(type, fn);},
 removeEventListener(type) {this.events.delete(type);},
 replaceWith(next) {currentFrame = next;},
});
let currentFrame = makeFrame();
let disconnected = false;
const holder = {clientWidth: 500, style: {}, querySelector: () => currentFrame};
const scope = {
 window: {addEventListener(type, fn) {listeners.set(type, fn);}, removeEventListener(type) {listeners.delete(type);}},
 ResizeObserver: class {observe() {} disconnect() {disconnected = true;}},
};
vm.createContext(scope);
vm.runInContext((await readFile(new URL('../setup-home-scene-b.js', import.meta.url),'utf8')).replace('export function','function'),scope);
const scene = scope.initialiseHomeScene({querySelector: () => holder});
scene.setDevice('computer');
scene.setVideos({selectedIds:['hills'],pendingIds:['sea']});
assert.equal(currentFrame.style.width,'1190px');
assert.equal(currentFrame.style.height,'620px');
assert.match(currentFrame.src,/device=desktop/);
const last = () => JSON.parse(JSON.stringify(currentFrame.contentWindow.messages.at(-1)));
assert.deepEqual(last(), {type:'villow:extension-story:selection',version:1,selectedIds:['hills'],pendingIds:['sea']});
const beforeDuplicate = currentFrame.contentWindow.messages.length;
scene.setVideos({selectedIds:['hills'],pendingIds:['sea']});
assert.equal(currentFrame.contentWindow.messages.length,beforeDuplicate,'Unrelated radial edits should not rerender Home');
const previousFrame = currentFrame;
scene.setDevice('ios');
assert.match(currentFrame.src,/device=phone/);
assert.equal(currentFrame.style.width,'390px');
assert.equal(currentFrame.style.height,'480px');
assert.equal(currentFrame.loading,'eager');
listeners.get('message')({source:previousFrame.contentWindow,data:{type:'villow:extension-story:ready',version:1}});
assert.equal(currentFrame.contentWindow.messages.length,0,'A stale frame must not trigger a replay');
listeners.get('message')({source:currentFrame.contentWindow,data:{type:'villow:extension-story:ready',version:2}});
assert.equal(currentFrame.contentWindow.messages.length,0,'Unknown protocol versions are ignored');
listeners.get('message')({source:currentFrame.contentWindow,data:{type:'villow:extension-story:ready',version:1}});
assert.deepEqual(last().selectedIds,['hills']);
assert.deepEqual(last().pendingIds,['sea']);
scene.setVideos({selectedIds:['hills','sea'],pendingIds:[]});
currentFrame.events.get('load')();
assert.deepEqual(last().selectedIds,['hills','sea'],'Load replay includes the latest arrivals');
assert.deepEqual(last().pendingIds,[]);
scene.setVideos({selectedIds:['sea','hills'],pendingIds:[]});
assert.deepEqual(last().selectedIds,['sea','hills'],'Re-added picks retain the controller’s newest-first order');
scene.setVideos({selectedIds:['hills'],pendingIds:[]});
assert.deepEqual(last().selectedIds,['hills'],'The controller’s completed removal reaches Home without a second adapter delay');
scene.setVideos({selectedIds:[],pendingIds:['river']});
assert.deepEqual(last().selectedIds,[],'Removing the last arrived pick restores the empty scene while another is pending');
assert.deepEqual(last().pendingIds,['river']);
scene.destroy();
assert.equal(disconnected,true);
assert.equal(listeners.has('message'),false);
console.log('Home frame: delayed readiness, device changes, deduplicated state and trusted message source passed.');
