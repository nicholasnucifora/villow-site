// Idle stories crossfade; every deliberate change moves as a horizontal track.
import {horizontalSwipe} from './horizontal-swipe.js';
const carousel = document.querySelector('.v-watching-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-watching-story]')];
  const controls = carousel.querySelector('.v-watching-controls');
  const pause = carousel.querySelector('.v-watching-pause');
  const markers = [...carousel.querySelectorAll('[data-watching-select]')];
  const announcement = carousel.querySelector('.v-watching-announcement');
  const stage = carousel.querySelector('.v-watching-stage');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, visible = false, paused = false, hovered = false, focused = false, touching = false;
  let gesture, settling = null, fadeTimer, motionSerial = 0;
  const staticMode = () => motion.matches && !document.body.hasAttribute('data-r-preview-motion');
  const markerDots = markers.map(marker => marker.querySelector('span'));
  const restingDot = selected => ({width:selected?'19px':'6px',transform:'translateX(0px)',backgroundColor:selected?'#55764f':'#adbba3'});
  function cancelMarkerMotion() {
    markerDots.forEach(dot => dot.getAnimations().forEach(animation => animation.cancel()));
  }
  function selectMarker(index, manual) {
    // Snapshot an interrupted animation before cancelling it, so rapid clicks
    // continue from the visible shape instead of snapping back to a full pill.
    const from = markerDots.map((dot,i) => {
      if (!dot.getAnimations().length) return restingDot(i===current);
      const style=getComputedStyle(dot);
      return {width:style.width,transform:style.transform,backgroundColor:style.backgroundColor};
    });
    cancelMarkerMotion();
    markers.forEach((marker,i) => marker.setAttribute('aria-pressed',String(i===index)));
    carousel.dataset.markerMotion=manual?'manual':'auto';
    if (staticMode()) return;
    markerDots.forEach((dot,i) => {
      const to=restingDot(i===index);
      if (Number.parseFloat(from[i].width)===Number.parseFloat(to.width) && i!==current && i!==index) return;
      let frames=[from[i],to];
      if (!manual && i===index) {
        // Move into the left cap, then unfurl to the right. Width and offset
        // travel together so the left edge stays fixed during the expansion.
        frames=[{...from[i],offset:0,easing:'ease-in-out'},
          {width:'6px',transform:'translateX(-6.5px)',backgroundColor:'#55764f',offset:.16,easing:'cubic-bezier(.3,0,.2,1)'},
          {...to,offset:1}];
      } else if (!manual && i===current) {
        // The outgoing pill gathers at its right cap and settles into its dot.
        frames=[{...from[i],offset:0,easing:'cubic-bezier(.3,0,.2,1)'},
          {width:'6px',transform:'translateX(6.5px)',backgroundColor:'#adbba3',offset:.76,easing:'ease-out'},
          {...to,offset:1}];
      }
      dot.animate(frames,{duration:620,easing:manual?'cubic-bezier(.3,0,.2,1)':'linear'});
    });
  }
  const canRotate = () => visible && !document.hidden && !paused && !hovered && !focused && !touching && !settling && !staticMode();
  function schedule() {
    clearTimeout(timer);
    if (canRotate()) timer = setTimeout(() => { showStory((current + 1) % slides.length, false); schedule(); }, 9000);
  }
  function update() {
    if (staticMode()) cancelMarkerMotion();
    pause.hidden = staticMode();
    pause.setAttribute('aria-label', paused ? 'Resume stories' : 'Pause stories');
    pause.title = paused ? 'Resume stories' : 'Pause stories';
    carousel.dataset.rotation = staticMode() ? 'static' : canRotate() ? 'playing' : 'paused';
    schedule();
  }
  function activateStory(index, manual) {
    selectMarker(index,manual);
    if (index !== current) {
      const previous = slides[current];
      previous.classList.remove('is-current');
      previous.setAttribute('aria-hidden', 'true');
      previous.inert = true;
    }
    current = index;
    const active = slides[current];
    active.classList.add('is-current');
    active.removeAttribute('aria-hidden');
    active.inert = false;
    carousel.dataset.currentStory = active.dataset.watchingStory;
    // Auto-rotation never interrupts a screen reader. Manual navigation announces.
    if (manual) {
      paused = true;
      announcement.textContent = active.getAttribute('aria-label');
    }
  }
  const translate = x => `translateX(${x}px)`;
  const neighbour = (index,direction) => (index+direction+slides.length)%slides.length;
  function stopStoryMotion() {
    motionSerial++;
    clearTimeout(fadeTimer);
    settling?.animations.forEach(animation=>animation.cancel());
    settling=null;
    slides.forEach(slide=>{
      slide.style.transform='';
      slide.classList.remove('is-slide-visible');
    });
    delete carousel.dataset.storyMotion;
    delete carousel.dataset.swiping;
  }
  function slidePair(from,to,fromStart,toStart,fromEnd,toEnd,duration) {
    carousel.dataset.storyMotion='slide';
    from.classList.add('is-slide-visible');
    to.classList.add('is-slide-visible');
    from.style.transform=translate(fromStart);
    to.style.transform=translate(toStart);
    if(staticMode()||typeof from.animate!=='function'){
      stopStoryMotion();
      update();
      return;
    }
    const serial=++motionSerial;
    const options={duration,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'};
    const animations=[from.animate([{transform:translate(fromStart)},{transform:translate(fromEnd)}],options),
      to.animate([{transform:translate(toStart)},{transform:translate(toEnd)}],options)];
    settling={animations};
    Promise.all(animations.map(animation=>animation.finished.catch(()=>{}))).then(()=>{
      if(serial!==motionSerial)return;
      stopStoryMotion();
      update();
    });
  }
  function showStory(index,manual,direction) {
    if(manual)gesture?.cancel();
    stopStoryMotion();
    if(index===current||staticMode()){
      activateStory(index,manual);
      return;
    }
    if(!manual){
      carousel.dataset.storyMotion='fade';
      activateStory(index,false);
      const serial=motionSerial;
      fadeTimer=setTimeout(()=>{if(serial===motionSerial)delete carousel.dataset.storyMotion;},650);
      return;
    }
    const previous=slides[current],incoming=slides[index],width=stage.clientWidth;
    const forward=(index-current+slides.length)%slides.length;
    direction??=forward<=slides.length-forward?1:-1;
    carousel.dataset.storyMotion='slide';
    previous.classList.add('is-slide-visible');
    incoming.classList.add('is-slide-visible');
    activateStory(index,true);
    slidePair(previous,incoming,0,direction*width,-direction*width,0,320);
  }
  slides.forEach((slide,i) => {
    if (i) { slide.setAttribute('aria-hidden','true'); slide.inert = true; }
  });
  carousel.dataset.currentStory = slides[0].dataset.watchingStory;
  pause.addEventListener('click', () => { paused = !paused; update(); });
  markers.forEach((marker,i) => {
    marker.addEventListener('click', () => { showStory(i,true); update(); });
    marker.addEventListener('keydown', event => {
      const target = {ArrowRight:(i+1)%slides.length,ArrowLeft:(i-1+slides.length)%slides.length,Home:0,End:slides.length-1}[event.key];
      if (target === undefined) return;
      event.preventDefault();
      const direction=event.key==='ArrowRight'||event.key==='End'?1:-1;
      showStory(target,true,direction);
      markers[target].focus();
      update();
    });
  });
  gesture=horizontalSwipe(stage,{
    begin(event){
      if(!['touch','pen'].includes(event.pointerType)||event.target.closest('a,button,input,select,textarea,[contenteditable="true"]'))return;
      stopStoryMotion();
      touching=true;
      update();
      return {slide:slides[current],index:current,width:stage.clientWidth,offset:0,direction:1,incoming:null};
    },
    move(detail,{dx}){
      const {slide,index,width}=detail;
      detail.offset=Math.max(-width,Math.min(width,dx));
      detail.direction=dx<0?1:dx>0?-1:detail.direction;
      carousel.dataset.swiping='true';
      if(staticMode())return;
      const incoming=slides[neighbour(index,detail.direction)];
      if(detail.incoming&&detail.incoming!==incoming){
        detail.incoming.classList.remove('is-slide-visible');
        detail.incoming.style.transform='';
      }
      detail.incoming=incoming;
      carousel.dataset.storyMotion='slide';
      slide.classList.add('is-slide-visible');
      incoming.classList.add('is-slide-visible');
      slide.style.transform=translate(detail.offset);
      incoming.style.transform=translate(detail.offset+detail.direction*width);
    },
    end(detail,{dx,cancelled,horizontal}){
      const {slide,index,width,offset,direction,incoming}=detail;
      delete carousel.dataset.swiping;
      touching=false;
      const commit=!cancelled&&horizontal&&Math.abs(dx)>=48&&current===index;
      if(staticMode()||!incoming){
        if(commit)activateStory(neighbour(index,direction),true);
        stopStoryMotion();
      }else if(commit){
        activateStory(neighbour(index,direction),true);
        const duration=Math.max(170,Math.round(320*(1-Math.abs(offset)/width)));
        slidePair(slide,incoming,offset,offset+direction*width,-direction*width,0,duration);
      }else{
        // A short swipe, scroll, second finger or cancelled pointer returns
        // the same pair to their original positions, without a fade.
        slidePair(slide,incoming,offset,offset+direction*width,0,direction*width,220);
      }
      update();
    },
  });
  window.addEventListener('resize',()=>{gesture.cancel();stopStoryMotion();update();});
  // Pause while reading or operating controls. Always restart with a full interval.
  stage.addEventListener('pointerenter', event => { if(event.pointerType==='mouse') { hovered=true; update(); } });
  stage.addEventListener('pointerleave', () => { hovered=false; update(); });
  carousel.addEventListener('focusin', () => { focused=true; update(); });
  carousel.addEventListener('focusout', event => { if(!carousel.contains(event.relatedTarget)) { focused=false; update(); } });
  document.addEventListener('visibilitychange', () => {if(document.hidden){gesture.cancel();stopStoryMotion();}update();});
  window.addEventListener('pagehide', () => {gesture.cancel();stopStoryMotion();clearTimeout(timer);});
  window.addEventListener('pageshow', update);
  const preferenceChanged=()=>{if(staticMode()){gesture.cancel();stopStoryMotion();}update();};
  motion.addEventListener('change', preferenceChanged);
  new MutationObserver(preferenceChanged).observe(document.body,{attributes:true,attributeFilter:['data-r-preview-motion']});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible=entries[0].isIntersecting; update(); },{threshold:.45}).observe(stage);
  else visible=true;
  carousel.classList.add('is-ready');
  controls.hidden=false;
  update();
}
