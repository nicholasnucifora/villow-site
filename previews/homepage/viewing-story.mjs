import {applyConnectedWatching} from './connected-watching.mjs';

export function applyViewingStory(source) {
  let page = applyConnectedWatching(source)
    .replace('class="version-g version-f ', 'class="version-h version-g version-f ')
    .replace('</head>', '<link rel="stylesheet" href="viewing-story.css"></head>');
  const feed = 'Bring channels you choose, saved videos and discoveries into one feed. Watch what interests you, save for later, or leave the rest.';
  if (!page.includes(feed)) throw new Error('Missing feed copy');
  page = page.replace(feed + '</p>', feed + '</p><p class="vh-feed-limit">Choose a daily viewing limit that works for you.</p>');
  const start = page.indexOf('<section class="gw-limits"');
  const reflection = page.indexOf('<section class="gw-reflection"', start);
  const end = page.indexOf('</section>', reflection);
  if (start < 0 || reflection < 0 || end < 0) throw new Error('Missing G sections');
  const section = `<section class="vh-story" id="room-for-your-day" aria-labelledby="vh-title">
    <div class="vh-copy"><h2 id="vh-title">Learn from what<br>you watch.</h2><p>Your viewing and optional ratings can help you see what felt worthwhile and consider changes to your feed. You decide what, if anything, to change.</p></div>
    <div class="vh-composition">
      <div class="vh-rating"><div><span>AFTER A VIDEO</span><strong>Was this video worth your time?</strong><p>Rate it if you like.</p></div><div class="vh-answers" aria-label="Rating choices: worth it or not worth it"><span>✓ &nbsp;Worth it</span><span>× &nbsp;Not worth it</span></div></div>
      <div class="vh-insights">
        <div class="vh-suggestion"><div class="vh-source"><span class="vh-avatar" aria-hidden="true">A</span><strong>Alex’s Studio</strong></div><h3>Only show new videos from this channel that run 5–30 minutes</h3><div class="vh-facts"><div><strong>9/10</strong><span>watched in this range</span></div><div><strong>18/20</strong><span>skipped outside it</span></div></div><div class="vh-actions" aria-label="Suggestion choices: use these lengths or dismiss"><span>Use these lengths</span><span>Dismiss</span></div></div>
        <figure class="vh-chart"><figcaption>Videos rated worthwhile</figcaption><div class="vh-plot" role="img" aria-label="Illustrative trend over time: percentage rated worth it among videos rated worth it or not worth it."><span>100%</span><svg viewBox="0 0 180 82" preserveAspectRatio="none" aria-hidden="true"><path class="vh-grid" d="M0 1H180 M0 40H180 M0 80H180"/><path class="vh-area" d="M0 54 C18 56 25 63 42 57 S63 36 80 40 S101 54 116 47 S137 24 153 28 S170 23 180 20 V80 H0Z"/><path class="vh-line" d="M0 54 C18 56 25 63 42 57 S63 36 80 40 S101 54 116 47 S137 24 153 28 S170 23 180 20"/></svg><span>0%</span></div><div class="vh-chart-time"><span>Earlier</span><span>Recently</span></div><p>Worth-it share of worth-it and not-worth-it ratings.</p></figure>
      </div>
    </div>
  </section>`;
  return page.slice(0, start) + section + page.slice(end + '</section>'.length);
}
