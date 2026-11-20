import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../a-source.html',import.meta.url),baseline=await readFile(file,'utf8');
const start=baseline.indexOf('<div class="xl-working '),end=baseline.indexOf('<div class="xl-concepts ',start);
if(start<0||end<0)throw new Error('Working examples not found');
const block=baseline.slice(start,end);
const visual=(kind)=>{const begin=block.indexOf(`<div class="xl-${kind}-visual"`),finish=block.indexOf('<h3>',begin);if(begin<0||finish<0)throw new Error('Missing visual '+kind);return block.slice(begin,finish);};
const streak=visual('streak'),tasks=visual('task');
const fire='<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M18 2c2 8-4 9-3 15 2-1 4-4 5-7 7 7 7 12 4 17-4 6-15 5-18-1C2 18 8 13 11 9c0 5 1 7 3 8-2-6 5-10 4-15Z"/></svg>';
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const star='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="m16 3 4 8 9 1-6.5 6.3L24 28l-8-4.5L8 28l1.5-9.7L3 12l9-1Z"/></svg>';
const cell=(side,id,title,art,copy)=>`<article class="xl-compare-cell xl-cell-${side}"><span class="xl-side-label">${side==='villow'?'With Villow':'A familiar pattern'}</span><h3 id="${id}">${title}</h3><div class="xl-compare-art">${art}</div><p>${copy}</p></article>`;
const returnVisual=`<div class="xl-return-visual" role="img" aria-label="A daily return streak, with the next day waiting for activity"><div class="xl-return-title">${fire}<span>Daily streak</span></div><div class="xl-return-week" aria-hidden="true">${['M','T','W','T','F','S','S'].map((day,i)=>`<span${i===6?' class="xl-return-next"':''}><small>${day}</small><i>${i===6?'': '<b></b>'}</i></span>`).join('')}</div><p>Keep it going</p></div>`;
const nextVisual=`<div class="xl-next-visual" role="img" aria-label="One related video leads to the next"><div class="xl-next-strip">${['c-thumb-mountain.webp','c-thumb-pasta.webp','i-thumb-rain.webp'].map((asset,i)=>`<div class="xl-next-thumb"><img src="assets/${asset}" width="536" height="300" alt="" loading="lazy"><span aria-hidden="true">▶</span></div>${i<2?`<span class="xl-next-arrow">${arrow}</span>`:''}`).join('')}</div><span>Up next. And next.</span></div>`;
const scoreVisual=`<div class="xl-score-visual" role="img" aria-label="An activity score grows with more sending and posting"><div class="xl-score-title">${star}<span>Activity score</span><span class="xl-score-plus">+</span></div><div class="xl-score-growth" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><span>${arrow}</span></div><p>Send · Post · Repeat</p></div>`;
const supportVisual=`<div class="xl-support-visual" role="img" aria-label="Optional support with friends through shared usage, streaks and limits"><div class="xl-support-people" aria-hidden="true"><i class="xl-support-person"></i><i class="xl-support-person"></i><i class="xl-support-person"></i></div><span class="xl-support-caption">Shared limits &amp; streaks</span><span class="xl-optional">Only if you choose</span></div>`;
const rows=`<div class="xl-comparisons" data-xl-comparisons>
<section class="xl-compare-row xl-reveal" data-xl-reveal aria-labelledby="xl-streak-benefit">${cell('pattern','xl-return-pattern','Come back every day.',returnVisual,'Daily activity keeps a return streak going. Time away can mean starting over.')}${cell('villow','xl-streak-benefit','Days without raising limits.',streak,'Count days without raising your limits—even when you don’t use Villow. Lowering a limit keeps your streak.')}</section>
<section class="xl-compare-row xl-reveal" data-xl-reveal aria-labelledby="xl-plans-benefit">${cell('pattern','xl-next-pattern','Another video waiting.',nextVisual,'Recommendations and autoplay make it easy to continue into another video.')}${cell('villow','xl-plans-benefit','Your own plans, close by.',tasks,'Keep things you want to do within reach—including a walk, music or rest. Choose what comes after watching.')}</section>
<section class="xl-compare-row xl-reveal" data-xl-reveal aria-labelledby="xl-support-benefit">${cell('pattern','xl-score-pattern','More activity. Higher scores.',scoreVisual,'Activity scores grow with the things you send or post. The number rewards doing more.')}${cell('villow','xl-support-benefit','Support for your boundaries.',supportVisual,'Choose whether to share usage or streaks with friends, and join shared limits when that support feels useful.')}</section>
</div>`;
let html=baseline.slice(0,start)+rows+baseline.slice(end);
html=html.replace('Rethinking what a platform encourages: room to step away, take part and stay informed.','Familiar patterns can reward more activity. Villow puts the focus on your own boundaries, plans and optional support from friends.');
const unchangedPrefix=s=>s.slice(0,s.indexOf('<section class="x-life"'));
const unchangedSuffix=s=>s.slice(s.indexOf('<div class="xl-concepts '));
if(unchangedPrefix(html)!==unchangedPrefix(baseline)||unchangedSuffix(html)!==unchangedSuffix(baseline))throw new Error('Out-of-scope content changed');
if((html.match(/class="xl-compare-row /g)||[]).length!==3)throw new Error('Expected three comparison rows');
await writeFile(file,html);
console.log('Updated A with three paired design-pattern comparisons. Other content preserved.');
