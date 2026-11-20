import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {studyNavigation} from './study-navigation.mjs';
import {addHomepageClosing} from './homepage-closing.mjs';
import {renderOInsights} from './o-insights.mjs';
import {renderPInsights} from './p-insights.mjs';
import {renderOTogether} from './o-together.mjs';
import {renderPTogether} from './p-together.mjs';

const path=new URL('./o.html',import.meta.url);
const baseline=await readFile(path,'utf8');
let next=baseline;
for(const [previous,replacement] of [[renderOInsights(),renderPInsights()],[renderOTogether(),renderPTogether()]]){
 if(next.split(previous).length!==2)throw new Error('Expected exactly one existing component.');
 next=next.replace(previous,replacement);
}
next=next.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('p'));
next=next.replaceAll('Villow · O · A little clearer','Villow · P · Patterns and company');
next=next.replace('class="version-i version-o"','class="version-i version-p"');
next=next.replace('href="o.html" aria-label="Villow home"','href="p.html" aria-label="Villow home"');
next=next.replace('href="o-insights.css"','href="p-insights.css"').replace('href="o-together.css"','href="p-together.css"');
next=next.replace('src="o-insights.js"','src="p-insights.js"');
next=next.replace('</head>','<script type="module" src="p-together.js"></script></head>');
const hero=html=>html.slice(html.indexOf('<main id="main">'),html.indexOf('<section class="i-following"'));
const section=(html,start)=>{const index=html.indexOf(start);if(index<0)throw new Error('Missing preservation boundary');return html.slice(index,html.indexOf('</section>',index)+10);};
for(const start of ['<section class="ics-company"','<section class="ifs-section','<section class="no-row oo-limit-row"']){
 if(section(next,start)!==section(baseline,start))throw new Error(`Unexpected section change: ${start}`);
}
if(hero(next)!==hero(baseline))throw new Error('Cloud cinema changed unexpectedly.');
if((next.match(/data-ifs-demo/g)||[]).length!==1)throw new Error('Expected exactly one card stack.');
next=addHomepageClosing(next,{previous:'p-before-closing.html'});
await writeFile(new URL('./p.html',import.meta.url),next);
if(await readFile(path,'utf8')!==baseline)throw new Error('O baseline changed.');
console.log(`Rendered P: http://127.0.0.1:4399/p.html#o-viewing\nO preserved: ${createHash('sha256').update(baseline).digest('hex')}`);

