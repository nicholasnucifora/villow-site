import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
import {watchingStoriesSection} from './w-watching-stories.mjs';
import {esc, feedIds, icons, videos} from './n-data.js';

// W refines the illustration and marker motion. Keep V's saved files intact.
const root = new URL('./',import.meta.url);
const source = await readFile(new URL('v.html',root),'utf8');
const stories = /<section class="v-watching"[\s\S]*?<\/section>/;
if(!stories.test(source))throw new Error('V watching stories missing.');
let page = source
  .replace('class="version-v-stories ', 'class="version-w-people version-v-stories ')
  .replaceAll('Villow · Homepage V','Villow · Homepage W')
  .replace('Good videos, good company.','Good videos, better company.')
  .replace('href="v.html" aria-label="Villow home"','href="w.html" aria-label="Villow home"')
  .replace('src="v-watching-stories.js"','src="w-watching-stories.js"')
  .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('w'))
  .replace('</head>','<link rel="stylesheet" href="w-illustrations.css"></head>')
  .replace(stories,watchingStoriesSection);

// Only W uses Home's thumbnail actions. The saved V feed supplies the stack
// container, completion state and mobile swipe cue.
function feedCard(id, depth) {
  const video = videos[id];
  const title = esc(video.title);
  const action = (name, label, icon) => `<button type="button" class="wf-thumbnail-action" data-ifs-action="${name}" data-ifs-id="${id}" aria-label="${label}: ${title}">${icon}</button>`;
  return `<article class="ifs-card ${depth ? 'ifs-back' : 'ifs-front'}" data-ifs-card="${id}" aria-label="${title}" style="--ifs-depth:${depth};--ifs-back-angle:${depth % 2 ? 4 : -5}deg;--ifs-front-angle:-2deg"${depth ? ' aria-hidden="true" inert' : ''}>
 <div class="ifs-card-image">
  <button class="wf-sample" type="button" aria-label="Preview ${title}"><img src="${video.image}" width="536" height="300" alt="" loading="lazy" draggable="false"></button>
  <span class="ifs-swipe-feedback" aria-hidden="true"></span>
  <div class="wf-thumbnail-actions">${action('save', 'Save to Watch Later', icons.clock)}${action('remove', 'Remove from your feed', icons.trash)}</div>
 </div>
 <div class="ifs-card-copy"><h4>${title}</h4><p>${esc(video.channel)}</p></div>
</article>`;
}
const feedStack = /(<div class="ifs-stack" data-ifs-stack[^>]*>)[\s\S]*?(<\/div><div class="ifs-complete wf-complete")/;
if (!feedStack.test(page)) throw new Error('V feed stack missing.');
page = page.replace(feedStack, (_, start, end) => start + feedIds.map(feedCard).reverse().join('') + end)
  .replace('data-wf-demo>', 'data-wf-demo data-thumbnail-feed>')
  .replace('Swipe or drag the top card. Buttons work too.', 'Swipe the top card left to remove it or right to save it.')
  .replace('</head>', '<link rel="stylesheet" href="w-thumbnail-feed.css"></head>');

// A fixed lower-body patch sits under the existing upper-body pose layers.
// Watching, turning and thinking therefore share the same corrected feet.
const base = /<img class="ig-cinema-base"[^>]*>/;
if(!base.test(page))throw new Error('Hero base missing.');
page = page.replace('<rect x=".05" y=".25" width=".27" height=".37" fill="white"', '<path d="M.05 .25H.32V.54H.25V.62H.05Z" fill="white"');
page = page.replace(base,match=>`${match}
   <svg class="ig-pose-masks" width="0" height="0" aria-hidden="true"><defs><filter id="w-feet-feather" x="-.1" y="-.1" width="1.2" height="1.2"><feGaussianBlur stdDeviation=".004"/></filter><mask id="w-feet-patch" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox"><rect x=".20" y=".54" width=".17" height=".29" fill="white" filter="url(#w-feet-feather)"/></mask></defs></svg>
   <img class="w-hero-feet" style="mask:url(#w-feet-patch)" src="assets/w-hero-feet-v1.webp" width="1774" height="887" alt="" aria-hidden="true" draggable="false">`);
await writeFile(new URL('w.html',root),applyPreviewHeader(localizePreviewLinks(page),{home:true}));
if(source!==await readFile(new URL('v.html',root),'utf8'))throw new Error('V changed unexpectedly.');
console.log('Rendered W: People, refined. V remains unchanged.');
