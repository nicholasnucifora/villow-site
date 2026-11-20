import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {studyNavigation} from './study-navigation.mjs';
import {renderQInsights} from './q-insights.mjs';
import {renderRInsights} from './r-insights.mjs';
import {renderQTogether} from './q-together.mjs';
import {renderRTogether} from './r-together.mjs';
const path=new URL('./q.html',import.meta.url),baseline=await readFile(path,'utf8');
let next=baseline;
for(const [previous,replacement] of [[renderQInsights(),renderRInsights()],[renderQTogether(),renderRTogether()]]){
 if(next.split(previous).length!==2)throw new Error('Expected one existing component.');
 next=next.replace(previous,replacement);
}
next=next.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('r'));
next=next.replaceAll('Villow · Q · Smooth patterns and shared reflection','Villow · R · Patterns and shared moments');
next=next.replace('class="version-i version-q"','class="version-i version-r"');
next=next.replace('href="q.html" aria-label="Villow home"','href="r.html" aria-label="Villow home"');
for(const name of ['insights','together']){
 next=next.replace(`href="q-${name}.css"`,`href="r-${name}.css"`);
 next=next.replace(`src="q-${name}.js"`,`src="r-${name}.js"`);
}
next=next.replace('</head>','<link rel="stylesheet" href="r-social.css"></head>');
next=next.replace('<section class="ics-company"','</div><div class="r-social-band"><div class="i-width"><section class="ics-company"');
const together=renderRTogether();
next=next.replace(together,`${together}</div></div><div class="i-width">`);
next=next.replace(/<!-- closing-comparison:start -->[\s\S]*?<!-- closing-comparison:end -->/,'<!-- closing-comparison:start --><a class="hc-comparison" href="q.html#good-company">Compare previous version · Q</a><!-- closing-comparison:end -->');
const hero=html=>html.slice(html.indexOf('<main id="main">'),html.indexOf('<section class="i-following"'));
const section=(html,start)=>{const index=html.indexOf(start);if(index<0)throw new Error('Missing preservation boundary');return html.slice(index,html.indexOf('</section>',index)+10);};
for(const start of ['<section class="ics-company"','<section class="ifs-section','<section class="no-row oo-limit-row"','<section class="hc-closing"'])if(section(next,start)!==section(baseline,start))throw new Error(`Unexpected section change: ${start}`);
if(hero(next)!==hero(baseline))throw new Error('Cloud cinema changed unexpectedly.');
if((next.match(/data-ifs-demo/g)||[]).length!==1)throw new Error('Expected one feed demonstration.');
await writeFile(new URL('./r.html',import.meta.url),next);
if(await readFile(path,'utf8')!==baseline)throw new Error('Q baseline changed.');
console.log(`Rendered R: http://127.0.0.1:4399/r.html#good-company\nQ preserved: ${createHash('sha256').update(baseline).digest('hex')}`);
