import {readFile, writeFile} from 'node:fs/promises';
import {studyNavigation, localizePreviewLinks} from './study-navigation.mjs';
import {refineRSocialPopularity} from './r-social-popularity.mjs';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';
import {yourControlSection} from './r-your-control.mjs';

// R starts from the accepted saved Q; Q and earlier artwork/layout stay intact.
let page = await readFile(new URL('./q.html', import.meta.url), 'utf8');
const replaceOnce = (from, to) => {
  if (!page.includes(from)) throw new Error(`Missing R source: ${from.slice(0, 80)}`);
  page = page.replace(from, to);
};
replaceOnce('class="version-q-story ', 'class="version-r-motion version-q-story ');
replaceOnce('<title>Villow · Homepage Q</title>', '<title>Villow · Homepage R</title>');
replaceOnce('href="q.html" aria-label="Villow home"', 'href="r.html" aria-label="Villow home"');
replaceOnce('Villow · Homepage Q &nbsp;', 'Villow · Homepage R &nbsp;');
page = page.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/, studyNavigation('r'));
// A single R motion layer replaces the inherited comparison reveal, avoiding
// overlapping opacity/transforms. The existing tab and feed controls stay intact.
replaceOnce('<script type="module" src="x-life.js"></script>', '');
replaceOnce('</head>', '<link rel="stylesheet" href="r-gentle-motion.css"><link rel="stylesheet" href="r-social-popularity.css"><script type="module" src="r-gentle-motion.js"></script></head>');
replaceOnce('</head>', '<link rel="stylesheet" href="r-your-control.css"><script type="module" src="r-your-control.js"></script></head>');
replaceOnce('<section class="it-section it-l"', `${yourControlSection}<section class="it-section it-l"`);

const start = page.indexOf('<div class="ics-postcard">');
const end = page.indexOf('<div class="ics-person ics-you">', start);
if (start < 0 || end < 0) throw new Error('Missing R sharing illustration');
let card = page.slice(start, end);
card = card.replace('loading="lazy">', 'loading="lazy"><span class="r-video-duration" aria-label="4 minutes 12 seconds">4:12</span>');
card = card.replace('assets/q-video-rest-v1.webp', 'assets/r-video-comedy-v2.webp')
  .replace('A simple illustration of someone relaxing on a sofa', 'Someone dancing in a homemade cardboard robot costume');
page = page.slice(0, start) + card + page.slice(end);
replaceOnce('assets/q-video-dog-v1.webp', 'assets/r-video-dog-v1.webp');
replaceOnce('<div class="p-video-playback" aria-hidden="true"><span class="p-playback-pause">Ⅱ</span><span>0:24 <span class="p-playback-duration">/ 2:10</span></span><span class="p-playback-track"><i></i></span></div>', '<span class="r-watch-state" aria-hidden="true"><i></i><i></i></span><span class="r-watch-runtime" aria-hidden="true">2:10</span>');
// Use the same simple scene in both halves, with clearer separation from the
// comparison surfaces. Earlier presets keep their original lake asset.
page = page.replaceAll('assets/p-video-lake.svg', 'assets/r-video-lake.svg');
page = refineRSocialPopularity(page);
await writeFile(new URL('./r.html', import.meta.url), applyFooterSpidey(localizePreviewLinks(page)));
console.log('Rendered R: Gentle motion.');
