const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

export function renderIControls() {
  return `<div class="i-controls" id="i-controls" data-i-controls aria-labelledby="i-controls-title">
  <div class="i-controls-heading">
    <span class="i-controls-kicker">A LITTLE MORE SAY</span>
    <h2 id="i-controls-title">Your time. Your choices.</h2>
    <p>Choose how watching fits into your day.</p>
  </div>
  <div class="i-controls-explorer">
    <div class="i-controls-tabs" role="tablist" aria-label="Explore Villow’s controls">
      <button type="button" role="tab" id="i-control-tab-feed" aria-controls="i-control-panel-feed" aria-selected="false" tabindex="-1" data-i-control-tab="feed">Your feed</button>
      <button type="button" role="tab" id="i-control-tab-boundaries" aria-controls="i-control-panel-boundaries" aria-selected="false" tabindex="-1" data-i-control-tab="boundaries">Your boundaries</button>
      <button type="button" role="tab" id="i-control-tab-time" aria-controls="i-control-panel-time" aria-selected="true" tabindex="0" data-i-control-tab="time">Your time</button>
    </div>
    <div class="i-controls-panel" role="tabpanel" id="i-control-panel-feed" aria-labelledby="i-control-tab-feed" tabindex="0" data-i-control-panel="feed" hidden>
      <div class="i-controls-copy">
        <h3>Choose what<br> gets in.</h3>
        <p>Pick your channels, filter their uploads by title or length, and choose daily or scheduled delivery.</p>
      </div>
      <div class="i-feed-choices">
        <p class="i-controls-note">Choices you have in Villow</p>
        <ul>
          <li><span>${check}</span><p>Channels you choose</p></li>
          <li><span>${check}</span><p>Title and length filters</p></li>
          <li><span>${check}</span><p>Daily or scheduled delivery</p></li>
        </ul>
        <p class="i-feed-stop">And a place to stop.</p>
      </div>
    </div>
    <div class="i-controls-panel" role="tabpanel" id="i-control-panel-boundaries" aria-labelledby="i-control-tab-boundaries" tabindex="0" data-i-control-panel="boundaries" hidden>
      <div class="i-controls-copy">
        <h3>Leave room<br> for later.</h3>
        <p>Choose a daily limit that fits your day. Schedules and breaks give you more ways to shape your watching.</p>
        <div class="i-limit-choices" role="group" aria-label="Choose an illustrative daily limit">
          <span>Try an example daily limit</span>
          <div>
            <button type="button" data-i-limit="15" aria-pressed="false">15 min</button>
            <button type="button" data-i-limit="30" aria-pressed="true">30 min</button>
            <button type="button" data-i-limit="60" aria-pressed="false">60 min</button>
          </div>
        </div>
      </div>
      <div class="i-boundary-detail">
        <span class="i-boundary-icon">${clock}</span>
        <span class="i-controls-note">YOUR EXAMPLE LIMIT</span>
        <output data-i-limit-output aria-live="polite">30<span>minutes a day</span></output>
        <p>A boundary chosen by you.</p>
      </div>
    </div>
    <div class="i-controls-panel" role="tabpanel" id="i-control-panel-time" aria-labelledby="i-control-tab-time" tabindex="0" data-i-control-panel="time">
      <div class="i-controls-copy">
        <h3>Notice.<br> Choose. Adjust.</h3>
        <p>See your viewing patterns alongside your chosen limits. After watching, optional reflection adds what felt worthwhile to you.</p>
      </div>
      <figure class="i-time-detail">
        <div class="i-time-chart" tabindex="0" role="region" aria-label="Villow daily use chart; scroll horizontally to inspect the product detail">
          <img src="assets/c-usage-chart.webp" width="1745" height="610" alt="Villow’s daily use chart with watching time and the viewer’s chosen limits, using sample data" loading="lazy">
        </div>
        <figcaption><span>Inside Villow · sample data</span><a href="assets/c-usage-chart.webp" target="_blank" rel="noopener">View detail <span aria-hidden="true">↗</span></a></figcaption>
      </figure>
    </div>
  </div>
</div>`;
}

