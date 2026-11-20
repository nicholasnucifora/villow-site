import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';

const root=new URL('./',import.meta.url);
const source=await readFile(new URL('w.html',root),'utf8');
let page=source.replace('class="version-w-people ','class="version-y-scenery version-w-people ')
 .replaceAll('Villow · Homepage W','Villow · Homepage Y')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('y'));
const terrain=/<div class="i-illustration"[\s\S]*?<\/picture><\/div>/;
if(!terrain.test(page))throw new Error('W landscape missing');
page=page.replace(terrain,`<div class="i-illustration" data-i-artwork data-active-art="i15" aria-hidden="true"><picture data-i-art-picture="i15">
 <source media="(max-width:700px)" srcset="assets/y-landscape/phone.webp" width="1536" height="1024">
 <source media="(max-width:1600px)" srcset="assets/y-landscape/tablet.webp" width="1774" height="887">
 <img src="illustration-studies/i-supplied/sage-sunrise.webp" width="2172" height="724" alt="" fetchpriority="high" decoding="async" draggable="false">
 </picture></div>`);
page=applyPreviewHeader(localizePreviewLinks(page),{home:true})
 .replace('</head>','<link rel="stylesheet" href="y-responsive-scenery.css"></head>');
await writeFile(new URL('y.html',root),page);
if(source!==await readFile(new URL('w.html',root),'utf8'))throw new Error('W was modified');
console.log('Rendered Y: Scenery that fits. W artwork and cinema preserved.');
