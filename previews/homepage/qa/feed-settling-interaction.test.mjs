import test from 'node:test';
import assert from 'node:assert/strict';
import {setImmediate} from 'node:timers/promises';
import {feedIds} from '../n-data.js';

// Keep the real controller's animations pending so a second gesture can start
// midway through promotion, rather than testing only the settled-card state.
test('the next card accepts input during its shuffle without stale animation callbacks unlocking another exit', async () => {
 const animations=[];
 class Element extends EventTarget {
  constructor(){
   super();this.dataset={};this.attributes=new Map();this.classes=new Set();this.captured=new Set();this.offsetWidth=320;
   this.style={transform:'',translate:'',rotate:'',setProperty(name,value){this[name]=value;},removeProperty(name){delete this[name];}};
   this.classList={add:name=>this.classes.add(name),remove:name=>this.classes.delete(name),contains:name=>this.classes.has(name),toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};
  }
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  hasAttribute(name){return this.attributes.has(name);}
  removeAttribute(name){this.attributes.delete(name);}
  closest(selector){return selector==='.ifs-front'&&this.classes.has('ifs-front')?this:null;}
  setPointerCapture(id){this.captured.add(id);}
  hasPointerCapture(id){return this.captured.has(id);}
  releasePointerCapture(id){this.captured.delete(id);}
  remove(){this.removed=true;}
  focus(){this.focused=true;}
  animate(frames,options){
   let resolve;
   const animation={node:this,frames,options,done:false,finished:new Promise(done=>{resolve=done;}),
    cancel(){this.cancelled=true;this.done=true;resolve();},finish(){this.done=true;resolve();}};
   animations.push(animation);return animation;
  }
 }
 const document=new Element(),window=new Element(),demo=new Element(),stack=new Element(),complete=new Element(),heading=new Element(),status=new Element(),motion=new Element(),coarse=new Element();
 document.hidden=false;window.innerWidth=390;motion.matches=false;coarse.matches=true;stack.ownerDocument=document;
 demo.setAttribute('data-thumbnail-feed','');
 const cards=feedIds.map((id,index)=>{
  const card=new Element(),feedback=new Element();card.dataset.ifsCard=id;card.style['--ifs-depth']=String(index);card.classList.add(index?'ifs-back':'ifs-front');card.inert=!!index;
  card.buttons=['save','remove'].map(action=>{const button=new Element();button.dataset={ifsAction:action,ifsId:id};button.closest=()=>button;return button;});
  card.querySelector=()=>feedback;card.querySelectorAll=()=>card.buttons;return card;
 });
 const remaining=()=>cards.filter(card=>!card.removed);
 const front=()=>remaining().find(card=>card.classes.has('ifs-front'));
 document.querySelectorAll=()=>[demo];
 demo.querySelector=selector=>({'[data-ifs-stack]':stack,'[data-wf-complete]':complete,'[data-wf-status]':status})[selector];
 demo.querySelectorAll=()=>remaining().flatMap(card=>card.buttons);
 stack.querySelector=selector=>selector.startsWith('.ifs-front button')?front()?.buttons.find(button=>selector.includes(button.dataset.ifsAction)):remaining().find(card=>selector.includes(`"${card.dataset.ifsCard}"`));
 complete.querySelector=()=>heading;
 const replacements={document,window,matchMedia:query=>query.includes('reduced-motion')?motion:coarse,
  DOMMatrixReadOnly:class {constructor(){this.m41=0;}},
  getComputedStyle:node=>{
   const pending=animations.filter(animation=>animation.node===node&&!animation.done);
   const value=property=>pending.findLast(animation=>animation.frames[0][property]!==undefined)?.[property==='transform'?'visualTransform':'unused']
     ||pending.findLast(animation=>animation.frames[0][property]!==undefined)?.frames[0][property]
     ||node.style[property]||(property==='transform'?(node.classes.has('ifs-back')?'matrix(1, 0, 0, 1, 3, -12)':'matrix(1, 0, 0, 1, 0, 0)'):'none');
   return {transform:value('transform'),translate:value('translate'),rotate:value('rotate'),getPropertyValue:()=>'-2'};
  }};
 const originals=new Map(Object.keys(replacements).map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 Object.assign(globalThis,replacements);
 function dispatch(target,type,origin,properties={}){
  const event=new Event(type,{cancelable:true});
  Object.defineProperty(event,'target',{value:origin});
  Object.assign(event,{pointerId:1,pointerType:'touch',isPrimary:true,button:0,clientX:180,clientY:100,...properties});target.dispatchEvent(event);
 }
 const pointer=(type,card,x=180)=>dispatch(stack,type,card,{clientX:x});
 const exit=card=>animations.findLast(animation=>animation.node===card&&!animation.done&&animation.frames.at(-1).opacity===0);
 const shuffle=card=>animations.findLast(animation=>animation.node===card&&!animation.done&&animation.options.duration===180);
 try{
  await import('../w-feed.js');
  const first=front();pointer('pointerdown',first);pointer('pointermove',first,60);pointer('pointerup',first,60);
  assert.equal(stack.getAttribute('aria-busy'),'true');
  exit(first).finish();await setImmediate();
  const second=front(),promotion=shuffle(second);
  assert(promotion&&!promotion.done);
  assert.equal(demo.dataset.wfCount,'4');
  assert.equal(stack.getAttribute('aria-busy'),'false');
  assert.equal(second.inert,false);assert(second.buttons.every(button=>!button.disabled));

  // A short drag and its horizontal return do not interrupt vertical settling.
  promotion.visualTransform='matrix(1, 0, 0, 1, 2, -8)';
  pointer('pointerdown',second);pointer('pointermove',second,220);
  assert.equal(second.style.translate,'40px');assert.equal(promotion.done,false);
  pointer('pointerup',second,220);
  const snapback=animations.findLast(animation=>animation.node===second&&!animation.done&&animation.options.duration===220);
  assert.deepEqual(Object.keys(snapback.frames[0]),['translate','rotate']);
  assert.equal(promotion.done,false);assert.equal(demo.dataset.wfCount,'4');
  snapback.finish();await setImmediate();

  // Releasing a committed swipe takes over from the combined displayed pose.
  pointer('pointerdown',second);pointer('pointermove',second,300);pointer('pointerup',second,300);
  const secondExit=exit(second);
  assert(secondExit);assert.equal(promotion.cancelled,true);
  assert.equal(secondExit.frames[0].transform,'matrix(1, 0, 0, 1, 2, -8)');
  assert(parseFloat(secondExit.frames[0].translate)>72);
  assert.equal(stack.getAttribute('aria-busy'),'true');
  // Completing older background shuffles must not clear this new exit's lock.
  animations.filter(animation=>animation!==secondExit&&!animation.done).forEach(animation=>animation.finish());
  await setImmediate();assert.equal(stack.getAttribute('aria-busy'),'true');
  secondExit.finish();await setImmediate();
  assert.equal(demo.dataset.wfCount,'3');assert.equal(demo.dataset.wfSaved,'1');

  // Keyboard controls are also usable immediately, including reduced motion.
  motion.matches=true;
  for(const action of ['save','remove','save']){
   const card=front(),button=card.buttons.find(button=>button.dataset.ifsAction===action);
   assert.equal(button.disabled,false);
   dispatch(demo,'click',button,{detail:0});dispatch(demo,'click',button,{detail:0});
   assert.equal(animations.filter(animation=>animation.node===card&&!animation.done&&animation.frames.at(-1).opacity===0).length,1);
   exit(card).finish();await setImmediate();
  }
  assert.equal(demo.dataset.wfCount,'0');assert.equal(demo.dataset.wfSaved,'3');
  assert.equal(stack.hidden,true);assert.equal(complete.hidden,false);assert.equal(heading.focused,true);
  assert.match(status.textContent,/All caught up/);
 }finally{
  animations.forEach(animation=>animation.finish());await setImmediate();
  for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
 }
});
