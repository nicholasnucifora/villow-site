import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
import {cinemaScene,heroHorizon} from './x-cinema-scene.mjs';

const root=new URL('./',import.meta.url);
const source=await readFile(new URL('w.html',root),'utf8');
let page=source.replace('class="version-w-people ','class="version-x-horizon version-w-people ')
 .replaceAll('Villow · Homepage W','Villow · Homepage X')
 .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('x'));
const artStart=page.indexOf('<div class="ig-cinema-art"');
const screenStart=page.indexOf('<div class="ig-cinema-screen">',artStart);
if(artStart<0||screenStart<0)throw new Error('W hero artwork missing');
page=page.slice(0,artStart)+'<div class="ig-cinema-art" style="--ig-screen-left:45.483871%;--ig-screen-top:26.111111%;--ig-screen-width:50%;--ig-screen-height:50.555556%;--ig-screen-rotation:0deg">'+cinemaScene+page.slice(screenStart);
page=page.replace('src="assets/i-cinema-cat-clip.webp" width="1254" height="1254"','src="assets/x-sleeping-cat.svg" width="620" height="364"');
const terrain=/<div class="i-illustration"[\s\S]*?<\/picture><\/div>/;
if(!terrain.test(page))throw new Error('W landscape missing');
page=page.replace(terrain,heroHorizon);
page=applyPreviewHeader(localizePreviewLinks(page),{home:true}).replace('</head>','<link rel="stylesheet" href="x-clear-horizons.css"></head>');
await writeFile(new URL('x.html',root),page);
if(source!==await readFile(new URL('w.html',root),'utf8'))throw new Error('W was modified');
console.log('Rendered X: Clearer horizons. W preserved.');
