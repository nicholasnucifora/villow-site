import {videos,feedIds,initialSaved,icons,esc} from './i-data.js';

const card = (id, depth) => {
  const video=videos[id];
  return `<article class="ifs-card ${depth?'ifs-back':'ifs-front'}" data-ifs-card="${id}" aria-label="${esc(video.title)}" style="--ifs-depth:${depth};--ifs-back-angle:${feedIds.indexOf(id)%2?4:-5}deg;--ifs-front-angle:-2deg"${depth?' aria-hidden="true" inert':''}>
    <div class="ifs-card-image"><img src="${video.image}" width="536" height="300" alt="" loading="lazy" draggable="false"><span class="ifs-swipe-feedback" aria-hidden="true"></span></div>
    <div class="ifs-card-copy"><h4>${esc(video.title)}</h4><p>${esc(video.channel)}</p></div>
    <div class="ifs-card-actions"><button class="ifs-remove" type="button" data-ifs-action="remove" data-ifs-id="${id}" aria-label="Remove from the example feed: ${esc(video.title)}"${depth?' tabindex="-1"':''}>${icons.trash}<span>Remove</span></button><button class="ifs-save" type="button" data-ifs-action="save" data-ifs-id="${id}" aria-label="Save to Watch Later: ${esc(video.title)}"${depth?' tabindex="-1"':''}>${icons.clock}<span>Watch Later</span></button></div>
  </article>`;
};

const sprout='<svg viewBox="0 0 96 96" fill="none" aria-hidden="true"><path d="M48 76V39" stroke="#43836b" stroke-width="3" stroke-linecap="round"/><path d="M48 53C29 54 19 43 19 28C37 27 49 37 48 53Z" fill="#8ebda3"/><path d="M48 43C47 26 60 18 77 20C77 36 65 46 48 43Z" fill="#3e8b70"/><path d="M31 78C42 74 55 74 66 78" stroke="#c1d8bd" stroke-width="3" stroke-linecap="round"/></svg>';
const confetti=Array.from({length:16},(_,n)=>{const angle=(n/16)*Math.PI*2;return `<i style="--ifs-confetti-x:${Math.round(Math.cos(angle)*(100+(n%3)*18))}px;--ifs-confetti-y:${Math.round(Math.sin(angle)*105-35)}px;--ifs-confetti-turn:${n%2?-130:160}deg;--ifs-confetti-delay:${(n%4)*28}ms;--ifs-confetti-color:${['#5b9d7e','#a8cdb5','#e4c87d','#d8aa89'][n%4]}"></i>`;}).join('');

export const feedSaveRow = id => {
  const video=videos[id];
  return `<li class="ifs-saved-row" data-ifs-saved="${id}"><img src="${video.image}" width="536" height="300" alt="" loading="lazy"><div class="ifs-saved-copy"><h4>${esc(video.title)}</h4><p>${esc(video.channel)}</p></div><button type="button" data-ifs-action="unsave" data-ifs-id="${id}" aria-label="Remove from Watch Later: ${esc(video.title)}">${icons.trash}</button></li>`;
};

export function renderIFeedSave(){
  return `<section class="ifs-section" id="feed-to-watch-later" aria-labelledby="ifs-heading" data-ifs-demo>
    <div class="ifs-intro"><div><p class="ifs-kicker">Interactive example · Sample videos</p><h2 id="ifs-heading">Find it now.<br>Watch it later.</h2></div><p>Keep what interests you.<br> Come back when you’re ready.</p></div>
    <div class="ifs-workspace">
      <div class="ifs-feed"><div class="ifs-panel-heading"><span class="ifs-panel-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m10 8 6 4-6 4V8Z"/></svg></span><h3>Home feed</h3></div>
        <div class="ifs-stack-space"><div class="ifs-stack" data-ifs-stack aria-busy="false">${feedIds.map((id,depth)=>card(id,depth)).reverse().join('')}</div>
          <div class="ifs-complete" data-ifs-complete hidden><div class="ifs-confetti" aria-hidden="true">${confetti}</div><span class="ifs-complete-sprout">${sprout}</span><h4 tabindex="-1">All done.</h4><p>A little room for what’s next.</p><button type="button" data-ifs-action="replay" aria-label="Try the stack again" title="Try again">${icons.undo}</button></div>
        </div>
      </div>
      <div class="ifs-bridge" aria-hidden="true">${icons.arrow}</div>
      <div class="ifs-library"><div class="ifs-panel-heading"><span class="ifs-panel-icon" aria-hidden="true">${icons.clock}</span><h3>Watch Later</h3></div><div class="ifs-library-body"><ul class="ifs-saved-list" data-ifs-list aria-label="Your saved sample videos">${initialSaved.map(feedSaveRow).join('')}</ul><div class="ifs-list-empty" data-ifs-empty hidden><span aria-hidden="true">${icons.clock}</span><h4 tabindex="-1">Room for your picks.</h4><p>Save a video from the Home feed.</p></div><p class="ifs-list-note">Your picks. In your own time.</p></div></div>
    </div>
    <p class="sr-only" data-ifs-status role="status" aria-live="polite" aria-atomic="true"></p>
  </section>`;
}
