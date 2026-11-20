import {readFile,writeFile} from 'node:fs/promises';
import {homeStudies,previewPages} from './preview-pages.js';
import {studyNavigation,pageStudyNavigation,secondaryStudyRoutes,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
import {deviceArtStudies} from './homepage-control-presets.js';
import {renderDeviceArtHome} from './home-device-art.mjs';

// Refresh navigation in saved previews without rerunning historical renderers.
const selectedHome = new URL(`${previewPages.home.selectedPreset}.html`, import.meta.url);
const homepage = await readFile(selectedHome,'utf8');
for(const file of [...homeStudies.map(([key])=>`${key}.html`),...secondaryStudyRoutes]){
 const url=new URL(file,import.meta.url);
 const artStudy=deviceArtStudies.find(([key])=>file===`${key}.html`);
 const original=artStudy ? renderDeviceArtHome(homepage,artStudy[0]) : await readFile(url,'utf8');
 const page=original.match(/data-study-page="([^"]+)"/)?.[1]||'home';
 const preset=page==='home'?file.slice(0,-5):original.match(/data-preview="([^"]+)"/)?.[1]||'b';
 const rail=page==='home'?studyNavigation(preset):pageStudyNavigation(page,preset);
 let html=localizePreviewLinks(original.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,rail));
 html=applyPreviewHeader(html,{home:page==='home'});
 if(artStudy||html!==original) await writeFile(url,html);
}
// The root entry is the selected homepage itself, never an older design.
await writeFile(new URL('index.html',import.meta.url),await readFile(selectedHome));
console.log('Updated saved preview links; every active preview shares the selected 34 header and menu.');
