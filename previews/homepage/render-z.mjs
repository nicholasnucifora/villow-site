import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';

const root=new URL('./',import.meta.url);
const source=await readFile(new URL('y.html',root),'utf8');
let page=source.replace('class="version-y-scenery ','class="version-z-layered version-y-scenery ')
 .replaceAll('Villow · Homepage Y','Villow · Homepage Z')
 .replace('href="y-responsive-scenery.css"','href="z-layered-landscape.css"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('z'));
const terrain=/<div class="i-illustration"[\s\S]*?<\/picture><\/div>/;
if(!terrain.test(page))throw new Error('Y landscape missing');
page=page.replace(terrain,`<div class="z-scenery" aria-hidden="true">
 <picture class="z-scenery-backdrop">
  <source media="(max-width:700px)" srcset="assets/z-layered/backdrop-phone.webp" width="1536" height="1024">
  <img src="assets/z-layered/backdrop-wide.webp" width="2172" height="724" alt="" fetchpriority="high" decoding="async" draggable="false">
 </picture>
 <img class="z-scenery-trees z-scenery-trees-left" src="assets/z-layered/trees-left.webp" width="1448" height="1086" alt="" decoding="async" draggable="false">
 <img class="z-scenery-trees z-scenery-trees-right" src="assets/z-layered/trees-right.webp" width="1448" height="1086" alt="" decoding="async" draggable="false">
 <img class="z-scenery-foreground" src="assets/z-layered/foreground.webp" width="2172" height="724" alt="" decoding="async" draggable="false">
 </div>`);
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('z.html',root),page);
if(source!==await readFile(new URL('y.html',root),'utf8'))throw new Error('Y was modified');
console.log('Rendered Z: independent scenery layers. Saved Y preserved.');
