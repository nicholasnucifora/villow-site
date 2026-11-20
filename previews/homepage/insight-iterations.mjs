import {applyViewingStory} from './viewing-story.mjs';

const chart = `<figure class="it-chart"><figcaption>Videos rated worthwhile</figcaption><div class="it-plot" role="img" aria-label="Illustrative percentage of videos rated worth it, among videos rated worth it or not worth it, over time."><span>100%</span><svg viewBox="0 0 240 86" preserveAspectRatio="none" aria-hidden="true"><path class="it-grid" d="M0 1H240 M0 43H240 M0 85H240"/><path class="it-area" d="M0 58 C22 57 35 66 54 60 S80 39 98 44 S126 57 145 49 S172 27 190 31 S219 24 240 19 V85 H0Z"/><path class="it-line" d="M0 58 C22 57 35 66 54 60 S80 39 98 44 S126 57 145 49 S172 27 190 31 S219 24 240 19"/></svg><span>0%</span></div><div class="it-time"><span>Earlier</span><span>Recently</span></div><p>Worth-it share of worth-it and not-worth-it ratings.</p></figure>`;
const chartL = chart
  .replace('<span>100%</span>', '<span class="it-y-top">100%</span><span class="it-y-mid">50%</span>')
  .replace('<div class="it-time"><span>Earlier</span><span>Recently</span></div><p>Worth-it share of worth-it and not-worth-it ratings.</p>', '<div class="it-time" role="img" aria-label="Time progresses from earlier on the left to later on the right"><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M21 8H3m6-5L3 8l6 5"/></svg><span>Time</span><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M3 8h18m-6-5 6 5-6 5"/></svg></div>');
const suggestion = `<div class="it-suggestion"><div class="it-source"><span class="it-avatar" aria-hidden="true">A</span><strong>Alex’s Studio</strong></div><h3>Only show new videos from this channel that are 5–30 minutes long</h3><p>9 of 10 videos you watched were this length.</p><div class="it-actions" aria-label="Suggestion choices: use these lengths or dismiss"><span>Use these lengths</span><span>Dismiss</span></div></div>`;
const intro = `<div class="it-intro"><h2 id="it-title">Learn from what<br>you watch.</h2><p>Optional ratings help you see what felt worthwhile. Your viewing can also inform suggestions, and you decide what to change.</p></div>`;
const variants = {
  j: `<section class="it-section it-j" id="room-for-your-day" aria-labelledby="it-title">${intro}<div class="it-j-content"><div class="it-j-ratings"><div class="it-j-label">FROM YOUR OPTIONAL RATINGS</div>${chart}</div><div class="it-j-suggest"><div class="it-j-label">A SUGGESTION FROM YOUR VIEWING</div>${suggestion}</div></div></section>`,
  k: `<section class="it-section it-k" id="room-for-your-day" aria-labelledby="it-title"><div class="it-k-left">${intro}<div class="it-k-graph"><div class="it-k-label">FROM YOUR OPTIONAL RATINGS</div>${chart}</div></div><div class="it-k-suggestion"><div class="it-k-label">A SUGGESTION FROM YOUR VIEWING</div>${suggestion}</div></section>`,
  l: `<section class="it-section it-l" id="room-for-your-day" aria-labelledby="it-title"><header class="it-l-header"><h2 id="it-title">Learn from what you watch.</h2><p>Optional ratings show what felt worthwhile over time. Your viewing can also inform suggestions; you choose what to change.</p></header><div class="it-l-columns"><div class="it-l-ratings"><div class="it-l-label">FROM YOUR OPTIONAL RATINGS</div>${chartL}</div><div class="it-l-suggest"><div class="it-l-label">A SUGGESTION FROM YOUR VIEWING</div>${suggestion}</div></div></section>`,
};
export function applyInsightIteration(source, key) {
  if (!variants[key]) throw new Error('Unknown insight iteration');
  let page = applyViewingStory(source).replace('class="version-h version-g ', `class="version-${key}-insight version-h version-g `).replace('</head>', '<link rel="stylesheet" href="insight-iterations.css"></head>');
  if (key === 'l') page = page
    .replace('src="everyday-accordion.js"', 'src="l-comparison.js"')
    .replace('</head>', '<link rel="stylesheet" href="l-social-flow.css"><link rel="stylesheet" href="l-refinements.css"><link rel="stylesheet" href="l-comparison.css"></head>')
    .replace('What if the platforms<br>did this too?', 'Ideas for the platforms themselves.')
    .replace('Some ideas go beyond what an independent app can build. YouTube’s infrastructure could make them practical at a wider scale, with lessons for other social platforms.', 'Villow puts some ideas into practice. These concepts explore changes to YouTube and social platforms themselves; they aren’t Villow features.')
    .replace('<span>Explore the design concepts</span><span class="eb-link-arrow" aria-hidden="true">→</span>', '<span>Explore the design concepts</span>')
    .replace('Villow is a working experiment in how YouTube could be designed differently. Your feedback can help improve it.', 'Villow is a Fix the Web project. Use it and share feedback to help explore what better online experiences could look like.')
    .replace('Help fix the web <span class="eb-link-arrow" aria-hidden="true">↗</span>', 'Explore Fix the Web');
  const start = page.indexOf('<section class="vh-story"');
  const end = page.indexOf('</section>', start);
  if (start < 0 || end < 0) throw new Error('Missing H insight section');
  return page.slice(0, start) + variants[key] + page.slice(end + '</section>'.length);
}
