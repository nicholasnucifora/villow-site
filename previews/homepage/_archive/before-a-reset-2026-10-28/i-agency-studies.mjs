import { symbol } from './i-concepts-shared.mjs';

const sample = '<img src="assets/i-thumb-rest.webp" width="536" height="300" alt="" draggable="false">';

function line() {
  return `<figure class="ic-scene ia27-scene" data-ia-line="0" aria-label="Conceptual illustration: a viewer draws their own stopping point around a video. The line represents a boundary around a viewing session, not a point at which a video is cut short.">
    <div class="ia27-drawing">
      <svg class="ia27-line" viewBox="0 0 535 430" fill="none" aria-hidden="true"><path data-ia-line-path d="M45 205C18 256 60 324 145 326S310 326 395 247"/><circle data-ia-line-end cx="395" cy="247" r="5"/></svg>
      <div class="ia27-video">${sample}<span class="ia27-play" aria-hidden="true">${symbol('play')}</span></div>
      <img class="ia27-hand" src="assets/i-hand-line-v1.webp" alt="" draggable="false">
    </div>
    <figcaption class="ia27-choice">
      <button type="button" data-ia-action="line-next" aria-label="Try a different stopping point for this illustrative viewing session">Try another stopping point <span aria-hidden="true">${symbol('arrow')}</span></button>
    </figcaption>
    <span class="sr-only" data-ia-status role="status" aria-live="polite"></span>
  </figure>`;
}

function record() {
  return `<figure class="ic-scene ia28-scene" data-ia-answer="none" aria-label="Conceptual illustration: a chosen viewing boundary surrounds a record of watching. A separate optional reflection asks how the time felt; an answer never changes the record.">
    <div class="ia28-drawing">
      <svg class="ia28-record" viewBox="0 0 535 380" fill="none" aria-hidden="true">
        <path class="ia28-outline" d="M77 150C117 62 317 43 426 112S511 286 378 321C259 353 90 307 58 246C41 215 47 183 77 150Z"/>
        <path class="ia28-trace" d="M90 211C116 142 257 108 344 147S423 250 333 272C242 294 148 265 116 236"/>
        <circle class="ia28-start" cx="90" cy="211" r="5"/>
        <circle class="ia28-finish" cx="116" cy="236" r="5"/>
      </svg>
      <span class="ia28-boundary-label">Your boundary</span>
      <span class="ia28-trace-label">Your viewing</span>
      <div class="ia28-video">${sample}<span aria-hidden="true">${symbol('play')}</span></div>
      <span class="ia28-judgment" aria-hidden="true"><i></i><span data-ia-judgment-text></span></span>
    </div>
    <div class="ia28-reflection" role="group" aria-label="Optional reflection on this example">
      <div class="ia28-question"><span>Worth your time?</span><button type="button" class="ia28-skip" data-ia-action="record-clear">Skip</button></div>
      <div class="ia28-answers">
        <button type="button" data-ia-action="record-answer" data-ia-value="no" aria-pressed="false">Not worth it</button>
        <button type="button" data-ia-action="record-answer" data-ia-value="unsure" aria-pressed="false">Not sure</button>
        <button type="button" data-ia-action="record-answer" data-ia-value="yes" aria-pressed="false">Worth it</button>
      </div>
      <span class="sr-only" data-ia-status role="status" aria-live="polite"></span>
    </div>
  </figure>`;
}

export const agencyStudies = [
  { key: 'agency-line', render: line },
  { key: 'agency-record', render: record },
];
