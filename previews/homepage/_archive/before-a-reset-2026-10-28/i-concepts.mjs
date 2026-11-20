import {firstConcepts} from './i-concepts-first.mjs';
import {middleConcepts} from './i-concepts-middle.mjs';
import {lastConcepts} from './i-concepts-last.mjs';
import {quietFirst} from './i-quiet-first.mjs';
import {quietLast} from './i-quiet-last.mjs';
import {nextJourneys} from './i-next-journeys.mjs';
import {nextNative} from './i-next-native.mjs';
import {cinemaStudies} from './i-cinema.mjs';
import {agencyStudies} from './i-agency-studies.mjs';
import {cinemaGallery} from './i-cinema-gallery.mjs';
import {conceptCatalog} from './i-concepts-catalog.mjs';
import {esc} from './i-concepts-shared.mjs';

export function renderIConceptPanels(){
 const concepts=[...firstConcepts,...middleConcepts,...lastConcepts,...quietFirst,...quietLast,...nextJourneys,...nextNative,...cinemaStudies,...agencyStudies,...cinemaGallery];
 return conceptCatalog.map(([key,number,name])=>{
  const concept=concepts.find(item=>item.key===key);
  if(!concept)throw new Error(`Missing right-hand concept: ${key}`);
  const quiet=Number(number)>12&&Number(number)<=20;
  const next=Number(number)>20;
  const description=key==='flow-open'?'Open landscape composition':`${name} — ${key==='flow-native'?'real Villow controls and a sample video':'conceptual illustration with sample videos'}`;
  return `<div data-ip-view-panel="${key}" data-ic-panel${quiet?' data-iq-panel':''} hidden><figure class="ic-concept${quiet?' iq-concept':''}${next?' in-concept':''}${Number(number)>25?' ia-concept':''}" aria-label="${esc(description)}"><div class="ic-stage">${concept.render()}</div>${quiet?'<span class="sr-only" role="status" aria-live="polite" data-iq-status></span>':''}</figure></div>`;
 }).join('');
}
