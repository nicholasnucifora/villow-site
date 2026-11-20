import {extensionStoreMarkup} from '../../src/lib/extension-store-links.js';
const urls = {
 chrome:'https://chromewebstore.google.com/detail/villow/cfgmdkobjfkacdamdfmbnifadbancelc',
 edge:'https://microsoftedge.microsoft.com/addons/detail/villow/knbdnoleancmiifdopoplpkmfgkfpmmm',
 firefox:'https://addons.mozilla.org/en-US/firefox/addon/villow/',
};
const storeBadge = (store) => store === 'firefox'
 ? `<a class="sg-store" href="${urls.firefox}" target="_blank" rel="noopener" aria-label="Get Villow from Firefox Add-ons"><img src="assets/store-badges/firefox-add-ons.png" width="172" alt="Get the add-on — Firefox Add-ons"></a>`
 : `<a class="sg-store" href="${urls[store]}" target="_blank" rel="noopener"><img src="assets/store-badges/${store==='chrome'?'chrome-web-store':'edge-add-ons'}.png" width="${store==='chrome'?206:226}" alt="${store==='chrome'?'Available in the Chrome Web Store':'Get it from Microsoft Edge'}"></a>`;
const icons = {
 computer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8m-4-5v5"/></svg>',
 ios:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.9 12.8c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.5 2.2-1.5 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.5 2.1 1 0 1.4-.6 2.7-.6 1.2 0 1.6.6 2.7.6 1.1 0 1.9-1 2.5-2 .8-1.2 1.1-2.5 1.1-2.6-.1 0-2.7-1.1-2.7-2.8Zm-2.2-6.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.4-1Z"/></svg>',
 android:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m6.5 6-2-3m13 3 2-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 13a9 9 0 0 1 18 0H3Z"/><circle cx="8" cy="9.5" r="1" fill="var(--sg-icon-eye)"/><circle cx="16" cy="9.5" r="1" fill="var(--sg-icon-eye)"/><path d="M4 14h16v3a2 2 0 0 1-2 2h-1v2a1 1 0 0 1-2 0v-2H9v2a1 1 0 0 1-2 0v-2H6a2 2 0 0 1-2-2v-3Zm-3 0a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4Zm20 0a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4Z"/></svg>',
};
const mobileNote = '<p class="sg-small sg-browser-note">Use YouTube in the browser where you installed Villow. The extension doesn’t run in the YouTube app.</p>';
const step = (text, extra='', detail='') => `<li><div><h5 class="sg-step-title">${text}</h5>${detail?`<p class="sg-step-copy">${detail}</p>`:''}${extra}</div></li>`;

export function extensionGuideB(id, connected=false) {
 const computerStores = extensionStoreMarkup('assets/store-badges/', true);
 const androidSteps = connected
  ? step('Install Firefox if you don’t have it.','<a class="sg-text-link" href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank" rel="noopener">Get Firefox</a>')+step('Open the add-on listing in Firefox, then add Villow.',storeBadge('firefox'))+step('Open your Villow in Firefox to connect it.')
  : step('Start with Firefox.','<a class="sg-text-link" href="https://play.google.com/store/apps/details?id=org.mozilla.firefox" target="_blank" rel="noopener">Get Firefox</a>','Install Firefox on your phone or tablet if you don’t have it.')+step('Add Villow.',storeBadge('firefox'),'Open this listing in Firefox and follow the installation prompts.')+step('Watch in Firefox.','','Open YouTube in Firefox, then choose your limits in Villow’s extension settings.');
 const iosSteps = connected
  ? step('Install Orion.','<a class="sg-text-link" href="https://apps.apple.com/app/orion-browser-by-kagi/id1484498200" target="_blank" rel="noopener">Get Orion</a>')+step('In Orion, open Settings → Extensions and enable Chrome extensions.')+step('Open this listing in Orion, then add Villow.',storeBadge('chrome'))+step('Open your Villow in Orion to connect it.')
  : step('Start with Orion.','<a class="sg-text-link" href="https://apps.apple.com/app/orion-browser-by-kagi/id1484498200" target="_blank" rel="noopener">Get Orion</a>','Install Orion on your iPhone or iPad.')+step('Enable Chrome extensions.','','In Orion, open Settings → Extensions and enable Chrome extensions.')+step('Add Villow.',storeBadge('chrome'),'Open this listing in Orion, then follow the installation prompts.')+step('Watch in Orion.','','Open YouTube in Orion, then choose your limits in Villow’s extension settings.');
 return `<div class="setup-extension-guide" data-extension-guide data-connected="${connected}">
  <div class="sg-controls" hidden><h3>Where will you use the extension?</h3><div class="sg-devices" role="group" aria-label="Device for the extension">${Object.entries(icons).map(([key,art])=>`<button type="button" data-device="${key}" aria-pressed="${key==='computer'}">${art}<span>${key==='computer'?'Computer':key==='ios'?'iPhone / iPad':'Android'}</span></button>`).join('')}</div></div>
  <section class="sg-panel sg-computer-panel" data-install-panel="computer" aria-labelledby="${id}-computer"><h4 id="${id}-computer">Add Villow to your browser.</h4>${computerStores}<p class="sg-desktop-next">${connected?'Once installed, finish connecting it in your Villow.':'Once installed, open YouTube and choose your limits in the extension’s settings.'}</p></section>
  <section class="sg-panel" data-install-panel="android" aria-labelledby="${id}-android"><h4 id="${id}-android">Use Firefox on Android</h4><ol class="sg-steps">${androidSteps}</ol><p class="sg-small">Choose Firefox if your device asks which app to use.</p>${mobileNote}</section>
  <section class="sg-panel" data-install-panel="ios" aria-labelledby="${id}-ios"><h4 id="${id}-ios">Use Orion on iPhone or iPad</h4><ol class="sg-steps">${iosSteps}</ol><p class="sg-small">Safari support isn’t available yet.</p>${mobileNote}</section>
  ${connected?'<aside class="sg-connect"><h4>Connect it to Villow</h4><p>In Villow, open <strong>Extension</strong> and select <strong>Create connect link</strong>. Paste the link into the extension’s settings, select <strong>Connect</strong>, then open YouTube in that browser.</p></aside>':''}
 </div>`;
}

export {extensionStoryB} from './setup-extension-story-b.mjs';
