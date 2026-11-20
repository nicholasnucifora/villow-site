import { roundedEstimate, money, amountIssue } from './help-currency.js';
import { mountSupporterFeed } from './help-support-feed.js';
import { mountCheckoutReturn } from './help-checkout-return.js';
import { createSupportPreview, applySupportPreview, previewLocation } from './help-preview-scenarios.js';
import { mountSupportStates } from './help-preview-controls.js';
import { mountSupportPreviewMotion } from './help-preview-motion.js';
const preview = createSupportPreview(location.search);
function previewNavigate(state) {
  if (window.parent !== window) window.parent.postMessage({ type: 'help-preview-select', state }, location.origin);
  else location.assign(previewLocation(state, location.href));
}
if (preview) {
  document.documentElement.dataset.supportPreview = preview.state.id;
  // A second barrier, in addition to the fixture transport: no API calls or
  // native form navigation can escape a visual state preview.
  const policy = document.createElement('meta'); policy.httpEquiv = 'Content-Security-Policy';
  policy.content = "connect-src 'none'; form-action 'none'"; document.head.append(policy);
  document.addEventListener('click', event => {
    if (event.target.closest('a[href]')) event.preventDefault();
  }, true);
} else mountSupportStates();
mountSupportPreviewMotion();
// Owner-authorised live integration; design files still remain local.
const api = 'https://fixtheweb-support.nuciforan.workers.dev/v1/projects/villow';
const root = document.querySelector('[data-support]');
if (root) {
  const get = selector => root.querySelector(selector);
  const checkout = get('[data-checkout]');
  const pay = get('[data-pay]');
  const status = get('[data-payment-status]');
  const custom = get('#help-custom-value');
  const removal = get('[data-removal]');
  const openDialog = dialog => { if (!dialog.open) dialog.showModal(); };
  root.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  root.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  let enabled = false;
  let configured = false;
  let token = null;
  // Explicit all-sample view. The normal loopback preview adds only enough
  // labelled samples for two distinct rows while real messages are sparse.
  let exampleMode = new URLSearchParams(location.search).get('example-messages') === '1';
  let checkoutBusy = false;
  let currency = 'AUD';
  let rates = { AUD: 1 };
  let discordEnabled = false;
  let discordToken = null;
  const examples = [
    { displayName: 'Alex', message: 'A calmer way to spend time online. I came for a little more control over my feed, and stayed because the small details make it feel like someone is on my side. Thank you.', kind: 'monthly', monthlyStatus: 'active', date: '2026-11-03' },
    { displayName: 'Sam', message: 'Small projects with big ideas deserve room to grow. Keep going!', kind: 'once', date: '2026-11-02' },
    { displayName: 'Taylor', message: 'Thanks for putting people first. Looking forward to what comes next.', kind: 'monthly', monthlyStatus: 'active', date: '2026-11-01' },
    { displayName: 'Jamie', message: 'The internet can feel different. I love having somewhere that helps me choose what to watch, then gives me room to get on with the rest of my day. Thanks for taking the time to build this with care. Happy to support the small joys that make it feel human.', kind: 'once', date: '2026-10-31' },
    { displayName: 'Morgan', message: 'More room for the things I actually care about. Thank you.', kind: 'monthly', monthlyStatus: 'active', date: '2026-10-30' },
    { displayName: 'Riley', message: 'Here’s to thoughtful tools and a better web.', kind: 'once', date: '2026-10-29' },
    { displayName: 'Casey', message: 'Love seeing this idea take shape, one update at a time.', kind: 'once', date: '2026-10-28' },
    { displayName: 'Jordan', message: 'A little encouragement from someone cheering you on.', kind: 'monthly', monthlyStatus: 'active', date: '2026-10-27' },
    { displayName: 'Robin', message: 'It’s good to have a choice about how we spend our time.', kind: 'once', date: '2026-10-26' },
  ];
  examples.forEach((entry, index) => {
    entry.amount = [500, 1000, 2000, 1234][index % 4];entry.currency = 'aud';
    entry.date = new Date(Date.now() - (index + 1) * 86400000).toISOString().slice(0, 10);
  });
  const failure = 'Something went wrong. Please try again in a moment.';
  async function request(action, body) {
    if (preview) return preview.request(action, body);
    const response = await fetch(`${api}/${action}`, {
      method: body ? 'POST' : 'GET', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(20000),
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok) { const error = new Error(data.error || failure); error.status = response.status; throw error; }
    return data;
  }
  function updateAmount() {
    let data = new FormData(checkout);
    const once = data.get('kind') === 'once';
    if (!once && data.get('amount') === 'custom') {
      get('input[name="amount"][value="10"]').checked = true;
      data = new FormData(checkout);
    }
    const isCustom = once && data.get('amount') === 'custom';
    get('[data-custom-option]').hidden = !once;
    get('[data-custom-label]').hidden = isCustom;
    get('[data-custom-input]').hidden = !isCustom;
    custom.disabled = !isCustom;
    custom.required = isCustom;
    root.querySelectorAll('[data-per-month]').forEach(el => { el.hidden = once; });
    const amount = isCustom ? custom.value : data.get('amount');
    const issue = amountIssue(amount);
    const valid = !issue;
    const foreign = currency !== 'AUD';
    const displayable = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) <= 10000;
    const formatted = displayable ? money(foreign ? roundedEstimate(Number(amount), rates[currency], currency) : Number(amount), currency) : '';
    get('[data-pay-label]').textContent = `Support${formatted ? ` with ${formatted}` : ''}${once ? '' : ' / month'}`;
    pay.disabled = !enabled || !configured || !valid || checkoutBusy;
    pay.setAttribute('aria-busy', String(checkoutBusy));
    const wrap = get('[data-pay-wrap]');
    const tip = get('[data-amount-tip]'); tip.textContent = issue; tip.hidden = valid;
    wrap.classList.toggle('has-amount-issue', !valid);
    if (valid) { wrap.removeAttribute('tabindex'); wrap.removeAttribute('aria-describedby'); }
    else { wrap.tabIndex = 0; wrap.setAttribute('aria-describedby', 'help-amount-tip'); }
    custom.setAttribute('aria-invalid', String(isCustom && !valid && !!amount));
    root.querySelectorAll('[data-preset-amount]').forEach(el => {
      const aud = Number(el.dataset.presetAmount);
      el.textContent = foreign ? money(roundedEstimate(aud, rates[currency], currency), currency) : `$${aud}`;
      el.classList.toggle('help-price-long', el.textContent.length > 8);
      el.classList.toggle('help-price-very-long', el.textContent.length > 12);
    });
    get('[data-currency-label]').textContent = currency;
    get('[data-exchange-note]').hidden = !foreign;
    get('[data-exchange-note]').textContent = foreign
      ? `${displayable ? `Charged ${money(Number(amount))}${once ? '' : ' per month'}. ` : ''}Conversion is an estimate; your bank’s rate may differ.`
      : '';
  }
  checkout.addEventListener('input', updateAmount);
  checkout.addEventListener('change', event => {
    updateAmount();
    if (event.target.value === 'custom') custom.focus();
  });
  get('[data-currency]').addEventListener('change', event => {
    currency = Object.hasOwn(rates, event.target.value) ? event.target.value : 'AUD';
    updateAmount();
  });
  const ratesReady = (async () => {
    try {
      const result = await request('exchange-rates');
      if (result.base !== 'AUD') return;
      const names = new Intl.DisplayNames(['en'], { type: 'currency' });
      const currencies = new Set(Intl.supportedValuesOf('currency').filter(code => !['XAU', 'XAG', 'XPD', 'XPT', 'XDR', 'XXX', 'XTS'].includes(code)));
      for (const [code, rate] of Object.entries(result.rates)) {
        if (code === 'AUD' || !currencies.has(code) || !Number.isFinite(rate) || rate <= 0) continue;
        rates[code] = rate;
        const option = document.createElement('option'); option.value = code;
        option.textContent = `${code} — ${names.of(code)}`;
        get('[data-currency]').append(option);
      }
    } catch {
      get('[data-currency]').disabled = true;
      get('[data-currency]').title = 'Currency estimates are temporarily unavailable.';
    }
  })();
  checkout.addEventListener('submit', async event => {
    event.preventDefault();
    if (!enabled || !configured || checkoutBusy) return;
    const data = new FormData(checkout);
    const amount = data.get('amount') === 'custom' ? custom.value : String(data.get('amount'));
    if (amountIssue(amount)) { updateAmount(); custom.focus(); return; }
    checkoutBusy = true; updateAmount(); status.textContent = 'Opening checkout…';
    try {
      const result = await request('checkout', { kind: data.get('kind'), amount });
      if (preview) { previewNavigate('payment-complete'); return; }
      const target = new URL(result.url);
      if (!['https://checkout.stripe.com', 'https://buy.stripe.com'].includes(target.origin)) throw new Error(failure);
      location.assign(target.href);
    } catch (error) { status.textContent = error.message || failure; checkoutBusy = false; updateAmount(); }
  });
  const feed = mountSupporterFeed(root, { request, examples: () => exampleMode ? examples : null, previewSamples: () => preview ? [] : examples, readable:true });
  const loadFeed = () => feed.load();
  root.querySelectorAll('[data-open-removal]').forEach(button => button.addEventListener('click', () => {
    openDialog(get('#help-manage-message'));
    get(button.hasAttribute('data-removal-focus') ? '#help-removal-email' : '#help-privacy-title').focus();
  }));
  get('[data-open-discord]').addEventListener('click', () => {
    openDialog(get(discordToken ? '[data-discord-confirm]' : '[data-discord-details]'));
  });
  // Keep the submitted address visible; a successful request becomes a distinct
  // inbox state, with the same response for recognised and unknown addresses.
  function bindEmailFlow(name, title, isReady) {
    const container = get(`[data-email-flow="${name}"]`);
    const form = container.querySelector('form');
    const sent = container.querySelector('[data-email-sent]');
    const submit = form.querySelector('button');
    const resend = container.querySelector('[data-email-resend]');
    const editButton = container.querySelector('[data-email-edit]');
    const email = form.querySelector('input');
    const errorBox = container.querySelector('[data-email-error]');
    const label = submit.innerHTML; const initialTitle = title.textContent;
    let busy = false; let address = ''; let retryAt = 0; let timer;
    function update() {
      const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
      submit.disabled = busy || !isReady();
      resend.disabled = busy || !isReady() || seconds > 0;
      editButton.disabled = busy;
      resend.textContent = busy ? 'Sending…' : seconds ? `Resend in ${seconds}s` : 'Resend email';
      if (!seconds) { clearInterval(timer); timer = null; }
    }
    async function send(repeat = false) {
      if (busy || !isReady() || (repeat && Date.now() < retryAt)) return;
      address = repeat ? address : email.value.trim();
      busy = true; errorBox.hidden = true; submit.textContent = 'Sending…'; update();
      try {
        await request(name === 'discord' ? 'discord-request' : 'removal-request', { email: address });
        container.querySelector('[data-email-copy]').textContent = name === 'discord'
          ? 'Your verification link is on its way to'
          : 'If this email has public details, a removal link will arrive at';
        container.querySelector('[data-email-address]').textContent = address;
        form.hidden = true; sent.hidden = false; title.textContent = 'Check your inbox.';
        title.focus();
        container.querySelector('[data-email-announcement]').textContent = repeat ? `Another link was requested for ${address}.` : `Check your inbox at ${address}.`;
        retryAt = Date.now() + (preview?.state.resendReady ? 0 : 30000);
        clearInterval(timer); timer = setInterval(update, 1000);
      } catch (error) {
        errorBox.querySelector('strong').textContent = error.status === 429 ? 'Give it a little time.' : 'We couldn’t send your link.';
        container.querySelector('[data-email-error-message]').textContent = error.status === 429 ? 'Please try again later.' : error.status ? 'Please try again in a moment.' : 'Check your connection and try again.';
        errorBox.hidden = false;
      } finally { busy = false; submit.innerHTML = label; update(); }
    }
    function edit() {
      form.hidden = false; sent.hidden = true; errorBox.hidden = true;
      title.textContent = initialTitle; email.focus(); update();
    }
    form.addEventListener('submit', event => { event.preventDefault(); void send(); });
    resend.addEventListener('click', () => { void send(true); });
    editButton.addEventListener('click', edit);
    return { update, edit };
  }
  const removalEmail = bindEmailFlow('removal', get('[data-removal-title]'), () => configured);
  const discordStart = get('[data-discord-start]');
  const discordEmail = bindEmailFlow('discord', get('#help-discord-title'), () => discordEnabled);
  function showDiscordForm() {
    get('[data-discord-confirm]').close();
    get('[data-discord-details]').classList.remove('help-dialog-centered', 'help-dialog-problem');
    get('[data-discord-result]').hidden = true;
    get('[data-email-flow="discord"]').hidden = false;
    discordToken = null; get('[data-discord-token]').value = '';
    openDialog(get('[data-discord-details]')); discordEmail.edit();
  }
  get('[data-discord-retry]').addEventListener('click', showDiscordForm);
  get('[data-discord-change-email]').addEventListener('click', showDiscordForm);
  let retryVerified = false;
  get('[data-discord-confirm-retry]').addEventListener('click', () => {
    if (retryVerified) void loadDiscordConnection(); else showDiscordForm();
  });
  async function loadDiscordConnection() {
    if (!discordToken) return;
    const title = get('#help-discord-confirm-title');
    const errorBox = get('[data-discord-confirm-error]');
    title.textContent = 'Checking your link…'; errorBox.hidden = true;
    get('[data-discord-confirm-copy]').textContent = '';
    get('[data-discord-confirm-retry]').hidden = true;
    get('[data-discord-change-email]').hidden = true;
    discordStart.hidden = true; get('[data-discord-disconnect]').hidden = true;
    try {
      const connection = await request('discord-status', { token: discordToken });
      if (!connection.eligible && !connection.connected) {
        title.textContent = 'No payment found.';
        get('[data-discord-confirm-copy]').textContent = 'We couldn’t find a completed contribution for this email. If you just paid, give it a moment and check again.';
        retryVerified = true;
        get('[data-discord-confirm-retry]').textContent = 'Check again';
        get('[data-discord-confirm-retry]').hidden = false;
        get('[data-discord-change-email]').hidden = false;
        title.focus(); return;
      }
      title.textContent = connection.connected ? 'Discord is connected.' : 'Connect Discord.';
      get('[data-discord-confirm-copy]').textContent = connection.disconnecting ? 'Your disconnection is being finished.' : connection.connected ? 'This payment is linked to Discord.' : 'Join the supporter chat on Fix the Web.';
      discordStart.hidden = connection.connected;
      discordStart.querySelector('button').disabled = !discordEnabled;
      get('[data-discord-disconnect]').hidden = !connection.connected || connection.disconnecting;
      get('[data-discord-disconnect]').disabled = !discordEnabled;
    } catch (error) {
      retryVerified = error.status !== 400;
      title.textContent = error.status === 400 ? 'This link has expired.' : 'We couldn’t check your link.';
      get('[data-discord-confirm-error-message]').textContent = error.status === 400 ? 'Request a fresh email to continue.' : 'Please try again in a moment.';
      errorBox.hidden = false;
      get('[data-discord-confirm-retry]').textContent = retryVerified ? 'Try again' : 'Email me a new link';
      get('[data-discord-confirm-retry]').hidden = false;
    }
    title.focus();
  }
  const fragment = new URLSearchParams(preview ? preview.state.fragment || '' : location.hash.slice(1));
  const checkoutToken = preview ? preview.state.receipt ? 'a'.repeat(64) : null : fragment.get('checkout') || history.state?.supportCheckoutToken;
  if (!preview && fragment.has('checkout')) {
    // Keep the scoped, expiring status token out of HTTP URLs and referrers.
    // History state survives refresh but is never sent to the website server.
    history.replaceState({ ...history.state, supportCheckoutToken: fragment.get('checkout') }, '', location.pathname + location.search);
  }
  if (fragment.has('remove')) {
    token = fragment.get('remove');
    history.replaceState(null, '', location.pathname + location.search);
    openDialog(get('[data-confirm-panel]'));
    get('#help-confirm-title').focus();
  } else if (fragment.has('discord-link')) {
    discordToken = fragment.get('discord-link');
    history.replaceState(null, '', location.pathname + location.search);
    openDialog(get('[data-discord-confirm]'));
    get('[data-discord-token]').value = discordToken;
    get('#help-discord-confirm-title').focus();
  } else if (fragment.has('discord')) {
    const outcomes = {
      connected: ['You’re connected.', 'Thanks for helping Villow grow. Your Discord supporter perks are ready.'],
      pending: ['Connected. Perks on the way.', 'Your roles are taking a little longer. We’ll keep trying automatically.'],
      'join-server': ['One more step.', 'We couldn’t add you automatically. Join Fix the Web and your roles will follow, usually within 15 minutes.'],
      screening: ['Accept the server rules.', 'Your account is connected. Accept the rules in Discord to unlock your supporter chat.'],
      cancelled: ['Connection cancelled.', 'Nothing was linked. You can try again whenever you’re ready.'],
      expired: ['This link has expired.', 'Request a fresh email link to continue.'],
      unavailable: ['Discord is unavailable.', 'Please try again in a moment.'],
      'not-supported': ['No payment found.', 'Use the email from your completed contribution. If you just paid, give it a moment before trying again.'],
      'test-account-only': ['That’s the wrong Discord account.', 'Switch to the account chosen for this test, then request a new email link.'],
      'already-linked': ['An account is already connected.', 'Open a fresh link sent to your payment email to disconnect it first.'],
      failed: ['Discord didn’t connect.', 'Please request a fresh email link and try again.'],
    };
    const outcome = fragment.get('discord');
    const linked = ['connected', 'pending', 'join-server', 'screening'].includes(outcome);
    const [title, message] = outcomes[outcome] || outcomes.failed;
    get('[data-discord-details]').classList.toggle('help-dialog-centered', outcome === 'connected');
    get('[data-discord-details]').classList.toggle('help-dialog-problem', !linked);
    get('[data-discord-return]').textContent = message;
    get('#help-discord-title').textContent = title;
    get('[data-discord-result-message]').setAttribute('role', linked ? 'status' : 'alert');
    get('[data-email-flow="discord"]').hidden = true;
    get('[data-discord-result]').hidden = false;
    get('[data-discord-reward]').hidden = outcome !== 'connected';
    get('[data-discord-ongoing]').hidden = fragment.get('ongoing') !== '1';
    get('[data-discord-server]').hidden = !['join-server', 'screening'].includes(outcome);
    get('[data-discord-server]').textContent = outcome === 'join-server' ? 'Join Fix the Web' : 'Open Discord';
    get('[data-discord-retry]').hidden = linked;
    get('[data-discord-retry]').textContent = ['expired', 'already-linked', 'test-account-only'].includes(outcome) ? 'Email me a new link' : 'Try again';
    history.replaceState(null, '', location.pathname + location.search);
    openDialog(get('[data-discord-details]'));
    get('#help-discord-title').focus();
  }
  discordStart.action = `${api}/discord-start`;
  discordStart.addEventListener('submit', event => {
    if (preview) { event.preventDefault(); previewNavigate('discord-supporter'); return; }
    if (!discordEnabled || !discordToken) event.preventDefault();
  });
  get('[data-discord-disconnect]').addEventListener('click', async () => {
    if (!discordEnabled || !discordToken) return;
    get('[data-discord-disconnect]').disabled = true; discordStart.querySelector('button').disabled = true;
    const message = get('[data-discord-confirm-status]'); message.textContent = 'Disconnecting Discord…';
    try {
      const result = await request('discord-disconnect', { token: discordToken });
      get('#help-discord-confirm-title').textContent = result.disconnected ? 'Discord disconnected.' : 'Disconnecting Discord.';
      get('[data-discord-confirm-copy]').textContent = result.disconnected ? '' : result.message;
      message.textContent = ''; discordToken = null; get('[data-discord-token]').value = '';
      get('[data-discord-disconnect]').hidden = true; discordStart.hidden = true;
      get('[data-discord-confirm-error]').hidden = true;
    } catch (error) {
      message.textContent = '';
      get('[data-discord-confirm-error]').hidden = false;
      get('[data-discord-confirm-error-message]').textContent = error.message || failure;
      retryVerified = false;
      get('[data-discord-confirm-retry]').textContent = 'Email me a new link';
      get('[data-discord-confirm-retry]').hidden = false;
      get('[data-discord-disconnect]').hidden = true;
    }
  });
  get('[data-confirm]').disabled = true;
  get('[data-confirm]').addEventListener('click', async () => {
    if (!configured || !token) return;
    const button = get('[data-confirm]'); button.disabled = true; button.textContent = 'Removing…';
    get('[data-keep]').disabled = true;
    const confirmStatus = get('[data-confirm-status]'); confirmStatus.textContent = ''; confirmStatus.classList.remove('help-status-error');
    try {
      await request('removal-confirm', { token });
      token = null; button.hidden = true;
      get('#help-confirm-title').textContent = 'Public details removed.';
      get('[data-confirm-copy]').textContent = 'Thanks for supporting Villow. Your benefits stay with you.';
      get('[data-keep]').textContent = 'Done';
      get('[data-keep]').disabled = false;
      exampleMode = false; await loadFeed();
    } catch (error) {
      get('[data-keep]').disabled = false;
      confirmStatus.classList.add('help-status-error');
      if (error.status === 400) {
        get('#help-confirm-title').textContent = 'This link has expired.';
        get('[data-confirm-copy]').hidden = true; button.hidden = true;
        get('[data-keep]').hidden = true; get('[data-removal-retry]').hidden = false;
        confirmStatus.textContent = 'Request a fresh email to continue.';
      } else { confirmStatus.textContent = 'We couldn’t remove your details. Please try again.'; button.disabled = false; button.textContent = 'Try again'; }
    }
  });
  get('[data-removal-retry]').addEventListener('click', () => {
    token = null; get('[data-confirm-panel]').close();
    openDialog(get('#help-manage-message')); removalEmail.edit();
  });
  get('[data-keep]').addEventListener('click', () => {
    token = null; get('[data-confirm-panel]').close(); get('[data-open-removal]').focus();
  });
  updateAmount();
  const returned = preview ? preview.state.payment : new URLSearchParams(location.search).get('payment');
  const checkoutReturn = mountCheckoutReturn(root, { payment: returned, token: checkoutToken, request, reloadFeed: loadFeed });
  if (['returned', 'cancelled'].includes(returned) && !token && !fragment.has('discord') && !discordToken) get('[data-checkout-return]').scrollIntoView({ block: 'start' });
  let connectionReady = Promise.resolve();
  const configReady = (async () => {
    try {
      const config = await request('config');
      configured = config.mode === 'live' && config.currency === 'aud';
      if (!configured) throw new Error('This page requires the live AUD configuration.');
      checkoutReturn.configure(config);
      enabled = config.enabled === true; updateAmount();
      discordEnabled = config.discord?.enabled === true;
      discordEmail.update(); removalEmail.update();
      if (discordToken) connectionReady = loadDiscordConnection();
      if (!discordEnabled) {
        const unavailable = get('[data-email-flow="discord"] [data-email-error]');
        unavailable.classList.add('help-flow-notice'); unavailable.setAttribute('role', 'status');
        unavailable.hidden = false; unavailable.querySelector('strong').textContent = 'Discord linking is paused.';
        unavailable.querySelector('p').textContent = 'This preview isn’t connecting accounts right now.';
      }
      status.textContent = enabled ? '' : 'Checkout is temporarily unavailable.';
      removal.querySelector('button').disabled = false;
      get('[data-confirm]').disabled = !token;
      const portal = new URL(config.portal);
      if (portal.origin === 'https://billing.stripe.com' && portal.pathname.startsWith('/p/login/') && !portal.pathname.includes('test_')) {
        get('[data-portal]').href = portal.href; get('[data-portal]').hidden = false;
        get('[data-portal-unavailable]').hidden = true;
      }
    } catch {
      checkoutReturn.unavailable();
      enabled = false; configured = false; pay.disabled = true;
      discordEnabled = false; discordEmail.update(); removalEmail.update();
      const unavailable = get('[data-email-flow="discord"] [data-email-error]');
      unavailable.classList.remove('help-flow-notice'); unavailable.setAttribute('role', 'alert');
      unavailable.hidden = false; unavailable.querySelector('strong').textContent = 'We couldn’t connect.';
      unavailable.querySelector('p').textContent = 'Refresh the page to try again.';
      if (discordToken) { get('#help-discord-confirm-title').textContent = 'We couldn’t check your link.'; get('[data-discord-confirm-copy]').textContent = 'Please refresh the page or reopen your email link.'; }
      removal.querySelector('button').disabled = true;
      get('[data-confirm]').disabled = true;
      status.textContent = 'Support is temporarily unavailable. Please refresh to try again.';
      get('[data-portal-unavailable]').textContent = 'Payment management is temporarily unavailable.';
      if (token) get('[data-confirm-status]').textContent = 'We couldn’t connect. Please reopen the link in your email to try again.';
    }
  })();
  const feedReady = loadFeed();
  // The requested note anchor starts hidden while the shared feed is loading.
  // Restore it once, so comparing presets does not jump back to the page hero.
  void feedReady.then(() => {
    if (location.hash === '#supporter-notes' && !get('[data-support-notes]').hidden) get('[data-support-notes]').scrollIntoView({ block: 'start' });
  });
  if (preview) void applySupportPreview(preview, { root, configReady, ratesReady, feedReady, connectionReady: () => connectionReady });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { checkoutBusy = false; updateAmount(); status.textContent = enabled ? '' : 'Checkout is temporarily unavailable.'; void loadFeed(); }
  });
}
