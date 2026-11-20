const sampleVideos=[
 {id:'garden',source:'Channels you follow',image:'assets/c-thumb-garden.webp',title:'A small herb garden',kind:'channel'},
 {id:'pasta',source:'Saved from YouTube',image:'assets/c-thumb-pasta.webp',title:'A simple Sunday lunch',kind:'youtube'},
 {id:'mountain',source:'Recommendations',image:'assets/c-thumb-mountain.webp',title:'A walk in the mountains',kind:'recommendation'},
];

const clock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.3"/><path d="M12 7v5l3 2"/></svg>';
const tick='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';

export function renderMFeed(){
 return `<div class="mo-feed-visual" data-mo-visual data-mo-feed-demo>
  <p class="mo-visual-label">Sample videos · Different sources, one selection</p>
  <div class="mo-feed-items">
   ${sampleVideos.map((video,index)=>`<article class="mo-feed-item mo-motion-piece" data-mo-item="${video.id}" style="--mo-order:${index}">
    <span class="mo-source mo-source-${video.kind}"><i aria-hidden="true"></i>${video.source}</span>
    <img src="${video.image}" width="536" height="300" alt="" loading="lazy">
    <h3 class="mo-feed-title">${video.title}</h3>
    <button class="mo-save" type="button" data-mo-save="${video.id}" aria-label="Save to Watch Later: ${video.title}" aria-pressed="false" hidden>${clock}<span data-mo-save-label>Watch Later</span></button>
   </article>`).join('')}
  </div>
  <div class="mo-feed-ending mo-motion-piece"><span class="mo-feed-end-mark">${tick}</span><div><strong>An ending in sight.</strong><p>You don’t have to watch everything.</p></div></div>
  <div class="mo-watch-later" data-mo-watch-later>
   <div class="mo-watch-later-heading"><h3>${clock}<span>Watch Later</span></h3><span class="mo-save-count" data-mo-save-count>0 saved</span><button class="mo-feed-reset" type="button" data-mo-feed-reset hidden>Reset example</button></div>
   <ul class="mo-saved-list" data-mo-saved-list aria-label="Saved sample videos" hidden></ul>
   <p class="mo-saved-empty" data-mo-saved-empty>Keep a pick for another time.</p>
  </div>
  <p class="sr-only" data-mo-feed-status role="status" aria-live="polite" aria-atomic="true"></p>
 </div>`;
}
