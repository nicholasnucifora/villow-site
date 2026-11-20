import { renderControls } from './c-controls.mjs';
export function renderC(c, h) {
 return `
 <section class="c-hero" aria-labelledby="hero-title">
   <img class="c-landscape" src="assets/c-landscape.webp" width="1774" height="887" alt="" fetchpriority="high">
   <div class="c-hero-inner">
     <div class="c-hero-copy">
       <p class="c-eyebrow"><span></span> A LITTLE MORE INTENTION.</p>
       <h1 id="hero-title">Watch<br><span>intentionally.</span></h1>
       <p class="c-intro">${c.lead.split(' Keep')[0]}</p>
       <p class="c-intro-after">Keep the videos you value.<br>Leave when you’re ready.</p>
       <div class="c-hero-actions"><a class="c-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started <span>${h.arrow}</span></a><a class="c-explore" href="#your-controls">Find your stopping point ${h.down}</a></div>
       <p class="c-open-source"><span aria-hidden="true">↗</span> Free and open source.</p>
     </div>
     <div class="c-feed-story" aria-label="Illustration of a finite feed, using sample videos from Villow">
       <div class="c-story-label"><span class="c-spark" aria-hidden="true">✳</span><span>A little of what you love.</span></div>
       <article class="c-video c-video-mountain"><img src="assets/c-thumb-mountain.webp" width="536" height="300" alt="Illustrated mountains from a sample video in Villow"><div><p>A slow walk through the mountains</p><span>Long Way Home</span></div></article>
       <article class="c-video c-video-pasta"><img src="assets/c-thumb-pasta.webp" width="536" height="292" alt="Illustrated pasta dish from a sample video in Villow"><div><p>The pasta I make when the fridge is almost empty</p><span>The Weeknight Table</span></div></article>
       <article class="c-video c-video-garden"><img src="assets/c-thumb-garden.webp" width="535" height="292" alt="Illustrated potted herb from a sample video in Villow"><div><p>A small herb garden for a sunny windowsill</p><span>Small Garden</span><span class="c-video-save" aria-hidden="true">${h.bookmark}</span></div></article>
       <div class="c-story-finish"><svg class="c-story-arrow" viewBox="0 0 100 120" fill="none" aria-hidden="true"><path d="M14 4c78 3 97 61 44 97m-3-19 1 21 22-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="c-finish-mark">${h.check}</span><p>And then?<br><strong>You’re done.</strong></p></div>
       <p class="c-story-note">A finite feed, illustrated. Sample videos from the app.</p>
     </div>
   </div>
   <div class="c-world-caption"><span class="c-caption-stroke"></span><p>Good videos.<br><strong>Room for whatever’s next.</strong></p><a href="#your-controls" aria-label="Explore your choices">${h.down}</a></div>
 </section>
 ${renderControls(h)}`;
}
