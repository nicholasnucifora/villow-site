// Local design fixtures. These use the real support controller and markup.
const group = (name, entries) => entries.map(([id, label, options = {}]) => ({ id, label, group: name, ...options }));
export const supportScenarios = [
  ...group('Payments', [
    ['payment-once', 'One-time support'], ['payment-monthly', 'Monthly support', { monthly: true }],
    ['payment-custom', 'Custom amount', { amount: '12.34' }], ['payment-currency', 'Currency estimate', { currency: 'USD' }],
    ['payment-invalid', 'Amount below the minimum', { amount: '4', submit: 'checkout' }],
    ['payment-opening', 'Opening checkout', { submit: 'checkout', waiting: 'checkout' }],
    ['payment-error', 'Checkout error', { submit: 'checkout', failure: 'checkout' }],
    ['payment-complete', 'Returned from payment', { payment: 'returned' }],
    ['payment-published', 'Message published', { payment: 'returned', receipt: { payment: 'paid', sharing: 'published' }, feed: true }],
    ['payment-review', 'Message awaiting review', { payment: 'returned', receipt: { payment: 'paid', sharing: 'review' } }],
    ['payment-private', 'Private contribution', { payment: 'returned', receipt: { payment: 'paid', sharing: 'private' } }],
    ['payment-processing', 'Payment still confirming', { payment: 'returned', receipt: { payment: 'processing' } }],
    ['payment-cancelled', 'Checkout cancelled', { payment: 'cancelled' }],
    ['payment-paused', 'Payments unavailable', { payments: false }],
    ['currency-unavailable', 'Currency estimates unavailable', { failure: 'exchange-rates' }],
    ['service-unavailable', 'Connection unavailable', { failure: 'config' }],
  ]),
  ...group('Discord · email', [
    ['discord-email', 'Enter payment email', { email: 'discord' }],
    ['discord-email-sending', 'Sending verification email', { email: 'discord', send: true, waiting: 'discord-request' }],
    ['discord-email-sent', 'Check your inbox', { email: 'discord', send: true }],
    ['discord-email-resend', 'Ready to resend', { email: 'discord', send: true, resendReady: true }],
    ['discord-email-failed', 'Email delivery failed', { email: 'discord', send: true, failure: 'discord-request' }],
    ['discord-email-rate', 'Too many requests', { email: 'discord', send: true, failure: 'discord-request', status: 429 }],
    ['discord-email-offline', 'Connection lost while sending', { email: 'discord', send: true, failure: 'discord-request', status: 0 }],
    ['discord-paused', 'Discord linking paused', { email: 'discord', discord: false }],
  ]),
  ...group('Discord · verification & accounts', [
    ['discord-checking', 'Checking email link', { fragment: 'discord-link=preview', waiting: 'discord-status' }],
    ['discord-ready', 'Ready to connect', { fragment: 'discord-link=preview' }],
    ['discord-no-payment', 'No payment found', { fragment: 'discord-link=preview', eligible: false }],
    ['discord-link-expired', 'Verification link expired', { fragment: 'discord-link=preview', failure: 'discord-status', status: 400 }],
    ['discord-check-failed', 'Couldn’t check the link', { fragment: 'discord-link=preview', failure: 'discord-status' }],
    ['discord-linked', 'Account already connected', { fragment: 'discord-link=preview', connected: true }],
    ['discord-disconnecting', 'Disconnecting account', { fragment: 'discord-link=preview', connected: true, disconnecting: true }],
    ['discord-disconnected', 'Account disconnected', { fragment: 'discord-link=preview', connected: true, disconnect: true }],
    ['discord-disconnect-failed', 'Disconnection failed', { fragment: 'discord-link=preview', connected: true, disconnect: true, failure: 'discord-disconnect' }],
  ]),
  ...group('Discord · joining & rewards', [
    ['discord-supporter', 'Connected · Supporter', { fragment: 'discord=connected' }],
    ['discord-ongoing', 'Connected · Ongoing Supporter', { fragment: 'discord=connected&ongoing=1' }],
    ['discord-pending', 'Roles on the way', { fragment: 'discord=pending' }],
    ['discord-rules', 'Server rules to accept', { fragment: 'discord=screening' }],
    ['discord-join-failed', 'Automatic join failed', { fragment: 'discord=join-server' }],
    ['discord-cancelled', 'Authorisation cancelled', { fragment: 'discord=cancelled' }],
    ['discord-failed', 'Discord connection failed', { fragment: 'discord=failed' }],
    ['discord-unavailable', 'Discord unavailable', { fragment: 'discord=unavailable' }],
    ['discord-conflict', 'Another account is linked', { fragment: 'discord=already-linked' }],
    ['discord-wrong-account', 'Wrong test account', { fragment: 'discord=test-account-only' }],
    ['discord-oauth-expired', 'Discord authorisation expired', { fragment: 'discord=expired' }],
    ['discord-no-contribution', 'Payment not found at connection', { fragment: 'discord=not-supported' }],
  ]),
  ...group('Public messages', [
    ['messages-empty', 'No messages yet'], ['messages', 'Supporter messages', { feed: true }],
    ['messages-loading', 'Messages loading · stays hidden', { waiting: 'supporters' }],
    ['messages-error', 'Messages unavailable · stays hidden', { failure: 'supporters' }],
    ['privacy', 'Sharing & privacy', { email: 'removal' }],
    ['removal-sending', 'Sending removal email', { email: 'removal', send: true, waiting: 'removal-request' }],
    ['removal-email', 'Removal email requested', { email: 'removal', send: true }],
    ['removal-email-failed', 'Removal email error', { email: 'removal', send: true, failure: 'removal-request' }],
    ['removal-rate', 'Removal request limit', { email: 'removal', send: true, failure: 'removal-request', status: 429 }],
    ['removal-confirm', 'Confirm public-detail removal', { fragment: 'remove=preview' }],
    ['removal-progress', 'Removing public details', { fragment: 'remove=preview', remove: true, waiting: 'removal-confirm' }],
    ['removal-done', 'Public details removed', { fragment: 'remove=preview', remove: true }],
    ['removal-expired', 'Removal link expired', { fragment: 'remove=preview', remove: true, failure: 'removal-confirm', status: 400 }],
    ['removal-failed', 'Removal failed', { fragment: 'remove=preview', remove: true, failure: 'removal-confirm' }],
  ]),
];

