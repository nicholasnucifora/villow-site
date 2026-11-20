import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {previewPageURL} from '../preview-pages.js';
import {secondaryStudyRoutes} from '../study-navigation.mjs';

const baseline = JSON.parse(await readFile(new URL('hosting-d-baseline.json',import.meta.url)));
for (const [file,hash] of Object.entries(baseline)) {
 let content = await readFile(new URL('../'+file,import.meta.url));
 if (file.endsWith('.html')) content = content.toString().match(/<main[\s\S]*?<\/main>/)[0];
 assert.equal(createHash('sha256').update(content).digest('hex'),hash,file+': C preserved');
}
const file='setup-hosting-d.html';
const html=await readFile(new URL('../'+file,import.meta.url),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(ids.length,new Set(ids).size,'Unique anchor IDs');
assert.ok(!/<details[^>]*\sopen(?:\s|=|>)/.test(html),'Answers start collapsed');
assert.ok(secondaryStudyRoutes.includes(file));
assert.ok(!secondaryStudyRoutes.includes('setup-hosting-troubleshooting-d.html'),'Separate help page retired');
assert.ok(!html.includes('setup-hosting-troubleshooting-d.html'),'No links leave for a separate help page');
for (const [,href] of html.matchAll(/href="([^"]+)"/g)) {
 const url=new URL(href,'http://127.0.0.1:4411/'+file);
 if (url.pathname==='/'+file && url.hash) assert.ok(ids.includes(url.hash.slice(1)),'Working answer link '+href);
}
const cards=[...html.matchAll(/<article class="hd-service">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
assert.equal(cards.length,3);
for(const [index,target] of ['videos-not-updating','wont-open','supabase-limits'].entries()){
 assert.ok(cards[index].includes('href="#'+target+'"'),'Service links to its local answer');
 assert.ok(html.includes('<details class="hd-disclosure" id="'+target+'"'),'Target opens as an answer');
}
assert.equal((html.match(/class="hd-faq-group"/g)||[]).length,4,'FAQs grouped by provider and Villow');
for(const target of ['wont-open','cant-sign-in','videos-not-updating','friends-cant-join','something-else']){
 assert.ok(ids.includes(target),'Old troubleshooting fragments retained: '+target);
}
assert.equal(previewPageURL('setup-hosting'),'http://127.0.0.1:4411/setup-hosting-d.html');
console.log('Hosting D: preserved C, inline help links, grouped FAQs, legacy anchors and collapsed defaults passed.');
