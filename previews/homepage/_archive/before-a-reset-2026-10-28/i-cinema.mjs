import {symbol} from './i-concepts-shared.mjs';

export function renderICinema(){
 return `<div class="ia-cinema" data-ia-cinema>
 <div class="ia-cinema-art" role="img" aria-label="A relaxed viewer holds the remote to their own little cinema. A small projector casts a bounded scene of a sleeping cat. This is an illustration of choosing how to watch.">
  <img class="ia-cinema-viewer" src="assets/i-cinema-person-v1.webp" width="1774" height="887" alt="" draggable="false">
  <img class="ia-cinema-light" src="assets/i-cinema-person-v1.webp" width="1774" height="887" alt="" draggable="false">
 </div>
 <button class="ia-cinema-switch" type="button" data-ia-cinema-switch aria-pressed="false"><span aria-hidden="true">${symbol('pause')}</span><span data-ia-cinema-label>Pause this scene</span></button>
 <div class="ia-cinema-reflection" data-ia-cinema-reflection hidden>
  <p>Worth your time?</p>
  <div role="group" aria-label="Optional reflection on the illustration">
   ${['Not worth it','Not sure','Worth it'].map(label=>`<button type="button" data-ia-cinema-answer="${label}" aria-pressed="false">${label}</button>`).join('')}
  </div>
  <button class="ia-cinema-skip" type="button" data-ia-cinema-skip>Skip</button>
 </div>
 <span class="sr-only" role="status" aria-live="polite" data-ia-cinema-status></span>
 </div>`;
}

export const cinemaStudies=[{key:'agency-cinema',render:renderICinema}];
