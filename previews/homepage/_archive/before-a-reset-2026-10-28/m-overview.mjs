import {renderMFeed} from './m-feed.mjs';
import {renderMInsights} from './m-insights.mjs';

export function renderMOverview(){
 return `<section class="mo-overview" id="i-controls" aria-label="A finite feed, personal limits and understanding your viewing">
  <div class="mo-intro"><span>A LITTLE MORE SAY</span><span>Illustrative examples</span></div>
  <div class="mo-row mo-feed-row">
   <div class="mo-copy"><h2>A feed you<br> can finish.</h2><p>Bring together channels you follow, saved YouTube videos and recommendations in a selection you can shape. Keep a pick for later, with an ending always in sight.</p></div>
   ${renderMFeed()}
  </div>
  <div class="mo-row mo-limit-row">
   <div class="mo-copy"><h2>Set your own<br> stopping point.</h2><p>Personal limits and watch-free periods help watching fit around the rest of your day.</p></div>
   <figure class="mo-allowance" data-mo-visual aria-label="Example daily limit: 30 minutes. 18 minutes watched and 12 minutes remaining. You choose your own limit.">
    <figcaption class="mo-visual-label">An example day · A limit you choose</figcaption>
    <div class="mo-limit-heading"><span>Daily limit</span><strong>30 <span>minutes</span></strong></div>
    <div class="mo-allowance-track" aria-hidden="true"><span class="mo-allowance-watched"></span><span class="mo-allowance-remaining"></span><span class="mo-allowance-marker"></span></div>
    <div class="mo-allowance-figures"><p><i aria-hidden="true"></i><strong>18 <span>minutes watched</span></strong></p><p><i aria-hidden="true"></i><strong>12 <span>minutes remaining</span></strong></p></div>
   </figure>
  </div>
  <div class="mo-row mo-insight-row">
   <div class="mo-copy"><h2>Understand<br> your viewing.</h2><p>See how your viewing changes over time and when you tend to watch. Optional reflection adds what felt worthwhile.</p></div>
   ${renderMInsights()}
  </div>
 </section>`;
}
