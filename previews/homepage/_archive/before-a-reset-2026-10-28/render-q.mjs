import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {studyNavigation} from './study-navigation.mjs';
import {addHomepageClosing} from './homepage-closing.mjs';
import {renderPInsights} from './p-insights.mjs';
import {renderQInsights} from './q-insights.mjs';
import {renderPTogether} from './p-together.mjs';
import {renderQTogether} from './q-together.mjs';
const path=new URL('./p.html',import.meta.url),baseline=await readFile(path,'utf8');
let next=baseline;
for(const [previous,replacement] of [[renderPInsights(),renderQInsights()],[renderPTogether(),renderQTogether()]]){
 if(next.split(previous).length!==2)throw new Error('Expected one existing component.');
 next=next.replace(previous,replacement);
}
next=next.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('q'));
next=next.replaceAll('Villow · P · Patterns and company','Villow · Q · Smooth patterns and shared reflection');
next=next.replace('class="version-i version-p"','class="version-i version-q"');
next=next.replace('href="p.html" aria-label="Villow home"','href="q.html" aria-label="Villow home"');
for(const name of ['insights','together']){
 next=next.replace(`href="p-${name}.css"`,`href="q-${name}.css"`);
 next=next.replace(`src="p-${name}.js"`,`src="q-${name}.js"`);
}
const hero=html=>html.slice(html.indexOf('<main id="main">'),html.indexOf('<section class="i-following"'));
const section=(html,start)=>{const index=html.indexOf(start);if(index<0)throw new Error('Missing preservation boundary');return html.slice(index,html.indexOf('</section>',index)+10);};
for(const start of ['<section class="ics-company"','<section class="ifs-section','<section class="no-row oo-limit-row"'])if(section(next,start)!==section(baseline,start))throw new Error(`Unexpected section change: ${start}`);
if(hero(next)!==hero(baseline))throw new Error('Cloud cinema changed unexpectedly.');
if((next.match(/data-ifs-demo/g)||[]).length!==1)throw new Error('Expected one feed demonstration.');
next=addHomepageClosing(next,{previous:'q-before-closing.html'});
await writeFile(new URL('./q.html',import.meta.url),next);
if(await readFile(path,'utf8')!==baseline)throw new Error('P baseline changed.');
console.log(`Rendered Q: http://127.0.0.1:4399/q.html#o-viewing\nP preserved: ${createHash('sha256').update(baseline).digest('hex')}`);

