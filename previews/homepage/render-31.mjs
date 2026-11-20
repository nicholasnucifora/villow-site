import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('30.html',root),'utf8');
let page=source.replace('version-30-blended','version-31-original')
 .replaceAll('Villow · Homepage 30','Villow · Homepage 31')
 .replace('href="30-blended-landscape.css"','href="31-original-landscape.css"')
 .replaceAll('assets/30-landscape/','assets/31-original-landscape/')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('31'));
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('31.html',root),page);
if(source!==await readFile(new URL('30.html',root),'utf8'))throw new Error('Preset 30 was modified');
console.log('Rendered 31: original 29 artwork with deterministic matte repair, retaining 30 footer/mobile layout.');