const fixtureNotes = [
  ['Alex', 'A calmer way to spend time online. Really glad this exists.'],
  ['Sam', 'Small projects with big ideas deserve room to grow. Keep going!'],
  ['Taylor', 'Thanks for putting people first. Looking forward to what comes next.'],
  ['Jamie', 'The internet can feel different. Happy to be a small part of that.'],
  ['Morgan', 'More room for the things I actually care about. Thank you.'],
  ['Riley', 'Here’s to thoughtful tools and a better web.'],
];
const supporters = Array.from({ length: 50 }, (_, i) => ({ displayName: fixtureNotes[i % 6][0], message: fixtureNotes[i % 6][1], kind: i % 2 ? 'once' : 'monthly', monthlyStatus: i % 3 ? 'active' : 'previous', amount: [500, 1234, 1000, 2000][i % 4], currency: 'aud', date: new Date(Date.UTC(2026, 10, 5 - i)).toISOString().slice(0, 10) }));

export function createSupportPreview(search) {
  const params = new URLSearchParams(search);
  if (!params.has('support-preview')) return null;
  // Unknown preview IDs still stay isolated; they never fall back to live requests.
  const state = supportScenarios.find(s => s.id === params.get('support-preview')) || supportScenarios[0];
  return {
    state,
    async request(action) {
      const [route, query] = action.split('?');
      if (state.waiting === route) return new Promise(() => {});
      if (state.failure === route) {
        const status = state.status ?? 503;
        const message = status === 429 ? 'Please wait before trying again.'
          : status === 400 ? 'This link is invalid or expired. Request a new one.'
          : route.endsWith('-request') ? 'We couldn’t send your verification email. Please try again.'
          : 'Support services are temporarily unavailable. Please try again later.';
        throw Object.assign(new Error(message), { status });
      }
      switch (route) {
        case 'config': return { enabled: state.payments !== false, mode: 'live', currency: 'aud', portal: 'https://billing.stripe.com/p/login/preview', discord: { enabled: state.discord !== false }, messageReview: state.receipt ? 'automatic' : 'manual' };
        case 'checkout-status': return state.receipt || { payment: 'processing' };
        case 'exchange-rates': return { base: 'AUD', date: '2026-11-05', rates: { AUD: 1, USD: .65, EUR: .60, GBP: .5, JPY: 100 }, dates: {} };
        case 'supporters': {
          if (new URLSearchParams(query).get('recent') === '50') return { supporters: state.feed ? supporters : [] };
          const page = Number(new URLSearchParams(query).get('page') || 0);
          return { supporters: state.feed ? supporters.slice(page * 12, (page + 1) * 12) : [], hasMore: !!state.feed && (page + 1) * 12 < supporters.length, nextPage: page + 1 };
        }
        case 'discord-status': return { eligible: state.eligible !== false, connected: !!state.connected, disconnecting: !!state.disconnecting };
        case 'discord-request': case 'removal-request': return { message: 'Preview email request.' };
        case 'discord-disconnect': return { disconnected: true, message: 'Discord disconnected.' };
        case 'removal-confirm': return { message: 'Your public supporter details have been removed. Your payments and subscriptions are unchanged.' };
        case 'checkout': return { preview: true };
        default: throw new Error('This action is not available in the state preview.');
      }
    },
  };
}

