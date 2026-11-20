import {videos,feedIds,icons,esc} from './n-data.js';
import {renderTSwipeCue} from './t-swipe-cue.mjs';
const card=(id,depth)=>{const video=videos[id];return `<article class="ifs-card ${depth?'ifs-back':'ifs-front'}" data-ifs-card="${id}" aria-label="${esc(video.title)}" style="--ifs-depth:${depth};--ifs-back-angle:${feedIds.indexOf(id)%2?4:-5}deg;--ifs-front-angle:-2deg"${depth?' aria-hidden="true" inert':''}>
 <div class="ifs-card-image"><img src="${video.image}" width="536" height="300" alt="" loading="lazy" draggable="false"><span class="ifs-swipe-feedback" aria-hidden="true"></span></div>
 <div class="ifs-card-copy"><h4>${esc(video.title)}</h4><p>${esc(video.channel)}</p></div>
 <div class="ifs-card-actions"><button class="ifs-remove" type="button" data-ifs-action="remove" data-ifs-id="${id}" aria-label="Remove from the example feed: ${esc(video.title)}"${depth?' tabindex="-1"':''}>${icons.trash}<span>Remove</span></button><button class="ifs-save" type="button" data-ifs-action="save" data-ifs-id="${id}" aria-label="Save to Watch Later: ${esc(video.title)}"${depth?' tabindex="-1"':''}>${icons.clock}<span>Watch Later</span></button></div>
 </article>`;};
export function renderWFeed(){return `<section class="ifs-section wf-section" id="feed-to-watch-later" aria-labelledby="ifs-heading" data-ifs-demo data-wf-demo>
 <div class="wf-layout">
  <div class="wf-copy"><p class="ifs-kicker">Interactive illustration · Sample videos</p><h2 id="ifs-heading">A feed you<br>can finish.</h2><p>Bring channels, saved videos and discoveries into a selection with an ending. Watch from your feed, save for later, or leave a video where it is.</p><p class="wf-note">You don’t have to watch or sort everything.</p></div>
  <div class="wf-visual"><div class="ifs-stack-space"><div class="ifs-stack" data-ifs-stack aria-busy="false">${feedIds.map((id,depth)=>card(id,depth)).reverse().join('')}</div><div class="ifs-complete wf-complete" data-wf-complete hidden><h3 tabindex="-1">The end of<br>this sample.</h3><button type="button" data-ifs-action="replay">${icons.undo}<span>Try again</span></button></div></div><p class="wf-feedback" data-wf-feedback aria-hidden="true"></p>${renderTSwipeCue()}</div>
 </div><p class="sr-only" data-wf-status role="status" aria-live="polite" aria-atomic="true"></p>
</section>`;}

