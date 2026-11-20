import {applyBalancedStory} from './balanced-story.mjs';

function section(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing section: ${marker}`);
  const tags = /<section\b[^>]*>|<\/section>/g;
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(source));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return source.slice(start, tags.lastIndex);
  }
  throw new Error(`Unclosed section: ${marker}`);
}

export function applyEverydayBalance(source) {
  let page = applyBalancedStory(source)
    .replace('class="version-d ', 'class="version-e version-d ')
    .replace('src="comparison-accordion.js"', 'src="everyday-accordion.js"')
    .replace('</head>', '<link rel="stylesheet" href="everyday-balance.css"><script type="module" src="everyday-balance.js"></script></head>');
  const boundaries = `<section class="eb-boundaries" id="room-for-your-day" aria-labelledby="eb-title">
    <div class="eb-intro"><span class="eb-eyebrow">YOUR TIME, YOUR CHOICE</span><h2 id="eb-title">A little more room<br>for your day.</h2><p>Choose your viewing limits. Reflect on what felt worthwhile, if you like.</p></div>
    <div class="eb-examples">
      <article class="eb-example"><div class="eb-example-copy"><h3>Set your boundaries</h3><p>Choose a daily limit that works for you.</p></div><div class="eb-interface eb-limit" aria-label="Example daily limit"><div class="eb-limit-row"><span>Daily watch limit</span><strong>1 hr</strong></div><button type="button" class="eb-add-day" aria-expanded="false" aria-controls="eb-day-example" data-eb-add-day><span aria-hidden="true">+</span> Add a limit for a day</button><div class="eb-day-example" id="eb-day-example" hidden><span>Sunday</span><strong>30 min</strong><span class="eb-example-hint">Example</span></div></div></article>
      <article class="eb-example"><div class="eb-example-copy"><span class="eb-number">02</span><h3>Reflect, if you choose</h3><p>Consider whether a video was worth your time.</p></div><div class="eb-interface eb-reflect" role="img" aria-label="Illustrative reflection with three choices: Worth watching, Not worth watching, or Not sure."><div class="eb-reflect-video"><img src="assets/c-thumb-garden.webp" alt=""><div><div class="eb-ui-title">Worth your time?</div><span>A video you watched</span></div></div><div class="eb-verdicts"><span>Worth watching</span><span>Not worth watching</span><span>Not sure</span></div></div></article>
    </div>
  </section>`;
  page = page.replace(section(page, '<section class="fs-boundaries"'), boundaries);
  page = page.replace('A good video, from<br>someone you know.', 'A good video, from someone you know.');
  page = page.replace('assets/r-shared-friends.webp', 'assets/e-shared-friends-looking-at-video.webp');
  page = page.replace('One experience.<br>Across your devices.', 'One experience. Across your devices.');
  page = page.replace(/<span class="ics-play"[\s\S]*?<\/span>/, '').replace(/<p class="ics-channel">[\s\S]*?<\/p>/, '');
  page = page.replace('<span class="rd-concepts-arrow" aria-hidden="true">↗</span>', '<span class="eb-link-arrow" aria-hidden="true">→</span>')
    .replace('<a class="rd-concepts-link" role="link" aria-disabled="true" tabindex="0" data-a-concepts-placeholder>', '<a class="rd-concepts-link" href="https://villow.app/roadmap#ideas">')
    .replace('Help fix the web <span aria-hidden="true">↗</span>', 'Help fix the web <span class="eb-link-arrow" aria-hidden="true">↗</span>');
  page = page.replace('Watch wherever<br>you are.', 'On the devices<br>you already use.');
  return page;
}
