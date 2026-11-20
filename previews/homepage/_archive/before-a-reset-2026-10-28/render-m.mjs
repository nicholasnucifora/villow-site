import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {studyNavigation} from './study-navigation.mjs';
import {renderLOverview} from './l-overview.mjs';
import {renderMOverview} from './m-overview.mjs';
import {renderIFeedSave} from './i-feed-save.mjs';

const baselinePath=new URL('./l.html',import.meta.url);
const baseline=await readFile(baselinePath,'utf8');
const oldOverview=renderLOverview(),oldFeed=renderIFeedSave();
for(const fragment of [oldOverview,oldFeed])if(baseline.split(fragment).length!==2)throw new Error('Expected exactly one baseline section. L was not changed.');
let next=baseline.replace(oldOverview,renderMOverview()).replace(oldFeed,'');
// Keep the empty data-i-feed-save hook: shared hero switching owns its visibility.
next=next.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('m'));
next=next.replace('<title>Villow · L · Product overview</title>','<title>Villow · M · Spacious overview</title>');
next=next.replace('class="version-i version-l"','class="version-i version-m"');
next=next.replace('href="l.html" aria-label="Villow home"','href="m.html" aria-label="Villow home"');
next=next.replace('href="l-overview.css"','href="m-overview.css"');
next=next.replace('<script type="module" src="l-overview.js"></script>','<script type="module" src="m-overview.js"></script><script type="module" src="m-feed.js"></script><script type="module" src="m-insights.js"></script>');
next=next.replace('<link rel="stylesheet" href="i-feed-save.css">','').replace('<script type="module" src="i-feed-save.js"></script>','');
next=next.replace('Villow · L · Product overview','Villow · M · Spacious overview');
const hero=html=>html.slice(html.indexOf('<main id="main">'),html.indexOf('<section class="i-following"'));
const social=html=>html.slice(html.indexOf('<section class="ics-company"'),html.indexOf('<footer class="i-preview-note'));
if(hero(next)!==hero(baseline))throw new Error('Cloud cinema content changed unexpectedly.');
if(social(next)!==social(baseline))throw new Error('Social content changed unexpectedly.');
if(next.includes('class="ifs-section"'))throw new Error('Duplicate large feed section still present.');
await writeFile(new URL('./m.html',import.meta.url),next);
if(await readFile(baselinePath,'utf8')!==baseline)throw new Error('L baseline changed unexpectedly.');
console.log(`Rendered M: http://127.0.0.1:4399/m.html#your-choices\nL baseline preserved: ${createHash('sha256').update(baseline).digest('hex')}`);
