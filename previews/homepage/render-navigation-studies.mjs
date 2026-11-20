import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {applyPreviewHeader} from './preview-header.mjs';
import {navigationStudies} from './navigation-studies.js';

const root=new URL('./',import.meta.url),source=await readFile(new URL('32.html',root),'utf8');
for(const preset of Object.keys(navigationStudies)){
 const basePreset='32';
 const base=source;
 let page=base.replaceAll(`Villow · Homepage ${basePreset}`,`Villow · Homepage ${preset}`)
  .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation(preset));
 page=applyPreviewHeader(localizePreviewLinks(page),{home:true,directory:true,directoryVariant:preset});
 await writeFile(new URL(`${preset}.html`,root),page);
}
if(source!==await readFile(new URL('32.html',root),'utf8'))throw new Error('Preset 32 was modified');
console.log('Rendered retained navigation presets 33 and 34. Run sync-preview-pages.mjs to apply the selected header everywhere.');
