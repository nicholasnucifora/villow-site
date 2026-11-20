import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('27.html',root),'utf8');
let page=source.replace('version-27-supplied','version-28-calm')
 .replaceAll('Villow · Homepage 27','Villow · Homepage 28')
 .replace('href="27-supplied-landscape.css"','href="28-calm-mobile.css"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('28'));
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('28.html',root),page);
if(source!==await readFile(new URL('27.html',root),'utf8'))throw new Error('Preset 27 was modified');
console.log('Rendered 28: quieter mobile hero and centred stacked copy. Preset 27 preserved.');