export function previewLocation(stateId, currentURL) {
  const url = new URL(currentURL);
  url.search = new URLSearchParams({ 'support-preview': stateId }).toString();
  // Let the fixture choose the view after load; an anchor would override the
  // message-list position when the browser finishes laying out the document.
  url.hash = '';
  return url;
}

export async function applySupportPreview(preview, { root, configReady, ratesReady, feedReady, connectionReady }) {
  await Promise.all([configReady, ratesReady]);
  if (document.readyState !== 'complete') await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
  root.scrollIntoView({ block: 'start' });
  const { state } = preview;
  if (state.feed) await feedReady;
  const get = selector => root.querySelector(selector);
  const change = element => element.dispatchEvent(new Event('change', { bubbles: true }));
  if (state.monthly) { get('input[name="kind"][value="monthly"]').checked = true; change(get('[data-checkout]')); }
  if (state.amount) {
    get('input[name="amount"][value="custom"]').checked = true;
    get('#help-custom-value').value = state.amount;
    change(get('[data-checkout]'));
  }
  if (state.currency) { get('[data-currency]').value = state.currency; change(get('[data-currency]')); }
  if (state.submit) {
    // Dispatch the handler so the application validation (not a browser tooltip)
    // is visible for the intentionally invalid amount fixture.
    get('[data-checkout]').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
  if (state.email) {
    get(state.email === 'discord' ? '[data-open-discord]' : '[data-open-removal]').click();
    if (state.send) {
      const form = get(`[data-email-flow="${state.email}"] form`);
      form.querySelector('input').value = 'supporter@example.com';
      form.requestSubmit();
    }
  }
  if (state.disconnect) { await connectionReady(); get('[data-discord-disconnect]').click(); }
  if (state.remove) get('[data-confirm]').click();
  if (state.id.startsWith('messages') && !get('[data-support-notes]').hidden) {
    get('[data-support-notes]').scrollIntoView({ block: 'start' });
  }
  if (matchMedia('(max-width:760px)').matches && /^(payment|currency)-/.test(state.id)) {
    get(state.payment ? '[data-checkout-return]' : '[data-checkout]').scrollIntoView({ block: 'start' });
  }
  document.documentElement.dataset.supportPreviewReady = '';
}
