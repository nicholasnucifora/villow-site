// Local design baseline. The three-way comparison is grounded in the web app's
// attention sources and extension sync logic; setup routes follow the site.
const icon = content => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
const appIcon = icon('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>');
const browserIcon = icon('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-14-2h.01M10 7h.01m2 6v4m-2-2h4"/>');
const connectedIcon = icon('<rect x="2" y="3" width="13" height="11" rx="2"/><rect x="9" y="10" width="13" height="11" rx="2" fill="#dce7d0"/><path d="M9 14h13M5 6h.01M8 6h.01M12 12h.01M15 12h.01"/>');
const downloadIcon = icon('<path d="M12 3v12m-4-4 4 4 4-4M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>');
const mobileLabel = label => `<span class="setup-mobile-label" aria-hidden="true">${label}</span>`;

export function setupPageBody() {
 return `<section class="sp-width sp-hero setup-hero" aria-labelledby="setup-title">
  <p class="sp-eyebrow">Getting started</p>
  <h1 id="setup-title">Find your way <span>into Villow.</span></h1>
  <p class="setup-hero-lead">Choose the web app for a finite feed without YouTube’s personalised recommendations. Use the extension if you mainly watch on YouTube. Connect both for YouTube discovery alongside Villow’s insights and friends.</p>
 </section>

 <section class="sp-width setup-comparison-section" aria-labelledby="setup-compare-title">
  <h2 class="setup-section-kicker" id="setup-compare-title">Three ways to use Villow</h2>
  <div class="setup-comparison-wrap">
   <table class="setup-comparison" role="table" aria-labelledby="setup-compare-title">
    <colgroup><col class="setup-feature-col"><col><col><col></colgroup>
    <thead><tr><th scope="col"><span class="setup-sr-only">Feature</span></th><th scope="col" id="setup-web-column"><span class="setup-option-icon">${appIcon}</span><span>Villow web app</span><small>For a different feed</small></th><th scope="col" id="setup-extension-column"><span class="setup-option-icon">${browserIcon}</span><span>Extension on its own</span><small>For watching on YouTube</small></th><th scope="col" id="setup-combined-column"><span class="setup-option-icon">${connectedIcon}</span><span>Web app + extension</span><small>For moving between both</small></th></tr></thead>
    <tbody>
     <tr><th scope="row" id="setup-row-experience">The experience</th><td headers="setup-web-column setup-row-experience">${mobileLabel('Villow web app')}<p>A finite feed from subscriptions and videos popular in your country. YouTube’s personalised recommendations aren’t included.</p></td><td headers="setup-extension-column setup-row-experience">${mobileLabel('Extension on its own')}<p>Watch on YouTube, including its personalised recommendations, with limits you choose.</p></td><td headers="setup-combined-column setup-row-experience">${mobileLabel('Web app + extension')}<p>Use Villow’s feed and discover on YouTube with the extension. Save videos from YouTube into Villow.</p></td></tr>
     <tr><th scope="row" id="setup-row-habits">Your habits</th><td headers="setup-web-column setup-row-habits">${mobileLabel('Villow web app')}<p>Optional ratings, viewing insights and gentle nudges help you understand and shape your watching.</p></td><td headers="setup-extension-column setup-row-habits">${mobileLabel('Extension on its own')}<p>See today’s usage in this browser. Villow’s insights and suggestions aren’t included.</p></td><td headers="setup-combined-column setup-row-habits">${mobileLabel('Web app + extension')}<p>Your connected YouTube usage also informs Villow’s insights and gentle nudges.</p></td></tr>
     <tr><th scope="row" id="setup-row-friends">Friends</th><td headers="setup-web-column setup-row-friends">${mobileLabel('Villow web app')}<p>Watch together, share playlists and exchange video recommendations with friends.</p></td><td headers="setup-extension-column setup-row-friends">${mobileLabel('Extension on its own')}<p>No social features.</p></td><td headers="setup-combined-column setup-row-friends">${mobileLabel('Web app + extension')}<p>The web app’s shared watching, playlists and friends’ recommendations.</p></td></tr>
     <tr><th scope="row" id="setup-row-devices">Across devices</th><td headers="setup-web-column setup-row-devices">${mobileLabel('Villow web app')}<p>Your feed, progress, viewing time and reflections stay together across phone, tablet and computer.</p></td><td headers="setup-extension-column setup-row-devices">${mobileLabel('Extension on its own')}<p>Separate limits and usage in each browser where you install it.</p></td><td headers="setup-combined-column setup-row-devices">${mobileLabel('Web app + extension')}<p>Usage and supported limits stay together across Villow and every browser you connect.</p></td></tr>
    </tbody>
    <tfoot><tr><th scope="row"><span class="setup-sr-only">Choose how to begin</span></th><td><a class="sp-button" href="#web-app">Set up the web app</a></td><td><a class="sp-button-secondary" href="#extension">Get the extension</a></td><td><a class="sp-button-secondary" href="#use-together">Use both together</a></td></tr></tfoot>
   </table>
  </div>
  <p class="setup-connect-note">Both work on their own. YouTube’s personalised feed stays on YouTube when you connect them.</p>
 </section>

 <section class="sp-width setup-web-app setup-section" id="web-app" aria-labelledby="setup-web-title">
  <header class="setup-section-heading"><p class="sp-eyebrow">Villow web app</p><h2 id="setup-web-title">Your own place to watch.</h2><p>Create a private Villow, or join one run by someone you trust. Each person chooses their own viewing settings.</p></header>
  <div class="setup-web-routes">
   <article class="setup-host" id="create" aria-labelledby="setup-host-title">
    <p class="setup-route-meta">Allow about 30 minutes</p><h3 id="setup-host-title">Create your own Villow</h3><p>Villow Setup guides you through creating your private installation. Once it’s ready, you can invite friends.</p>
    <details class="setup-install"><summary>Set up Villow</summary><div class="setup-install-content"><p>Use a Windows computer for Setup. You’ll need Google, Google Cloud, Vercel and Supabase accounts.</p><button class="sp-button setup-download-button" type="button" disabled>${downloadIcon}<span>Download for Windows <small>.exe installer</small></span></button><p class="setup-unavailable">Download link being prepared.</p><p class="setup-platform-note">Setup for macOS and Linux is still undecided. Villow itself opens in a browser on phone, tablet and computer.</p><a class="sp-link" href="https://villow.app/developers#by-hand" target="_blank" rel="noopener">Prefer manual setup?</a></div></details>
   </article>
   <article class="setup-join" id="join" aria-labelledby="setup-join-title">
    <p class="setup-route-meta">No hosting setup</p><h3 id="setup-join-title">Join a friend’s Villow</h3><p>Open your friend’s link, sign in and choose your viewing settings. The owner needs to allow your Google account to sign in.</p><p class="setup-trust-note"><strong>Choose someone you trust.</strong> They control the hosting and database and can access the data stored there.</p><a class="sp-link" href="https://villow.app/privacy-overview" target="_blank" rel="noopener">Understand permissions and privacy</a>
   </article>
  </div>
  <div class="setup-hosting"><div><h3>Free software.<br>Hosting is your choice.</h3><p>Hosting uses Vercel and Supabase, whose free allowances may not cover a group.</p></div><details class="setup-costs"><summary>Hosting, costs and sharing</summary><div><p>If both Pro plans are needed, current base prices start at <strong>US$45/month combined</strong>, before tax and extra usage. Your total depends on plans and usage.</p><p class="setup-pricing-links"><a class="sp-link" href="https://vercel.com/pricing" target="_blank" rel="noopener">Vercel pricing</a><a class="sp-link" href="https://supabase.com/pricing" target="_blank" rel="noopener">Supabase pricing</a></p><p>Try a small group and monitor usage. You can upgrade, keep your group smaller, or revoke access later. Revoking access does not reset quotas or remove existing charges.</p><p>You decide what hosting yourself and friends is worth to you.</p><a class="sp-link" href="https://villow.app/running-villow" target="_blank" rel="noopener">Running your Villow</a></div></details></div>
  <aside class="setup-pairing" id="use-together" aria-labelledby="setup-pairing-title"><div><p class="sp-eyebrow">Web app + extension</p><h3 id="setup-pairing-title">Connect them when you’re ready.</h3></div><div><p><a href="#web-app">Create or join a Villow</a>, then <a href="#extension">install the extension</a>. Open a connect link from Villow in each browser you want to include.</p><p>Your connected YouTube time joins your Villow usage, with supported limits shared between them.</p></div></aside>
 </section>

 <section class="setup-extension-band" id="extension" aria-labelledby="setup-extension-title"><div class="sp-width setup-extension">
  <header class="setup-section-heading"><p class="sp-eyebrow">Villow extension</p><h2 id="setup-extension-title">Start in your browser.</h2><p>Choose daily time, video and recommendation limits, with calmer settings for YouTube. Install it in the browser you want to use.</p></header>
  <div class="setup-browser-stores" aria-label="Get the Villow extension">
   <a href="https://chromewebstore.google.com/detail/villow/cfgmdkobjfkacdamdfmbnifadbancelc" target="_blank" rel="noopener"><strong>Chrome</strong><span>Chrome Web Store</span></a>
   <a href="https://microsoftedge.microsoft.com/addons/detail/villow/knbdnoleancmiifdopoplpkmfgkfpmmm" target="_blank" rel="noopener"><strong>Edge</strong><span>Edge Add-ons</span></a>
   <a href="https://addons.mozilla.org/en-US/firefox/addon/villow/" target="_blank" rel="noopener"><strong>Firefox</strong><span>Firefox Add-ons</span></a>
   <button type="button" disabled><strong>Safari</strong><span>Not available yet</span></button>
  </div>
  <p class="setup-coverage-note">The extension works in supported browsers, not native YouTube apps or TVs. Connect each browser to include its YouTube usage in Villow.</p>
 </div></section>

 <section class="sp-width setup-return" aria-label="Return to the homepage"><p>Want another look at the experience?</p><a class="sp-link" href="r.html">Back to the homepage</a></section>`;
}

export const setupPageSources = [
 'https://villow.app/download',
 'src/content/pages/download.yaml',
 'src/content/pages/extension.yaml',
 'C:/Users/Nebula PC/Development/villow_extension/src/options/options.js:1273',
 'C:/Users/Nebula PC/Development/villow_extension/src/background.js:2994',
 'C:/Users/Nebula PC/Development/disconnect/lib/extension-attention.ts:144',
 'C:/Users/Nebula PC/Development/disconnect/lib/attention-vectors-api.ts:335',
 'https://vercel.com/pricing',
 'https://supabase.com/pricing',
];
