import {readFile,writeFile} from 'node:fs/promises';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';

// Upgrade saved pages in place instead of regenerating their design histories.
const pages=['n','o','p','q','r','setup-a','concepts-a','concepts-b'];
for(const name of pages){
 const path=new URL(`./${name}.html`,import.meta.url);
 const source=await readFile(path,'utf8');
 const result=applyFooterSpidey(source);
 if(!result.includes('data-footer-spidey'))throw new Error(`Missing project credit in ${name}`);
 if(result!==source)await writeFile(path,result);
}
console.log(`Updated live project badges in ${pages.length} saved previews.`);
