import {applyViewingStory} from './viewing-story.mjs';

export function applyCalmerInsight(source) {
  let page = applyViewingStory(source)
    .replace('class="version-h version-g ', 'class="version-i-story version-h version-g ')
    .replace('</head>', '<link rel="stylesheet" href="calmer-insight.css"></head>');
  const start = page.indexOf('<section class="vh-story"');
  const end = page.indexOf('</section>', start);
  if (start < 0 || end < 0) throw new Error('Missing H insight section');
  const section = `<section class="ci-story" id="room-for-your-day" aria-labelledby="ci-title">
    <div class="ci-copy"><h2 id="ci-title">Learn from what<br>you watch.</h2><p>Rate videos if you like to see what you found worthwhile over time. Your viewing can also help Villow suggest changes to your feed. You choose what to do.</p></div>
    <div class="ci-visual" role="img" aria-label="A suggestion for Alex’s Studio: only show new videos that are 5 to 30 minutes long. Nine of ten watched videos were in that range. The choices are use these lengths or dismiss.">
      <div class="ci-source"><span class="ci-avatar" aria-hidden="true">A</span><strong>Alex’s Studio</strong></div>
      <h3>Only show new videos from this channel that are 5–30 minutes long</h3>
      <p>9 of 10 videos you watched were this length.</p>
      <div class="ci-actions" aria-hidden="true"><span>Use these lengths</span><span>Dismiss</span></div>
    </div>
  </section>`;
  return page.slice(0, start) + section + page.slice(end + '</section>'.length);
}
