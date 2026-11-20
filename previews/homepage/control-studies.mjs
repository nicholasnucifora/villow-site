import {yourControlSection} from './r-your-control.mjs';

// Reuse the accepted vector characters without changing R's source or assets.
const people = [...yourControlSection.matchAll(/<svg class="r-control-person"[\s\S]*?<\/svg>/g)]
  .map(([svg]) => svg.replace('r-control-person', 'cs-person'));
const examples = [
  {key:'discover', tab:'Discover a little', title:'A little discovery each day.', context:'With the Villow extension', person:0,
    points:['Keep YouTube’s recommendations.', 'Choose a 30-minute daily limit.'], note:'Discovery, with a stopping point.'},
  {key:'channels', tab:'Catch up', title:'Just the channels you choose.', context:'With the Villow app', person:1,
    points:['Build your feed around your subscriptions.', 'Choose which video lengths each channel brings in.'], note:'Your favourites, at your pace.'},
  {key:'away', tab:'Watch less', title:'Evenings for something else.', context:'With the Villow app', person:4,
    points:['Schedule time away from videos.', 'Add a reminder when it’s time for bed.'], note:'Leave a little room for the rest of life.'},
];
const svg = content => `<svg class="cs-object" viewBox="0 0 220 150" width="220" height="150" fill="none" aria-hidden="true">${content}</svg>`;
const artwork = {
 discover: svg('<ellipse cx="111" cy="134" rx="86" ry="9" fill="#dce5d1"/><rect x="54" y="18" width="105" height="105" rx="15" fill="#aabda5" transform="rotate(-7 106 70)"/><rect x="66" y="26" width="105" height="105" rx="14" fill="#fffdf6"/><rect x="77" y="36" width="83" height="51" rx="8" fill="#d9e4da"/><path d="M77 72L103 48L133 79L148 61L160 76V87H77Z" fill="#9eb6a1"/><circle cx="142" cy="48" r="7" fill="#f0d7a2"/><path d="M81 101H127M81 112H112" stroke="#c1ceba" stroke-width="5" stroke-linecap="round"/><circle cx="169" cy="108" r="23" fill="#315b49"/><path d="M169 94V108L178 113" stroke="#fffaf0" stroke-width="3" stroke-linecap="round"/>'),
 channels: svg('<ellipse cx="110" cy="134" rx="87" ry="8" fill="#e9dfc7"/><rect x="43" y="30" width="124" height="88" rx="12" fill="#c7d6c0" transform="rotate(-9 105 74)"/><rect x="58" y="35" width="124" height="88" rx="12" fill="#fffdf6"/><circle cx="80" cy="57" r="10" fill="#d8bd88"/><path d="M100 55H161M100 63H137" stroke="#a6b99f" stroke-width="4" stroke-linecap="round"/><rect x="71" y="78" width="44" height="31" rx="5" fill="#b5c9b2"/><rect x="123" y="78" width="44" height="31" rx="5" fill="#e6d9b8"/><path d="M88 86L99 94L88 102Z" fill="#f9faf1"/><path d="M139 86L150 94L139 102Z" fill="#fffaf0"/><circle cx="184" cy="33" r="19" fill="#315b49"/><path d="M176 33L182 39L193 27" stroke="#fffaf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
 away: svg('<ellipse cx="110" cy="134" rx="87" ry="8" fill="#dfe3dc"/><path d="M67 116V59Q67 12 112 12Q157 12 157 59V116Z" fill="#c3d4d4"/><path d="M123 29A25 25 0 1 0 143 67A29 29 0 0 1 123 29Z" fill="#fff6d9"/><path d="M84 42V51M80 46H88M137 87V95M133 91H141" stroke="#fffdf1" stroke-width="2" stroke-linecap="round"/><path d="M41 117L70 100L104 110V137L71 127L41 133Z" fill="#9caf99"/><path d="M71 103V124" stroke="#f7f3de" stroke-width="2"/><path d="M161 133V104M161 122Q142 120 145 104Q164 103 161 122M161 114Q181 110 177 95Q158 97 161 114" fill="#829f89" stroke="#829f89" stroke-width="2"/>'),
};
const heading = (title, copy) => `<header class="cs-heading"><h2 id="cs-title">${title}</h2><p>${copy}</p></header>`;
const tabs = items => `<div class="cs-tabs" data-control-tablist hidden>${items.map(({key,tab})=>`<button type="button" id="cs-tab-${key}" data-control-tab="${key}">${tab}</button>`).join('')}</div>`;
const list = items => `<ul class="cs-points">${items.map(point=>`<li><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10L8 14L16 6"/></svg><span>${point}</span></li>`).join('')}</ul>`;
const scene = example => `<div class="cs-scene cs-scene-${example.key}"><span class="cs-ground"></span>${people[example.person]}${artwork[example.key]}</div>`;

export function controlStudySection(key) {
  if(key==='s') return `<section class="cs-control cs-choice" id="your-control" aria-labelledby="cs-title" data-control-tabs>
    ${heading('Make it yours.', 'Discover something new, catch up with your channels, or make more time away. You choose how Villow fits into your day.')}
    ${tabs(examples)}
    <div class="cs-stage">${examples.map(example=>`<article class="cs-panel cs-choice-panel" id="cs-panel-${example.key}" data-control-panel="${example.key}">
      ${scene(example)}<div class="cs-example-copy"><p class="cs-context">${example.context}</p><h3>${example.title}</h3>${list(example.points)}</div>
    </article>`).join('')}</div>
    <p class="cs-caption">A few possibilities. The choices are yours.</p>
  </section>`;
  if(key==='t') return `<section class="cs-control cs-three" id="your-control" aria-labelledby="cs-title">
    ${heading('Make it yours.', 'There’s no one right way to watch. Keep what you enjoy, and choose the boundaries that fit your life.')}
    <div class="cs-three-grid">${examples.map(example=>`<article class="cs-story cs-story-${example.key}">
      ${scene(example)}<p class="cs-context">${example.context}</p><h3>${example.tab}.</h3>${list(example.points)}
    </article>`).join('')}</div>
    <p class="cs-caption">Three examples, not three fixed modes. Make your own mix.</p>
  </section>`;
  if(key==='u') return `<section class="cs-control cs-day" id="your-control" aria-labelledby="cs-title" data-control-tabs>
    ${heading('Your feed. Your rules.', 'Choose what comes in, how long you watch and when to step away. There’s room for different days, too.')}
    ${tabs([{key:'workday',tab:'On a workday'},{key:'weekend',tab:'At the weekend'}])}
    <div class="cs-stage">${[
      {key:'workday',limit:30,away:'9 pm',note:'A shorter watch. An evening to yourself.'},
      {key:'weekend',limit:60,away:'10 pm',note:'A little more time for what you enjoy.'},
    ].map(day=>`<article class="cs-panel cs-day-panel" id="cs-panel-${day.key}" data-control-panel="${day.key}">
      <div class="cs-day-grid">
        <div class="cs-day-piece">${artwork.channels}<p class="cs-context">What you watch</p><h3>Your chosen channels</h3><p>A feed shaped around your interests.</p></div>
        <div class="cs-day-piece"><div class="cs-clock-art" aria-hidden="true"><svg viewBox="0 0 220 150" width="220" height="150" fill="none"><ellipse cx="110" cy="136" rx="62" ry="7" fill="#dce5d1"/><circle cx="110" cy="72" r="57" fill="#e5ebdc"/><circle cx="110" cy="72" r="47" fill="#fffdf6"/><path d="M110 36V72L${day.limit===30?'135 88':'91 91'}" stroke="#426a52" stroke-width="5" stroke-linecap="round"/><path d="M110 30V34M152 72H148M110 114V110M68 72H72" stroke="#a6b89e" stroke-width="3" stroke-linecap="round"/></svg><span>${day.limit}<small>min / day</small></span></div><p class="cs-context">How much</p><h3>${day.limit} minutes of watching</h3><p>A daily limit you choose.</p></div>
        <div class="cs-day-piece">${artwork.away}<p class="cs-context">When to step away</p><h3>Time away from ${day.away}</h3><p>A scheduled break for your evening.</p></div>
      </div><p class="cs-day-note">${day.note}</p>
    </article>`).join('')}</div>
    <p class="cs-caption">An example in the Villow app. Set your own channels, daily limits and breaks.</p>
  </section>`;
  throw new Error(`Unknown control study: ${key}`);
}
