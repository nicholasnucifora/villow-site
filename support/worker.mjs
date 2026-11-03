import Stripe from 'stripe';
import { API_VERSION, HttpError, LinkConfigError, amountCents, assertSecrets, projectConfig, projects, verifiedLink } from './lib/config.mjs';
import { confirmRemoval, privateHash, rateLimit, requestRemoval, nowSeconds } from './lib/privacy.mjs';
import { processEvent, recentSupporters } from './lib/events.mjs';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  } });
}
async function bodyText(request, limit) {
  if (Number(request.headers.get('content-length')) > limit) throw new HttpError(413, 'Request too large.');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > limit) { await reader.cancel(); throw new HttpError(413, 'Request too large.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
async function bodyJson(request) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') throw new HttpError(415, 'Use application/json.');
  try { return JSON.parse(await bodyText(request, 4096)); }
  catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, 'Invalid JSON.'); }
}
function stripeClient(env) {
  assertSecrets(env);
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: API_VERSION, httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2, timeout: 15000 });
}
async function sendEmail(env, { to, url, project }) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) throw new Error('Missing email configuration');
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject: 'Remove your public supporter details',
      text: `Someone requested removal of your public supporter name and message for ${project}.\n\nOpen this link, then confirm removal:\n${url}\n\nThe link expires in 30 minutes. Opening it does not remove anything. This does not cancel a subscription. If you did not request this, ignore this email.` }),
  });
  if (!result.ok) throw new Error('Email delivery failed');
}

