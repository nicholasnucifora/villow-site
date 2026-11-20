import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation} from './study-navigation.mjs';
import {watchingStoriesSection} from './v-watching-stories.mjs';
const root = new URL('./',import.meta.url);
const source = await readFile(new URL('r.html',root),'utf8');
const oldSection = /<section class="r-control"[\s\S]*?<\/section>/;
if(!oldSection.test(source))throw new Error('R control section missing.');
const page = source
  .replace('class="version-r-motion ', 'class="version-v-stories version-r-motion ')
  .replaceAll('Villow · Homepage R','Villow · Homepage V')
  .replace('href="r.html" aria-label="Villow home"','href="v.html" aria-label="Villow home"')
  .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/,studyNavigation('v'))
  .replace('<link rel="stylesheet" href="r-your-control.css"><script type="module" src="r-your-control.js"></script>','<link rel="stylesheet" href="v-watching-stories.css"><script type="module" src="v-watching-stories.js"></script>')
  .replace(oldSection,watchingStoriesSection);
await writeFile(new URL('v.html',root),page);
if(source!==await readFile(new URL('r.html',root),'utf8'))throw new Error('R changed unexpectedly.');
console.log('Rendered V: Your kind of watching. R remains unchanged.');
