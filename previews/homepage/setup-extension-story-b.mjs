import {setupChoiceIcons} from './setup-choice-icons.mjs';

// YouTube's interactive feed and controls are shared with the app.
// The Home scene below is the app's real, isolated Home with fictional videos.
export function extensionStoryB({overview=false,caption=true}={}) {
 return `<figure class="sg-story${overview?' sg-story-overview':''}" data-story-device="desktop"${caption?'':' aria-label="How Villow and the extension work together"'}>${caption?`<figcaption aria-label="How Villow and the extension work together"><span>How</span><span class="sg-story-product-icons" aria-hidden="true">${setupChoiceIcons.both}</span><span>work together</span></figcaption>`:''}<div class="sg-story-sequence">
 <div class="sg-story-youtube"><div class="sg-story-demo" data-extension-story-demo></div></div>
 <div class="sg-story-handoff" aria-hidden="true"><svg width="24" height="30" viewBox="0 0 24 30" fill="none"><path d="M12 4v22m-7-7 7 7 7-7"/></svg></div>
 <div class="sg-story-home"><div class="sg-real-home" data-home-preview><iframe title="Villow Home example" sandbox="allow-scripts" loading="eager" tabindex="-1"></iframe></div></div>
 </div></figure>`;
}
