const duration=6000;
const peerDelay=1800;
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const play='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 6 10 6-10 6Z"/></svg>';
const pause='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg>';
const worthIcon=value=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path${value==='no'?' transform="rotate(180 12 12)"':''} d="M4 12.2 6.5 12c1.4-2.1 2.2-4.5 2.6-7.2.1-1 1-1.6 1.9-1.3 1.8.6 2.4 2.5 1.9 4.5l-.5 2.1 4.6.3c2 .1 3 1.6 2.6 3.4l-1 4.2c-.4 1.9-1.8 2.8-3.7 2.6l-3.6-.4c-1.7-.2-2.7-1.1-4.1-1.5L4 18.4Z"/></svg>`;
for(const scene of document.querySelectorAll('[data-rt-scene]')){
 const toggle=scene.querySelector('[data-rt-toggle]'),icon=scene.querySelector('[data-rt-toggle-icon]'),seek=scene.querySelector('[data-rt-seek]'),reflection=scene.querySelector('[data-rt-reflection]'),status=scene.querySelector('[data-rt-status]'),yourResponse=scene.querySelector('[data-rt-your-response]'),alexResponse=scene.querySelector('[data-rt-alex-response]'),answers=[...scene.querySelectorAll('[data-rt-answer]')];
 if(!toggle||!icon||!seek||!reflection||!status||!yourResponse||!alexResponse||answers.length!==2)continue;
 let elapsed=0,previous=null,frame=0,playing=false,ended=false,manualMotion=false,scrubMode=null,scrubPointer=null,resumeAfterScrub=false,inView=true;
 let yourVerdict='',alexRated=false,alexTimer=0,alexStarted=0,alexRemaining=peerDelay;
 function renderYourResponse(){
  for(const answer of answers)answer.setAttribute('aria-pressed',String(answer.dataset.rtAnswer===yourVerdict));
  yourResponse.innerHTML=yourVerdict?worthIcon(yourVerdict):'—';
  const label=yourVerdict==='yes'?'Worth it':yourVerdict==='no'?'Not worth it':'Unrated';
  yourResponse.setAttribute('aria-label',label);yourResponse.title=label;
  yourResponse.classList.toggle('is-worth-it',yourVerdict==='yes');yourResponse.classList.toggle('is-not-worth-it',yourVerdict==='no');scene.dataset.rtRated=yourVerdict;
 }
 function pausePeerDelay(reset=false){
  if(alexTimer){clearTimeout(alexTimer);alexTimer=0;alexRemaining=Math.max(0,alexRemaining-(performance.now()-alexStarted));}
  alexStarted=0;if(reset&&!alexRated)alexRemaining=peerDelay;
 }
 function startPeerDelay(){
  if(alexRated||alexTimer||!ended||!inView||document.hidden)return;
  alexStarted=performance.now();
  alexTimer=setTimeout(()=>{
   alexTimer=0;alexStarted=0;
   if(!ended||!inView||document.hidden)return;
   alexRated=true;alexRemaining=0;scene.dataset.rtAlexRated='true';
   alexResponse.innerHTML=worthIcon('yes');alexResponse.setAttribute('aria-label','Worth it');alexResponse.title='Worth it';alexResponse.classList.add('is-worth-it','is-new-rating');
   status.textContent='Alex rated this video Worth it. Your response is optional.';
  },alexRemaining);
 }
 function update(){
  scene.dataset.rtState=ended?'ended':playing?'playing':elapsed?'paused':'ready';scene.dataset.rtManualMotion=String(manualMotion);scene.dataset.rtScrubbing=String(Boolean(scrubMode));
  scene.style.setProperty('--rt-progress',String(elapsed/duration));scene.style.setProperty('--rt-elapsed',String(elapsed/1000));
  if(!scrubMode)seek.value=String(Math.round(elapsed/50)/20);
  seek.setAttribute('aria-valuetext',`${Math.round(elapsed/100)/10} of 6 seconds`);
  toggle.hidden=ended;reflection.hidden=!ended;
  const word=playing?'Pause':'Play';toggle.setAttribute('aria-label',`${word} the shared video`);const iconState=playing?'pause':'play';if(icon.dataset.rtIcon!==iconState){icon.innerHTML=playing?pause:play;icon.dataset.rtIcon=iconState;}
 }
 function cancel(){cancelAnimationFrame(frame);frame=0;previous=null;}
 function stop(){playing=false;cancel();update();}
 function finish(){
  const firstEnd=!ended,ownedFocus=document.activeElement===toggle;
  ended=true;playing=false;elapsed=duration;cancel();update();startPeerDelay();
  if(firstEnd)status.textContent=alexRated?'The shared video has ended. Alex rated it Worth it. Your response is optional.':'The shared video has ended. Alex has not rated it yet. Was this video worth your time? Your response is optional.';
  if(ownedFocus)answers[0].focus({preventScroll:true});
 }
 function tick(now){
  frame=0;if(!playing||scrubMode||document.hidden)return;
  if(previous!==null)elapsed=Math.min(duration,elapsed+now-previous);previous=now;
  if(elapsed>=duration){finish();return;}
  update();frame=requestAnimationFrame(tick);
 }
 function run(){if(playing&&!ended&&!scrubMode&&!document.hidden&&!frame){previous=null;frame=requestAnimationFrame(tick);}update();}
 toggle.addEventListener('click',()=>{if(ended)return;if(playing){stop();status.textContent='The shared video is paused for both viewers.';}else{playing=true;manualMotion=true;status.textContent='You and Alex are watching the same video in sync.';run();}});
 for(const answer of answers)answer.addEventListener('click',()=>{
  const value=answer.dataset.rtAnswer;yourVerdict=yourVerdict===value?'':value;renderYourResponse();
  const peer=alexRated?' Alex rated it Worth it.':' Alex has not rated it yet.';
  status.textContent=(yourVerdict?(yourVerdict==='yes'?'You rated this video Worth it.':'You rated this video Not worth it.'):'Your response is cleared.')+peer;
 });
 function beginScrub(mode){if(scrubMode)return;resumeAfterScrub=playing;playing=false;cancel();scrubMode=mode;manualMotion=true;update();}
 function readSeek(){
  const seconds=Number(seek.value);if(!Number.isFinite(seconds))return;
  elapsed=Math.max(0,Math.min(duration,seconds*1000));previous=null;
  if(elapsed>=duration){finish();return;}
  if(ended){ended=false;pausePeerDelay(true);}
  update();
 }
 function finishScrub(){
  if(!scrubMode)return;
  const resume=resumeAfterScrub;scrubMode=null;scrubPointer=null;resumeAfterScrub=false;
  if(elapsed>=duration){ended=true;playing=false;update();startPeerDelay();return;}
  playing=resume;run();
 }
 seek.addEventListener('pointerdown',event=>{event.stopPropagation();beginScrub('pointer');scrubPointer=event.pointerId;try{seek.setPointerCapture(event.pointerId);}catch{}});
 seek.addEventListener('input',event=>{event.stopPropagation();if(!scrubMode)beginScrub('input');readSeek();});
 seek.addEventListener('change',event=>{event.stopPropagation();if(!scrubMode)beginScrub('input');readSeek();if(scrubMode==='input')finishScrub();});
 const finishPointer=event=>{event.stopPropagation();if(scrubMode==='pointer'&&(scrubPointer===null||event.pointerId===scrubPointer))finishScrub();};
 for(const type of ['pointerup','pointercancel','lostpointercapture'])seek.addEventListener(type,finishPointer);
 const seekKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown']);
 seek.addEventListener('keydown',event=>{if(seekKeys.has(event.key)){event.stopPropagation();beginScrub('keyboard');}});
 seek.addEventListener('keyup',event=>{if(seekKeys.has(event.key)){event.stopPropagation();if(scrubMode==='keyboard')finishScrub();}});
 seek.addEventListener('blur',finishScrub);seek.addEventListener('click',event=>event.stopPropagation());
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pausePeerDelay();if(scrubMode)finishScrub();stop();}else startPeerDelay();});
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){inView=entry.isIntersecting;if(!inView){pausePeerDelay();if(playing)stop();}else startPeerDelay();}},{threshold:.1});observer.observe(scene);}
 window.addEventListener('pagehide',()=>{pausePeerDelay();cancel();});
 reduced.addEventListener('change',()=>{manualMotion=false;if(scrubMode)finishScrub();stop();});
 renderYourResponse();update();
}




