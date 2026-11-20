import {renderIFeedSave} from './i-feed-save.mjs';
import {videos as original} from './i-data.js';
import {videos,esc} from './n-data.js';
import {renderNInsights,renderNTrends} from './n-insights.mjs';

function renderNFeed(){
 let feed=renderIFeedSave();
 for(const [id,video] of Object.entries(videos))if(original[id])feed=feed.split(esc(original[id].title)).join(esc(video.title));
 feed=feed.replace('class="ifs-section"','class="ifs-section no-feed"');
 feed=feed.replace('<div class="ifs-workspace">','<div class="ifs-workspace" data-no-visual>');
 feed=feed.replace('Keep what interests you.<br> Come back when you’re ready.','Channels you follow, saved YouTube videos and recommendations. Shape a finite selection, and keep a pick for later.');
 feed=feed.replace('<h3>Home feed</h3></div>','<h3>Home feed</h3><span class="no-feed-count">5 sample videos</span></div>');
 feed=feed.replace('<p class="sr-only" data-ifs-status','<p class="no-feed-footnote">A feed with an ending. You don’t have to watch everything.</p><p class="sr-only" data-ifs-status');
 return feed;
}

export function renderNOverview(){
 return `<section class="no-overview" id="i-controls" aria-label="A feed with an ending, personal limits and understanding your viewing">
  ${renderNFeed()}
  <div class="no-row no-limit-row">
   <div class="no-copy"><h2>Set your own<br> stopping point.</h2><p>Choose personal limits and watch-free periods, so watching fits around the rest of your day.</p></div>
   <figure class="no-limit-visual" data-no-visual aria-label="Illustrative daily allowance: 60 minutes in total, 30 used and 30 minutes left. Half of the ring is filled.">
    <div class="no-time-indicator">
     <svg class="no-limit-ring" viewBox="0 0 112 112" fill="none" aria-hidden="true"><circle cx="56" cy="56" r="43" stroke="#e0e8d6" stroke-width="9"/><circle class="no-limit-arc" cx="56" cy="56" r="43" pathLength="100" stroke="#4b8a6c" stroke-width="9" stroke-linecap="round" stroke-dasharray="50 100" transform="rotate(-90 56 56)"/></svg>
     <div class="no-time-label"><span>An example daily limit</span><strong>60 <span>min / day</span></strong><p>30 min used · 30 min remaining</p></div>
    </div>
   </figure>
  </div>
  <div class="no-row no-insight-row" id="n-viewing">
   <div class="no-copy"><h2>Understand<br> your viewing.</h2><p>Notice when you tend to watch, how your time changes, and what feels worthwhile.</p></div>
   ${renderNInsights()}
  </div>
  ${renderNTrends()}
 </section>`;
}
