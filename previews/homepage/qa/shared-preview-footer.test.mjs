import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import {applyPreviewFooter} from '../preview-footer.mjs';
import {setupComparisonB} from '../setup-comparison-b.mjs';
import {homeStudies} from '../preview-pages.js';
import {localizePreviewLinks,secondaryStudyRoutes} from '../study-navigation.mjs';
import {siteLinks} from '../site-links.mjs';

test('sharing the page footer preserves comparison cards and their action footers',()=>{
 const comparison=setupComparisonB();
 const body=`<main>${comparison}</main>`;
 const html=`${body}<footer class="sp-footer"><div class="sp-footer-bottom">Local preview</div><p class="sp-footer-disclaimer">Independent project.</p></footer>`;
 const result=applyPreviewFooter(html);
 assert.ok(result.startsWith(body),'The entire comparison remains unchanged');
 assert.equal((result.match(/shared-preview-footer/g)||[]).length,1);
 assert.match(result,/<div class="shared-footer-bottom">Local preview<\/div>/);
 assert.match(result,/<p class="shared-footer-disclaimer">Independent project\.<\/p>/);
 assert.equal(applyPreviewFooter(result),result,'Repeated sync preserves the cards and page footer');
 assert.equal(applyPreviewFooter(body),body,'Cards alone are never treated as a page footer');
});

test('every saved page has exactly one shared page footer with the right scope',async()=>{
 for(const file of ['index.html',...homeStudies.map(([key])=>`${key}.html`),...secondaryStudyRoutes]){
  const html=await readFile(new URL(`../${file}`,import.meta.url),'utf8');
  const footers=[...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/g)].map(match=>match[0]);
  const shared=footers.filter(footer=>/\bshared-preview-footer\b/.test(footer));
  assert.equal(shared.length,1,`${file} has one shared footer`);
  assert.match(shared[0],/^<footer class="(?:(?:n-footer|sp-footer) )?shared-preview-footer"/,`${file} targets the page footer`);
  assert.ok(shared[0].includes(`</p><a class="shared-footer-email" href="${siteLinks.contact}">${siteLinks.contact.slice(7)}</a>`),`${file} shows the contact email below the project description`);
  if(secondaryStudyRoutes.includes(file))assert.ok(html.indexOf(shared[0])>html.indexOf('</main>'),`${file} footer follows main content`);
  assert.equal(applyPreviewFooter(html),html,`${file} stays stable on sync`);
  if(file==='setup-b.html')assert.ok(html.includes(localizePreviewLinks(setupComparisonB())),'Saved setup keeps all three original cards and setup buttons');
 }
});
