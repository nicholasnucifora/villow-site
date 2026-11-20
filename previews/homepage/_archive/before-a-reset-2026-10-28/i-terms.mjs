import {videos,esc} from './i-data.js';

const samples=[['garden',784],['pasta',963],['mountain',1096],['shelf',1251]];
const chevron='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg>';

export function renderITerms(library){
  return `<div class="i-terms" data-i-terms aria-labelledby="i-terms-title">
  <header class="i-terms-heading"><span class="i-terms-kicker">INTERACTIVE EXAMPLE</span><h2 id="i-terms-title">You set the terms.</h2></header>
  <p class="i-terms-sentence">I want <span class="i-terms-select i-terms-select-length"><label class="sr-only" for="i-terms-length">Video length</label><select id="i-terms-length" data-i-terms-length><option value="all">all videos</option><option value="15">videos under 15 min</option><option value="20" selected>videos under 20 min</option></select>${chevron}</span> from the channels I choose, <span class="i-terms-arrival">checked <span class="i-terms-select i-terms-select-schedule"><label class="sr-only" for="i-terms-schedule">When new videos arrive</label><select id="i-terms-schedule" data-i-terms-schedule><option value="daily">daily</option><option value="weekly" selected>once a week</option></select>${chevron}</span>.</span></p>
  <div class="i-terms-outcome" role="status" aria-live="polite" aria-atomic="true"><span data-i-terms-count>3 of 4 sample videos match.</span><span data-i-terms-delivery>Scheduled checks · every week.</span></div>
  <div class="i-terms-results" role="list" aria-label="Sample videos matching your length choice">${samples.map(([id,duration])=>{const v=videos[id];return `<article class="i-terms-video" role="listitem" data-i-terms-video data-duration="${duration}"${duration>1200?' hidden':''}><img src="${v.image}" width="536" height="300" alt="" loading="lazy"><h3>${esc(v.title)}</h3><p>${esc(v.channel)}</p></article>`;}).join('')}</div>
  <p class="i-terms-caption">Filter each channel’s uploads. Check scheduled channels at a pace you choose.</p>
</div><div class="i-terms-continuation">${library}</div>`;
}
