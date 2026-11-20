import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('31.html',root),'utf8');
let page=source.replace('version-31-original','version-32-grounded')
 .replaceAll('Villow · Homepage 31','Villow · Homepage 32')
 .replace('href="31-original-landscape.css"','href="32-grounded-bush.css"')
 .replace('href="assets/31-original-landscape/trees.webp"','href="assets/32-grounded-bush/trees-left.webp"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('32'));
page=applyPreviewHeader(localizePreviewLinks(page),{home:true,directory:true});
await writeFile(new URL('32.html',root),page);
if(source!==await readFile(new URL('31.html',root),'utf8'))throw new Error('Preset 31 was modified');
console.log('Rendered 32: original bush silhouette, cut edge covered by the hill.');
