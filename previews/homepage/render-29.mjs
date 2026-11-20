import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('28.html',root),'utf8');
let page=source.replace('version-28-calm','version-29-raised')
 .replaceAll('Villow · Homepage 28','Villow · Homepage 29')
 .replace('href="28-calm-mobile.css"','href="29-raised-landscape.css"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('29'));
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('29.html',root),page);
if(source!==await readFile(new URL('28.html',root),'utf8'))throw new Error('Preset 28 was modified');
console.log('Rendered 29: higher wide-screen landscape and fuller trees. Preset 28 preserved.');
