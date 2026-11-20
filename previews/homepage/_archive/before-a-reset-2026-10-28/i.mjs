import {icons,feedIds,stackMarkup} from './i-data.js';
import {renderIControls} from './i-controls.mjs';
import {renderLandscape} from './i-landscape.mjs';
import {renderIllustration} from './i-illustration.mjs';
import {renderILibrary} from './i-library.mjs';
import {renderI2} from './i2-section.mjs';
import {renderI3} from './i3-section.mjs';
import {renderI4} from './i4-section.mjs';
import {renderIProduct} from './i-product.mjs';
const sprout='<svg viewBox="0 0 96 96" fill="none" aria-hidden="true"><path d="M48 76V39" stroke="#43836b" stroke-width="3" stroke-linecap="round"/><path d="M48 53C29 54 19 43 19 28C37 27 49 37 48 53Z" fill="#8ebda3"/><path d="M48 43C47 26 60 18 77 20C77 36 65 46 48 43Z" fill="#3e8b70"/><path d="M31 78C42 74 55 74 66 78" stroke="#c1d8bd" stroke-width="3" stroke-linecap="round"/></svg>';
const confetti=Array.from({length:16},(_,n)=>{const a=(n/16)*Math.PI*2;return `<i style="--confetti-x:${Math.round(Math.cos(a)*(100+(n%3)*18))}px;--confetti-y:${Math.round(Math.sin(a)*105-35)}px;--confetti-turn:${n%2?-130:160}deg;--confetti-delay:${(n%4)*28}ms;--confetti-color:${['#5b9d7e','#a8cdb5','#e4c87d','#d8aa89'][n%4]}"></i>`;}).join('');
export function renderI({version='I',layout='i1',stackHeroOnly=false}={}){
const library=renderILibrary();
const refined=version==='I'&&layout==='i1';
if(refined&&!stackHeroOnly)return renderIProduct({stackHero:renderI({version,layout,stackHeroOnly:true})});
const following=layout==='i2'?renderI2(library):layout==='i3'?renderI3(library):layout==='i4'?renderI4(library):renderIControls()+library;
const titleId=stackHeroOnly?'i-stack-title':'i-title';
const hero=`<section class="i-hero${refined?' i-hero-illustrated':''}" aria-labelledby="${titleId}"${stackHeroOnly?' data-i-stack-hero':''}>
<div class="i-hero-inner i-width">
<div class="i-hero-copy"><h1 id="${titleId}">Watch<br><span>intentionally.</span></h1><p class="i-lead">An app for watching YouTube with a finite feed and controls you choose. Keep what interests you. Leave room for what’s next.</p><a class="i-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started <span>${icons.arrow}</span></a></div>
<div class="i-stack-experience" aria-labelledby="stack-title">
<h2 id="stack-title" class="sr-only">Try a five-video sample feed</h2>
<div class="i-deck">
<div class="i-stack-stage" data-i-stack>${stackMarkup(feedIds)}</div>
<div class="i-stack-complete" data-i-complete hidden><div class="i-confetti" aria-hidden="true">${confetti}</div><span class="i-complete-sprout">${sprout}</span><h2 tabindex="-1">All done.</h2><p>A little room for what’s next.</p><button type="button" class="i-replay" data-i-action="reset" aria-label="Try the stack again" title="Try again">${icons.undo}</button></div>
</div>
</div></div>
${refined?renderIllustration():renderLandscape()}
</section>`;
if(stackHeroOnly)return hero;
return `${hero}<section class="i-following" id="your-choices" data-i-layout="${layout}" aria-label="Your controls and Watch Later">
<div class="i-width">${following}</div>
</section>
<footer class="i-preview-note i-width"><span>Villow · ${refined?'I':version==='I'?layout.toUpperCase():version} · Watch intentionally</span><span>Interactive study · Sample videos from the supplied product images</span></footer>
<div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-i-announcement></div>`;
}

