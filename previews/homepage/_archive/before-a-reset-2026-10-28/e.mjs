const videos = {
  garden: { image:'garden', title:'A small herb garden for a sunny windowsill', channel:'Small Garden', width:535, height:292 },
  mountain: { image:'mountain', title:'A slow walk through the mountains', channel:'Long Way Home', width:536, height:300 },
  pasta: { image:'pasta', title:'The pasta I make when the fridge is almost empty', channel:'The Weeknight Table', width:536, height:292 },
};
const thumbnail = (video, eager = false) => `<img src="assets/c-thumb-${video.image}.webp" width="${video.width}" height="${video.height}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const feature = () => `<div class="e-featured">${thumbnail(videos.garden, true)}<div><h3>${videos.garden.title}</h3><p>${videos.garden.channel}</p></div></div>`;
const row = (video) => `<div class="e-feed-row">${thumbnail(video)}<div><h3>${video.title}</h3><p>${video.channel}</p></div><span class="e-row-menu" aria-hidden="true">⋮</span></div>`;
const search = '<span class="e-search" aria-hidden="true"><span>Search videos</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="5.5"/><path d="m14 14 5 5"/></svg></span>';

export function renderE(h) {
return `<section class="e-opening" aria-labelledby="e-title">
  <div class="e-opening-copy">
    <h1 id="e-title">Keep the videos.<br><span>Lose the rabbit holes.</span></h1>
    <div class="e-description-row"><p>Villow is an app for watching YouTube with a finite feed. <br>Choose your channels. Choose how much makes it in.</p><a class="e-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started <span>${h.arrow}</span></a></div>
  </div>
  <figure class="e-comparison" id="comparison" aria-labelledby="e-comparison-caption">
    <div class="e-comparison-grid">
      <div class="e-comparison-side e-before">
        <div class="e-side-heading"><span class="e-side-number" aria-hidden="true">01</span><h2>YouTube recommendations</h2></div>
        <div class="e-interface">
          <div class="e-interface-bar"><span class="e-youtube-name"><svg viewBox="0 0 28 20" aria-hidden="true"><rect x="0" y="0" width="28" height="20" rx="6" fill="#df4f45"/><path d="m11 5 8 5-8 5z" fill="white"/></svg><span>YouTube</span></span>${search}<span class="e-avatar" aria-hidden="true"></span></div>
          <div class="e-interface-content">
            <div class="e-topics" aria-hidden="true"><span class="e-topic-active">All</span><span>Gardening</span><span>Cooking</span><span>Outdoors</span></div>
            ${feature()}
            <div class="e-source-label">Recommended for you</div>
            <div class="e-recommendations">${[videos.mountain,videos.pasta].map(v=>`<div class="e-recommendation">${thumbnail(v)}<h3>${v.title}</h3><p>${v.channel}</p></div>`).join('')}</div>
            <div class="e-more"><span>More to explore</span><span class="e-more-lines" aria-hidden="true"><i></i><i></i><i></i></span>${h.down}</div>
          </div>
        </div>
        <p class="e-side-caption">A suggestion can lead to another.</p>
      </div>
      <div class="e-comparison-side e-after">
        <div class="e-side-heading"><img src="assets/villow-mark-small-on-light.svg" width="22" height="25" alt=""><h2>Your Villow feed</h2><span class="e-side-tag">YOUR CHOICES</span></div>
        <div class="e-interface">
          <div class="e-interface-bar"><span class="e-villow-name"><img src="assets/villow-mark-small-on-light.svg" width="21" height="24" alt=""><span>Villow</span></span>${search}<span class="e-avatar" aria-hidden="true"></span></div>
          <div class="e-interface-content">
            <div class="e-chosen"><span>${h.check} Channels you chose</span><span>Newest first</span></div>
            ${feature()}
            <div class="e-chosen-videos">${row(videos.mountain)}${row(videos.pasta)}</div>
            <div class="e-feed-end"><span class="e-end-icon">${h.check}</span><div><p>A feed with an end.</p><span>You set its size. Watch, save or skip.</span></div></div>
          </div>
        </div>
        <p class="e-side-caption">You decide what comes in—and where it ends.</p>
      </div>
    </div>
    <figcaption id="e-comparison-caption">Simplified interface illustrations using the same sample videos. The number shown is an example; you choose Villow’s feed size.</figcaption>
  </figure>
</section>`;
}
