import { paperVideo, symbol } from './i-concepts-shared.mjs';

const video = kind => paperVideo(kind, { caption: false });
const smile = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 14.5c1.2 2.5 6.8 2.5 8 0"/><circle cx="8.5" cy="9" r=".7" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9" r=".7" fill="currentColor" stroke="none"/></svg>';

function ribbon() {
  return `<figure class="ic-scene in21-scene" aria-label="A simple three-part illustration: choose a comedy, watch it, then optionally reflect on how it felt. This is a conceptual illustration, not the Villow interface.">
    <div class="in21-spread">
      <div class="in21-side in21-before">
        <span class="in21-label">Choose</span>
        <div class="in21-choice in21-choice-back" aria-hidden="true">${video('garden')}</div>
        <div class="in21-choice in21-choice-front">${video('comedy')}<span class="in21-tick" aria-hidden="true">${symbol('check')}</span></div>
      </div>
      <div class="in21-during">
        <span class="in21-label">Watch</span>
        ${video('comedy')}
        <div class="in21-player-line" aria-hidden="true"><span>${symbol('pause')}</span><i></i><b></b></div>
      </div>
      <div class="in21-side in21-after">
        <span class="in21-label">Reflect</span>
        <span class="in21-feeling" aria-hidden="true">${smile}</span>
        <span class="in21-answer" aria-hidden="true">${symbol('check')}</span>
      </div>
    </div>
  </figure>`;
}

function triptych() {
  return `<figure class="ic-scene in22-scene" aria-label="Three lightly arranged moments: a video selected from a few choices, a generous viewing frame, and an optional moment of reflection. This is a conceptual illustration, not the Villow interface.">
    <div class="in22-before">
      <span class="in22-label">Choose</span>
      <div class="in22-choices" aria-hidden="true">
        <div class="in22-choice in22-choice-other">${video('music')}</div>
        <div class="in22-choice in22-choice-picked">${video('comedy')}<span>${symbol('check')}</span></div>
      </div>
    </div>
    <div class="in22-watch">
      <span class="in22-label">Watch</span>
      <div class="in22-view">${video('comedy')}<span class="in22-play" aria-hidden="true">${symbol('play')}</span></div>
      <span class="in22-progress" aria-hidden="true"><i></i></span>
    </div>
    <div class="in22-after">
      <span class="in22-feeling" aria-hidden="true">${smile}</span>
      <span class="in22-label">Reflect</span>
    </div>
  </figure>`;
}

function orbit() {
  return `<figure class="ic-scene in23-scene" aria-label="One video at the centre of three choices: selecting what to watch, watching with room to pause, and optionally reflecting afterwards. This is a conceptual illustration, not the Villow interface.">
    <div class="in23-choice">
      <div class="in23-little in23-little-back" aria-hidden="true">${video('garden')}</div>
      <div class="in23-little in23-little-front" aria-hidden="true">${video('comedy')}</div>
      <span class="in23-check" aria-hidden="true">${symbol('check')}</span>
      <span class="in23-label">Choose</span>
    </div>
    <div class="in23-view">
      ${video('comedy')}
      <div class="in23-bottom"><span class="in23-play" aria-hidden="true">${symbol('play')}</span><span class="in23-label">Watch</span><span class="in23-pause" aria-hidden="true">${symbol('pause')}</span></div>
    </div>
    <div class="in23-reflection">
      <span class="in23-feeling" aria-hidden="true">${smile}</span>
      <span class="in23-label">Reflect</span>
    </div>
  </figure>`;
}

export const nextJourneys = [
  { key: 'flow-ribbon', render: ribbon },
  { key: 'flow-triptych', render: triptych },
  { key: 'flow-orbit', render: orbit },
];
