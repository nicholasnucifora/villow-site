import {setupWebOptionsB} from './setup-web-options-b.mjs';
import {extensionGuideB,extensionStoryB} from './setup-extension-guide-b.mjs';
import {setupChoiceIcons} from './setup-choice-icons.mjs';

const setupPaths = [
 {path:'web',name:'Villow app',description:'Your own place to watch.'},
 {path:'extension',name:'Villow extension',description:'Keep watching on YouTube.'},
 {path:'both',name:'Villow app + extension',description:'Choose on YouTube. Watch in Villow.'},
];

export function setupInstructionsBodyB() {
 const web = setupWebOptionsB();
 const connected = `<section class="sp-width setup-connected-instructions" data-instructions-section="connection" id="use-together"><details class="setup-connection-details"><summary><span class="setup-connection-copy"><strong>The extension comes next.</strong><span>Once your Villow is ready, it will guide you through installing and connecting the extension. <span class="setup-connection-link">Preview setup now.</span></span></span></summary><div class="sg-connected-layout">${extensionStoryB()}${extensionGuideB('connected',true)}</div></details></section>`;
 const extension = `<section class="setup-extension-band" id="extension"><div class="sp-width setup-extension sg-standalone">${extensionGuideB('standalone')}</div></section>`;
 return `<header class="sp-width setup-instructions-heading"><a class="setup-instructions-back" href="setup-b.html"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>Getting started</a><h1>Set up Villow.</h1><p>You can change your choice here at any time.</p></header>
 <nav class="sp-width setup-path-choices" aria-label="Choose your setup">${setupPaths.map(({path,name,description})=>`<a class="setup-path-choice" href="setup-instructions-b.html?path=${path}" data-instructions-path="${path}"${path==='both'?' aria-current="page"':''}><span class="setup-path-icon" aria-hidden="true">${setupChoiceIcons[path]}</span><span class="setup-path-name">${name}</span><span class="setup-path-description">${description}</span></a>`).join('')}</nav>
 <div class="setup-instructions-content" data-setup-content><div data-setup-content-inner>
 <section class="sp-width setup-instructions-intro" aria-labelledby="setup-current-title"><h2 id="setup-current-title" data-instructions-title>Set up or join a Villow.</h2><p data-instructions-lead>Use your own installation, or join someone you trust.</p></section>
 <div data-instructions-section="web"><div class="sp-width setup-path-branch" aria-hidden="true"><svg viewBox="0 0 1090 72" preserveAspectRatio="none" fill="none"><path d="M545 0v14M545 14C545 42 266 34 266 72M545 14C545 42 824 34 824 72"/></svg></div>${web}</div><div class="setup-connection-slot" data-connection-slot>${connected}</div>
 <div data-instructions-section="extension">${extension}</div></div></div>`;
}
