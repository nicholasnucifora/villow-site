export const API_VERSION = '2026-10-28.endive';
export const CONSENT_VERSION = 'public-name-message-v1';
export const LABELS = ['Display name', 'Supporter message', 'Can we publicly display your name and message?'];
export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export class LinkConfigError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
export function projects(env) {
  const value = JSON.parse(env.PROJECTS_JSON || '{}');
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid projects');
  const links = Object.values(value).flatMap(project => Object.values(project.links || {}));
  if (new Set(links).size !== links.length) throw new Error('Each project and option needs its own Payment Link');
  return value;
}
export function projectConfig(env, id) {
  const p = projects(env)[id];
  if (!/^[a-z][a-z0-9-]{0,39}$/.test(id || '') || !p) throw new HttpError(404, 'Unknown project.');
  const origin = new URL(p.origin);
  if (origin.origin !== p.origin || (origin.protocol !== 'https:' && !(env.STRIPE_MODE === 'test' && ['localhost', '127.0.0.1'].includes(origin.hostname)))) throw new Error('Invalid project origin');
  if (p.currency !== 'aud') throw new Error('This integration currently supports AUD only');
  for (const key of ['once', 'monthly5', 'monthly10', 'monthly20']) {
    if (!/^plink_[A-Za-z0-9]+$/.test(p.links?.[key] || '')) throw new Error('Missing Payment Link ID');
  }
  const portal = new URL(p.portal);
  if (portal.origin !== 'https://billing.stripe.com' || !portal.pathname.startsWith('/p/login/')) throw new Error('Invalid portal URL');
  if (portal.pathname.includes('test_') !== (env.STRIPE_MODE === 'test')) throw new Error('Portal mode mismatch');
  return p;
}
export function assertSecrets(env) {
  if (!['test', 'live'].includes(env.STRIPE_MODE)) throw new Error('Missing Stripe mode');
  if (!new RegExp(`^(sk|rk)_${env.STRIPE_MODE}_`).test(env.STRIPE_SECRET_KEY || '')) throw new Error('Stripe key mode mismatch');
  if (!env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_') || (env.EMAIL_HASH_SECRET || '').length < 32) throw new Error('Missing support secrets');
}
export function fieldMapping(fields) {
  const found = LABELS.map(label => fields?.filter(f => f.label?.custom === label) || []);
  if (fields?.length !== 3 || found.some(f => f.length !== 1)) throw new LinkConfigError('field_labels', 'Expected three exact custom field labels');
  const [name, message, consent] = found.map(f => f[0]);
  if (name.type !== 'text' || message.type !== 'text' || consent.type !== 'dropdown' || [name, message, consent].some(f => f.optional !== true)) throw new LinkConfigError('field_types_or_optional', 'Custom field types or optional settings differ');
  const options = consent.dropdown?.options;
  const yes = options?.filter(o => o.label.toLowerCase().trim() === 'yes');
  const no = options?.filter(o => o.label.toLowerCase().trim() === 'no');
  if (options?.length !== 2 || yes?.length !== 1 || no?.length !== 1 || yes[0].value === no[0].value || (consent.dropdown.default_value && consent.dropdown.default_value !== no[0].value)) throw new LinkConfigError('consent_options', 'Consent must offer Yes and No without defaulting to Yes');
  return { name: name.key, message: message.key, consent: consent.key, yes: yes[0].value };
}
export function publicFields(fields, mapping) {
  const lookup = key => fields?.find(f => f.key === key);
  const consent = lookup(mapping.consent)?.type === 'dropdown' && lookup(mapping.consent)?.dropdown?.value === mapping.yes;
  const clean = (key, limit) => {
    const f = lookup(key);
    return f?.type === 'text' && typeof f.text?.value === 'string' ? f.text.value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit) || null : null;
  };
  return { consent, name: consent ? clean(mapping.name, 80) : null, message: consent ? clean(mapping.message, 255) : null };
}
export function amountCents(value) {
  if (typeof value !== 'string' || !/^\d{1,5}(\.\d{1,2})?$/.test(value)) throw new HttpError(400, 'Enter an AUD amount with at most two decimal places.');
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (cents < 500 || cents > 1000000) throw new HttpError(400, 'Choose an amount from A$5 to A$10,000.');
  return cents;
}
export function sessionSource(session, env) {
  for (const [id, raw] of Object.entries(projects(env))) {
    const link = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link?.id;
    const pair = Object.entries(raw.links || {}).find(([, value]) => value === link);
    if (pair) return { id, project: projectConfig(env, id), key: pair[0], link };
    // Metadata is written by our authenticated server, never accepted from a browser.
    if (!link && session.metadata?.support_integration === 'ftw-support-v1' && session.metadata?.support_project === id && session.metadata?.support_link === raw.links?.once) {
      return { id, project: projectConfig(env, id), key: 'once', link: raw.links.once };
    }
  }
  return null;
}
export async function verifiedLink(stripe, env, project, key) {
  const link = await stripe.paymentLinks.retrieve(project.links[key]);
  if (link.livemode !== (env.STRIPE_MODE === 'live')) throw new LinkConfigError('mode', 'Payment Link mode mismatch');
  if (link.allow_promotion_codes || link.subscription_data?.trial_period_days || link.subscription_data?.trial_end) throw new LinkConfigError('discount_or_trial', 'Contributions must not use promotion codes or trials');
  const mapping = fieldMapping(link.custom_fields);
  const lines = await stripe.paymentLinks.listLineItems(link.id, { limit: 2 });
  if (lines.has_more || lines.data.length !== 1 || lines.data[0].quantity !== 1 || lines.data[0].adjustable_quantity?.enabled) throw new LinkConfigError('line_items', 'Expected a single contribution item');
  const price = lines.data[0].price;
  if (price?.currency !== project.currency) throw new LinkConfigError('currency', 'Payment Link currency mismatch');
  if (key === 'once') {
    if (price.recurring || !Number.isSafeInteger(price.custom_unit_amount?.minimum) || price.custom_unit_amount.minimum < 500) throw new LinkConfigError('one_time_minimum', 'One-time link must have a customer-chosen amount with a minimum of A$5');
  } else if (price.unit_amount !== Number(key.slice(7)) * 100 || price.recurring?.interval !== 'month' || price.recurring?.interval_count !== 1) {
    throw new LinkConfigError('monthly_price', 'Monthly link amount or interval mismatch');
  }
  const url = new URL(link.url);
  if (url.origin !== 'https://buy.stripe.com') throw new LinkConfigError('url_origin', 'Unexpected Payment Link URL');
  return { link, mapping, price };
}
