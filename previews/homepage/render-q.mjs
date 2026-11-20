import {readFile, writeFile} from 'node:fs/promises';
import {studyNavigation} from './study-navigation.mjs';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';

// Q is a separate refinement of the saved P; do not regenerate or restyle P.
let page = await readFile(new URL('./p.html', import.meta.url), 'utf8');
const replaceOnce = (from, to) => {
  if (!page.includes(from)) throw new Error(`Missing Q source: ${from.slice(0, 80)}`);
  page = page.replace(from, to);
};
replaceOnce('class="version-p-story ', 'class="version-q-story version-p-story ');
replaceOnce('<title>Villow · Homepage P</title>', '<title>Villow · Homepage Q</title>');
replaceOnce('href="p.html" aria-label="Villow home"', 'href="q.html" aria-label="Villow home"');
replaceOnce('Villow · Homepage P &nbsp;', 'Villow · Homepage Q &nbsp;');
page = page.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/, studyNavigation('q'));
replaceOnce('</head>', '<link rel="stylesheet" href="q-calmer-details.css"></head>');

// Make choosing the daily boundary part of the feed's opening, not a footnote.
replaceOnce('<p>Bring channels you choose, saved videos and discoveries into one feed. Watch what interests you, save for later, or leave the rest.</p><p class="vh-feed-limit">Choose a daily viewing limit that works for you.</p>', '<p class="vh-feed-limit q-feed-intro">Choose your channels and a daily viewing limit that works for you. Your feed brings together their videos, saved videos and discoveries.</p>');

// One channel header, then a readable question and evidence across the card.
replaceOnce('Only show new videos from this channel that are 5–30 minutes long', 'Only show new 5–30 minute videos from this channel?');
replaceOnce('You often watch videos in this range and skip videos outside it.', 'You often watch this range and skip videos outside it.');
replaceOnce('data-m-suggestion-action="apply"', 'data-q-suggestion-choice="lengths"');
replaceOnce('data-m-suggestion-action="dismiss"', 'data-q-suggestion-choice="dismiss"');
// The homepage example keeps its hover/focus states without consuming a choice.
const completeStart = page.indexOf('<div class="m-suggestion-complete"');
const completeEnd = page.indexOf('</div>', completeStart);
if (completeStart < 0 || completeEnd < 0) throw new Error('Missing suggestion completion state');
page = page.slice(0, completeStart) + page.slice(completeEnd + '</div>'.length);

// Reuse the same people across both social illustrations, retaining the postcard.
const shareStart = page.indexOf('<figure class="ics-scene"');
const shareEnd = page.indexOf('</figure>', shareStart);
if (shareStart < 0 || shareEnd < 0) throw new Error('Missing sharing illustration');
let share = page.slice(shareStart, shareEnd);
const portrait = '<span class="ics-portrait" aria-hidden="true"><span class="ics-head"></span><span class="ics-body"></span></span>';
share = share.replace(portrait, '<span class="n-person n-person-alex q-share-portrait" aria-hidden="true"></span>')
  .replace(portrait, '<span class="n-person n-person-you q-share-portrait" aria-hidden="true"></span>')
  .replace('<span class="ics-person-label">A friend</span>', '<span class="ics-person-label">Alex</span>')
  .replace('A friend shares a comedy video', 'Alex shares a comedy video')
  .replace(/<div class="ics-video-copy">[\s\S]*?<\/div>/, '')
  .replace('assets/i-thumb-rest.webp', 'assets/q-video-rest-v1.webp');
page = page.slice(0, shareStart) + share + page.slice(shareEnd);

// Keep the chat beside the video, with larger participants and readable dialogue.
replaceOnce('<small>Watching together</small>', '<small>Watching in sync</small>');
replaceOnce('<div class="o-chat-message"><span class="n-person n-person-alex"></span><div>', '<div class="o-chat-message"><div>');
replaceOnce('assets/p-video-dog-v2.svg', 'assets/q-video-dog-v1.webp');

// The footer already explains the project; the final invitation has one job.
replaceOnce('<div class="fs-mission"><p>Villow is a Fix the Web project. Use it and share feedback to help explore what better online experiences could look like.</p><a class="hc-movement" href="https://fixtheweb.org" target="_blank" rel="noopener">Explore Fix the Web</a></div>', '');

// The topic selector and paired labels explain the comparison without a second
// reading column. Keep the introduction centred with the choices beneath it.
replaceOnce('<p>Across social and video apps, small design choices shape what we do next. Here are four familiar patterns, and how Villow approaches them.</p>', '');
replaceOnce('<span>Then close the tab.</span>', '<span>Then get back to your day.</span>');

await writeFile(new URL('./q.html', import.meta.url), applyFooterSpidey(page));
console.log('Rendered Q: Calmer details.');
