const interval=7500;
const play='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m5 3 8 5-8 5Z"/></svg>';
const pause='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="4" y="3" width="3" height="10" rx=".7"/><rect x="9" y="3" width="3" height="10" rx=".7"/></svg>';
for(const carousel of document.querySelectorAll('[data-sl-carousel]')){
 const slides=[...carousel.querySelectorAll('[data-sl-slide]')],controls=carousel.querySelector('[data-sl-controls]'),previous=carousel.querySelector('[data-sl-previous]'),next=carousel.querySelector('[data-sl-next]'),rotation=carousel.querySelector('[data-sl-rotation]'),count=carousel.querySelector('[data-sl-count]'),dots=[...carousel.querySelectorAll('.sl-dots i')],status=carousel.querySelector('[data-sl-status]'),rotationIcon=carousel.querySelector('[data-sl-rotation-icon]'),rotationLabel=carousel.querySelector('[data-sl-rotation-label]');
 if(slides.length<2||!controls||!previous||!next||!rotation||!count||!status||!rotationIcon||!rotationLabel)continue;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let index=0,auto=!reduced.matches,inView=false,hovered=false,timer=0,disposed=false;
 function clear(){if(timer){clearTimeout(timer);timer=0;}}
 function sync(){
  carousel.dataset.slAuto=String(auto);carousel.dataset.slIndex=String(index);rotation.hidden=false;
  const text=auto?'Pause':'Play';rotation.setAttribute('aria-label',`${text==='Pause'?'Pause automatic examples':'Start automatic examples'}`);rotationLabel.textContent=text;rotationIcon.innerHTML=auto?pause:play;
 }
 function schedule(){clear();if(!disposed&&auto&&inView&&!hovered&&!document.hidden)timer=setTimeout(()=>{timer=0;show(index+1,false);},interval);}
 function stop(){auto=false;clear();sync();}
 function show(value,manual){
  index=(value+slides.length)%slides.length;
  for(const [i,slide] of slides.entries()){slide.hidden=i!==index;slide.classList.toggle('is-arriving',i===index);}
  dots.forEach((dot,i)=>dot.classList.toggle('is-current',i===index));count.textContent=`${index+1} / ${slides.length}`;
  if(manual){stop();status.textContent=slides[index].getAttribute('aria-label');}else sync();
  schedule();
 }
 previous.addEventListener('click',()=>show(index-1,true));next.addEventListener('click',()=>show(index+1,true));
 rotation.addEventListener('click',()=>{auto=!auto;sync();schedule();status.textContent=auto?(reduced.matches?'Examples will change automatically without animation while visible.':'Examples will move automatically while visible.'): 'Automatic examples paused. Use the arrows to explore.';});
 carousel.addEventListener('pointerdown',event=>{if(!event.target.closest('[data-sl-rotation]'))stop();});
 carousel.addEventListener('focusin',event=>{if(!event.target.closest('[data-sl-rotation]'))stop();});
 carousel.addEventListener('pointerenter',()=>{hovered=true;clear();});carousel.addEventListener('pointerleave',()=>{hovered=false;schedule();});
 carousel.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();show(event.key==='Home'?0:event.key==='End'?slides.length-1:index+(event.key==='ArrowLeft'?-1:1),true);});
 const visibility=()=>document.hidden?clear():schedule();document.addEventListener('visibilitychange',visibility);
 let observer;
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const entry of entries){inView=entry.isIntersecting&&entry.intersectionRatio>=.25;schedule();}},{threshold:[0,.25]});observer.observe(carousel);}else{inView=true;}
 reduced.addEventListener('change',()=>{stop();});
 window.addEventListener('pagehide',()=>{disposed=true;clear();observer?.disconnect();document.removeEventListener('visibilitychange',visibility);},{once:true});
 controls.hidden=false;carousel.setAttribute('aria-roledescription','carousel');sync();schedule();
}


