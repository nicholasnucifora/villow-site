import test from 'node:test';
import assert from 'node:assert/strict';
import {horizontalSwipe,cardSwipeOffset} from '../horizontal-swipe.js';

class Surface extends EventTarget {
  constructor(){super();this.ownerDocument=new EventTarget();this.captured=new Set();}
  setPointerCapture(id){this.captured.add(id);}
  hasPointerCapture(id){return this.captured.has(id);}
  releasePointerCapture(id){this.captured.delete(id);}
}
function setup(){
  const surface=new Surface(),moves=[],ends=[];
  const gesture=horizontalSwipe(surface,{begin:()=>({card:'current'}),move:(_,value)=>moves.push(value),end:(_,value)=>ends.push(value)});
  const send=(type,x=0,y=0,extra={},target=surface)=>{
    const event=new Event(type,{cancelable:true});
    Object.assign(event,{pointerId:1,pointerType:'touch',isPrimary:true,button:0,clientX:x,clientY:y,...extra});
    target.dispatchEvent(event);
    return event;
  };
  return {surface,moves,ends,gesture,send};
}

test('horizontal drag locks after app threshold and suppresses its compatibility click',()=>{
  const {surface,moves,ends,send}=setup();
  send('pointerdown');
  assert.equal(send('pointermove',8,0).defaultPrevented,false);
  assert.equal(moves.length,0);
  assert.equal(send('pointermove',12,3).defaultPrevented,true);
  send('pointermove',90,55); // vertical drift after horizontal lock remains a swipe
  send('pointerup',90,55);
  assert.deepEqual(ends,[{dx:90,dy:55,horizontal:true,cancelled:false}]);
  assert.equal(surface.captured.size,0);
  assert.equal(send('click',0,0,{detail:1}).defaultPrevented,true);
  assert.equal(send('click',0,0,{detail:0}).defaultPrevented,false); // keyboard
  send('pointerdown');
  send('pointerup');
  assert.equal(send('click',0,0,{detail:1}).defaultPrevented,false); // fresh tap
});

test('page scrolling cannot become a swipe after sideways drift',()=>{
  const {moves,ends,send}=setup();
  send('pointerdown');
  assert.equal(send('pointermove',3,30).defaultPrevented,false);
  send('pointermove',160,32);
  send('pointerup',160,32);
  assert.equal(moves.length,0);
  assert.deepEqual(ends,[{dx:3,dy:30,horizontal:false,cancelled:true}]);
});

for(const eventType of ['pointercancel','lostpointercapture'])test(`${eventType} restores a held card without committing`,()=>{
  const {surface,ends,send}=setup();
  send('pointerdown');send('pointermove',120,0);send(eventType,120,0);send('pointerup',120,0);
  assert.equal(ends.length,1);
  assert.equal(ends[0].cancelled,true);
  assert.equal(surface.captured.size,0);
});

test('second finger outside the surface cancels and cannot finish the first gesture',()=>{
  const {surface,ends,send}=setup();
  send('pointerdown');send('pointermove',120,0);
  send('pointerdown',300,100,{pointerId:2,isPrimary:false},surface.ownerDocument);
  send('pointerup',120,0);
  assert.equal(ends.length,1);
  assert.equal(ends[0].cancelled,true);
  assert.equal(surface.captured.size,0);
});

test('resize/page-hide cancellation and stray pointers never commit a gesture',()=>{
  const {ends,gesture,send}=setup();
  send('pointerdown');send('pointermove',90,0,{pointerId:2});
  gesture.cancel();gesture.cancel();send('pointerup',90,0);
  assert.deepEqual(ends,[{dx:0,dy:0,horizontal:false,cancelled:true}]);
});

test('card tracking matches the app distance threshold and bounded resistance',()=>{
  assert.equal(cardSwipeOffset(71,400),71);
  assert.equal(cardSwipeOffset(-72,400),-72);
  assert.equal(cardSwipeOffset(172,400),158);
  assert.equal(cardSwipeOffset(-1000,344),-344);
});
