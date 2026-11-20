import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('29.html',root),'utf8');
let page=source.replace('version-29-raised','version-30-blended')
 .replaceAll('Villow · Homepage 29','Villow · Homepage 30')
 .replace('href="29-raised-landscape.css"','href="30-blended-landscape.css"')
 .replaceAll('assets/supplied-landscape/trees.webp','assets/30-landscape/trees.webp')
 .replaceAll('assets/supplied-landscape/foreground.webp','assets/30-landscape/foreground.webp')
 .replace('viewBox="0 1780 1850 900"','viewBox="0 1780 1850 1237"')
 .replace('viewBox="8310 2180 740 500"','viewBox="8310 2180 740 837"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('30'));
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('30.html',root),page);
if(source!==await readFile(new URL('29.html',root),'utf8'))throw new Error('Preset 29 was modified');
console.log('Rendered 30: blended landscape, visible shrubs, higher mobile scenery and subtle footer.');
