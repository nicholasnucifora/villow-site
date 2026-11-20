const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>';

export function renderI3(libraryMarkup) {
  return `<div class="i3-focus" data-i-controls aria-labelledby="i3-heading">
    <header class="i3-heading">
      <div><span class="i3-kicker">A LITTLE MORE SAY</span><h2 id="i3-heading">Make it<br>your kind of watching.</h2></div>
      <p>The videos are familiar.<br> The choices around them are yours.</p>
    </header>
    <div class="i3-workbench">
      <div class="i3-tabs" role="tablist" aria-label="Explore your choices" aria-orientation="vertical">
        <button type="button" role="tab" id="i3-tab-feed" aria-controls="i3-panel-feed" aria-selected="false" tabindex="-1" data-i-control-tab="feed"><span class="i3-tab-number">01</span><span><strong>Your feed</strong><small>Choose what gets in.</small></span>${arrow}</button>
        <button type="button" role="tab" id="i3-tab-boundaries" aria-controls="i3-panel-boundaries" aria-selected="false" tabindex="-1" data-i-control-tab="boundaries"><span class="i3-tab-number">02</span><span><strong>Your boundaries</strong><small>Leave room for later.</small></span>${arrow}</button>
        <button type="button" role="tab" id="i3-tab-time" aria-controls="i3-panel-time" aria-selected="true" tabindex="0" data-i-control-tab="time"><span class="i3-tab-number">03</span><span><strong>Your time</strong><small>Notice what feels worthwhile.</small></span>${arrow}</button>
      </div>
      <div class="i3-detail">
        <div class="i3-panel" role="tabpanel" id="i3-panel-feed" aria-labelledby="i3-tab-feed" tabindex="0" data-i-control-panel="feed" hidden>
          <span class="i3-detail-label">WHAT ARRIVES</span>
          <h3>A feed with<br>a little more intention.</h3>
          <p>Pick your channels, filter their uploads by title or length, and choose the maximum size of your feed.</p>
          <dl class="i3-feed-list">
            <div><dt>Channels</dt><dd>The ones you choose.</dd></div>
            <div><dt>Uploads</dt><dd>Title and length filters.</dd></div>
            <div><dt>Feed size</dt><dd>A limit you set.</dd></div>
          </dl>
        </div>
        <div class="i3-panel" role="tabpanel" id="i3-panel-boundaries" aria-labelledby="i3-tab-boundaries" tabindex="0" data-i-control-panel="boundaries" hidden>
          <span class="i3-detail-label">HOW WATCHING FITS</span>
          <h3>Room for the rest<br>of your day.</h3>
          <p>Choose a daily limit that fits your day. Schedules and breaks give you more ways to shape your watching.</p>
          <div class="i3-limit-example">
            <div class="i3-limit-choices" role="group" aria-label="Choose an example daily limit"><span>Try an example daily limit</span><div><button type="button" data-i-limit="15" aria-pressed="false">15 min</button><button type="button" data-i-limit="30" aria-pressed="true">30 min</button><button type="button" data-i-limit="60" aria-pressed="false">60 min</button></div></div>
            <output data-i-limit-output aria-live="polite">30<span>minutes a day</span></output>
          </div>
        </div>
        <div class="i3-panel" role="tabpanel" id="i3-panel-time" aria-labelledby="i3-tab-time" tabindex="0" data-i-control-panel="time">
          <span class="i3-detail-label">WHAT YOU NOTICE</span>
          <h3>See the pattern.<br>Choose what changes.</h3>
          <p>See your viewing patterns alongside your chosen limits. Optional reflection adds what felt worthwhile to you.</p>
          <figure class="i3-usage"><div class="i3-chart" role="region" tabindex="0" aria-label="Villow daily use chart; scroll horizontally to inspect the detail"><img src="assets/c-usage-chart.webp" width="1745" height="610" alt="Villow’s daily use chart showing time spent and chosen limits, with sample data" loading="lazy"></div><figcaption><span>Inside Villow · sample data</span><a href="assets/c-usage-chart.webp" target="_blank" rel="noopener">View detail ↗</a></figcaption></figure>
        </div>
      </div>
    </div>
  </div>
  <div class="i3-kept">${libraryMarkup}</div>`;
}
