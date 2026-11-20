import {readFile, writeFile} from 'node:fs/promises';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';

// O is derived from the saved previews, leaving both comparison pages untouched.
let page = await readFile(new URL('./n.html', import.meta.url), 'utf8');
const m = await readFile(new URL('./m.html', import.meta.url), 'utf8');
const company = m.match(/<figure class="ics-scene"[\s\S]*?<\/figure>/)?.[0];
const socialStart = page.indexOf('<section class="n-social"');
const devicesStart = page.indexOf('<section class="n-devices"', socialStart);
if (!company || socialStart < 0 || devicesStart < 0) throw new Error('Missing source social illustrations');

const together = `<figure class="o-watch-scene" role="img" aria-label="A shared video playing beside a group chat, with You and Alex watching together.">
  <div class="o-watch-window"><div class="o-player-side"><div class="o-video"><img src="assets/i-cinema-cat-clip.webp" alt=""><span class="o-video-pause">Ⅱ</span><span class="o-video-progress"></span></div></div>
  <div class="o-social-panel"><div class="o-panel-top"><span class="o-viewers" aria-hidden="true"><span class="n-person n-person-you"></span><span class="n-person n-person-alex"></span></span><span><strong>You and Alex</strong><small>Watching together</small></span></div><div class="o-chat"><strong>Group chat</strong><div class="o-chat-message"><span class="n-person n-person-alex"></span><div><b>Alex</b><p>That cat is so cosy</p></div></div></div></div></div>
</figure>`;
const social = `<section class="n-social o-social" aria-labelledby="n-social-heading"><div class="i-width n-social-inner"><header class="n-social-header"><h2 id="n-social-heading">Good videos, good company.</h2></header><div class="n-social-cards"><article class="n-social-card o-share-card" id="good-company">${company}<h3>A good video, from someone you know.</h3><p>Pass along a video with a personal note, and watch a friend’s pick in your own time.</p></article><article class="n-social-card o-together-card" id="watch-together">${together}<h3>Watch together, even from afar.</h3><p>Invite friends, add videos to a shared queue and watch in sync.</p></article></div>`;
page = page.slice(0, socialStart) + social + page.slice(devicesStart);
page = page.replace('class="version-n-story ', 'class="version-o-story version-n-story ')
  .replace('<title>Villow · Homepage N</title>', '<title>Villow · Homepage O</title>')
  .replace('href="n.html" aria-label="Villow home"', 'href="o.html" aria-label="Villow home"')
  .replace('Villow · Homepage N &nbsp;', 'Villow · Homepage O &nbsp;')
  .replace('data-preview="n"', 'data-preview="o"')
  .replace('aria-label="Version N: Compact story" aria-current="page"', 'aria-label="Version N: Compact story"')
  .replace('aria-label="Version O: Shared moments"', 'aria-label="Version O: Shared moments" aria-current="page"')
  .replace('</head>', '<link rel="stylesheet" href="o-shared-moments.css"></head>');
await writeFile(new URL('./o.html', import.meta.url), applyFooterSpidey(page));
console.log('Rendered O from the saved N and M previews.');
