const close = '<button type="button" class="help-dialog-close" data-close-dialog aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
const emailSent = `<div class="help-email-sent" data-email-sent hidden><p><span data-email-copy>Your link should arrive shortly at</span><br><strong data-email-address></strong></p><p class="help-email-hint">Check your spam folder too.</p><div class="help-email-actions"><button class="help-text-button" type="button" data-email-resend>Resend email</button><button class="help-text-button" type="button" data-email-edit>Use another email</button></div><p class="sr-only" role="status" data-email-announcement></p></div><div class="help-flow-error" role="alert" data-email-error hidden><strong>We couldn’t send your link.</strong><p data-email-error-message></p></div>`;
const supporterReward = `<div class="help-supporter-reward" data-discord-reward hidden><svg viewBox="0 0 180 150" fill="none" aria-hidden="true"><circle cx="90" cy="73" r="55" fill="#e7eddc"/><ellipse cx="90" cy="133" rx="38" ry="5" fill="#dce5cf"/><path d="M90 128V66" stroke="#64876b" stroke-width="3.5" stroke-linecap="round"/><path d="M90 94C60 96 43 76 49 56c28-1 47 16 41 38Z" fill="#a8bf98"/><path d="M90 75c-2-31 19-47 45-44-1 30-22 47-45 44Z" fill="#709777"/><path d="m61 67 29 27m0-19 30-29" stroke="#fbfaf3" stroke-width="2" stroke-linecap="round"/><path d="m39 33 2-7 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#b99b61"/><circle cx="143" cy="94" r="3" fill="#b99b61"/><circle cx="65" cy="21" r="2" fill="#a4b891"/></svg><div class="help-reward-roles"><span>Supporter <span aria-hidden="true">✓</span></span><span data-discord-ongoing hidden>Ongoing Supporter <span aria-hidden="true">✓</span></span></div></div>`;

