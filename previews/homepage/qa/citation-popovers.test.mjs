import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const timers = new Map();
let nextTimer = 0;
const node = (extra = {}) => ({
 events:{}, attributes:{}, hover:false,
 addEventListener(type, handler){this.events[type]=handler;},
 setAttribute(name, value){this.attributes[name]=value;},
 matches(selector){return selector === ':hover' ? this.hover : this.popoverOpen;},
 ...extra,
});
const fixtures = [1,2].map(number => {
 const trigger = node({getBoundingClientRect:()=>({left:300,top:200,bottom:220})});
 const closeButton = node();
 const popup = node({
  id:`citation-${number}`, hidden:true, style:{},
  showPopover(){this.popoverOpen=true;}, hidePopover(){this.popoverOpen=false;},
  getBoundingClientRect:()=>({width:300,height:250}),
  querySelector:()=>closeButton,
 });
 const source = {};
 const citation = node({
  querySelector:selector=>selector === '[data-citation-trigger]' ? trigger : popup,
  contains:element=>[citation,trigger,popup,closeButton,source].includes(element),
 });
 return {citation,trigger,popup,closeButton,source};
});
const document = node({activeElement:null,querySelectorAll:()=>fixtures.map(f=>f.citation)});
for (const {trigger} of fixtures) trigger.focus = () => {document.activeElement=trigger;trigger.events.focus();};
const flushTimers = () => {for (const callback of [...timers.values()]) callback();timers.clear();};
const script = await readFile(new URL('../concepts-citations.js',import.meta.url),'utf8');
vm.runInNewContext(script,{
 document,window:node(),innerWidth:390,innerHeight:700,
 setTimeout(callback){timers.set(++nextTimer,callback);return nextTimer;},
 clearTimeout(id){timers.delete(id);},
});
const [first,second] = fixtures;
first.trigger.hover=true;
first.trigger.events.pointerenter({pointerType:'mouse'});
assert.equal(first.popup.hidden,false,'Hover opens the paper summary');
assert.equal(first.trigger.attributes['aria-expanded'],'true');
assert.equal(first.popup.style.left,'78px','A citation near the right edge stays in the viewport');
first.trigger.hover=false;
first.trigger.events.pointerleave();
first.popup.hover=true;
first.popup.events.pointerenter();
flushTimers();
assert.equal(first.popup.hidden,false,'The popup remains open while the pointer moves into it');
first.popup.hover=false;
first.popup.events.pointerleave();
flushTimers();
assert.equal(first.popup.hidden,true,'Leaving the citation and popup dismisses it');
first.trigger.focus();
assert.equal(first.popup.hidden,false,'Keyboard focus also opens the summary');
let prevented=false;
first.trigger.events.click({button:0,preventDefault(){prevented=true;}});
assert.equal(prevented,true,'A normal tap opens the summary instead of navigating away');
document.events.keydown({key:'Escape',preventDefault(){}});
assert.equal(first.popup.hidden,true);
assert.equal(document.activeElement,first.trigger,'Escape restores focus without reopening');
first.trigger.events.pointerenter({pointerType:'mouse'});
second.trigger.events.pointerenter({pointerType:'mouse'});
assert.equal(first.popup.hidden,true,'Only one citation summary is shown at a time');
assert.equal(second.popup.hidden,false);
document.events.pointerdown({target:{}});
assert.equal(second.popup.hidden,true,'Clicking outside dismisses the summary');
prevented=false;
first.trigger.events.click({button:0,ctrlKey:true,preventDefault(){prevented=true;}});
assert.equal(prevented,false,'Modified clicks keep the original source-link behaviour');
