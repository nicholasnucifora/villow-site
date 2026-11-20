// This teaches a gesture without dispatching any feed action or changing a card node.
for(const cue of document.querySelectorAll('[data-t-swipe-cue]')){
 const demo=cue.closest('[data-ifs-demo]'),stack=demo?.querySelector('[data-ifs-stack]'),button=cue.querySelector('[data-t-swipe-preview]'),status=cue.querySelector('[data-t-swipe-status]');
 if(!demo||!stack||!button||!status)continue;
 const coarse=matchMedia('(any-pointer:coarse)'),narrow=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let active=null,timer=0,serial=0,visible=false,interacted=false,automaticUsed=reduced.matches,disposed=false;
 const front=()=>stack.querySelector('.ifs-front');
 function clearTimer(){if(timer){clearTimeout(timer);timer=0;}}
 function cancel(){
  clearTimer();serial++;
  if(active){active.cancel();active=null;}
  cue.dataset.tCueState='ready';
 }
 function sync(){
  const empty=stack.hidden||!front(),busy=stack.getAttribute('aria-busy')==='true';
  cue.hidden=empty;button.disabled=empty||busy;
  cue.dataset.tCueInput=coarse.matches?'touch':'pointer';
  if(empty||busy)cancel();
 }
 async function preview(explicit=false){
  cancel();
  const card=front();
  if(disposed||!card||stack.hidden||stack.getAttribute('aria-busy')==='true'||document.hidden||(!explicit&&reduced.matches))return;
  if(explicit){interacted=true;automaticUsed=true;}
  const own=++serial,base=getComputedStyle(card).transform,suffix=base==='none'?'':' '+base;
  cue.dataset.tCueState='previewing';
  if(explicit)status.textContent='Preview only: swipe right to save to Watch Later, or left to remove from the feed. The card stays in place.';
  if(typeof card.animate!=='function'){cue.dataset.tCueState='ready';return;}
  // Small and non-committing; reduced motion uses an explicitly requested 8px cue.
  const travel=reduced.matches?8:30,turn=reduced.matches?0:2;
  const frames=[{transform:base,offset:0},{transform:`translateX(${travel}px) rotate(${turn}deg)${suffix}`,offset:.24},{transform:base,offset:.47},{transform:`translateX(${-travel}px) rotate(${-turn}deg)${suffix}`,offset:.73},{transform:base,offset:1}];
  try{
   active=card.animate(frames,{duration:reduced.matches?850:1450,easing:'ease-in-out'});
   await active.finished.catch(()=>{});
  }catch{
   // A missing or interrupted animation leaves the same usable card in place.
  }finally{
   if(serial===own){active=null;cue.dataset.tCueState='ready';}
  }
 }
 function schedule(){
  if(disposed||automaticUsed||interacted||!visible||!coarse.matches||reduced.matches||document.hidden||cue.hidden||button.disabled)return;
  automaticUsed=true;
  timer=setTimeout(()=>{timer=0;if(visible&&!document.hidden&&!interacted)void preview(false);},450);
 }
 function interaction(event){
  if(event.target.closest('[data-t-swipe-preview]'))return;
  interacted=true;automaticUsed=true;cancel();
 }
 button.addEventListener('click',()=>void preview(true));
 for(const type of ['pointerdown','focusin','keydown'])demo.addEventListener(type,interaction,true);
 const resize=()=>{cancel();sync();};
 window.addEventListener('resize',resize);
 const visibility=()=>{if(document.hidden)cancel();else schedule();};
 document.addEventListener('visibilitychange',visibility);
 const preference=()=>{automaticUsed=true;cancel();sync();};
 reduced.addEventListener('change',preference);coarse.addEventListener('change',preference);narrow.addEventListener('change',preference);
 let observer;
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const entry of entries){visible=entry.isIntersecting&&entry.intersectionRatio>=.65;if(visible)schedule();else cancel();}},{threshold:[0,.65]});observer.observe(cue);}else{visible=true;}
 const changes='MutationObserver'in window?new MutationObserver(sync):null;
 changes?.observe(stack,{attributes:true,attributeFilter:['aria-busy','hidden'],childList:true});
 window.addEventListener('pagehide',()=>{disposed=true;cancel();observer?.disconnect();changes?.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',preference);coarse.removeEventListener('change',preference);narrow.removeEventListener('change',preference);},{once:true});
 sync();schedule();
}




