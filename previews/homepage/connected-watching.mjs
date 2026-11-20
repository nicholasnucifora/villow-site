import {applyRoomForYourDay} from './room-for-your-day.mjs';

export function applyConnectedWatching(source) {
  let page = applyRoomForYourDay(source)
    .replace('class="version-f version-e ', 'class="version-g version-f version-e ')
    .replace('</head>', '<link rel="stylesheet" href="connected-watching.css"></head>');
  const start = page.indexOf('<section class="rf-boundaries"');
  const insights = page.indexOf('<section class="rf-insights"', start);
  const end = page.indexOf('</section>', insights);
  if (start < 0 || insights < 0 || end < 0) throw new Error('Missing F sections');
  const section = `<section class="gw-limits" id="room-for-your-day" aria-labelledby="gw-limit-title">
    <div><h2 id="gw-limit-title">Make room for<br>the rest of your day.</h2><p>Choose a daily viewing limit, with flexibility for different days.</p></div>
    <div class="gw-limit-visual" aria-label="A daily viewing limit of one hour"><span>Daily viewing limit</span><strong>1 hour</strong></div>
  </section>
  <section class="gw-reflection" aria-labelledby="gw-reflection-title">
    <div class="gw-copy"><h2 id="gw-reflection-title">Learn from what<br>you watch.</h2><p>If you choose to rate videos, you can see what felt worthwhile over time. Your viewing and ratings can also help Villow suggest changes to your feed. What you do is up to you.</p></div>
    <div class="gw-composition">
      <div class="gw-rating"><div class="gw-rating-copy"><span>AFTER A VIDEO</span><strong>Was this video worth your time?</strong><p>Rate it if you like.</p></div><div class="gw-answers" aria-label="Rating choices: worth it or not worth it"><span><b aria-hidden="true">✓</b> Worth it</span><span><b aria-hidden="true">×</b> Not worth it</span></div></div>
      <div class="gw-feedback"><div class="gw-feedback-heading">Over time, see what works for you</div><div class="gw-feedback-content">
        <div class="gw-suggestion"><span class="gw-kicker">A SUGGESTION</span><strong>Change your recommendation topics</strong><p>Adjust what reaches your feed.</p><div class="gw-actions" aria-label="Suggestion choices: edit topics or dismiss"><span>Edit topics</span><span>Dismiss</span></div></div>
        <figure class="gw-chart"><figcaption>Videos you found worthwhile</figcaption><div class="gw-plot" role="img" aria-label="Illustrative trend of the percentage of rated videos found worth watching over time"><span>100%</span><svg viewBox="0 0 180 82" preserveAspectRatio="none" aria-hidden="true"><path class="gw-chart-grid" d="M0 1H180 M0 40H180 M0 80H180"/><path class="gw-chart-area" d="M0 54 C18 56 25 63 42 57 S63 36 80 40 S101 54 116 47 S137 24 153 28 S170 23 180 20 V80 H0Z"/><path class="gw-chart-line" d="M0 54 C18 56 25 63 42 57 S63 36 80 40 S101 54 116 47 S137 24 153 28 S170 23 180 20"/></svg><span>0%</span></div><div class="gw-chart-time"><span>Earlier</span><span>Recently</span></div><p>Of videos rated worth it or not worth it.</p></figure>
      </div></div>
    </div>
  </section>`;
  return page.slice(0, start) + section + page.slice(end + '</section>'.length);
}
