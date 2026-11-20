const duration=6000;
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)');

for(const scene of document.querySelectorAll('[data-ig-cinema]')){
 const panel=scene.closest('[data-ip-view-panel]');
 const toggle=scene.querySelector('[data-ig-toggle]');
 const icon=scene.querySelector('[data-ig-toggle-icon]');
 const seek=scene.querySelector('[data-ig-seek]');
 const reflection=scene.querySelector('[data-ig-reflection]');
 const answers=[...scene.querySelectorAll('[data-ig-answer]')];
 const status=scene.querySelector('[data-ig-status]');
 let elapsed=0;
 let previous=null;
 let frame=0;
 let inView=false;
 let started=false;
 let userPaused=false;
 let ended=false;
 let manualMotion=false;
 let poseMotion=false;
 let previousPose=null;
 let lastProgress=-1;
 let lastSeekText='';
 let scrubMode=null;
 let scrubPointer=null;
 let resumeAfterScrub=false;
 let motionBeforeScrub=false;
 const canRun=()=>inView&&!document.hidden&&!panel?.hidden&&!scene.closest('[hidden]')&&started&&!userPaused&&!ended&&!scrubMode;

 function updateProgress(){
  const progress=Math.round(Math.min(1,elapsed/duration)*1000)/1000;
  if(progress!==lastProgress){
   lastProgress=progress;
   scene.dataset.igProgress=String(progress);
   scene.style.setProperty('--ig-progress',String(progress));
   scene.style.setProperty('--ig-elapsed',String(Math.min(duration,elapsed)/1000));
  }
  if(seek){
   const seconds=Math.round(Math.min(duration,elapsed)/50)/20;
   if(!scrubMode&&Number(seek.value)!==seconds)seek.value=String(seconds);
   const valueText=`${Math.round(seconds*10)/10} of ${duration/1000} seconds`;
   if(valueText!==lastSeekText){seek.setAttribute('aria-valuetext',valueText);lastSeekText=valueText;}
  }
 }
 function clearAnswers(){
  answers.forEach(button=>button.setAttribute('aria-pressed','false'));
  scene.dataset.igRated='';
 }
 function updateControls(){
  const playing=canRun();
  scene.dataset.igState=ended?'ended':playing?'playing':started?'paused':'ready';
  scene.dataset.igManualMotion=String(manualMotion);
  scene.dataset.igScrubbing=String(Boolean(scrubMode));
  scene.dataset.igPoseMotion=String(poseMotion);
  const pose=ended&&!scene.dataset.igRated?'thinking':'watching';
  if(pose!==previousPose){
   if(previousPose!==null)scene.dataset.igPoseTransition=pose==='thinking'?'to-thinking':'to-watching';
   scene.dataset.igPose=pose;
   previousPose=pose;
  }
  const word=playing?'Pause':'Play';
  toggle.setAttribute('aria-label',`${word} the short cat ${reduceMotion.matches&&!playing?'animation':'scene'}`);
  icon.innerHTML=playing?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M8 6v12M16 6v12"/></svg>':'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m9 6 10 6-10 6Z"/></svg>';
  toggle.hidden=ended;
  reflection.hidden=!ended;
 }
 function end(){
  if(ended){elapsed=duration;updateProgress();updateControls();return;}
  // Preserve focus only when the disappearing projection button owns it.
  const focusedToggle=document.activeElement===toggle;
  ended=true;previous=null;manualMotion=false;elapsed=duration;
  cancelAnimationFrame(frame);frame=0;
  clearAnswers();
  updateProgress();
  updateControls();
  status.textContent='The video has ended. Was this video worth your time? You can choose either optional response. Use the progress bar to replay.';
  if(focusedToggle)answers[0]?.focus({preventScroll:true});
 }
 function tick(now){
  frame=0;
  if(!canRun()){previous=null;updateControls();return;}
  if(previous!==null)elapsed+=now-previous;
  previous=now;
  updateProgress();
  if(elapsed>=duration){end();return;}
  frame=requestAnimationFrame(tick);
 }
 function sync(){
  if(!started&&inView&&!panel?.hidden&&!document.hidden&&!reduceMotion.matches)started=true;
  if(canRun()){
   if(!frame){previous=null;frame=requestAnimationFrame(tick);}
  }else{
   cancelAnimationFrame(frame);frame=0;previous=null;
  }
  updateControls();
 }
 toggle.addEventListener('click',()=>{
  if(ended)return;
  if(canRun())userPaused=true;
  else{started=true;userPaused=false;manualMotion=reduceMotion.matches;poseMotion=true;}
  status.textContent=userPaused?'Video paused.':'Video playing.';
  sync();
 });
 for(const answer of answers)answer.addEventListener('click',()=>{
  const selected=answer.getAttribute('aria-pressed')!=='true';
  clearAnswers();
  answer.setAttribute('aria-pressed',String(selected));
  const value=answer.dataset.igAnswer;
  scene.dataset.igRated=selected?value:'';
  updateControls();
  status.textContent=selected?(value==='yes'?'This video felt worth your time.':'This video did not feel worth your time.'):'Reflection cleared.';
 });
 function beginScrub(mode){
  if(scrubMode)return;
  resumeAfterScrub=canRun();
  motionBeforeScrub=reduceMotion.matches;
  manualMotion=motionBeforeScrub;
  poseMotion=true;
  scrubMode=mode;
  sync();
 }
 function seekToInput(){
  const seconds=Number(seek.value);
  if(!Number.isFinite(seconds))return;
  elapsed=Math.max(0,Math.min(duration,seconds*1000));
  previous=null;
  if(elapsed>=duration){end();return;}
  if(ended){
   ended=false;userPaused=true;
   clearAnswers();
  }
  manualMotion=reduceMotion.matches&&motionBeforeScrub;
  started=true;
  updateProgress();
  sync();
 }
 function finishScrub(){
  if(!scrubMode)return;
  const resume=resumeAfterScrub;
  scrubMode=null;scrubPointer=null;resumeAfterScrub=false;
  if(elapsed>=duration){end();return;}
  started=true;userPaused=!resume;
  manualMotion=reduceMotion.matches&&motionBeforeScrub;
  updateProgress();
  sync();
 }
 if(seek){
  const seekKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown']);
  seek.addEventListener('pointerdown',event=>{
   event.stopPropagation();
   beginScrub('pointer');scrubPointer=event.pointerId;
   try{seek.setPointerCapture(event.pointerId);}catch{}
  });
  seek.addEventListener('input',event=>{
   event.stopPropagation();
   if(!scrubMode)beginScrub('input');
   seekToInput();
  });
  seek.addEventListener('change',event=>{
   event.stopPropagation();
   if(!scrubMode)beginScrub('input');
   seekToInput();
   if(scrubMode==='input')finishScrub();
  });
  const finishPointer=event=>{
   event.stopPropagation();
   if(scrubMode==='pointer'&&(scrubPointer===null||event.pointerId===scrubPointer))finishScrub();
  };
  for(const event of ['pointerup','pointercancel','lostpointercapture'])seek.addEventListener(event,finishPointer);
  seek.addEventListener('keydown',event=>{
   if(!seekKeys.has(event.key))return;
   event.stopPropagation();beginScrub('keyboard');
  });
  seek.addEventListener('keyup',event=>{
   if(!seekKeys.has(event.key))return;
   event.stopPropagation();
   if(scrubMode==='keyboard')finishScrub();
  });
  seek.addEventListener('blur',finishScrub);
  seek.addEventListener('click',event=>event.stopPropagation());
 }
 const intersection=new IntersectionObserver(entries=>{
  inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;
  sync();
 },{threshold:[0,.2]});
 intersection.observe(scene.querySelector('.ig-cinema-art'));
 if(panel)new MutationObserver(()=>{
  if(panel.hidden&&scrubMode)finishScrub();
  sync();
 }).observe(panel,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&scrubMode)finishScrub();
  sync();
 });
 reduceMotion.addEventListener('change',()=>{
  manualMotion=false;
  poseMotion=false;
  resumeAfterScrub=false;motionBeforeScrub=false;
  if(started&&!ended)userPaused=true;
  sync();
 });
 updateProgress();
 clearAnswers();
 sync();
}