export function createWorker(dependencies = {}) {
  return {
    async fetch(request, env) {
      let origin; let allowedOrigin;
      try {
        const url = new URL(request.url);
        origin = request.headers.get('origin');
        if (origin && Object.values(projects(env)).some(p => p.origin === origin)) allowedOrigin = origin;
        let response;
        if (url.pathname === '/v1/stripe/webhook' && request.method === 'POST') {
          const stripe = dependencies.stripe || stripeClient(env);
          const raw = await bodyText(request, 262144);
          let event;
          try {
            event = await stripe.webhooks.constructEventAsync(raw, request.headers.get('stripe-signature') || '', env.STRIPE_WEBHOOK_SECRET, 300, Stripe.createSubtleCryptoProvider());
          } catch { throw new HttpError(400, 'Invalid Stripe signature.'); }
          await processEvent(env.DB, env, stripe, event);
          response = json({ received: true });
        } else if (request.method === 'OPTIONS') {
          if (!allowedOrigin) throw new HttpError(403, 'Origin not allowed.');
          response = new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store' } });
        } else {
          const match = url.pathname.match(/^\/v1\/projects\/([a-z][a-z0-9-]{0,39})\/(config|supporters|checkout|removal-request|removal-confirm)$/);
          if (!match) throw new HttpError(404, 'Not found.');
          const [, projectId, action] = match;
          const project = projectConfig(env, projectId);
          if (request.method === 'GET' && action === 'config') {
            const enabled = env.PAYMENTS_ENABLED === 'true';
            if (enabled) assertSecrets(env);
            response = json({ enabled, mode: env.STRIPE_MODE, currency: project.currency, portal: project.portal });
          } else if (request.method === 'GET' && action === 'supporters') {
            response = json({ supporters: await recentSupporters(env.DB, projectId) });
          } else if (request.method === 'POST' && ['checkout', 'removal-request', 'removal-confirm'].includes(action)) {
            if (origin !== project.origin) throw new HttpError(403, 'Origin not allowed.');
            const ipHash = await privateHash(env, `ip:${request.headers.get('cf-connecting-ip') || 'local'}`);
            await rateLimit(env.DB, `ip:${action}:${ipHash}`, action === 'checkout' ? 20 : 10, 600);
            const body = await bodyJson(request);
            if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Expected a JSON object.');
            if (action === 'checkout') {
              if (env.PAYMENTS_ENABLED !== 'true') throw new HttpError(503, 'Support payments are not available yet.');
              const stripe = dependencies.stripe || stripeClient(env);
              const key = body.kind === 'monthly' && ['5', '10', '20'].includes(body.amount) ? `monthly${body.amount}` : body.kind === 'once' ? 'once' : null;
              if (!key) throw new HttpError(400, 'Choose a supported contribution.');
              const cents = key === 'once' ? amountCents(body.amount) : null;
              const { link, price } = await verifiedLink(stripe, env, project, key);
              if (!link.active) throw new HttpError(503, 'This contribution option is currently unavailable.');
              if (key !== 'once') {
                const target = new URL(link.url);
                target.searchParams.set('client_reference_id', projectId);
                response = json({ url: target.href });
              } else {
                const fields = link.custom_fields.map(f => ({ key: f.key, label: f.label, type: f.type, optional: true,
                  ...(f.type === 'text' ? { text: { maximum_length: f.label.custom === 'Display name' ? 80 : 255 } } : { dropdown: { options: f.dropdown.options } }) }));
                const session = await stripe.checkout.sessions.create({ mode: 'payment',
                  line_items: [{ price_data: { currency: 'aud', unit_amount: cents, product: typeof price.product === 'string' ? price.product : price.product.id }, quantity: 1 }],
                  custom_fields: fields, client_reference_id: projectId,
                  metadata: { support_integration: 'ftw-support-v1', support_project: projectId, support_link: link.id },
                  success_url: `${project.origin}/support?payment=returned`, cancel_url: `${project.origin}/support?payment=cancelled`,
                });
                if (new URL(session.url).origin !== 'https://checkout.stripe.com') throw new Error('Unexpected Checkout URL');
                response = json({ url: session.url });
              }
            } else if (action === 'removal-request') {
              if (!env.RESEND_API_KEY || !env.MAIL_FROM) throw new HttpError(503, 'Email management is temporarily unavailable. Please contact support.');
              // Generic result even on delivery failure: email membership is private.
              try { await requestRemoval(env.DB, env, projectId, project, body.email, dependencies.sendEmail || (message => sendEmail(env, message))); }
              catch (e) { if (e instanceof HttpError) throw e; console.error('support_email_delivery_failed'); }
              response = json({ message: 'If this email has supporter details, a removal link will arrive shortly. Check your spam folder too.' });
            } else {
              await confirmRemoval(env.DB, projectId, body.token);
              response = json({ message: 'Your public supporter details have been removed. Your payments and subscriptions are unchanged.' });
            }
          } else throw new HttpError(405, 'Method not allowed.');
        }
        if (allowedOrigin) response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
        response.headers.set('Vary', 'Origin');
        return response;
      } catch (error) {
        // Do not log Stripe payloads, request bodies, emails, tokens or SDK errors.
        if (error instanceof LinkConfigError) console.error('support_link_configuration_failed', error.code);
        else if (error instanceof Stripe.errors.StripePermissionError) console.error('support_stripe_permission_failed');
        else if (error instanceof Stripe.errors.StripeAuthenticationError) console.error('support_stripe_authentication_failed');
        else if (!(error instanceof HttpError)) console.error('support_request_failed');
        const response = json({ error: error instanceof HttpError ? error.message : 'Support services are temporarily unavailable. Please try again later.' }, error instanceof HttpError ? error.status : 503);
        if (allowedOrigin) response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
        response.headers.set('Vary', 'Origin');
        return response;
      }
    },
    async scheduled(_event, env) {
      const now = nowSeconds();
      await env.DB.batch([
        env.DB.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now),
        env.DB.prepare('DELETE FROM removal_tokens WHERE expires_at < ? OR used_at IS NOT NULL').bind(now),
        env.DB.prepare('DELETE FROM webhook_events WHERE processed_at < ?').bind(now - 90 * 86400),
      ]);
    },
  };
}
export default createWorker();
