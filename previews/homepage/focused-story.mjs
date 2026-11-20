import {applyComparisonOption} from './comparison-variants.mjs';

// Derive the shorter alternative without editing the accepted source or its demos.
function element(source, marker, tag = 'section') {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing focused-story source: ${marker}`);
  const tags = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'g');
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(source));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return source.slice(start, tags.lastIndex);
  }
  throw new Error(`Unclosed source element: ${marker}`);
}

export function applyFocusedStory(source) {
  let head = source.slice(0, source.indexOf('<main id="main">'));
  head = head
    .replace('version-a version-i', 'version-c version-a version-i')
    .replace('A little more say <span', 'See how it works <span')
    .replace('</head>', '<link rel="stylesheet" href="focused-story.css"><script type="module" src="focused-story.js"></script></head>');
  // These tours have no counterpart in this shorter version.
  for (const script of ['s-limits.js', 's-insights.js', 'r-together.js']) {
    head = head.replace(`<script type="module" src="${script}"></script>`, '');
  }

  const hero = element(source, '<section class="i-hero ')
    .replace('Watch<br><span>intentionally.</span>', 'YouTube, with<br><span>a stopping point.</span>')
    .replace('An app for watching YouTube with a feed that ends. Choose what reaches you, set your viewing boundaries, and reflect on what felt worthwhile.', 'Villow gives you a feed that ends, boundaries you choose, and space to reflect on what was worth watching.');

  const feed = element(source, '<section class="ifs-section wf-section"')
    .replace('Bring channels, saved videos and discoveries into a selection with an ending. Watch from your feed, save for later, or leave a video where it is.', 'Videos from channels you choose, saves and discoveries, brought into a selection with an end. Watch what interests you. Save something for later. Leave the rest.')
    .replace('You don’t have to watch or sort everything.', 'The feed ends. You don’t have to watch or sort everything to stop.');

  const allowance = element(source, '<div class="sl-daily"', 'div');
  const worth = element(source, '<div class="si-view" data-si-panel="worth"', 'div').replace(' hidden>', '>');
  const boundaries = `<section class="fs-boundaries" id="room-for-your-day" aria-labelledby="fs-boundaries-title">
    <header class="fs-section-intro"><h2 id="fs-boundaries-title">Make room for<br>the rest of your day.</h2><p>Set boundaries that work for you, and look back at what felt worthwhile—not just how long you watched.</p></header>
    <div class="fs-boundary-examples">
      <article class="fs-allowance"><h3>A little room for watching.</h3>${allowance}<p>Choose your limits and reminders. Keep a sense of how much time is left as you watch.</p></article>
      <article class="fs-reflection"><h3>Was it worth your time?</h3><div class="si-insights" data-fs-worth><figure class="si-figure"><div class="si-plot" tabindex="0" role="group" aria-label="Worthwhile chart: percentage of recent ratings marked worth watching" aria-describedby="fs-worth-instructions" data-fs-plot>${worth}<div class="si-tooltip" data-fs-tooltip hidden><span class="si-tooltip-label" data-fs-label></span><div><strong data-fs-value></strong><span class="si-tooltip-unit">worth watching</span></div></div></div><figcaption>Look back at what felt worthwhile over time.</figcaption></figure><p class="sr-only" id="fs-worth-instructions">Illustrative viewing history, based on the most recent thirty Worth it and Not worth it ratings. Unrated videos are excluded. Move across the chart, tap, or use Left and Right, Home and End to inspect. Escape closes the detail.</p><p class="sr-only" role="status" aria-live="polite" data-fs-status></p></div><p>Reflect when a video ends, if you choose. Entertainment, learning and rest can all be worthwhile.</p></article>
    </div><p class="fs-integrated">Your boundaries and optional reflections are part of the way you watch.</p>
  </section>`;

  const company = element(source, '<section class="ics-company"')
    .replace('Good videos.<br> Good company.', 'A good video, from<br>someone you know.')
    .replace('Pass along a video with a personal note. Watch something a friend thought you’d enjoy, in your own time.', 'Pass along a video with a personal note, and watch a friend’s pick in your own time. You can watch together, too—if you’d like.')
    .replace('</div>\n  <figure', '<p class="fs-social-note">A little company, whenever you want it.</p></div>\n  <figure');

  let philosophy = element(applyComparisonOption(source, 'b'), '<section class="x-life"');
  for (const topic of ['sidebar', 'social']) {
    philosophy = philosophy.replace(element(philosophy, `<section class="xl-compare-row xl-reveal" data-xl-reveal data-xc-selected="villow" data-xl-topic="${topic}"`), '');
  }
  philosophy = philosophy
    .replace('Designing for life<br>beyond the screen.', 'Designed for life<br>beyond the screen.')
    .replace('Some apps turn returning and staying longer into the goal. Villow rethinks those patterns around your time, plans and accountability.', 'Even a streak can encourage something different. Villow counts the days you keep your boundaries, including the days you don’t watch.')
    .replace('xc-streaks-pattern xc-sidebar-pattern xc-social-pattern', 'xc-streaks-pattern')
    .replace('xc-streaks-villow xc-sidebar-villow xc-social-villow', 'xc-streaks-villow');
  const concepts = element(philosophy, '<div class="xl-concepts ', 'div');
  philosophy = philosophy.replace(concepts, `<div class="fs-concepts"><p>These ideas could reach beyond Villow, to YouTube and other social platforms.</p><a class="xl-concepts-link" role="link" aria-disabled="true" tabindex="0">Explore the design concepts <span aria-hidden="true">↗</span></a></div>`);

  const practical = `<section class="fs-practical i-width" aria-labelledby="fs-practical-title"><h2 id="fs-practical-title">A few things before you begin.</h2><dl><div><dt>What is Villow?</dt><dd>An independent app built on YouTube’s videos and official player. It isn’t affiliated with YouTube or Google.</dd></div><div><dt>Where can I use it?</dt><dd>In a browser on your computer, phone or tablet. Add it to your mobile home screen for an app-like experience.</dd></div><div><dt>How do I get started?</dt><dd>Create a private Villow or join one run by someone you trust. Creating your own involves hosting and database setup; Windows Setup guides you through it.</dd></div></dl><a class="fs-setup-link" href="https://villow.app/download" target="_blank" rel="noopener">Explore setup and ways to begin <span aria-hidden="true">↗</span></a></section>`;
  const cta = source.match(/<a class="i-primary"[\s\S]*?<\/a>/)[0];
  const closing = `<section class="hc-closing w-closing fs-closing" id="help-shape-web" aria-labelledby="hc-title"><div class="hc-inner i-width"><h2 id="hc-title">Make watching<br><span>work for you.</span></h2><p class="fs-closing-lead">Enjoy what you watch. Leave room for what’s next.</p><div class="hc-actions">${cta}</div><div class="fs-mission"><p>Villow is a working experiment in designing around the people using it. Try it, share feedback if you choose, and help shape a better web.</p><a class="hc-movement" href="https://fixtheweb.org" target="_blank" rel="noopener">Help fix the web <span aria-hidden="true">↗</span></a></div></div></section>`;
  const footer = element(source, '<footer class="i-preview-note', 'footer');
  return `${head}<main id="main">${hero}<section class="i-following" id="your-choices" aria-label="A calmer way to watch YouTube"><div class="i-width">${feed}${boundaries}${company}</div></section>${philosophy}${practical}${closing}${footer}</main></body></html>`;
}
