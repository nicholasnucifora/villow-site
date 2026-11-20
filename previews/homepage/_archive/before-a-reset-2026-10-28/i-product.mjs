import {icons} from './i-data.js';
import {renderIllustration} from './i-illustration.mjs';
import {renderIControls} from './i-controls.mjs';
import {renderILibrary} from './i-library.mjs';
import {renderIConceptPanels} from './i-concepts.mjs';
import {renderICompany} from './i-company.mjs';
import {renderIFeedSave} from './i-feed-save.mjs';

const image=(name,alt,cls='')=>`<picture>${['title','title-controls','duration','delivery','reflection'].includes(name)?`<source media="(max-width:1000px)" srcset="assets/i-product-${name}-mobile.webp">`:''}<img class="${cls}" src="assets/i-product-${name}.webp" alt="${alt}" decoding="async"></picture>`;
const provenance='<span class="ip-source">Actual Villow interface · Example settings</span>';
const detail=(name,label='Inspect interface')=>`<a class="ip-detail" href="assets/i-product-${name}.webp" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`;
const screenshot=(name,alt)=>`<a class="ip-image-link" href="assets/i-product-${name}.webp" target="_blank" rel="noopener" aria-label="Inspect ${alt}">${image(name,alt)}</a>`;

function focus(){
 return `<div class="ip-focus" aria-label="Channel filters in Villow">
 <div class="ip-heading"><span class="ip-eyebrow">INSIDE VILLOW</span><h2>A feed you have a say in.</h2></div>
 <figure class="ip-focus-figure">
 ${screenshot('title','Villow title filter set to Must exclude, with reaction as an example phrase')}
 <figcaption>${provenance}${detail('title')}</figcaption>
 </figure>
 <p class="ip-benefit">Love a channel, but not every upload?<br>Filter the titles that reach your feed.</p></div>`;
}

function explore(){
 return `<div class="ip-explore" data-ip-explorer aria-label="Explore real Villow controls">
 <div class="ip-topic-tabs" role="tablist" aria-label="Ways to shape YouTube">
 ${[['feed','Your feed'],['boundaries','Your boundaries'],['time','Your time']].map(([key,label],index)=>`<button type="button" role="tab" id="ip-tab-${key}" aria-controls="ip-panel-${key}" aria-selected="${!index}" tabindex="${index?-1:0}" data-ip-topic="${key}">${label}</button>`).join('')}
 </div>
 <div class="ip-topic-panel" role="tabpanel" id="ip-panel-feed" aria-labelledby="ip-tab-feed" tabindex="0" data-ip-topic-panel="feed">
 <div class="ip-topic-heading"><span class="ip-eyebrow">CHANNEL FILTERS</span><h2>Keep what interests you.</h2></div>
 ${screenshot('title','Villow’s actual title filter controls')}
 <p>Include or exclude titles with the phrases you choose.</p><div class="ip-caption">${provenance}${detail('title')}</div>
 </div>
 <div class="ip-topic-panel" role="tabpanel" id="ip-panel-boundaries" aria-labelledby="ip-tab-boundaries" tabindex="0" data-ip-topic-panel="boundaries" hidden>
 <div class="ip-topic-heading"><span class="ip-eyebrow">DAILY LIMITS</span><h2>Leave room for your day.</h2></div>
 ${screenshot('limits','Villow default and daily viewing limits, using sample settings')}
 <p>Choose your daily viewing limits, including different limits for different days.</p><div class="ip-caption">${provenance}${detail('limits')}</div>
 </div>
 <div class="ip-topic-panel" role="tabpanel" id="ip-panel-time" aria-labelledby="ip-tab-time" tabindex="0" data-ip-topic-panel="time" hidden>
 <div class="ip-topic-heading"><span class="ip-eyebrow">OPTIONAL REFLECTION</span><h2>More than minutes watched.</h2></div>
 ${screenshot('reflection','Villow asks Was it worth your time, with Not worth it, Not sure, and Worth it choices')}
 <p>Time tells one part of the story. Your own judgment adds another.</p><div class="ip-caption">${provenance}${detail('reflection')}</div>
 </div></div>`;
}

function rhythm(){
 return `<div class="ip-rhythm" aria-label="Channel choices in Villow">
 <div class="ip-heading"><span class="ip-eyebrow">YOUR CHANNELS. YOUR WAY.</span><h2>What arrives. When it arrives.</h2></div>
 <figure><figcaption><span>01</span><p>Choose what fits.<small>A video length range for each channel.</small></p></figcaption>${screenshot('duration','Villow’s real video length controls with an example 2 to 20 minute range')}</figure>
 <figure><figcaption><span>02</span><p>Choose the rhythm.<small>Daily, or on your update schedule.</small></p></figcaption>${screenshot('delivery','Villow’s Daily and Scheduled upload delivery options')}</figure>
 <div class="ip-caption">${provenance}${detail('delivery')}</div>
 </div>`;
}

function editorial(){
 return `<div class="ip-editorial" aria-label="A closer look at Villow channel filters">
 <div class="ip-heading"><span class="ip-eyebrow">A LITTLE MORE SAY</span><h2>Make room for what you want.</h2></div>
 <figure class="ip-annotated"><figcaption><span>01</span><p>Videos that fit.<small>Choose a length range.</small></p></figcaption>${screenshot('duration','Villow’s video length slider set to an example range of 2 to 20 minutes')}</figure>
 <figure class="ip-annotated"><figcaption><span>02</span><p>Titles that fit.<small>Include or exclude phrases in titles.</small></p></figcaption>${screenshot('title-controls','Villow’s real Must exclude title filter with reaction as an example phrase')}</figure>
 <div class="ip-caption">${provenance}${detail('title')}</div>
 </div>`;
}

export function renderIProduct({stackHero=''}={}){
 return `${stackHero}<section class="i-hero i-hero-illustrated ip-hero" aria-labelledby="i-title" data-ip-view="stack" hidden>
 <div class="i-hero-inner i-width">
 <div class="i-hero-copy"><h1 id="i-title">Watch<br><span>intentionally.</span></h1><p class="i-lead">An app for watching YouTube with a feed that ends. Choose what reaches you, set your viewing boundaries, and reflect on what felt worthwhile.</p><a class="i-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started <span>${icons.arrow}</span></a></div>
 <div class="ip-product-space">${[['focus',focus],['explore',explore],['rhythm',rhythm],['editorial',editorial]].map(([key,render],index)=>`<div data-ip-view-panel="${key}"${index?' hidden':''}>${render()}</div>`).join('')}${renderIConceptPanels()}</div>
 </div>${renderIllustration()}</section>
 <section class="i-following" id="your-choices" aria-label="Your controls"><div class="i-width">${renderIControls()}<div data-i-feed-save hidden>${renderIFeedSave()}</div>${renderICompany()}<div data-i-stack-library>${renderILibrary()}</div></div></section>
 <footer class="i-preview-note i-width"><span>Villow · I · Card stack and product studies</span><span>Local previews · Sample videos and settings</span></footer>
 <div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-i-announcement></div>`;
}
