import {paperVideo,symbol} from './i-concepts-shared.mjs';

function desk(){
 return `<div class="ic-scene iq17-scene" data-iq-desk aria-label="A chosen comedy sits in a simple viewing space, with a small selection of videos and an optional reflection">
  <div class="iq17-canvas">
   <div class="iq17-source"><span class="iq17-source-dot" aria-hidden="true"></span><span>From your channels</span><span class="iq17-source-end" aria-hidden="true"></span></div>
   <div class="iq17-main">${paperVideo('comedy',{caption:false})}</div>
   <div class="iq17-bottom"><strong>A little comedy.</strong><button type="button" class="iq17-worth" data-iq-action="desk-worth" aria-pressed="false" aria-label="Mark this sample as worth your time"><span>Worth it?</span><i>${symbol('check')}</i></button></div>
   <div class="iq17-divider" aria-hidden="true"></div>
   <div class="iq17-picks" aria-label="A small selection of sample videos"><div class="iq17-pick iq17-picked">${paperVideo('comedy',{caption:false})}<span class="iq17-pick-dot" aria-hidden="true"></span></div><div class="iq17-pick">${paperVideo('curiosity',{caption:false})}</div><div class="iq17-pick">${paperVideo('music',{caption:false})}</div><div class="iq17-picks-end" aria-hidden="true"><i></i><i></i></div></div>
  </div><span class="iq17-shadow" aria-hidden="true"></span>
 </div>`;
}

function pause(){
 return `<div class="ic-scene iq18-scene" data-iq-pause aria-label="A few videos lead to a pause you can choose, with open space beyond">
  <svg class="iq18-course" viewBox="0 0 535 430" fill="none" aria-hidden="true"><path class="iq18-line-before" d="M34 205C108 205 121 281 218 281H319"/><path class="iq18-line-after" d="M371 281H477"/></svg>
  <div class="iq18-video iq18-video-one">${paperVideo('curiosity',{caption:false})}</div><div class="iq18-video iq18-video-two">${paperVideo('comedy',{caption:false})}</div>
  <span class="iq18-chosen" aria-hidden="true">${symbol('check')}</span>
  <div class="iq18-boundary" aria-hidden="true"><span></span><span></span></div>
  <button class="iq18-pause" type="button" data-iq-action="pause-toggle" aria-pressed="false"><span class="iq18-pause-icon">${symbol('pause')}</span><span class="iq18-resume-icon">${symbol('play')}</span><span class="iq18-pause-text">Pause here</span><span class="iq18-resume-text">Keep watching</span></button>
  <span class="iq18-beyond" aria-hidden="true">${symbol('leaf')}</span>
 </div>`;
}

function thread(){
 return `<div class="ic-scene iq19-scene" aria-label="One gentle line links choosing a video, watching, and an optional reflection, before fading into open space">
  <svg class="iq19-thread" viewBox="0 0 535 430" fill="none" aria-hidden="true"><defs><linearGradient id="iq19-thread-fade" x1="360" y1="330" x2="510" y2="330" gradientUnits="userSpaceOnUse"><stop stop-color="#b3ccbd"/><stop offset="1" stop-color="#b3ccbd" stop-opacity="0"/></linearGradient></defs><path class="iq19-under" d="M37 210C37 139 109 100 180 110C267 122 267 230 338 283C374 310 423 328 486 326"/><path class="iq19-fade" d="M338 283C374 310 423 328 486 326"/></svg>
  <div class="iq19-incoming" aria-hidden="true"><span class="iq19-small iq19-small-one">${paperVideo('garden',{caption:false})}</span><span class="iq19-small iq19-small-two">${paperVideo('music',{caption:false})}</span></div>
  <span class="iq19-choice" aria-hidden="true">${symbol('check')}</span>
  <div class="iq19-chosen">${paperVideo('comedy',{caption:false})}</div>
  <span class="iq19-play" aria-hidden="true">${symbol('play')}</span>
  <button type="button" class="iq19-reflect" data-iq-action="thread-worth" aria-pressed="false" aria-label="Reflect on whether this sample was worth your time"><span>Worth it?</span><i>${symbol('check')}</i></button>
  <span class="iq19-open" aria-hidden="true"></span>
 </div>`;
}

function stack(){
 return `<div class="ic-scene iq20-scene" data-iq-quiet-stack data-sample="0" aria-label="A light stack of chosen videos has a visible final edge and a pause the viewer can choose">
  <div class="iq20-fan"><div class="iq20-last"><div class="iq20-last-video">${paperVideo('curiosity',{caption:false})}</div><span class="iq20-end" aria-hidden="true"><span></span>${symbol('leaf')}</span></div><div class="iq20-middle">${paperVideo('garden',{caption:false})}</div>
  <div class="iq20-front"><div class="iq20-sample iq20-sample-comedy">${paperVideo('comedy',{caption:false})}</div><div class="iq20-sample iq20-sample-music">${paperVideo('music',{caption:false})}</div><div class="iq20-meta"><span class="iq20-picked">${symbol('check')}<span>Your pick</span></span><button type="button" class="iq20-next" data-iq-action="stack-next" aria-label="See another sample video">${symbol('arrow')}</button></div></div></div>
  <button type="button" class="iq20-pause" data-iq-action="stack-pause" aria-pressed="false">${symbol('pause')}<span>Pause here</span></button>
 </div>`;
}

export const quietLast=[
 {key:'quiet-desk',number:17,name:'Your viewing space',render:desk},
 {key:'quiet-pause',number:18,name:'Leave a little room',render:pause},
 {key:'quiet-thread',number:19,name:'A lighter journey',render:thread},
 {key:'quiet-stack',number:20,name:'A quieter stack',render:stack}
];
