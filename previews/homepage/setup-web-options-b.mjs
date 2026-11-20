export function setupWebOptionsB() {
 return `<section class="sp-width setup-web-options" id="web-app" aria-label="Two ways to get your Villow">
  <article class="setup-web-option setup-create-option" id="create" aria-labelledby="setup-create-heading">
   <h2 id="setup-create-heading">Create your own Villow.</h2>
   <p>Villow Setup guides you through creating your private Villow. Use it yourself, or invite friends. Setup takes about <strong>30 minutes</strong>.</p>
   <p class="setup-hosting-brief">Hosting for friends may eventually require paid plans. <a href="setup-hosting-b.html" data-hosting-link>See hosting costs and sharing</a></p>
   <div class="setup-create-actions"><button class="sp-button setup-download-button" type="button" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/></svg><span>Download for Windows <small>.exe installer</small></span></button><div class="setup-platform-note"><p class="setup-download-note">macOS and Linux support coming soon.</p><a class="setup-manual-link" href="https://villow.app/developers#by-hand" target="_blank" rel="noopener">Set up manually</a></div></div>
  </article>
  <article class="setup-web-option setup-join-option" id="join" aria-labelledby="setup-join-heading">
   <h2 id="setup-join-heading">Join a friend’s Villow.</h2>
   <p>Joining a friend’s Villow is simple. If you create your own, you can invite friends to join this way too.</p>
   <ol class="setup-join-steps"><li>Ask them to invite your Google account.</li><li>Open their Villow link and sign in.</li></ol>
   <div class="setup-option-explanation"><h3>Choose a host you trust</h3><p>The owner can access data stored in their Villow, such as your viewing history and usage. Signing in with Google doesn’t give them your Google password.</p><a class="setup-privacy-link" href="https://villow.app/privacy-overview" target="_blank" rel="noopener">Understand permissions and privacy</a></div>
  </article>
 </section>`;
}
