import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,studies,localizePreviewLinks} from './study-navigation.mjs';
import {applyComparisonOption} from './comparison-variants.mjs';
import {applyFocusedStory} from './focused-story.mjs';
import {applyBalancedStory} from './balanced-story.mjs';
import {applyEverydayBalance} from './everyday-balance.mjs';
import {applyRoomForYourDay} from './room-for-your-day.mjs';
import {applyConnectedWatching} from './connected-watching.mjs';
import {applyViewingStory} from './viewing-story.mjs';
import {applyCalmerInsight} from './calmer-insight.mjs';
import {applyInsightIteration} from './insight-iterations.mjs';
import {applyClearerInsight} from './clearer-insight.mjs';
import {applyCompactStory} from './compact-story.mjs';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';
const template=await readFile(new URL('./a-source.html',import.meta.url),'utf8');
const navigation=/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/;
if(!navigation.test(template))throw new Error('Missing comparison navigation marker');
if(!template.includes('<title>Villow · Homepage A</title>'))throw new Error('Unexpected baseline title');
for(const [key] of studies){
  let page=key==='n'?applyCompactStory(template):key==='m'?applyClearerInsight(template):['j','k','l'].includes(key)?applyInsightIteration(template,key):key==='i'?applyCalmerInsight(template):key==='h'?applyViewingStory(template):key==='g'?applyConnectedWatching(template):key==='f'?applyRoomForYourDay(template):key==='e'?applyEverydayBalance(template):key==='d'?applyBalancedStory(template):key==='c'?applyFocusedStory(template):applyComparisonOption(template,key);
  page=page.replace('</head>','<link rel="stylesheet" href="compact-comparisons.css"><script type="module" src="compact-comparisons.js"></script><noscript><style>@media(max-width:600px){.xl-column-headings{display:none}.xl-pair{display:block}.xl-pair>.xl-compare-cell{opacity:1;visibility:visible;transform:none;pointer-events:auto}.xl-comparisons .xc-side-marker{display:block}.xc-reveal-footer,.xc-shared-control{display:none}}</style></noscript></head>');
  if(key!=='a')page=page
    .replace('<title>Villow · Homepage A</title>',`<title>Villow · Homepage ${key.toUpperCase()}</title>`)
    .replace('href="a.html" aria-label="Villow home"',`href="${key}.html" aria-label="Villow home"`)
    .replace('Villow · Homepage A</span>',`Villow · Homepage ${key.toUpperCase()}</span>`);
  const output=applyFooterSpidey(localizePreviewLinks(page.replace(navigation,studyNavigation(key))));
  if(/closing-comparison|data-i-view-choice|data-preview-variant/.test(output))throw new Error('Retired comparison controls found');
  await writeFile(new URL(`./${key}.html`,import.meta.url),output);
  if(key===studies[0][0])await writeFile(new URL('./index.html',import.meta.url),output);
}
console.log('Rendered B, C, D, E, F, G, H, I, J, K, L, M and N homepage previews.');

