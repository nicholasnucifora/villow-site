import {paperVideo,symbol} from './i-concepts-shared.mjs';

function tray(){
 return `<div class="ic-scene ic9-scene" data-ic-tray aria-label="A shallow tray holds a small collection of videos, with one set aside for later">
 <div class="ic9-keep"><span class="ic9-keep-mark">${symbol('check')}</span><span>For another time</span><div class="ic9-kept-default">${paperVideo('music',{size:'small',caption:false,label:'An evening of music'})}</div><div class="ic9-kept-choice">${paperVideo('comedy',{size:'small',caption:false,label:'A little absurdity'})}</div></div>
 <div class="ic9-tray"><div class="ic9-inner">
 <div class="ic9-choice ic9-choice-one">${paperVideo('comedy',{caption:true,label:'A little absurdity'})}<span class="ic9-origin">From a channel you chose</span></div>
 <div class="ic9-choice ic9-choice-two">${paperVideo('curiosity',{caption:true,label:'Something to wonder about'})}</div>
 </div><div class="ic9-tray-front"><span>A little to watch.</span><i aria-hidden="true"></i></div></div>
 <button class="ic-action ic9-action" type="button" data-ic-action="tray-keep" aria-pressed="false">${symbol('clock')}<span>Put one aside</span></button>
 <p class="ic-caption ic9-caption">Keep what interests you.<br>There’s room to leave the rest.</p>
 </div>`;
}

function object(){
 return `<div class="ic-scene ic10-scene" data-ic-object aria-label="One upright folding video postcard has a reflection flap and an open paper ending">
 <div class="ic10-object"><div class="ic10-open-end"><span>Room to stop.</span></div>
 <div class="ic10-watch"><span class="ic10-arrival">A channel you chose</span><div class="ic10-front">${paperVideo('comedy',{caption:true,label:'A little absurdity'})}</div><div class="ic10-back" aria-hidden="true"><span>${symbol('check')}</span><strong>Your time.<br>Your call.</strong></div><span class="ic10-fold-line" aria-hidden="true"></span></div>
 <div class="ic10-reflect"><p>Worth<br>your time?</p><span class="ic10-reflection-mark">${symbol('check')} <span>Your call.</span></span></div>
 </div>
 <button class="ic-action ic10-action" type="button" data-ic-action="object-turn" aria-pressed="false"><span>Turn the paper</span>${symbol('arrow')}</button>
 <p class="ic-caption ic10-caption">Your choice, all the way through.</p>
 </div>`;
}

function windowScene(){
 return `<div class="ic-scene ic11-scene" data-ic-window aria-label="A bounded, arched viewing window holds a chosen video, with a shutter that can pause the view">
 <div class="ic11-window"><div class="ic11-pane"><span class="ic11-source">A channel you chose</span><div class="ic11-video">${paperVideo('curiosity',{caption:true,label:'Follow your curiosity'})}</div><span class="ic11-question">Worth the watch?</span>
 <div class="ic11-curtain" aria-hidden="true"><span>${symbol('pause')}</span><strong>Paused for now.</strong><small>Room for whatever’s next.</small></div></div><div class="ic11-sill"></div></div>
 <div class="ic11-shutter" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
 <button class="ic-action ic11-action" type="button" data-ic-action="window-pause" aria-pressed="false">${symbol('pause')}<span>Pause here</span></button>
 <p class="ic-caption ic11-caption">Watching has a place.<br>It doesn’t have to fill the view.</p>
 </div>`;
}

function bookmark(){
 return `<div class="ic-scene ic12-scene" data-ic-bookmark aria-label="An oversized green bookmark marks a stopping place in a few pages of chosen videos">
 <div class="ic12-pages"><div class="ic12-page ic12-page-back" aria-hidden="true"><span></span><span></span></div><div class="ic12-page ic12-page-middle" aria-hidden="true"><span></span><span></span></div><div class="ic12-page ic12-page-front"><span class="ic12-source">From your channels</span>${paperVideo('comedy',{caption:true,label:'A little absurdity'})}<div class="ic12-reflection">${symbol('check')}<span>Worth it?<br>You decide.</span></div><span class="ic12-page-line" aria-hidden="true"></span></div></div>
 <div class="ic12-bookmark"><span class="ic12-eye" aria-hidden="true"></span><span class="ic12-ribbon-icon">${symbol('pause')}</span><strong>A good<br>place<br>to pause.</strong><span class="ic12-ribbon-rule" aria-hidden="true"></span></div>
 <span class="ic12-margin-note">The rest<br>can wait.</span>
 <button class="ic-action ic12-action" type="button" data-ic-action="bookmark-pause" aria-pressed="false"><span>Put it down for now</span>${symbol('arrow')}</button>
 <p class="ic-caption ic12-caption">Good watching. A place to put it down.</p>
 </div>`;
}

export const lastConcepts=[
 {key:'tray',number:9,name:'The finite tray',render:tray},
 {key:'object',number:10,name:'One object, the whole journey',render:object},
 {key:'window',number:11,name:'The viewing window',render:windowScene},
 {key:'bookmark',number:12,name:'The attention bookmark',render:bookmark}
];
