import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createAnimatedDisclosure} from '../disclosure-motion.js';

const node = (rect={left:0,top:0,width:600,height:300}) => ({
 hidden:false, open:false, inert:false, children:[], animations:[], events:{}, classes:new Set(),
 style:{setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}},
 get classList(){return {add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name))};},
 getBoundingClientRect(){return {...rect,height:this.style.height?parseFloat(this.style.height):rect.height};},
 setAttribute(name,value){this[name]=value;},
 addEventListener(name,fn){this.events[name]=fn;},
 append(child){this.children.push(child);child.parent=this;},
 remove(){this.parent.children=this.parent.children.filter(item=>item!==this);},
 animate(frames,options){const animation={frames,options,cancelled:false,cancel(){this.cancelled=true;},finish(){this.onfinish?.();}};this.animations.push(animation);return animation;},
});
const source=await readFile(new URL('../setup-choice-motion.js',import.meta.url),'utf8');
const {splitCardSurfaces,createRecommendationTransition,createStoryDisclosure}=vm.runInNewContext(source.replace(/^import[^\n]+\n/gm,'').replace(/^export /gm,'')+'\n({splitCardSurfaces,createRecommendationTransition,createStoryDisclosure});',{
 createAnimatedDisclosure,
 matchMedia:()=>({matches:false}),document:{createElement:()=>node()},getComputedStyle:element=>({borderRadius:element.style.borderRadius||'12px'}),
});

const full={left:20,top:50,width:600,height:320};
const horizontal=splitCardSurfaces([full],false);
assert.equal(horizontal[0].left+horizontal[0].width,horizontal[1].left);
assert.equal(horizontal[1].left+horizontal[1].width,full.left+full.width);
assert.equal(horizontal[0].height,full.height);
assert.equal(horizontal[0].borderRadius,'12px 0px 0px 12px');
const vertical=splitCardSurfaces([full],true);
assert.equal(vertical[0].top+vertical[0].height,vertical[1].top);
assert.equal(vertical[1].top+vertical[1].height,full.top+full.height);
assert.equal(vertical[0].width,full.width);

const single=node(full), left=node({...full,width:294}), right=node({...full,left:326,width:294});
const web=node(), options=node(); options.hidden=true;
web.querySelectorAll=()=>[single]; options.querySelectorAll=()=>[left,right];
web.querySelector=()=>node(); options.querySelector=()=>node();
const container=node();container.querySelectorAll=()=>[web,options];
const transition=createRecommendationTransition(container,()=>false);
let changes=0;
const changeToOptions=()=>{changes++;web.hidden=true;options.hidden=false;};
transition.run(changeToOptions,{outgoing:web,incoming:options});
assert.equal(changes,0,'Content stays intact during its brief exit');
assert.equal(container.children.length,1,'Solid surfaces exist before any text fades');
assert.equal(container.children[0].children.length,2);
web.animations.at(-1).finish();
assert.equal(changes,1);
assert.equal(web.hidden,true);
assert.equal(options.hidden,false);
assert.ok(container.style['--setup-card-height'],'Desktop card height follows the measured content');
assert.equal(container.children[0].children[0].animations[0].frames[1].width,'294px');
assert.equal(container.children[0].children[1].animations[0].frames[1].left,'326px');
assert.ok(container.children[0].children.every(shape=>shape.animations[0].frames.every(frame=>!('transform' in frame)&&!('opacity' in frame))),'Only surfaces resize; they never fade or stretch text');
options.animations.at(-1).finish();
assert.equal(container.children.length,0);
assert.equal(container.style.height,'');
assert.equal(container.classes.size,0);

transition.run(()=>{changes++;},{outgoing:options,incoming:web});
const stale=options.animations.at(-1);
transition.cancel();stale.finish();
assert.equal(changes,1,'Rapid reversal drops obsolete pending choices');
assert.equal(container.children.length,0);
transition.run(()=>{changes++;},{outgoing:options,incoming:web});
transition.finish();
assert.equal(changes,2,'Resize settles the pending choice');
assert.equal(container.style.height,'');

// A disclosure stays mounted during close/reopen and only closes after easing.
const details=node(), summary=node({left:0,top:0,width:300,height:50}), content=node();
details.querySelector=selector=>selector==='summary'?summary:content;
let opens=0;
const disclosure=createStoryDisclosure(details,{onOpen:()=>opens++,reducedMotion:()=>false});
assert.equal(content.inert,true);
summary.events.click({preventDefault(){}});
assert.equal(details.open,true);assert.equal(opens,1);assert.equal(content.inert,false);
assert.equal(details.animations.at(-1).options.duration,400);
summary.events.click({preventDefault(){}});
const closing=details.animations.at(-1);
assert.equal(details.open,true,'Native details remains open while height collapses');
assert.equal(content.inert,true,'Closing content is immediately removed from keyboard navigation');
assert.equal(closing.frames[1].height,'50px');
summary.events.click({preventDefault(){}});
assert.equal(closing.cancelled,true);
closing.finish();assert.equal(details.open,true);
details.animations.at(-1).finish();
assert.equal(details.style.height,'');assert.equal(details.open,true);
disclosure.close();
assert.equal(details.open,false);assert.equal(content.inert,true);assert.equal(details.style.height,'');
const linked=createAnimatedDisclosure(details,{contentSelector:'.cb-ai-card-content',reducedMotion:()=>false});
const beforeLinkAnimations=details.animations.length;
linked.open({animate:false});
assert.equal(details.open,true);assert.equal(content.inert,false);assert.equal(details.style.height,'');
assert.equal(details.animations.length,beforeLinkAnimations,'Initial linked disclosures open without a layout transition');

const reducedDetails=node(), reducedSummary=node(), reducedContent=node();
reducedDetails.querySelector=selector=>selector==='summary'?reducedSummary:reducedContent;
createStoryDisclosure(reducedDetails,{reducedMotion:()=>true});
reducedSummary.events.click({preventDefault(){}});
assert.equal(reducedDetails.animations[0].options.duration,0,'Reduced motion does not animate height');
reducedContent.animations.at(-1).finish();
assert.equal(reducedDetails.style.height,'');
assert.equal(reducedDetails.open,true);
console.log('Recommendation surfaces, responsive split geometry, rapid reversal, disclosure lifecycle and reduced motion passed.');
