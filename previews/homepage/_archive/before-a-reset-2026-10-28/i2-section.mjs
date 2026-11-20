const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';

export function renderI2(libraryMarkup) {
  return `<div class="i2-editorial" data-i-controls aria-labelledby="i2-title">
  <header class="i2-intro">
    <span class="i2-kicker">A LITTLE MORE SAY</span>
    <h2 id="i2-title">Your YouTube.<br>A little more yours.</h2>
    <p>Decide what reaches your feed, how much time you give it, and what you keep for later.</p>
  </header>
  <div class="i2-rows">
    <article class="i2-row">
      <div class="i2-row-copy"><span class="i2-row-label">01 <span>YOUR FEED</span></span><h3>Choose what<br> gets in.</h3><p>Choose your channels, filter their uploads by title or length, and set the maximum size of your feed.</p></div>
      <div class="i2-feed-detail">
        <p class="i2-detail-label">Choices inside Villow</p>
        <ul><li>${check}<span>Channels you choose</span></li><li>${check}<span>Title and length filters</span></li><li>${check}<span>A feed size you set</span></li></ul>
        <p class="i2-feed-end">A feed with a place to stop.</p>
      </div>
    </article>
    <article class="i2-row i2-boundary-row">
      <div class="i2-row-copy"><span class="i2-row-label">02 <span>YOUR BOUNDARIES</span></span><h3>Leave room<br> for the rest.</h3><p>Choose a daily limit that fits your day. Schedules and breaks give you more ways to shape your watching.</p></div>
      <div class="i2-limit-detail">
        <p class="i2-detail-label">Try an example daily limit</p>
        <output data-i-limit-output aria-live="polite">30<span>minutes a day</span></output>
        <div class="i2-limit-buttons" role="group" aria-label="Choose an illustrative daily limit"><button type="button" data-i-limit="15" aria-pressed="false">15 min</button><button type="button" data-i-limit="30" aria-pressed="true">30 min</button><button type="button" data-i-limit="60" aria-pressed="false">60 min</button></div>
      </div>
    </article>
    <article class="i2-row i2-time-row">
      <div class="i2-row-copy"><span class="i2-row-label">03 <span>YOUR TIME</span></span><h3>Notice.<br> Choose. Adjust.</h3><p>See your viewing patterns alongside your limits. Optional reflection adds what felt worthwhile to you.</p></div>
      <figure class="i2-time-detail"><div class="i2-chart" tabindex="0" role="region" aria-label="Villow daily use chart; scroll horizontally to inspect the product detail"><img src="assets/c-usage-chart.webp" width="1745" height="610" alt="Villow’s daily use chart with watching time and the viewer’s chosen limits, using sample data" loading="lazy"></div><figcaption><span>Inside Villow · sample data</span><a href="assets/c-usage-chart.webp" target="_blank" rel="noopener">View detail <span aria-hidden="true">↗</span></a></figcaption></figure>
    </article>
  </div>
</div>${libraryMarkup}`;
}
