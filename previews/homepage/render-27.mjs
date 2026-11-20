import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
const root=new URL('./',import.meta.url),source=await readFile(new URL('z.html',root),'utf8');
const trees=(side,viewBox)=>`<svg class="p27-scenery-trees p27-scenery-trees-${side}" viewBox="${viewBox}" aria-hidden="true" focusable="false"><image href="assets/supplied-landscape/trees.webp" width="9050" height="3017"/></svg>`;
const terrain=/<div class="z-scenery"[\s\S]*?<\/div>/;
if(!terrain.test(source))throw new Error('Z landscape missing');
let page=source.replace('version-z-layered','version-27-supplied')
 .replaceAll('Villow · Homepage Z','Villow · Homepage 27')
 .replace('href="z-layered-landscape.css"','href="27-supplied-landscape.css"')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('27'))
 .replace(terrain,`<div class="p27-scenery" aria-hidden="true">
 <picture class="p27-scenery-backdrop"><img src="assets/supplied-landscape/backdrop.webp" width="2172" height="724" alt="" fetchpriority="high" decoding="async" draggable="false"></picture>
 ${trees('left','0 1780 1850 900')}
 ${trees('right','8310 2180 740 500')}
 <img class="p27-scenery-foreground" src="assets/supplied-landscape/foreground.webp" width="9050" height="3017" alt="" decoding="async" draggable="false">
 </div>`);
page=applyPreviewHeader(localizePreviewLinks(page),{home:true});
await writeFile(new URL('27.html',root),page);
if(source!==await readFile(new URL('z.html',root),'utf8'))throw new Error('Z was modified');
console.log('Rendered 27: supplied tree/foreground layers. Z remains preserved.');
