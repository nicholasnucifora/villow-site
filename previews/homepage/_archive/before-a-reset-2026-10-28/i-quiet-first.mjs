import { paperVideo, symbol } from './i-concepts-shared.mjs';

const thumb = kind => paperVideo(kind, { caption: false });

function focus() {
  return `<figure class="ic-scene iq13-scene" data-iq-focus="comedy" aria-label="An illustrative viewing choice: one video in focus, a small finite queue, and space to stop.">
    <div class="iq13-view">
      <div class="iq13-main">
        <div class="iq13-feature" data-iq-kind="comedy">${thumb('comedy')}<span class="iq13-title">A little comedy</span></div>
        <div class="iq13-feature" data-iq-kind="curiosity">${thumb('curiosity')}<span class="iq13-title">How does that work?</span></div>
        <div class="iq13-feature" data-iq-kind="music">${thumb('music')}<span class="iq13-title">An evening piano session</span></div>
      </div>
      <div class="iq13-queue" role="group" aria-label="Choose a video in this illustrative queue">
        <button type="button" class="iq13-pick" data-iq-action="focus" data-iq="comedy" aria-label="Choose the comedy sample" aria-pressed="true">${thumb('comedy')}</button>
        <button type="button" class="iq13-pick" data-iq-action="focus" data-iq="curiosity" aria-label="Choose the curiosity sample" aria-pressed="false">${thumb('curiosity')}</button>
        <button type="button" class="iq13-pick" data-iq-action="focus" data-iq="music" aria-label="Choose the music sample" aria-pressed="false">${thumb('music')}</button>
        <span class="iq13-end" aria-label="A visible end to this illustrative queue"><i></i>${symbol('leaf')}</span>
      </div>
    </div>
  </figure>`;
}

function edit() {
  return `<figure class="ic-scene iq14-scene" data-iq-mix-comedy="on" data-iq-mix-curiosity="on" data-iq-mix-music="off" aria-label="Choose which illustrative sources reach a small personal video mix.">
    <div class="iq14-sources" role="group" aria-label="Choose sources for this illustrative mix">
      <div class="iq14-source"><span class="iq14-origin">Channels</span><button type="button" class="iq14-choice" data-iq-action="mix" data-iq="comedy" aria-label="Include the comedy sample from a channel" aria-pressed="true">${thumb('comedy')}<span class="iq14-check">${symbol('check')}</span></button></div>
      <div class="iq14-source"><span class="iq14-origin">Discovery</span><button type="button" class="iq14-choice" data-iq-action="mix" data-iq="curiosity" aria-label="Include the curiosity recommendation sample" aria-pressed="true">${thumb('curiosity')}<span class="iq14-check">${symbol('check')}</span></button></div>
      <div class="iq14-source"><span class="iq14-origin">Saved</span><button type="button" class="iq14-choice" data-iq-action="mix" data-iq="music" aria-label="Include the saved music sample" aria-pressed="false">${thumb('music')}<span class="iq14-check">${symbol('check')}</span></button></div>
    </div>
    <div class="iq14-mix" aria-label="Your chosen illustrative mix">
      <div class="iq14-mix-videos">
        <div class="iq14-result" data-iq-kind="comedy">${thumb('comedy')}</div>
        <div class="iq14-result" data-iq-kind="curiosity">${thumb('curiosity')}</div>
        <div class="iq14-result" data-iq-kind="music">${thumb('music')}</div>
        <span class="iq14-empty" aria-hidden="true">${symbol('play')}</span>
      </div>
      <div class="iq14-end" aria-label="This illustrative mix has an ending"><span></span>${symbol('leaf')}</div>
    </div>
  </figure>`;
}

function pace() {
  return `<figure class="ic-scene iq15-scene" style="--iq15-pace:53%" aria-label="An illustrative video with a pause point the viewer can move, leaving open space beyond it.">
    <div class="iq15-view">
      <div class="iq15-video">${thumb('music')}</div>
      <span class="iq15-title">An evening piano session</span>
      <div class="iq15-track"><input type="range" min="0" max="100" value="53" data-iq-action="pace" aria-label="Move the pause point in this illustration" aria-valuetext="Pause point at 53 percent of this illustrative strip"></div>
    </div>
    <span class="iq15-open" aria-hidden="true">${symbol('leaf')}</span>
  </figure>`;
}

function sequence() {
  return `<figure class="ic-scene iq16-scene" data-iq-step="2" aria-label="An illustrative finite sequence of videos follows a gentle curve, with a chosen video and a visible place to stop.">
    <svg class="iq16-path" viewBox="0 0 535 430" fill="none" aria-hidden="true"><path d="M35 255C100 191 163 185 235 211S371 300 466 255"/></svg>
    <div class="iq16-pieces" role="group" aria-label="Choose a video along this illustrative sequence">
      <button type="button" class="iq16-piece iq16-first" data-iq-action="sequence" data-iq="1" aria-label="Choose the comedy sample" aria-pressed="false">${thumb('comedy')}<span class="iq16-title">A little comedy</span><span class="iq16-selected" aria-hidden="true">${symbol('check')}</span></button>
      <button type="button" class="iq16-piece iq16-second" data-iq-action="sequence" data-iq="2" aria-label="Choose the cooking sample" aria-pressed="true">${thumb('cooking')}<span class="iq16-title">Something for dinner</span><span class="iq16-selected" aria-hidden="true">${symbol('check')}</span></button>
      <button type="button" class="iq16-piece iq16-third" data-iq-action="sequence" data-iq="3" aria-label="Choose the music sample" aria-pressed="false">${thumb('music')}<span class="iq16-title">An evening piano</span><span class="iq16-selected" aria-hidden="true">${symbol('check')}</span></button>
    </div>
    <span class="iq16-ending" aria-label="A place to stop after this finite sequence"><i></i>${symbol('leaf')}</span>
  </figure>`;
}

export const quietFirst = [
  { key: 'quiet-focus', number: 13, name: 'One clear view', render: focus },
  { key: 'quiet-edit', number: 14, name: 'Choose your mix', render: edit },
  { key: 'quiet-pace', number: 15, name: 'Set your pace', render: pace },
  { key: 'quiet-sequence', number: 16, name: 'A clear ending', render: sequence },
];
