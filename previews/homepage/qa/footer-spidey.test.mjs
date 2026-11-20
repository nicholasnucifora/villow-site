import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {applyFooterSpidey} from '../footer-spidey-markup.mjs';

test('project credit keeps a real accessible link and an inert fallback illustration',()=>{
 const html='<html><head></head><body><a class="n-footer-brand" href="https://fixtheweb.org"><img src="assets/fixtheweb-spider.svg" alt="" width="40" height="40"><span>A Fix the Web project</span></a></body></html>';
 const result=applyFooterSpidey(html);
 assert.match(result,/<a class="n-footer-brand" href="https:\/\/fixtheweb\.org">/);
 assert.match(result,/data-footer-spidey aria-hidden="true"/);
 assert.match(result,/class="footer-spidey-fallback" src="spidey\/base-spider\.svg" width="48" height="48" alt=""/);
 assert.match(result,/<span>A Fix the Web project<\/span><\/a>/);
 assert.doesNotMatch(result,/onclick=|role="button"|tabindex=/);
 assert.equal(applyFooterSpidey(result),result);
 assert.equal((result.match(/href="footer-spidey.css"/g)||[]).length,1);
 assert.equal((result.match(/src="footer-spidey.js"/g)||[]).length,1);
});

test('pages without the existing project badge are unchanged',()=>{
 const html='<html><head></head><body><a href="https://fixtheweb.org">Explore Fix the Web</a><img src="assets/fixtheweb-spider.svg"></body></html>';
 assert.equal(applyFooterSpidey(html),html);
});

test('every current saved footer keeps one enhancement, separate from the shared menu',async()=>{
 for(const name of ['n','o','p','q','r','setup-a','concepts-a','concepts-b']){
  const html=await readFile(new URL(`../${name}.html`,import.meta.url),'utf8');
  const footer=html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0]||'';
  assert.equal((footer.match(/data-footer-spidey/g)||[]).length,1,name);
  assert.equal((html.match(/src="footer-spidey.js"/g)||[]).length,1,name);
  assert.equal(applyFooterSpidey(html),html,name);
 }
 const m=await readFile(new URL('../m.html',import.meta.url),'utf8');
 assert.equal(applyFooterSpidey(m),m);
 assert.equal((m.match(/data-footer-spidey/g)||[]).length,2,'M now shares the selected header and footer spiders');
});
