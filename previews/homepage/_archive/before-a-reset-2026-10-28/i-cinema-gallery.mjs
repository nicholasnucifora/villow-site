import {esc,symbol} from './i-concepts-shared.mjs';

// Percentages refer to the full 2:1 source artwork. Projector, cloud and frame
// stay fixed; Cloud cinema changes only the viewer's head/arm region.
export const cinemaGalleryConfig={
 'cinema-cloud-cat':{image:'assets/i-cinema-cloud-cat.webp',watchingImage:'assets/i-cinema-cloud-watching-v1.webp',turnImage:'assets/i-cinema-cloud-turn-v1.webp',description:'A viewer watches a sleeping cat, then considers whether the video was worth their time.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
 'cinema-cushion':{image:'assets/i-cinema-cushion.webp',description:'A relaxed viewer sits on a cushion, with a little cinema resting on a cloud.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
 'cinema-reading-chair':{image:'assets/i-cinema-reading-chair.webp',description:'A viewer leans back in a light wooden recliner beside a projector, all resting on a cloud.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
 'cinema-hammock':{image:'assets/i-cinema-hammock.webp',description:'A viewer rests in a hammock with their own small cinema on a cloud.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
 'cinema-director':{image:'assets/i-cinema-director.webp',description:'A viewer in a folding chair chooses what to watch in a small cinema on a cloud.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
 'cinema-evening':{image:'assets/i-cinema-evening.webp',description:'A viewer enjoys a quiet evening with a small projector and screen on a cloud.',screen:{left:64.1,top:21.55,width:29.95,height:43.6}},
};

export function renderCinemaGallery(key){
 const config=cinemaGalleryConfig[key];
 if(!config)throw new Error(`Unknown cinema illustration: ${key}`);
 const box=config.screen;
 const pose=config.watchingImage;
 return `<div class="ig-cinema" data-ig-cinema="${esc(key)}" data-ig-state="ready">
  <div class="ig-cinema-art" style="--ig-screen-left:${box.left}%;--ig-screen-top:${box.top}%;--ig-screen-width:${box.width}%;--ig-screen-height:${box.height}%;--ig-screen-rotation:${box.rotate||0}deg">
   ${pose?`<svg class="ig-pose-masks" width="0" height="0" aria-hidden="true"><defs><filter id="ig-viewer-feather-${key}" x="-.1" y="-.1" width="1.2" height="1.2"><feGaussianBlur stdDeviation=".008"/></filter><mask id="ig-viewer-patch-${key}" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="black"/><rect x=".05" y=".25" width=".27" height=".37" fill="white" filter="url(#ig-viewer-feather-${key})"/></mask></defs></svg>`:''}
   <img class="ig-cinema-base" src="${config.image}" width="1774" height="887" alt="${esc(config.description)}" draggable="false">
   ${pose?`<div class="ig-viewer-pose" style="mask:url(#ig-viewer-patch-${key})" aria-hidden="true" data-ig-viewer><img class="ig-pose-layer ig-pose-watching" src="${config.watchingImage}" width="1774" height="887" alt="" draggable="false"><img class="ig-pose-layer ig-pose-turn" src="${config.turnImage}" width="1774" height="887" alt="" draggable="false"><img class="ig-pose-layer ig-pose-thinking" src="${config.image}" width="1774" height="887" alt="" draggable="false"></div>`:''}
   <div class="ig-cinema-screen">
    <div class="ig-cinema-clip" aria-hidden="true"><img src="assets/i-cinema-cat-clip.webp" width="1254" height="1254" alt="" draggable="false"></div>
    <button class="ig-cinema-toggle" type="button" data-ig-toggle aria-label="Play the short cat scene"><span class="ig-cinema-toggle-icon" data-ig-toggle-icon aria-hidden="true">${symbol('play')}</span></button>
    <div class="ig-cinema-progress"><input class="ig-cinema-seek" type="range" data-ig-seek min="0" max="6" step=".05" value="0" aria-label="Video progress" aria-valuetext="0 of 6 seconds"></div>
    <div class="ig-cinema-reflection" data-ig-reflection hidden>
     <h3 class="ig-cinema-question"><span>Was this video</span><span>worth your time?</span></h3>
     <div class="ig-cinema-answers" role="group" aria-label="Was this video worth your time? Optional sample reflection">
      ${[['yes','Worth it'],['no','Not worth it']].map(([value,label])=>`<button class="ig-cinema-verdict" type="button" data-ig-answer="${value}" aria-label="${label}" title="${label}" aria-pressed="false">${worthIcon(value)}</button>`).join('')}
     </div>
    </div>
   </div>
  </div>
  <span class="sr-only" role="status" aria-live="polite" data-ig-status></span>
 </div>`;
}

// Same Bare hand path and idle/selected treatment as Villow's WorthIcon.tsx.
function worthIcon(value){
 return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path${value==='no'?' transform="rotate(180 12 12)"':''} d="M4 12.2 6.5 12c1.4-2.1 2.2-4.5 2.6-7.2.1-1 1-1.6 1.9-1.3 1.8.6 2.4 2.5 1.9 4.5l-.5 2.1 4.6.3c2 .1 3 1.6 2.6 3.4l-1 4.2c-.4 1.9-1.8 2.8-3.7 2.6l-3.6-.4c-1.7-.2-2.7-1.1-4.1-1.5L4 18.4Z"/></svg>`;
}

export const cinemaGallery=Object.keys(cinemaGalleryConfig).map(key=>({key,render:()=>renderCinemaGallery(key)}));
