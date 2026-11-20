import { paperVideo, symbol } from './i-concepts-shared.mjs';

const video = (kind, label) => paperVideo(kind, { size: 'small', caption: false, label });

function stop() {
  return `<figure class="ic-scene ic1-scene" aria-label="An illustrative feed of video postcards has a visible ending, with room to step away.">
    <div class="ic1-sequence" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="ic1-piece ic1-first">
      ${video('comedy', 'A little comedy')}
      <div class="ic1-piece-caption"><span>A little comedy</span><span class="ic1-state">${symbol('check')} Watched</span></div>
    </div>
    <div class="ic1-piece ic1-second">
      ${video('curiosity', 'Something wonderfully odd')}
      <div class="ic1-piece-caption"><span>Something wonderfully odd</span><span class="ic1-state">${symbol('clock')} Saved</span></div>
      <span class="ic1-paperclip" aria-hidden="true"></span>
    </div>
    <div class="ic1-piece ic1-last">
      ${video('music', 'One for another time')}
      <div class="ic1-piece-caption"><span>One for another time</span><span class="ic1-state">${symbol('pause')} Pass for now</span></div>
      <div class="ic1-end"><span class="ic1-end-line" aria-hidden="true"></span>End of this feed</div>
    </div>
    <figcaption class="ic1-room"><span class="ic1-open-mark" aria-hidden="true">${symbol('leaf')}</span>Room for<br>what’s next.</figcaption>
  </figure>`;
}

function journey() {
  return `<figure class="ic-scene ic2-scene" aria-label="One folded paper strip links choosing a video, watching a comedy, and reflecting that it was a good laugh.">
    <div class="ic2-accordion">
      <section class="ic2-fold ic2-choose" aria-label="Choose">
        <span class="ic2-moment">Choose</span>
        <div class="ic2-source ic2-source-back" aria-hidden="true">${video('garden', 'An everyday interest')}</div>
        <div class="ic2-source ic2-source-front">${video('comedy', 'A comedy you chose')}<span class="ic2-chosen">${symbol('check')}</span></div>
        <span class="ic2-source-note">From a channel<br>you enjoy</span>
      </section>
      <section class="ic2-fold ic2-watch" aria-label="Watch">
        <span class="ic2-moment">Watch</span>
        <div class="ic2-screen">${video('comedy', 'A little comedy')}
          <span class="ic2-play" aria-hidden="true">${symbol('play')}</span>
        </div>
        <div class="ic2-watch-footer"><span>A good laugh.</span><span class="ic2-pause" aria-hidden="true">${symbol('pause')}</span></div>
        <span class="ic2-progress" aria-hidden="true"><i></i></span>
      </section>
      <section class="ic2-fold ic2-reflect" aria-label="Reflect">
        <span class="ic2-moment">Reflect</span>
        <span class="ic2-question">Worth<br>your time?</span>
        <span class="ic2-answer">${symbol('check')} Yes.</span>
        <span class="ic2-reflection-note">A good laugh<br>counts, too.</span>
      </section>
    </div>
    <figcaption class="ic2-caption">A little more say.<span>Before, during, and after.</span></figcaption>
  </figure>`;
}

function room() {
  return `<figure class="ic-scene ic3-scene" aria-label="A small set of video postcards can be put aside, while an open paper path continues into space around them.">
    <svg class="ic3-path" viewBox="0 0 535 430" fill="none" aria-hidden="true"><path class="ic3-path-edge" d="M222 223C330 257 238 309 302 332S402 349 494 399"/><path class="ic3-path-paper" d="M222 223C330 257 238 309 302 332S402 349 494 399"/><path class="ic3-path-seam" d="M222 223C330 257 238 309 302 332S402 349 494 399"/></svg>
    <div class="ic3-postcard ic3-postcard-back" aria-hidden="true">${video('comedy', 'A little comedy')}<span class="ic3-postcard-line"></span></div>
    <div class="ic3-postcard ic3-postcard-front">${video('music', 'A song to come back to')}<div class="ic3-card-footer"><span>A song to come back to</span><span class="ic3-save-mark">${symbol('clock')}</span></div></div>
    <span class="ic3-pause-tab">${symbol('pause')} Pick this up later.</span>
    <figcaption class="ic3-open-caption">Good videos.<br><strong>Room for<br>the rest.</strong></figcaption>
    <span class="ic3-open-end" aria-hidden="true">${symbol('leaf')}</span>
  </figure>`;
}

function shape() {
  return `<figure class="ic-scene ic4-scene" aria-label="Videos from channels, discovery, and saved YouTube videos become a finite personal mix through the viewer’s choices.">
    <div class="ic4-source ic4-channel">
      <span class="ic4-source-label">Channels</span>
      ${video('music', 'From a channel you follow')}
      <span class="ic4-selection" aria-label="Chosen">${symbol('check')}</span>
    </div>
    <div class="ic4-source ic4-discovery">
      <span class="ic4-source-label">Discovery</span>
      ${video('curiosity', 'A recommendation to explore')}
      <span class="ic4-selection" aria-label="Chosen">${symbol('check')}</span>
    </div>
    <div class="ic4-source ic4-youtube">
      <span class="ic4-source-label"><span class="ic4-youtube-mark" aria-hidden="true">${symbol('play')}</span> Saved from YouTube</span>
      ${video('comedy', 'A video saved from YouTube')}
      <span class="ic4-selection" aria-label="Chosen">${symbol('check')}</span>
    </div>
    <span class="ic4-selection-note">Picked by you.<svg viewBox="0 0 100 58" fill="none" aria-hidden="true"><path d="M8 7c37 0 50 15 70 39m-17-2 20 5-1-18"/></svg></span>
    <div class="ic4-collection">
      <div class="ic4-collection-back" aria-hidden="true"></div>
      <div class="ic4-collection-sheet">
        <span class="ic4-collection-title">Your mix<span>Room to choose. An end in sight.</span></span>
        <div class="ic4-mix-videos">${video('music', 'Music')}${video('curiosity', 'Curiosity')}${video('comedy', 'Comedy')}</div>
        <span class="ic4-collection-bottom"><i></i><i></i><i></i><span>${symbol('pause')} A place to stop</span></span>
      </div>
    </div>
  </figure>`;
}

export const firstConcepts = [
  { key: 'stop', number: 1, name: 'A place to stop', render: stop },
  { key: 'journey', number: 2, name: 'Before, during, after', render: journey },
  { key: 'room', number: 3, name: 'Room for the rest', render: room },
  { key: 'shape', number: 4, name: 'The feed you shape', render: shape },
];
