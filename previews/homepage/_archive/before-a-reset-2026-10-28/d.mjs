import { renderControls } from './c-controls.mjs';

// D changes the opening only. The following section is shared with C verbatim.
export function renderD(c, h) {
  return `
  <section class="c-hero d-hero" aria-labelledby="hero-title">
    <div class="c-hero-inner">
      <div class="c-hero-copy">
        <h1 id="hero-title">Watch<br><span>intentionally.</span></h1>
        <p class="c-intro">${c.lead}</p>
        <div class="c-hero-actions"><a class="c-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started <span>${h.arrow}</span></a></div>
      </div>
      <div class="c-feed-story" aria-label="Illustration of a finite feed using sample videos from Villow">
        <article class="c-video c-video-mountain"><img src="assets/c-thumb-mountain.webp" width="536" height="300" alt="Illustrated mountains from a sample video in Villow"><div><p>A slow walk through the mountains</p><span>Long Way Home</span></div></article>
        <article class="c-video c-video-pasta"><img src="assets/c-thumb-pasta.webp" width="536" height="292" alt="Illustrated pasta dish from a sample video in Villow"><div><p>The pasta I make when the fridge is almost empty</p><span>The Weeknight Table</span></div></article>
        <article class="c-video c-video-garden"><img src="assets/c-thumb-garden.webp" width="535" height="292" alt="Illustrated potted herb from a sample video in Villow"><div><p>A small herb garden for a sunny windowsill</p><span>Small Garden</span><span class="c-video-save" aria-hidden="true">${h.bookmark}</span></div></article>
        <div class="c-story-finish"><svg class="c-story-arrow" viewBox="0 0 100 120" fill="none" aria-hidden="true"><path d="M14 4c78 3 97 61 44 97m-3-19 1 21 22-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="c-finish-mark">${h.check}</span><p>And then?<br><strong>You’re done.</strong></p></div>
      </div>
    </div>
    <svg class="d-horizon" viewBox="0 0 1600 260" preserveAspectRatio="xMaxYMax slice" fill="none" aria-hidden="true">
      <circle cx="1195" cy="89" r="45" fill="#faefc7"/>
      <path d="M0 186C185 172 267 117 439 151C610 186 726 192 890 162C1056 131 1173 178 1286 153C1428 121 1508 130 1600 142V260H0Z" fill="#e1f0ed"/>
      <path d="M0 225C200 153 396 179 599 223C801 265 1013 183 1174 186C1334 189 1473 135 1600 151V260H0Z" fill="#cce9df"/>
      <path d="M0 251C254 181 434 217 636 249C899 291 1037 257 1199 223C1380 184 1493 182 1600 199V260H0Z" fill="#b9dfce"/>
      <g fill="#75b7a3"><path d="M1437 151v71h7v-71z"/><path d="m1440 65-18 38h10l-22 33h14l-25 35h83l-25-35h14l-22-33h10z"/></g>
      <g fill="#549d89"><path d="M1500 136v82h8v-82z"/><path d="m1504 38-20 43h11l-25 38h15l-29 39h96l-29-39h15l-25-38h11z"/></g>
      <g fill="#a1cdbd"><path d="M113 209v27h4v-27z"/><path d="m115 154-12 25h7l-15 23h9l-17 24h57l-17-24h9l-15-23h6z"/></g>
    </svg>
  </section>
  ${renderControls(h)}`;
}
