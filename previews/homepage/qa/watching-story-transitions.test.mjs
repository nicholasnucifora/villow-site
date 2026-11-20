import test from 'node:test';
import assert from 'node:assert/strict';

// Exercise the shipped controller through pointer, marker and keyboard events.
// This small DOM harness records real animation frames without launching a UI.
test('stories track both neighbouring slides and reserve fades for idle rotation',async()=>{
  const animations=[],timers=new Map();let timerId=0,intersection;
  class Element extends EventTarget {
    constructor(){
      super();this.dataset={};this.style={transform:''};this.attributes=new Map();this.classes=new Set();this.captured=new Set();this.clientWidth=360;
      this.classList={add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name)),contains:name=>this.classes.has(name)};
    }
    setAttribute(name,value){this.attributes.set(name,String(value));}
    getAttribute(name){return this.attributes.get(name)||null;}
    removeAttribute(name){this.attributes.delete(name);}
    hasAttribute(name){return this.attributes.has(name);}
    closest(){return null;}
    contains(node){return node===this;}
    focus(){}
    setPointerCapture(id){this.captured.add(id);}
    hasPointerCapture(id){return this.captured.has(id);}
    releasePointerCapture(id){this.captured.delete(id);}
    getAnimations(){return animations.filter(animation=>animation.node===this&&!animation.done);}
    animate(frames,options){
      let resolve;
      const animation={node:this,frames,options,done:false,finished:new Promise(done=>{resolve=done;}),
        cancel(){this.done=true;resolve();},finish(){this.done=true;resolve();}};
      animations.push(animation);return animation;
    }
  }
  const document=new Element(),window=new Element(),carousel=new Element(),stage=new Element(),pause=new Element(),controls=new Element(),announcement=new Element(),motion=new Element();
  document.body=new Element();document.hidden=false;stage.ownerDocument=document;motion.matches=false;
  const stories=['shorts','browser','gardener','evenings','allrounder'];
  const slides=stories.map((story,i)=>{const slide=new Element();slide.dataset.watchingStory=story;slide.setAttribute('aria-label',`${i+1} of 5: ${story}`);return slide;});
  slides[0].classList.add('is-current');
  const markers=stories.map((_,i)=>{const marker=new Element(),dot=new Element();marker.setAttribute('aria-pressed',String(i===0));marker.querySelector=()=>dot;return marker;});
  document.querySelector=()=>carousel;
  carousel.querySelector=selector=>({'.v-watching-controls':controls,'.v-watching-pause':pause,'.v-watching-announcement':announcement,'.v-watching-stage':stage})[selector];
  carousel.querySelectorAll=selector=>selector==='[data-watching-story]'?slides:markers;
  const replacements={document,window,matchMedia:()=>motion,
    getComputedStyle:()=>({width:'6px',transform:'translateX(0px)',backgroundColor:'#adbba3'}),
    MutationObserver:class {observe(){}},IntersectionObserver:class {constructor(callback){intersection=callback;}observe(){}},
    setTimeout:(callback,delay)=>{timers.set(++timerId,{callback,delay});return timerId;},clearTimeout:id=>timers.delete(id)};
  const original=new Map(Object.keys(replacements).map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  window.IntersectionObserver=replacements.IntersectionObserver;
  Object.assign(globalThis,replacements);
  const dispatch=(target,type,properties={})=>{
    const event=new Event(type,{cancelable:true});
    Object.assign(event,{pointerId:1,pointerType:'touch',isPrimary:true,button:0,clientX:180,clientY:100,...properties});
    target.dispatchEvent(event);return event;
  };
  const pointer=(type,x=180,y=100)=>dispatch(stage,type,{clientX:x,clientY:y});
  const activeSlideAnimations=()=>animations.filter(animation=>slides.includes(animation.node)&&!animation.done);
  const finish=async()=>{activeSlideAnimations().forEach(animation=>animation.finish());await Promise.resolve();await Promise.resolve();await Promise.resolve();};
  const assertSlideOnly=()=>activeSlideAnimations().forEach(animation=>animation.frames.forEach(frame=>assert.deepEqual(Object.keys(frame),['transform'])));
  try{
    await import('../w-watching-stories.js');
    pointer('pointerdown');pointer('pointermove',90);
    assert.equal(slides[0].style.transform,'translateX(-90px)');
    assert.equal(slides[1].style.transform,'translateX(270px)');
    assert(slides[1].classList.contains('is-slide-visible'));
    assert.equal(carousel.dataset.storyMotion,'slide');
    // Reversing mid-drag reveals the previous story, including wraparound.
    pointer('pointermove',230);
    assert.equal(slides[0].style.transform,'translateX(50px)');
    assert.equal(slides[4].style.transform,'translateX(-310px)');
    assert.equal(slides[1].style.transform,'');
    assert.equal(slides[1].classList.contains('is-slide-visible'),false);
    pointer('pointerup',230);
    assert.equal(carousel.dataset.currentStory,'allrounder');
    assert.equal(carousel.dataset.rotation,'paused');
    assert.equal(slides[0].getAttribute('aria-hidden'),'true');
    assert.equal(slides[4].inert,false);
    assert.deepEqual(activeSlideAnimations().map(animation=>animation.frames),[
      [{transform:'translateX(50px)'},{transform:'translateX(360px)'}],
      [{transform:'translateX(-310px)'},{transform:'translateX(0px)'}],
    ]);
    assertSlideOnly();await finish();
    assert(slides.every(slide=>slide.style.transform===''&&!slide.classList.contains('is-slide-visible')));
    // A short swipe returns the outgoing and incoming stories together.
    pointer('pointerdown');pointer('pointermove',155);pointer('pointerup',155);
    assert.equal(carousel.dataset.currentStory,'allrounder');
    assert.deepEqual(activeSlideAnimations().map(animation=>animation.frames.at(-1).transform),['translateX(0px)','translateX(360px)']);
    assertSlideOnly();await finish();
    pointer('pointerdown');pointer('pointermove',70);pointer('pointercancel',70);
    assert.equal(carousel.dataset.currentStory,'allrounder');
    assertSlideOnly();await finish();
    // Vertical scrolling never introduces an adjacent story.
    pointer('pointerdown');pointer('pointermove',182,145);pointer('pointermove',60,145);pointer('pointerup',60,145);
    assert.equal(carousel.dataset.storyMotion,undefined);
    assert.equal(carousel.dataset.currentStory,'allrounder');
    // Marker and keyboard selections also slide, never crossfade.
    dispatch(markers[1],'click',{detail:1});
    assert.equal(carousel.dataset.currentStory,'browser');assertSlideOnly();await finish();
    dispatch(markers[1],'keydown',{key:'ArrowLeft'});
    assert.equal(carousel.dataset.currentStory,'shorts');assertSlideOnly();await finish();
    // Reduced motion preserves gestures while making the change immediate.
    motion.matches=true;motion.dispatchEvent(new Event('change'));
    pointer('pointerdown');pointer('pointermove',70);
    assert(slides.every(slide=>slide.style.transform===''));
    pointer('pointerup',70);
    assert.equal(carousel.dataset.currentStory,'browser');
    assert.equal(activeSlideAnimations().length,0);
    // Only the unattended timer explicitly selects the fade mode.
    motion.matches=false;motion.dispatchEvent(new Event('change'));
    intersection([{isIntersecting:true}]);dispatch(pause,'click',{detail:1});
    const idle=[...timers.values()].find(timer=>timer.delay===9000);
    assert(idle);idle.callback();
    assert.equal(carousel.dataset.currentStory,'gardener');
    assert.equal(carousel.dataset.storyMotion,'fade');
    assert.equal(activeSlideAnimations().length,0);
    [...timers.values()].find(timer=>timer.delay===650).callback();
    assert.equal(carousel.dataset.storyMotion,undefined);
  }finally{
    for(const [key,descriptor] of original){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
  }
});
