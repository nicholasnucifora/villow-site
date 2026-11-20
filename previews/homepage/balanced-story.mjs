import {applyFocusedStory} from './focused-story.mjs';
import {applyComparisonOption} from './comparison-variants.mjs';
import {usageComparison} from './usage-comparison.mjs';

function section(source, marker, tag = 'section') {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing balanced-story source: ${marker}`);
  const tags = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'g');
  tags.lastIndex = start;
  let depth = 0;
  for (let match; (match = tags.exec(source));) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return source.slice(start, tags.lastIndex);
  }
  throw new Error(`Unclosed balanced-story source: ${marker}`);
}

// D builds on C's clear opening, with room for the product's distinctive pleasures.
export function applyBalancedStory(source) {
  let page = applyFocusedStory(source)
    .replace('class="version-c ', 'class="version-d version-c ')
    .replace('</head>', '<link rel="stylesheet" href="balanced-story.css"><script type="module" src="r-together.js"></script><script type="module" src="comparison-accordion.js"></script></head>');

  // Keep the explanation once; the illustrations carry the examples.
  page = page
    .replace('Videos from channels you choose, saves and discoveries, brought into a selection with an end. Watch what interests you. Save something for later. Leave the rest.', 'Bring channels you choose, saved videos and discoveries into one feed. Watch what interests you, save for later, or leave the rest.')
    .replace(/<p class="wf-note">[\s\S]*?<\/p>/, '')
    .replace('<p>Room for what’s next.</p>', '')
    .replace(/<div class="wf-confetti"[\s\S]*?<\/div><span class="wf-finish-icon"[\s\S]*?<\/span>/, '<span class="rd-finish-art" aria-hidden="true"><svg viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="42" fill="#e9f2e5"/><path d="M48 67V43M48 54C34 54 30 47 29 37c11 0 19 5 19 17ZM48 46c0-12 7-19 18-20 0 12-6 20-18 20Z" stroke="#548565" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M33 69h30" stroke="#9cbd9e" stroke-width="3" stroke-linecap="round"/></svg></span>')
    .replace('Set boundaries that work for you, and look back at what felt worthwhile—not just how long you watched.', 'Choose your viewing limits and reflect on what felt worthwhile.')
    .replace(/<p class="fs-integrated">[\s\S]*?<\/p>/, '')
    .replace('<figcaption>Look back at what felt worthwhile over time.</figcaption>', '')
    .replace('Reflect when a video ends, if you choose. Entertainment, learning and rest can all be worthwhile.', 'Rate a video when it ends, if you choose.');
  page = page.replace(section(page, '<article class="fs-allowance"', 'article'), `<article class="fs-allowance"><h3>Daily allowance</h3><div class="rd-allowance" role="img" aria-label="A 60-minute daily limit, with 30 minutes left."><div class="rd-allowance-values"><strong>30 <span>min left</span></strong><span class="rd-allowance-total">60 min limit</span></div><div class="rd-allowance-track" aria-hidden="true"><i></i></div></div></article>`);

  const devices = section(source, '<section class="w-devices"')
    .replace(/<p class="w-browser-note">[\s\S]*?<\/p>/, '');
  const company = section(page, '<section class="ics-company"');
  const quietCompany = company
    .replace('Pass along a video with a personal note, and watch a friend’s pick in your own time. You can watch together, too—if you’d like.', 'Pass along a video with a personal note, and watch a friend’s pick in your own time.')
    .replace(/<p class="fs-social-note">[\s\S]*?<\/p>/, '')
    .replace('<span class="ics-your-pace">At your pace.</span>', '');
  page = page.replace(company, devices);

  const together = `<div class="r-social-band rd-together-band"><div class="i-width">${quietCompany}${section(source, '<section class="rt-together"')
    .replace(/<span class="rt-kicker">[\s\S]*?<\/span>/, '')
    .replace('Invite friends, add to a shared queue and watch in sync. See how everyone felt about it afterwards.', 'Invite friends, add videos to a shared queue and watch in sync.')}</div></div>`;

  let philosophy = section(applyComparisonOption(source, 'b'), '<section class="x-life"');
  philosophy = philosophy
    .replace('Designing for life<br>beyond the screen.', 'Designed for life<br>beyond the screen.')
    .replace('Some apps turn returning and staying longer into the goal. Villow rethinks those patterns around your time, plans and accountability.', 'Across social and video apps, small design choices shape what we do next. Here are four familiar patterns, and how Villow approaches them.')
    .replace('Common social-app patterns</h3>', 'Common patterns across apps</h3>')
    .replace('<small>On other apps</small>', '<small>Across different apps</small>')
    .replace('Daily streaks can turn returning into a goal of its own. Miss a day, and the count is gone.', 'Some apps reward coming back each day. Keeping the streak can become a reason to return.')
    .replace('Some apps turn activity into a score for friends to see. More engagement becomes a way to show off.', 'Some social apps turn sending and posting into a score friends can see. Being active becomes something to display.');

  const socialComparison = section(philosophy, '<section class="xl-compare-row xl-reveal" data-xl-reveal data-xc-selected="villow" data-xl-topic="social"');
  philosophy = philosophy.replace(socialComparison, usageComparison + socialComparison)
    .replace('xc-streaks-pattern xc-sidebar-pattern xc-social-pattern', 'xc-streaks-pattern xc-sidebar-pattern xc-usage-pattern xc-social-pattern')
    .replace('xc-streaks-villow xc-sidebar-villow xc-social-villow', 'xc-streaks-villow xc-sidebar-villow xc-usage-villow xc-social-villow');

  for (const topic of ['streaks', 'sidebar', 'usage', 'social']) {
    const marker = `<section class="xl-compare-row xl-reveal" data-xl-reveal data-xc-selected="villow" data-xl-topic="${topic}"`;
    const row = section(philosophy, marker);
    let updated = row
      .replace(/(<h3 class="xl-pair-topic" id="[^"]+">)([^<]+)(<\/h3>)\s*(<div class="xl-pair">)/, `$1<span class="rd-topic-fallback">$2</span><button class="rd-topic-button" type="button" aria-expanded="false" aria-controls="rd-panel-${topic}"><span>$2</span><span class="rd-topic-icon" aria-hidden="true"></span></button>$3<div class="rd-panel" id="rd-panel-${topic}" data-rd-panel><div class="rd-panel-inner">$4`)
      .replace(/<\/div>\s*<\/section>$/, '</div></div></div></section>');
    for (const [side, label] of [['pattern', 'Common patterns across apps'], ['villow', 'Villow’s approach']]) {
      const marker = `<div class="xc-side-marker" id="xc-${topic}-${side}-label">`;
      const start = updated.indexOf(marker);
      if (start < 0) throw new Error(`Missing ${topic} ${side} label`);
      const end = updated.indexOf('</div>', start) + 6;
      updated = updated.slice(0, end) + `<div class="rd-inline-heading" aria-hidden="true">${label}</div>` + updated.slice(end);
    }
    if (updated === row || !updated.includes(`rd-panel-${topic}`)) throw new Error(`Could not create accordion for ${topic}`);
    philosophy = philosophy.replace(row, updated);
  }

  const concepts = section(philosophy, '<div class="xl-concepts ', 'div');
  const invitation = `<section class="rd-concepts" aria-labelledby="rd-concepts-heading"><div class="rd-concepts-intro"><h3 id="rd-concepts-heading">What if the platforms<br>did this too?</h3></div><div class="rd-concepts-copy"><p>Some ideas go beyond what an independent app can build. YouTube’s infrastructure could make them practical at a wider scale, with lessons for other social platforms.</p><a class="rd-concepts-link" role="link" aria-disabled="true" tabindex="0" data-a-concepts-placeholder><span>Explore the design concepts</span><span class="rd-concepts-arrow" aria-hidden="true">↗</span></a></div></section>`;
  philosophy = philosophy.replace(concepts, invitation);
  page = page.replace(section(page, '<section class="x-life"'), together + philosophy);
  page = page.replace(section(page, '<section class="fs-practical '), '');
  page = page
    .replace('Make watching<br><span>work for you.</span>', 'Try Villow.')
    .replace('Enjoy what you watch. Leave room for what’s next.', 'Watch YouTube with a feed that ends and limits you choose.')
    .replace('Villow is a working experiment in designing around the people using it. Try it, share feedback if you choose, and help shape a better web.', 'Villow is a working experiment in how YouTube could be designed differently. Your feedback can help improve it.');
  page = page.replace('<footer class="i-preview-note', '<p class="rd-attribution i-width">Villow uses YouTube’s videos and official player. An independent project, not affiliated with YouTube or Google.</p><footer class="i-preview-note');
  return page;
}
