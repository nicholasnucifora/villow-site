import { paperVideo, symbol } from './i-concepts-shared.mjs';

const programme = () => `
  <div class="ic-scene ic5-scene" role="group" aria-label="An illustrated personal viewing programme with chosen channel videos, something saved from YouTube, and a clear place to stop">
    <div class="ic5-folio-shadow" aria-hidden="true"></div>
    <div class="ic5-folio">
      <div class="ic5-page ic5-left">
        <span class="ic5-running">YOUR PROGRAMME</span>
        <h2>A few good things.</h2>
        <div class="ic5-entry">
          ${paperVideo('garden', { size: 'small', caption: false })}
          <span class="ic5-origin">From your channels</span>
        </div>
        <div class="ic5-margin">${symbol('clock')}<span>Delivery<br>you choose.</span></div>
        <span class="ic5-folio-number" aria-hidden="true">01</span>
      </div>
      <div class="ic5-page ic5-right">
        <span class="ic5-running">JUST FOR YOU</span>
        <div class="ic5-entry ic5-second">
          ${paperVideo('comedy', { size: 'small', caption: false })}
          <span class="ic5-origin">Saved from YouTube</span>
        </div>
        <div class="ic5-ending">${symbol('leaf')}<span>A place to pause.</span></div>
        <span class="ic5-folio-number" aria-hidden="true">02</span>
      </div>
      <span class="ic5-spine" aria-hidden="true"></span>
      <span class="ic5-ribbon" aria-hidden="true"></span>
    </div>
    <p class="ic-caption ic5-caption">A programme that feels like yours.</p>
  </div>`;

const worth = () => `
  <div class="ic-scene ic6-scene" role="group" aria-label="A video postcard opens onto an optional reflection: was it worth your time?">
    <span class="ic6-corner" aria-hidden="true"></span>
    <div class="ic6-postcard">
      <div class="ic6-front">
        ${paperVideo('comedy', { caption: false })}
        <span class="ic6-video-note">A little comedy.</span>
        <span class="ic6-play" aria-hidden="true">${symbol('play')}</span>
      </div>
      <div class="ic6-reflection">
        <span class="ic6-fold" aria-hidden="true"></span>
        <span class="ic6-overline">AFTER WATCHING · YOUR CALL</span>
        <h2>Was it worth<br>your time?</h2>
        <div class="ic6-answers" aria-label="Try an illustrative reflection">
          <button class="ic-action" type="button" data-ic-action="reflect" data-ic-value="worth" aria-pressed="false">Worth it</button>
          <button class="ic-action" type="button" data-ic-action="reflect" data-ic-value="unsure" aria-pressed="false">Not sure</button>
          <button class="ic-action" type="button" data-ic-action="reflect" data-ic-value="not" aria-pressed="false">Not worth it</button>
        </div>
        <p class="ic6-response" data-ic-result aria-live="polite">A laugh can be time well spent.</p>
      </div>
      <div class="ic6-postmark" aria-hidden="true">${symbol('leaf')}</div>
    </div>
    <p class="ic-caption ic6-caption">You decide what felt worthwhile.</p>
  </div>`;

const day = () => `
  <div class="ic-scene ic7-scene" role="group" aria-label="An illustrated ribbon of a day has a small bounded part for watching, with open space before and after">
    <div class="ic7-day-ribbon" aria-hidden="true"></div>
    <div class="ic7-ribbon-edge" aria-hidden="true"></div>
    <span class="ic7-before">Room before.</span>
    <span class="ic7-after">Room after.</span>
    <div class="ic7-watching">
      <span class="ic7-kicker">A LITTLE WATCHING</span>
      <div class="ic7-films">
        <div class="ic7-film ic7-first">${paperVideo('curiosity', { size: 'small', caption: false })}</div>
        <div class="ic7-film ic7-second">${paperVideo('music', { size: 'small', caption: false })}</div>
      </div>
      <span class="ic7-watch-caption">A curious rabbit hole.<br>A song you love.</span>
    </div>
    <span class="ic7-pause" aria-hidden="true">${symbol('pause')}</span>
    <div class="ic7-sprout" aria-hidden="true">${symbol('leaf')}</div>
    <p class="ic-caption ic7-caption">Watching, with room around it.</p>
  </div>`;

const person = (side) => `<span class="ic8-person ic8-person-${side}" aria-hidden="true"><span class="ic8-person-head"></span><span class="ic8-person-body"></span></span>`;

const company = () => `
  <div class="ic-scene ic8-scene" role="group" aria-label="A friend passes along a comedy video with a personal note, and you choose when to watch it">
    <svg class="ic8-connection" viewBox="0 0 535 440" fill="none" aria-hidden="true"><path d="M90 148C140 148 132 245 217 248S319 241 371 302C390 324 409 326 443 326"/><path d="m433 318 11 8-13 5"/></svg>
    <div class="ic8-sender">${person('friend')}<span>A friend</span></div>
    <div class="ic8-note"><span class="ic8-note-pin" aria-hidden="true"></span><span class="ic8-note-label">A PERSONAL NOTE</span><p>“This made<br>me laugh.”</p></div>
    <div class="ic8-video">
      ${paperVideo('comedy', { caption: false })}
      <span class="ic8-video-origin">Recommended by a friend</span>
      <span class="ic8-video-title">Something good to share.</span>
    </div>
    <div class="ic8-receiver"><span class="ic8-pause-mark" aria-hidden="true">${symbol('pause')}</span>${person('you')}<span>You choose<br>when to watch.</span></div>
    <p class="ic-caption ic8-caption">Good videos can come from people, too.</p>
  </div>`;

export const middleConcepts = [
  { key: 'programme', number: 5, name: 'Your own programme', render: programme },
  { key: 'worth', number: 6, name: 'Was it worth your time?', render: worth },
  { key: 'day', number: 7, name: 'A day with room', render: day },
  { key: 'company', number: 8, name: 'Good videos, good company', render: company },
];
