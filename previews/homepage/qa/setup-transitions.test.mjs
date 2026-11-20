import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../setup-transitions.js', import.meta.url), 'utf8');
const createTransition = vm.runInNewContext(source.replace(/^export /gm, '')+'\ncreateSetupTransition;', {
 getComputedStyle: node => ({opacity:node.opacity ?? '1'}),
});
const node = (height = 300) => ({
 hidden:false, height, style:{height:''}, classes:new Set(), animations:[],
 get classList(){return {add:name=>this.classes.add(name),remove:name=>this.classes.delete(name)};},
 getBoundingClientRect(){return {height:this.style.height ? parseFloat(this.style.height) : this.height};},
 animate(frames,options){
  const animation = {frames,options,cancelled:false,cancel(){this.cancelled=true;},finish(){this.onfinish?.();}};
  this.animations.push(animation);
  return animation;
 },
});

// Initial reveal grows from nothing and fades in; every finish restores natural layout.
const first = node(400); first.hidden = true;
const firstTransition = createTransition(first,()=>false);
firstTransition.run(()=>{first.hidden=false;},{incoming:first});
assert.equal(first.animations[0].frames[0].height,'0px');
assert.equal(first.animations[0].frames[1].height,'400px');
assert.equal(first.animations[1].frames[0].opacity,0);
first.animations[0].finish();
assert.equal(first.style.height,'');
assert.equal(first.classes.size,0);

// Two fast switches never commit the superseded answer or overlap their contents.
const box=node(), outgoing=node(), incoming=node();
const transition=createTransition(box,()=>false);
const committed=[];
transition.run(()=>committed.push('obsolete'),{outgoing,incoming});
const obsoleteExit=outgoing.animations.at(-1);
transition.run(()=>{committed.push('latest');box.height=500;},{outgoing,incoming});
assert.deepEqual(committed,[]);
assert.equal(obsoleteExit.cancelled,true);
obsoleteExit.finish();
assert.deepEqual(committed,[]);
outgoing.animations.at(-1).finish();
assert.deepEqual(committed,['latest']);
assert.equal(box.animations.at(-1).frames[1].height,'500px');
box.animations.at(-1).finish();
assert.equal(box.style.height,'');

// Returning to the displayed choice cancels a pending change.
transition.run(()=>committed.push('cancelled'),{outgoing,incoming});
const cancelledExit=outgoing.animations.at(-1);
transition.cancel(); cancelledExit.finish();
assert.deepEqual(committed,['latest']);
assert.equal(box.style.height,'');

// Resize or changing the preview motion setting commits the latest selection immediately.
transition.run(()=>committed.push('finished'),{outgoing,incoming});
transition.finish();
assert.deepEqual(committed,['latest','finished']);
assert.equal(box.style.height,'');
transition.finish();
assert.deepEqual(committed,['latest','finished']);

// Reduced motion still fades both sides without moving or freezing their height.
const reducedBox=node(), reducedOut=node(), reducedIn=node();
const reduced=createTransition(reducedBox,()=>true);
let changed=false;
reduced.run(()=>{changed=true;},{outgoing:reducedOut,incoming:reducedIn});
assert.equal(changed,false);
assert.equal(reducedBox.style.height,'');
reducedOut.animations[0].finish();
assert.equal(changed,true);
assert.equal(reducedBox.animations.length,0);
for(const animation of [...reducedOut.animations,...reducedIn.animations]) {
 assert.ok(animation.frames.every(frame=>Object.keys(frame).join()==='opacity'));
}

// Without Web Animations support, choices still work immediately.
const fallback=node(); fallback.animate=undefined;
let fallbackChanged=false;
createTransition(fallback,()=>false).run(()=>{fallbackChanged=true;});
assert.equal(fallbackChanged,true);
console.log('Setup transitions passed: initial fade, rapid cancellation, natural height, resize, reduced motion and fallback.');
