const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 12 4 4 8-9"/></svg>';
const videos = [
  { image: 'garden', title: 'A small herb garden for a sunny windowsill', channel: 'Small Garden' },
  { image: 'mountain', title: 'A slow walk through the mountains', channel: 'Long Way Home' },
  { image: 'pasta', title: 'The pasta I make when the fridge is almost empty', channel: 'The Weeknight Table' },
];

export function renderControls(h) {
  return `<section class="c-controls" id="your-controls" aria-labelledby="c-controls-title">
    <div class="c-controls-inner">
      <div class="c-controls-heading">
        <p class="c-controls-kicker">A LITTLE MORE SAY</p>
        <h2 id="c-controls-title">Your time. Your choices.</h2>
        <p>Keep the good part of YouTube. <br>Choose how much space it takes up.</p>
      </div>
      <div class="c-explorer" data-c-explorer>
        <div class="c-explorer-tabs" role="tablist" aria-label="Explore Villow’s controls">
          <button type="button" role="tab" id="c-tab-feed" aria-controls="c-panel-feed" aria-selected="true" tabindex="0" data-c-tab="feed"><span>01</span>Your feed</button>
          <button type="button" role="tab" id="c-tab-boundaries" aria-controls="c-panel-boundaries" aria-selected="false" tabindex="-1" data-c-tab="boundaries"><span>02</span>Your boundaries</button>
          <button type="button" role="tab" id="c-tab-time" aria-controls="c-panel-time" aria-selected="false" tabindex="-1" data-c-tab="time"><span>03</span>Your time</button>
        </div>
        <div class="c-explorer-panel" role="tabpanel" id="c-panel-feed" aria-labelledby="c-tab-feed" tabindex="0" data-c-panel="feed">
          <div class="c-explorer-copy">
            <span class="c-explorer-label">THE FINITE FEED</span>
            <h3>Catch up. <br>Then be done.</h3>
            <p>Pick your channels and set the size of your feed. When you’re caught up, you’ve reached the end.</p>
            <div class="c-explorer-choice" role="group" aria-label="Choose an example feed size"><span>Try a smaller feed</span><div><button type="button" data-feed-size="2" aria-pressed="false">2 videos</button><button type="button" data-feed-size="3" aria-pressed="true">3 videos</button></div></div>
          </div>
          <div class="c-feed-demo">
            <p class="c-demo-note"><span aria-hidden="true"></span>Interactive illustration · sample videos</p>
            <div class="c-demo-videos">${videos.map((video, index) => `<article class="c-demo-video" data-c-video="${index}"><img src="assets/c-thumb-${video.image}.webp" alt="" loading="lazy"><h4>${video.title}</h4><p>${video.channel}</p></article>`).join('')}</div>
            <div class="c-feed-finish"><span class="c-finish-check">${check}</span><div><p>The feed ends here.</p><span data-feed-status aria-live="polite">Three videos. Then, a little breathing room.</span></div></div>
          </div>
        </div>
        <div class="c-explorer-panel" role="tabpanel" id="c-panel-boundaries" aria-labelledby="c-tab-boundaries" tabindex="0" data-c-panel="boundaries" hidden>
          <div class="c-explorer-copy">
            <span class="c-explorer-label">BOUNDARIES YOU CHOOSE</span>
            <h3>Make a little <br>room for later.</h3>
            <p>Choose a daily limit that fits your day. Schedules and breaks give you more ways to shape your watching.</p>
            <div class="c-explorer-choice" role="group" aria-label="Choose an illustrative daily limit"><span>Try a daily limit</span><div><button type="button" data-limit="15" aria-pressed="false">15 min</button><button type="button" data-limit="30" aria-pressed="true">30 min</button><button type="button" data-limit="60" aria-pressed="false">60 min</button></div></div>
          </div>
          <div class="c-boundary-demo">
            <p class="c-demo-note"><span aria-hidden="true"></span>Interactive illustration</p>
            <div class="c-limit-dial" data-limit-dial style="--limit-turn:180deg"><div><output data-limit-output aria-live="polite">30<span>minutes</span></output><p>YOUR EXAMPLE LIMIT</p></div></div>
            <p class="c-limit-footnote">A boundary chosen by you.<br>A place to pick up tomorrow.</p>
          </div>
        </div>
        <div class="c-explorer-panel" role="tabpanel" id="c-panel-time" aria-labelledby="c-tab-time" tabindex="0" data-c-panel="time" hidden>
          <div class="c-explorer-copy">
            <span class="c-explorer-label">A MOMENT TO REFLECT</span>
            <h3>Notice. <br>Choose. Adjust.</h3>
            <p>See your viewing patterns, then decide what you’d like to change. Entertainment, learning and rest all count.</p>
            <a class="c-explorer-link" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${h.arrow || ''}</a>
          </div>
          <figure class="c-time-demo">
            <p class="c-demo-note"><span aria-hidden="true"></span>Inside Villow · sample data</p>
            <div class="c-chart-frame"><img src="assets/c-usage-chart.webp" alt="A crop of Villow’s daily-use chart showing viewing time alongside chosen limits" loading="lazy"></div>
            <figcaption><span>Daily use, in Villow.</span><span>A real product detail.</span></figcaption>
          </figure>
        </div>
        <div class="c-explorer-bottom"><span>YOUR CHANNELS. YOUR BOUNDARIES. YOUR CALL.</span><span>Explore the controls above <span aria-hidden="true">↖</span></span></div>
      </div>
    </div>
  </section>`;
}
