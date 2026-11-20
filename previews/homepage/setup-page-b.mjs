import {setupComparisonB} from './setup-comparison-b.mjs';
import {extensionStoryB} from './setup-extension-story-b.mjs';
import {setupChoiceIcons} from './setup-choice-icons.mjs';

const optionHeading = (path,label,badge='') => `<div class="setup-option-heading"><div class="setup-option-title"><span class="setup-result-icon" aria-hidden="true">${setupChoiceIcons[path]}</span><h3>${label}</h3></div>${badge?`<span class="setup-option-badge">${badge}</span>`:''}</div>`;

// Reuse the grounded comparison and setup routes without changing the saved A.
export function setupPageBodyB() {
 const comparison = setupComparisonB();
 return `<section class="sp-width sp-hero setup-hero setup-b-hero" aria-labelledby="setup-title">
  <h1 id="setup-title">Three ways to use Villow.</h1>
 </section>
 <div class="sp-width setup-b-compare" id="compare-options">${comparison}</div>
 <section class="sp-width setup-guide" id="setup-question" aria-labelledby="setup-guide-title">
  <form id="setup-guide" hidden>
   <div class="setup-questions">
    <fieldset class="setup-question"><legend><h2 id="setup-guide-title">Do you want YouTube’s recommendations?</h2></legend><p>The videos YouTube suggests for you based on your activity.</p><div class="setup-answer-row"><label><input type="radio" name="youtube" value="yes"><span>Yes</span></label><label><input type="radio" name="youtube" value="no"><span>No</span></label></div></fieldset>
   <div id="setup-recommendation" class="setup-recommendation" aria-live="polite" aria-atomic="true" hidden>
    <div data-result="web" hidden><h2>Watch in Villow.</h2><div class="setup-option-cards setup-option-single"><article>${optionHeading('web','Villow app')}<p>A good fit if you want to step away from YouTube’s personalised recommendations and endless Shorts scrolling.</p><p>Build a finite feed from subscriptions, videos popular in your country and friends’ recommendations. Customise what appears, choose your limits, and use detailed insights and suggested adjustments to shape your viewing.</p><a class="sp-button" href="setup-instructions-b.html?path=web">Get Villow</a></article></div></div>
    <div data-result="options" hidden><h2>Two ways to watch.</h2><div class="setup-option-cards">
     <article>${optionHeading('extension','Villow extension','Quick start')}
      <p>Watch on YouTube with limits you choose. Try the extension first and add the Villow app later if you like.</p>
      <p>A good fit if you’d rather keep watching on YouTube than switch to Villow to watch your chosen videos.</p>
      <ul class="setup-option-features"><li>No Villow feed, friends or detailed insights.</li><li>Limits and usage stay separate in each browser.</li></ul>
      <a class="sp-button" href="setup-instructions-b.html?path=extension">Get the extension</a>
     </article>
     <article>${optionHeading('both','Villow app + extension','Recommended')}
      <p>Choose a few videos from YouTube’s recommendations, then watch them in Villow. The connected extension adds your picks to your Villow feed.</p>
      <p>We make switching easy, but that extra step is worth considering.</p>
      <ul class="setup-option-features"><li>Villow’s feed, friends and detailed insights.</li><li>Usage and supported limits sync across connected extensions.</li></ul>
      <a class="sp-button" href="setup-instructions-b.html?path=both">Get the app and extension</a>
     </article>
    </div><details class="setup-choice-story" id="app-extension-flow" aria-live="off">
     <summary aria-label="How Villow and the extension work together"><span class="setup-story-summary-label"><span>How</span><span class="sg-story-product-icons" aria-hidden="true">${setupChoiceIcons.both}</span><span>work together</span></span><svg class="setup-story-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
     <div class="setup-story-content">${extensionStoryB({overview:true,caption:false})}</div>
    </details></div>
   </div>
   </div>
  </form>
  <noscript><p class="setup-no-script">Explore the options: <a href="setup-instructions-b.html?path=web">set up the web app</a>, <a href="setup-instructions-b.html?path=extension">get the extension</a>, or <a href="setup-instructions-b.html?path=both">use both together</a>.</p></noscript>
 </section>`;
}
