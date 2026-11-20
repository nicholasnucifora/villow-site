import {readFile,writeFile} from 'node:fs/promises';
const file=new URL('../a-source.html',import.meta.url);
let html=await readFile(file,'utf8');
const start=html.indexOf('<div class="xl-proposals ');
const end=html.indexOf('</div></div></div></section><!-- homepage-closing:start -->',start);
if(start<0||end<0)throw new Error('Concept block boundaries not found');
const invitation=`<div class="xl-concepts xl-reveal" data-xl-reveal aria-labelledby="xl-concept-heading"><h3 id="xl-concept-heading">Beyond what we<br>can build alone.</h3><div class="xl-concept-copy"><p>Villow can demonstrate a different direction. Some concepts would need YouTube’s own infrastructure to work at scale. Those same principles could guide how other social platforms are designed.</p><a class="xl-concept-link" role="link" aria-disabled="true" tabindex="0" data-a-concepts-placeholder>Explore the concepts <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></a></div></div>`;
// The old close sequence ends the proposal grid, proposal group and chapter inner.
html=html.slice(0,start)+invitation+'</div></section>'+html.slice(end+'</div></div></div></section>'.length);
if(/class="xl-proposal|class="xl-action|class="xl-context|Ideas we’re exploring/.test(html))throw new Error('Old concept previews remain');
if((html.match(/id="xl-concept-heading"/g)||[]).length!==1)throw new Error('Concept invitation duplicated');
await writeFile(file,html);
console.log('Replaced detailed concepts with one future-page invitation. No page or navigation target created.');
