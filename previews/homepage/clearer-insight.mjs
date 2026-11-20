import {applyInsightIteration} from './insight-iterations.mjs';

function replaceComparisonGraphic(page, articleId, graphic) {
  const article = page.indexOf(`id="${articleId}"`);
  const start = page.indexOf('<div class="xl-compare-art">', article);
  if (article < 0 || start < 0) throw new Error(`Missing comparison art: ${articleId}`);
  const tags = /<div\b[^>]*>|<\/div>/g;
  tags.lastIndex = start;
  let depth = 0, end = -1;
  for (let match; (match = tags.exec(page));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) { end = tags.lastIndex; break; }
  }
  if (end < 0) throw new Error(`Unclosed comparison art: ${articleId}`);
  return page.slice(0, start) + `<div class="xl-compare-art">${graphic}</div>` + page.slice(end);
}


export function applyClearerInsight(source) {
  let page = applyInsightIteration(source, 'l')
    .replace('class="version-l-insight ', 'class="version-m-insight version-l-insight ')
    .replace('</head>', '<link rel="stylesheet" href="m-refinements.css"></head>')
    .replace('</body>', '<script src="m-insight-interactions.js" defer></script></body>');
  const changes = [
    ['Optional ratings show what felt worthwhile over time. Your viewing can also inform suggestions; you choose what to change.', 'After a video, you can say whether it was worth your time, if you like. See what you found worthwhile over time and consider suggestions based on your viewing.'],
    ['<figcaption>Videos rated worthwhile</figcaption>', '<figcaption>Worth-it share · worth / not-worth ratings</figcaption>'],
    ['9 of 10 videos you watched were this length.', 'You often watch videos in this range and skip videos outside it.'],
    ['<span class="it-avatar" aria-hidden="true">A</span>', '<span class="it-avatar m-alex-photo" aria-hidden="true"></span>'],
    ['<small>Time usage</small>', ''],
    ['A streak for keeping your boundaries. Keep or lower your limits to keep it growing—even on days you don’t watch.', 'Your streak counts days without raising your limits. Keep or lower them, and it grows—even on days away.'],
    ['Some apps reward coming back each day. Keeping the streak can become a reason to return.', 'Return streaks reward coming back each day, making it feel like you have to return—even when you want a break.'],
    ['Another video, one click away. Recommendations make it easy to carry on without pausing to decide if you want to.', 'Another video waits beside the one you’re watching, making it easy to keep going.'],
    ['An optional to-do sidebar keeps your own plans in sight, ready for when you decide to stop.', 'Beside the video, choose what helps you keep your day in mind, like an optional to-do list.'],
    ['Some social apps turn sending and posting into a score friends can see. Being active becomes something to display.', 'Likes and follower counts turn attention into status. Paid boosts make extra visibility something to buy.'],
    ['On some apps, usage controls sit inside settings, away from the watching experience.', 'On some apps, usage and limits are tucked away inside settings.'],
    ['Check usage and adjust limits from the main navigation—centre on mobile, sidebar on desktop. Tailor your feed, reminders and appearance to suit you.', 'Usage and limits are part of the experience, easy to check and adjust when you need them.'],
  ];
  for (const [before, after] of changes) {
    if (!page.includes(before)) throw new Error(`Missing L content: ${before}`);
    page = page.replace(before, after);
  }
  // A small illustrative series uses the same 30 decided-rating window as the app.
  // The app samples up to the latest 30 decided ratings, not 30 calendar days.
  // Give the illustration a daily history, calculated from a reproducible set of sample ratings.
  const ratings = [];
  const samples = [];
  let seed = 78123;
  for (let day = 0; day < 64; day++) {
    const count = 1 + (day % 3);
    for (let video = 0; video < count; video++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      ratings.push(seed / 4294967296 < 0.38 + day * 0.0042 ? 1 : 0);
    }
    if (day < 20) continue;
    const recent = ratings.slice(-30);
    const percent = Math.round(recent.reduce((sum, rating) => sum + rating, 0) / recent.length * 100);
    const date = new Date(Date.UTC(2026, 4, 1 + day));
    samples.push({ date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }), percent });
  }
  samples.forEach((point, index) => { point.x = +(index * 240 / (samples.length - 1)).toFixed(2); point.y = +(86 * (1 - point.percent / 100)).toFixed(2); });
  const line = samples.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');
  const chartStart = page.indexOf('<figure class="it-chart">');
  const chartEnd = page.indexOf('</figure>', chartStart);
  if (chartStart < 0 || chartEnd < 0) throw new Error('Missing M ratings chart');
  const chart = `<figure class="it-chart"><figcaption>Percentage of videos you found worthwhile</figcaption><div class="it-plot m-interactive-plot" tabindex="0" role="slider" aria-label="Worthwhile ratings over time" aria-describedby="m-chart-instructions" aria-valuemin="1" aria-valuemax="${samples.length}" aria-valuenow="1" aria-valuetext="${samples[0].date}: ${samples[0].percent} percent of the last 30 worth-it and not-worth-it ratings"><span class="it-y-top">100%</span><span class="it-y-mid">50%</span><span class="it-y-bottom">0%</span><svg viewBox="0 0 240 86" preserveAspectRatio="none" aria-hidden="true"><path class="it-grid" d="M0 1H240 M0 43H240 M0 85H240"/><path class="it-area" d="${line} L240 86 L0 86 Z"/><path class="it-line" d="${line}"/></svg><div class="m-chart-point" aria-hidden="true" hidden></div><div class="m-plot-detail" aria-hidden="true" hidden><strong data-m-chart-value></strong><small data-m-chart-date></small><span>Last 30 ratings: worth it or not</span></div></div><div class="it-time" role="img" aria-label="Time progresses from earlier on the left to later on the right"><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M21 8H3m6-5L3 8l6 5"/></svg><span>Time</span><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M3 8h18m-6-5 6 5-6 5"/></svg></div><p class="sr-only" id="m-chart-instructions">Illustrative values. Move over or tap the chart for details. Use the arrow keys, Home and End to explore. Each point is based on the latest 30 worth-it and not-worth-it ratings; not-sure and unrated videos are excluded.</p><script type="application/json" id="m-chart-data">${JSON.stringify(samples)}</script></figure>`;
  page = page.slice(0, chartStart) + chart + page.slice(chartEnd + '</figure>'.length);
  const originalActions = '<div class="it-actions" aria-label="Suggestion choices: use these lengths or dismiss"><span>Use these lengths</span><span>Dismiss</span></div>';
  const interactiveActions = '<div class="it-actions" aria-label="Suggestion choices"><button type="button" data-m-suggestion-action="apply">Use these lengths</button><button type="button" data-m-suggestion-action="dismiss">Dismiss</button></div>';
  if (!page.includes(originalActions)) throw new Error('Missing suggestion actions');
  page = page.replace(originalActions, interactiveActions);
  page = page.replace('</div></div></div></section><section class="w-devices"', '</div><div class="m-suggestion-complete" role="status" aria-live="polite" hidden><svg class="m-complete-art" viewBox="0 0 176 112" fill="none" aria-hidden="true"><defs><linearGradient id="m-complete-gradient" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7eb997"/><stop offset="1" stop-color="#3b7754"/></linearGradient></defs><ellipse cx="88" cy="98" rx="30" ry="4" fill="#dcebd8"/><g class="m-complete-float"><rect x="54" y="14" width="68" height="68" rx="22" fill="url(#m-complete-gradient)"/><path d="m74.5 49 9 9 19-20" stroke="#fffef9" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g><path d="M130 9Q131.26 14.74 137 16Q131.26 17.26 130 23Q128.74 17.26 123 16Q128.74 14.74 130 9Z" fill="#dfb45c"/><path d="M140 32Q140.72 35.28 144 36Q140.72 36.72 140 40Q139.28 36.72 136 36Q139.28 35.28 140 32Z" fill="#9ebca0"/><path d="M40 67Q40.9 71.1 45 72Q40.9 72.9 40 77Q39.1 72.9 35 72Q39.1 71.1 40 67Z" fill="#bfd9bd"/><circle cx="44" cy="26" r="2.5" fill="#bfd9bd"/></svg><h3>No adjustments to review</h3><p>New suggestions appear as you watch and rate videos.</p></div></div></div></section><section class="w-devices"');
  const conceptsStart = page.indexOf('<section class="rd-concepts"');
  const conceptsEnd = page.indexOf('</section>', conceptsStart);
  if (conceptsStart < 0 || conceptsEnd < 0) throw new Error('Missing concepts invitation');
  const concepts = `<section class="rd-concepts m-concepts" aria-labelledby="rd-concepts-heading"><div class="m-concepts-copy"><h3 id="rd-concepts-heading">Ideas beyond Villow.</h3><p>Some ideas need the platforms themselves to build them. See the designs we’d like to bring to life.</p></div><a class="rd-concepts-link" href="https://villow.app/roadmap#ideas">Explore the design concepts</a></section>`;
  page = page.slice(0, conceptsStart) + concepts + page.slice(conceptsEnd + '</section>'.length);
  const usageStart = page.indexOf('<div class="rd-usage-villow"');
  const usageEnd = page.indexOf('Usage and limits are part of the experience', usageStart);
  if (usageStart < 0 || usageEnd < 0) throw new Error('Missing Villow usage illustration');
  const usage = page.slice(usageStart, usageEnd).replaceAll('<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>', '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>');
  page = page.slice(0, usageStart) + usage + page.slice(usageEnd);
  const start = page.indexOf('<div class="rd-usage-pattern"');
  const end = page.indexOf('\n      <p>On some apps, usage and limits', start);
  if (start < 0 || end < 0) throw new Error('Missing usage illustration');
  const pattern = `<div class="m-settings-path" role="img" aria-label="From an app, open settings, then Account, then Digital wellbeing to find usage and limits."><div class="m-settings-app" aria-hidden="true"><div class="m-settings-app-top"><span>App</span><span class="m-settings-gear"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19 12a7 7 0 0 0-.1-1.1l1.5-1.2-1.6-2.8-1.8.6a7.7 7.7 0 0 0-1.9-1.1l-.3-1.9h-3.2l-.3 1.9a7.7 7.7 0 0 0-1.9 1.1l-1.8-.6-1.6 2.8 1.5 1.2a7 7 0 0 0 0 2.2l-1.5 1.2 1.6 2.8 1.8-.6a7.7 7.7 0 0 0 1.9 1.1l.3 1.9h3.2l.3-1.9a7.7 7.7 0 0 0 1.9-1.1l1.8.6 1.6-2.8-1.5-1.2c.1-.4.1-.7.1-1.1Z"/></svg></span></div><div class="m-settings-app-video"></div><i></i><i></i></div><span class="m-settings-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15m-5-5 5 5-5 5"/></svg></span><div class="m-settings-example" aria-hidden="true"><div class="m-settings-title">Settings</div><div class="m-settings-line">Notifications <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m7 4 6 6-6 6"/></svg></div><div class="m-settings-line m-settings-parent">Account <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m4 7 6 6 6-6"/></svg></div><div class="m-settings-child">Digital wellbeing <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m7 4 6 6-6 6"/></svg></div><div class="m-settings-subchild">Usage &amp; limits</div></div></div></div>`;
  page = page.slice(0, start) + pattern + page.slice(end);
  page = replaceComparisonGraphic(page, 'xc-streaks-pattern', `<figure class="m-streak-picture"><img src="assets/m-streak-return-clean.webp" alt="A phone showing a daily return streak." loading="lazy"><figcaption>Come back to keep your streak</figcaption></figure>`);
  page = replaceComparisonGraphic(page, 'xc-streaks-villow', `<figure class="m-streak-picture m-streak-picture-villow"><img src="assets/m-streak-boundaries-gold.webp" alt="A calendar with days keeping or lowering a limit." loading="lazy"><figcaption><strong>8 days without raising limits</strong></figcaption></figure>`);
  page = replaceComparisonGraphic(page, 'xc-social-pattern', `<div class="m-status-example" role="img" aria-label="An illustrative social profile showing likes, followers and a paid option to boost reach."><div class="m-status-profile"><span class="m-status-avatar" aria-hidden="true"></span><span><strong>Your profile</strong><small>Getting noticed</small></span></div><div class="m-status-metrics" aria-hidden="true"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 4.9a5.4 5.4 0 0 0-7.6 0L12 5.7l-.8-.8a5.4 5.4 0 0 0-7.6 7.6L12 21l8.4-8.5a5.4 5.4 0 0 0 0-7.6Z"/></svg><b>2.4k</b> likes</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20v-1a6.5 6.5 0 0 1 13 0v1"/></svg><b>860</b> followers</span></div><div class="m-status-boost" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-5 5 5-5 5 5"/></svg>Boost reach <span>Paid</span></div></div>`);
  page = replaceComparisonGraphic(page, 'xc-social-villow', `<div class="m-shared-chart" role="img" aria-label="Illustrative shared usage over completed fortnights: you start with higher usage, Alex joins partway through, and both lines trend downward over time. Sharing is optional."><div class="m-shared-title">Shared usage <span>Opt-in</span></div><div class="m-shared-legend"><span><i class="m-avatar-you" aria-hidden="true"></i>You</span><span><i class="m-avatar-alex" aria-hidden="true"></i>Alex</span></div><div class="m-shared-plot"><div class="m-shared-scale" aria-hidden="true"><span>More</span><span>Less</span></div><svg viewBox="0 0 270 75" preserveAspectRatio="none" aria-hidden="true"><path class="m-chart-grid" d="M0 5H270 M0 37H270 M0 70H270"/><path class="m-chart-join" d="M125 13V70"/><path class="m-chart-you" d="M0 12 C25 15 35 12 55 18 S92 24 112 25 S145 34 162 43 S190 49 205 52 S226 48 238 51 S257 54 270 50"/><path class="m-chart-alex" d="M125 36 C145 38 152 45 169 47 S191 55 205 53 S225 56 238 54 S257 49 270 53"/><circle class="m-join-point" cx="125" cy="36" r="3"/><text x="130" y="13" class="m-join-label">Alex joins</text></svg></div><div class="m-shared-axis">Over time</div></div>`);
  return page;
}
