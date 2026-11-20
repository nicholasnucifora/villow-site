import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {studyNavigation} from './study-navigation.mjs';
import {controlStudies} from './homepage-control-presets.js';
import {controlStudySection} from './control-studies.mjs';

const root = new URL('./', import.meta.url);
const source = await readFile(new URL('r.html', root), 'utf8');
const sectionPattern = /<section class="r-control"[\s\S]*?<\/section>/;
if (!sectionPattern.test(source)) throw new Error('R control section was not found; no pages written.');
const intro = 'Choose your channels and a daily viewing limit that works for you. Your feed brings together their videos, saved videos and discoveries.';
if (!source.includes(intro)) throw new Error('R feed introduction changed; review before rendering.');
for (const [key, label] of controlStudies.filter(([key]) => ['s','t','u'].includes(key))) {
  const page = source
    .replace('class="version-r-motion ', `class="version-${key}-control version-r-motion `)
    .replaceAll('Villow · Homepage R', `Villow · Homepage ${key.toUpperCase()}`)
    .replace('href="r.html" aria-label="Villow home"', `href="${key}.html" aria-label="Villow home"`)
    .replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/, studyNavigation(key))
    .replace('<link rel="stylesheet" href="r-your-control.css"><script type="module" src="r-your-control.js"></script>', '<link rel="stylesheet" href="control-studies.css"><script type="module" src="control-studies.js"></script>')
    .replace(sectionPattern, controlStudySection(key))
    .replace(intro, 'Videos from your channels, saved picks and discoveries, brought together in a feed with an end. Watch what interests you, then get on with your day.');
  await writeFile(new URL(`${key}.html`, root), page);
  console.log(`Rendered ${key.toUpperCase()}: ${label}`);
}
// A run must never mutate its accepted source.
if (source !== await readFile(new URL('r.html', root), 'utf8')) throw new Error('R was modified unexpectedly.');
console.log(`R preserved: ${createHash('sha256').update(source).digest('hex')}`);
