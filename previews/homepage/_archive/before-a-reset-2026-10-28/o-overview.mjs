import {renderNOverview} from './n-overview.mjs';
import {renderOInsights} from './o-insights.mjs';

const icons={
 pause:'<rect x="7" y="5" width="3" height="14" rx="1"/><rect x="14" y="5" width="3" height="14" rx="1"/>',
 moon:'<path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z"/>',
 quiet:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
};
const icon=key=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;

export function renderOOverview(){
 const previous=renderNOverview();
 const marker='<div class="no-row no-limit-row">';
 if(previous.split(marker).length!==2)throw new Error('Expected one N limits row.');
 const feed=previous.slice(0,previous.indexOf(marker)).replace('class="no-overview"','class="no-overview oo-overview"');
 return `${feed}
  <section class="no-row oo-limit-row" id="o-limits" aria-labelledby="oo-limit-heading">
   <div class="no-copy"><h2 id="oo-limit-heading">Set your own<br> stopping point.</h2><p>Make room for the rest of your day, with limits and reminders you choose.</p></div>
   <div class="oo-limits" data-oo-visual>
    <figure class="oo-allowance" aria-label="Example daily allowance: 60 minutes, with 30 used and 30 remaining.">
     <div class="oo-limit-indicator">
      <svg class="oo-ring" viewBox="0 0 112 112" fill="none" aria-hidden="true"><circle cx="56" cy="56" r="43" stroke="#e0e8d6" stroke-width="8"/><circle class="oo-ring-arc" cx="56" cy="56" r="43" pathLength="100" stroke="#4b8a6c" stroke-width="8" stroke-linecap="round" stroke-dasharray="50 100" transform="rotate(-90 56 56)"/></svg>
      <div class="oo-allowance-copy"><span>Example daily limit</span><strong>60 <span>min / day</span></strong><p>30 used · 30 remaining</p></div>
     </div>
    </figure>
    <div class="oo-reminders"><ul><li>${icon('pause')}<span>Break reminders</span></li><li>${icon('moon')}<span>Bedtime reminders</span></li><li>${icon('quiet')}<span>Watch-free time</span></li></ul><p>Use what helps. Adjust as you go.</p></div>
   </div>
  </section>
  <section class="no-row oo-insight-row" id="o-viewing" aria-labelledby="oo-viewing-heading">
   <div class="no-copy"><h2 id="oo-viewing-heading">Understand<br> your viewing.</h2><p>See when you watch and how your time changes. If you want, reflect on what felt worthwhile.</p></div>
   ${renderOInsights()}
  </section>
 </section>`;
}
