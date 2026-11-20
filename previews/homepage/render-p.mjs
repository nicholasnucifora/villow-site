import {readFile, writeFile} from 'node:fs/promises';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';

// A separate O-derived study; changes to earlier previews are limited to navigation.
let page = await readFile(new URL('./o.html', import.meta.url), 'utf8');
const stroke = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
// Drawings from disconnect/src/components/NavIcons.tsx and navIconArt.ts.
const home = stroke('<path d="M3 10.25L12 3l9 7.25V20a1 1 0 01-1 1h-5.5v-6h-5v6H4a1 1 0 01-1-1v-9.75z"/>');
const library = stroke('<path d="M4 6.5h16M4 12h5M4 17.5h4"/><circle cx="17" cy="16" r="5"/><path d="M14.75 16l1.5 1.5 3-3.25"/>');
const mobileLibrary = stroke('<path d="M4 6.5h16M4 12h16M4 17.5h10"/><path d="M17 15.5l2 1.5 3-3"/>');
const clock = stroke('<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>');
const filter = stroke('<path d="M4 6h16M7 12h10M10 18h4"/>');
const social = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z"/></svg>';

const patternStart = page.indexOf('<div class="xl-compare-art">', page.indexOf('id="xc-usage-pattern"'));
const patternEnd = page.indexOf('<p>Usage and limits are buried', patternStart);
if (patternStart < 0 || patternEnd < 0) throw new Error('Missing common-pattern usage illustration');
page = page.slice(0, patternStart) + '<div class="xl-compare-art"><img class="p-usage-path" src="assets/p-usage-balanced.webp" alt="Open your profile and go to Settings, where Digital wellbeing is tucked near the bottom of the menu." loading="lazy"></div>' + page.slice(patternEnd);

const appStart = page.indexOf('<div class="xl-compare-art">', page.indexOf('id="xc-usage-villow"'));
const appEnd = page.indexOf('<p>Usage and limits are part', appStart);
if (appStart < 0 || appEnd < 0) throw new Error('Missing Villow usage illustration');
const graphs = '<svg class="p-mini-line" viewBox="0 0 100 42" preserveAspectRatio="none" aria-hidden="true"><path class="p-mini-grid" d="M0 7H100M0 24H100M0 41H100"/><path class="p-mini-area" d="M0 28 12 22 23 25 35 15 47 21 59 14 70 18 82 10 92 17 100 13V42H0Z"/><path class="p-mini-trend" d="M0 28 12 22 23 25 35 15 47 21 59 14 70 18 82 10 92 17 100 13"/></svg><div class="p-mini-bars" aria-hidden="true"><i style="--h:62%"></i><i style="--h:90%"></i><i style="--h:48%"></i><i style="--h:70%"></i><i style="--h:40%"></i><i style="--h:55%"></i></div>';
const content = `<div class="p-mini-usage"><strong>App Usage</strong>${graphs}</div>`;
const mobileContent = `<div class="p-mini-usage p-mini-usage-mobile">${graphs}</div>`;
const menu = (icon,label,selected=false) => `<div class="rd-ui-menu${selected?' rd-ui-highlight':''}">${icon}<span>${label}</span></div>`;
const app = `<div class="xl-compare-art"><div class="rd-usage-villow p-usage-villow" role="img" aria-label="App Usage graphs, with Time Usage selected in Villow’s desktop sidebar and the central clock selected in mobile navigation."><div class="rd-ui-desktop" aria-hidden="true"><div class="rd-ui-side"><div class="rd-ui-brand">Villow</div>${menu(home,'Home Feed')}${menu(library,'Library')}${menu(clock,'Time Usage',true)}${menu(social,'Social')}</div><div class="rd-ui-desktop-content">${content}</div></div><div class="rd-ui-mobile" aria-hidden="true"><div class="rd-ui-mobile-top">App Usage</div>${mobileContent}<div class="rd-ui-bottom"><span>${home}</span><span>${mobileLibrary}</span><span class="rd-ui-highlight">${clock}</span><span>${filter}</span><span>${social}</span></div></div></div></div>`;
page = page.slice(0, appStart) + app + page.slice(appEnd);

const sharedVideo = /<figure class="o-watch-scene"[\s\S]*?<\/figure>/;
if (!sharedVideo.test(page)) throw new Error('Missing shared-watch illustration');
page = page.replace(sharedVideo, figure => figure
 .replace('assets/i-cinema-cat-clip.webp','assets/p-video-dog-v2.svg')
 .replace('That cat is so cosy','What’s the dog doing?')
 .replace('<span class="o-video-pause">Ⅱ</span><span class="o-video-progress"></span>','<div class="p-video-playback" aria-hidden="true"><span class="p-playback-pause">Ⅱ</span><span>0:24 <span class="p-playback-duration">/ 2:10</span></span><span class="p-playback-track"><i></i></span></div>'));
const besideStart = page.indexOf('id="xc-sidebar-pattern"');
const besideEnd = page.indexOf('data-xl-topic="usage"', besideStart);
if (besideStart < 0 || besideEnd < 0) throw new Error('Missing beside-video comparison');
page = page.slice(0, besideStart) + page.slice(besideStart, besideEnd)
 .replaceAll('assets/i-cinema-cat-clip.webp','assets/p-video-lake.svg')
 .replace('A playing cat video with suggested videos alongside it','A lake video with suggested videos alongside it') + page.slice(besideEnd);

page = page.replace('class="version-o-story ', 'class="version-p-story version-o-story ')
 .replace('<title>Villow · Homepage O</title>', '<title>Villow · Homepage P</title>')
 .replace('href="o.html" aria-label="Villow home"', 'href="p.html" aria-label="Villow home"')
 .replace('Villow · Homepage O &nbsp;', 'Villow · Homepage P &nbsp;')
 .replace('data-preview="o"','data-preview="p"')
 .replace('aria-label="Version O: Shared moments" aria-current="page"','aria-label="Version O: Shared moments"')
 .replace('aria-label="Version P: Steady rhythm"','aria-label="Version P: Steady rhythm" aria-current="page"')
 .replace('</head>','<link rel="stylesheet" href="p-steady-rhythm.css"></head>');
await writeFile(new URL('./p.html', import.meta.url), applyFooterSpidey(page));
console.log('Rendered P: Steady rhythm.');
