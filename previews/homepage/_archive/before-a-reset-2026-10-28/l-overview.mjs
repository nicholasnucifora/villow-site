const tick='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const hand=(down=false)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path${down?' transform="rotate(180 12 12)"':''} d="M4 12.2 6.5 12c1.4-2.1 2.2-4.5 2.6-7.2.1-1 1-1.6 1.9-1.3 1.8.6 2.4 2.5 1.9 4.5l-.5 2.1 4.6.3c2 .1 3 1.6 2.6 3.4l-1 4.2c-.4 1.9-1.8 2.8-3.7 2.6l-3.6-.4c-1.7-.2-2.7-1.1-4.1-1.5L4 18.4Z"/></svg>`;
const feed=[
 ['Channels you follow','assets/c-thumb-garden.webp','A small herb garden','channel'],
 ['Saved from YouTube','assets/c-thumb-pasta.webp','A simple Sunday lunch','youtube'],
 ['Recommendations','assets/c-thumb-mountain.webp','A walk in the mountains','recommendation'],
];
const days=[['M',38],['T',64],['W',29],['T',80],['F',48],['S',60],['S',35]];

export function renderLOverview(){
 return `<section class="lo-overview" id="i-controls" aria-label="A finite feed, personal limits and understanding your viewing">
  <div class="lo-intro-line"><span>A LITTLE MORE SAY</span><span>Illustrative examples</span></div>
  <div class="lo-feed-story">
   <div class="lo-feed-copy">
    <h2>A feed you<br> can finish.</h2>
    <p>Bring together channels you follow, saved YouTube videos and recommendations in a finite feed you can shape.</p>
   </div>
   <figure class="lo-feed-visual" data-lo-visual aria-label="Illustrative feed: videos from followed channels, saved from YouTube and recommendations form a finite selection, ending with Feed clear.">
    <div class="lo-source-label">Different sources. One manageable selection.</div>
    <div class="lo-feed-strip">
     ${feed.map(([source,image,title,key],index)=>`<div class="lo-feed-item lo-motion-piece" style="--lo-order:${index}"><span class="lo-source lo-source-${key}"><i aria-hidden="true"></i>${source}</span><img src="${image}" width="536" height="300" alt="" loading="lazy"><span class="lo-video-title">${title}</span></div>`).join('')}
     <div class="lo-feed-end lo-motion-piece"><span class="lo-end-mark">${tick}</span><strong>Feed clear.</strong><span>A place to stop.</span></div>
    </div>
    <figcaption>Illustrative selection</figcaption>
   </figure>
  </div>
  <div class="lo-supporting">
   <div class="lo-limits-story">
    <figure class="lo-limit-visual" data-lo-visual aria-label="Example personal daily viewing limit: 30 minutes. The limit is set by the viewer.">
     <div class="lo-limit-dial">
      <svg class="lo-limit-arc" viewBox="0 0 220 220" fill="none" aria-hidden="true"><circle cx="110" cy="110" r="83" stroke="#e6ebda" stroke-width="12"/><circle class="lo-arc-fill" cx="110" cy="110" r="83" pathLength="100" stroke="#70aa8d" stroke-width="12" stroke-linecap="round" stroke-dasharray="72 100" transform="rotate(-90 110 110)"/><circle class="lo-limit-dot" cx="28.5" cy="125.5" r="10" fill="#275f50"/></svg>
      <div class="lo-limit-value"><strong>30</strong><span>minutes a day</span></div>
     </div>
     <figcaption>Example limit</figcaption>
    </figure>
    <div class="lo-support-copy">
     <h3>Set your own<br> stopping point.</h3>
     <p>Personal limits and watch-free periods help watching fit around the rest of your day.</p>
    </div>
   </div>
   <div class="lo-time-story">
    <div class="lo-support-copy">
     <h3>Understand<br> your viewing.</h3>
     <p>See when and how much you watch. Optionally reflect on what felt worthwhile.</p>
    </div>
    <figure class="lo-time-visual" data-lo-visual aria-label="Sample week of time watched, shown as seven varying daily bars, alongside optional thumbs-up or thumbs-down reflection.">
     <div class="lo-chart-label"><span>Time watched</span><span>Sample week</span></div>
     <div class="lo-chart">
      <div class="lo-chart-bars">${days.map(([day,height],index)=>`<div class="lo-chart-day"><span class="lo-bar" style="--lo-height:${height}%;--lo-order:${index}"></span><span class="lo-day-label">${day}</span></div>`).join('')}</div>
     </div>
     <div class="lo-reflection lo-motion-piece"><span>Optional reflection</span><span class="lo-reflection-icons">${hand()}${hand(true)}</span></div>
    </figure>
   </div>
  </div>
 </section>`;
}