export function helpSupportBody() {
  return `<section class="help-funding" id="financial-support" aria-labelledby="help-funding-title" data-support>
    <div class="help-checkout-return" data-checkout-return role="status" hidden><h3 data-checkout-return-title></h3><p data-checkout-return-copy></p><button class="help-text-button" type="button" data-checkout-return-retry hidden>Check again</button></div>
    <dialog class="help-dialog" data-confirm-panel aria-labelledby="help-confirm-title">${close}
      <h3 id="help-confirm-title" tabindex="-1">Remove your public details?</h3><p data-confirm-copy>Your name, notes and shared amounts will disappear. You’ll keep your supporter benefits.</p>
      <div class="help-community"><button type="button" class="sp-button" data-confirm>Remove my public details</button><button type="button" class="sp-button-secondary" data-keep>Keep my details</button></div><p role="status" data-confirm-status></p><button type="button" class="sp-button help-dialog-primary" data-removal-retry hidden>Email me a new link</button>
    </dialog>
    <dialog class="help-dialog" data-discord-confirm aria-labelledby="help-discord-confirm-title">${close}
      <h3 id="help-discord-confirm-title" tabindex="-1">Checking your link…</h3><p data-discord-confirm-copy></p>
      <form method="post" data-discord-start hidden><input type="hidden" name="token" data-discord-token><button class="sp-button help-dialog-primary" type="submit" disabled>Connect Discord</button></form>
      <button class="help-text-button help-disconnect-action" type="button" data-discord-disconnect hidden disabled>Disconnect</button>
      <div class="help-flow-error" role="alert" data-discord-confirm-error hidden><p data-discord-confirm-error-message></p></div>
      <button class="sp-button help-dialog-primary" type="button" data-discord-confirm-retry hidden>Try again</button>
      <button class="help-text-button" type="button" data-discord-change-email hidden>Use another email</button>
      <p role="status" data-discord-confirm-status></p>
    </dialog>
    <dialog class="help-dialog" data-discord-details aria-labelledby="help-discord-title">${close}
      <h3 id="help-discord-title" tabindex="-1">Connect Discord.</h3><p>Verify your payment email, then choose whether to connect Discord. We match your Discord ID to your supporter records and manage your roles. <a href="/site-privacy#optional-discord-connection">Connection privacy</a>.</p>
      <div data-email-flow="discord"><form data-discord-request><label for="help-discord-email">Email used for your payment</label><input id="help-discord-email" type="email" name="email" autocomplete="email" required placeholder="you@example.com"><button class="sp-button help-dialog-primary" type="submit" disabled>Email me a link</button></form>${emailSent}</div>
      <div data-discord-result hidden><div data-discord-result-message role="status"><p data-discord-return></p></div>${supporterReward}<a class="sp-button help-dialog-primary" data-discord-server href="https://discord.gg/kBXuDtHFsW" target="_blank" rel="noopener" hidden>Open Discord</a><button class="sp-button help-dialog-primary" type="button" data-discord-retry hidden>Try again</button></div>
    </dialog>
    <dialog class="help-dialog" id="help-manage-message" aria-labelledby="help-privacy-title">${close}
      <h3 id="help-privacy-title" tabindex="-1">Sharing is your choice.</h3><p>If you agree at checkout, your name, note and contribution amount may appear on Villow and other Fix the Web projects. <span data-review-privacy>Messages are manually reviewed before they appear publicly.</span></p><p>You can remove your public details without losing supporter benefits. We use your payment email to send a verification link through Resend. <a href="/site-privacy#payments-and-public-supporter-details">Support privacy</a>.</p>
      <div data-email-flow="removal"><h4 data-removal-title tabindex="-1">Remove my public details</h4><form data-removal><label for="help-removal-email">Email used for your payment</label><input id="help-removal-email" type="email" name="email" autocomplete="email" required placeholder="you@example.com"><button class="sp-button help-dialog-primary" type="submit" disabled>Email me a removal link</button></form>${emailSent}</div>
    </dialog>
    <div class="help-support-grid">
    <div class="help-funding-intro"><h2 id="help-funding-title">Help the good things grow.</h2><p>Your support gives Villow more time for development, maintenance and the little details that make a difference. It also helps Fix the Web work towards better online spaces.</p>
      <div class="help-discord-benefit"><h3>A little closer to the project.</h3><p>Any contribution gives you access to our private Discord chat while the supporter community operates, subject to its community rules. Monthly supporters also get an <strong>Ongoing Supporter</strong> role.</p><button type="button" class="help-connect-button" data-open-discord>Connect Discord</button></div>
    </div>
    <div class="help-payment-side">
      <form class="help-donation" data-checkout>
        <h3>A little goes a long way.</h3><p class="help-donation-intro">Entirely optional. Choose what works for you. <span data-review-note>Public messages appear after review.</span></p>
        <fieldset class="help-frequency"><legend class="sr-only">How often would you like to contribute?</legend><label><input type="radio" name="kind" value="once" checked><span>One-time</span></label><label><input type="radio" name="kind" value="monthly"><span>Monthly</span></label></fieldset>
        <div class="help-amount-heading"><span>Choose an amount</span><label class="help-currency"><span class="sr-only">Display currency</span><span data-currency-label aria-hidden="true">AUD</span><select data-currency aria-describedby="help-exchange-note"><option value="AUD">AUD — Australian dollar</option></select></label></div>
        <fieldset class="help-amounts"><legend class="sr-only">Choose an amount</legend>${[5, 10, 20].map(amount => `<label><input type="radio" name="amount" value="${amount}"${amount === 10 ? ' checked' : ''}><span><strong data-preset-amount="${amount}">$${amount}</strong><small data-per-month hidden>/ month</small></span></label>`).join('')}<div class="help-custom-choice" data-custom-option><label data-custom-label><input type="radio" name="amount" value="custom"><span>Choose another amount</span></label><div class="help-custom-amount" data-custom-input hidden><span aria-hidden="true">A$</span><label class="sr-only" for="help-custom-value">Your amount in Australian dollars</label><input id="help-custom-value" name="customAmount" type="text" inputmode="decimal" autocomplete="off" maxlength="9" placeholder="0" disabled></div></div></fieldset>
        <div class="help-pay-wrap" data-pay-wrap><button type="submit" class="help-primary help-pay" data-pay disabled><span data-pay-label>Support with A$10</span></button><span class="help-amount-tip" id="help-amount-tip" role="tooltip" data-amount-tip hidden></span></div>
        <p class="help-exchange-note" id="help-exchange-note" data-exchange-note hidden></p>
        <p class="help-payment-status" role="status" data-payment-status>Connecting to secure checkout…</p>
        <p class="help-donation-intro">Monthly support repeats until cancelled through “Manage monthly support”. <a href="/terms#support">Support terms (draft)</a> · <a href="/site-privacy">Website privacy</a></p>
        <noscript><p>Please enable JavaScript to choose an amount and continue to secure checkout.</p></noscript>
      </form>
      <div class="help-inline-tools"><a href="https://billing.stripe.com/p/login/14AcN6c7ph2D9fMgkd5J600" target="_blank" rel="noopener noreferrer" data-portal hidden>Manage monthly support</a><span data-portal-unavailable>Payment management is loading…</span><button type="button" data-open-removal>Sharing & privacy</button></div>
    </div>
    </div>
      <section class="help-support-notes" id="supporter-notes" aria-label="Supporter messages" data-support-notes hidden>
        <h3 class="help-support-notes-title">Notes from supporters</h3>
        <p class="sr-only" id="help-message-instructions">Click any note to read it. Use the left and right arrow keys to browse, Enter to open a note, and Space to pause or resume the row.</p>
        <div class="help-message-viewport" data-message-viewport tabindex="0" role="group" aria-label="Supporter messages, first row" aria-describedby="help-message-instructions">
          <ol class="help-supporters" data-supporters aria-label="Recent supporter messages" aria-live="off"></ol>
        </div>
        <div class="help-message-viewport" data-message-viewport-secondary tabindex="0" role="group" aria-label="Supporter messages, second row" aria-describedby="help-message-instructions" hidden>
          <ol class="help-supporters" data-supporters-secondary aria-label="More supporter messages" aria-live="off"></ol>
        </div>
        <span class="sr-only" role="status" data-message-announcement></span>
      </section>
  </section>`;
}
