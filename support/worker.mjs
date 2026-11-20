import Stripe from 'stripe';
import { API_VERSION, HttpError, LinkConfigError, amountCents, assertSecrets, checkoutFields, projectConfig, projectOrigin, projects, verifiedLink } from './lib/config.mjs';
import { confirmRemoval, privateHash, rateLimit, requestRemoval, nowSeconds, randomToken, digest } from './lib/privacy.mjs';
import { adminPath, moderationRoute } from './lib/moderation.mjs';
import { checkoutStatus } from './lib/checkout-return.mjs';
import { processEvent, recentSupporters, refreshSupporterSubscriptions, queueDiscordForEvent } from './lib/events.mjs';
import { exchangeRates } from './lib/exchange.mjs';
import {contactReady,sendContact} from './lib/contact.mjs';
import { discordReady, requestDiscordLink, beginDiscord, finishDiscord, disconnectDiscord, discordLinkStatus, syncDueDiscord, syncDiscordLink } from './lib/discord.mjs';

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
async function bodyJson(request,limit=4096) {
  if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') throw new HttpError(415, 'Use application/json.');
  try { return JSON.parse(await bodyText(request, limit)); }
  catch (e) { if (e instanceof HttpError) throw e; throw new HttpError(400, 'Invalid JSON.'); }
}
function stripeClient(env) {
  assertSecrets(env);
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: API_VERSION, httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2, timeout: 15000 });
}
async function sendEmail(env, { to, url, project, purpose }) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) throw new Error('Missing email configuration');
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(15000), headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject: purpose === 'discord' ? 'Connect your supporter Discord account' : 'Remove your public supporter details',
      text: purpose === 'discord'
        ? `Verify this email to check your ${project} support and connect Discord:\n${url}\n\nThe link expires in 30 minutes. Opening it does not connect or disconnect anything or change payments. If you did not request this, ignore this email.`
        : `Someone requested removal of your public supporter name and message for ${project}.\n\nOpen this link, then confirm removal:\n${url}\n\nThe link expires in 30 minutes. Opening it does not remove anything. This does not cancel a subscription. If you did not request this, ignore this email.` }),
  });
  if (!result.ok) throw new Error('Email delivery failed');
}

export function createWorker(dependencies = {}) {
  return {
    async fetch(request, env, ctx) {
      let origin; let allowedOrigin;
      try {
        const url = new URL(request.url);
        if (url.pathname === adminPath || url.pathname.startsWith(adminPath + '/')) return await moderationRoute(request, env, bodyJson);
        origin = request.headers.get('origin');
        if (origin && Object.keys(projects(env)).some(id => {
          const p = projectConfig(env, id);
          return p.origin === origin || p.additional_origins?.includes(origin);
        })) allowedOrigin = origin;
        let response;
        if (url.pathname === '/v1/discord/callback' && request.method === 'GET') {
          response = await finishDiscord(env.DB, env, request, { fetcher: dependencies.discordFetch || fetch,
            refreshSubscriptions: hash => refreshSupporterSubscriptions(env.DB, dependencies.stripe || stripeClient(env), hash) });
        } else if (url.pathname === '/v1/stripe/webhook' && request.method === 'POST') {
          const stripe = dependencies.stripe || stripeClient(env);
          const raw = await bodyText(request, 262144);
          let event;
          try {
            event = await stripe.webhooks.constructEventAsync(raw, request.headers.get('stripe-signature') || '', env.STRIPE_WEBHOOK_SECRET, 300, Stripe.createSubtleCryptoProvider());
          } catch { throw new HttpError(400, 'Invalid Stripe signature.'); }
          await processEvent(env.DB, env, stripe, event);
          if (discordReady(env)) {
            const hashes = await queueDiscordForEvent(env.DB, event);
            const sync = Promise.all(hashes.map(hash => syncDiscordLink(env.DB, env, hash, dependencies.discordFetch || fetch)));
            if (ctx?.waitUntil) ctx.waitUntil(sync); else await sync;
          }
          response = json({ received: true });
        } else if (request.method === 'OPTIONS') {
          if (!allowedOrigin) throw new HttpError(403, 'Origin not allowed.');
          response = new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-store' } });
        } else {
          const match = url.pathname.match(/^\/v1\/projects\/([a-z][a-z0-9-]{0,39})\/(config|supporters|exchange-rates|checkout|checkout-status|removal-request|removal-confirm|discord-request|discord-start|discord-status|discord-disconnect|contact)$/);
          if (!match) throw new HttpError(404, 'Not found.');
          const [, projectId, action] = match;
          const project = projectConfig(env, projectId);
          if(request.method==='GET'&&action==='contact'){
            response=json({enabled:contactReady(env)});
          } else if(request.method==='POST'&&action==='contact'){
            projectOrigin(project,origin);
            const ipHash=await privateHash(env,`ip:${request.headers.get('cf-connecting-ip')||'local'}`);
            await rateLimit(env.DB,`ip:contact:${projectId}:${ipHash}`,5,3600);
            // Bound aggregate mail volume as well as individual senders.
            await rateLimit(env.DB,`contact:total:${projectId}`,100,3600);
            response=json(await sendContact(env,projectId,await bodyJson(request,16384),dependencies.contactFetch||fetch));
          } else if (request.method === 'GET' && action === 'config') {
            const enabled = env.PAYMENTS_ENABLED === 'true';
            if (enabled) assertSecrets(env);
            response = json({ enabled, mode: env.STRIPE_MODE, currency: project.currency, portal: project.portal, discord: { enabled: discordReady(env) }, messageReview: env.AUTO_PUBLISH_MESSAGES === 'true' ? 'automatic' : 'manual' });
          } else if (request.method === 'GET' && action === 'supporters') {
            if (url.searchParams.has('recent')) {
              if (url.searchParams.get('recent') !== '50') throw new HttpError(400, 'Invalid recent window.');
              response = json({ supporters: await recentSupporters(env.DB, projectId, { limit: 50 }) });
            } else if (url.searchParams.has('page')) {
              const rawPage = url.searchParams.get('page');
              if (!/^\d{1,4}$/.test(rawPage) || Number(rawPage) > 1000) throw new HttpError(400, 'Invalid page.');
              const page = Number(rawPage);
              const rows = await recentSupporters(env.DB, projectId, { limit: 13, offset: page * 12 });
              response = json({ supporters: rows.slice(0, 12), hasMore: rows.length > 12 && page < 1000, nextPage: page + 1 });
            } else response = json({ supporters: await recentSupporters(env.DB, projectId) });
          } else if (request.method === 'GET' && action === 'exchange-rates') {
            response = json(await exchangeRates(dependencies.fetch || fetch));
          } else if (request.method === 'POST' && action === 'discord-start') {
            projectOrigin(project, origin);
            if (request.headers.get('content-type')?.split(';')[0] !== 'application/x-www-form-urlencoded') throw new HttpError(415, 'Use the Discord confirmation form.');
            const ipHash = await privateHash(env, `ip:${request.headers.get('cf-connecting-ip') || 'local'}`);
            await rateLimit(env.DB, `ip:discord-start:${ipHash}`, 10, 600);
            const body = new URLSearchParams(await bodyText(request, 1024));
            try { response = await beginDiscord(env.DB, env, projectId, body.get('token'), undefined, origin); }
            catch (error) {
              if (!(error instanceof HttpError)) throw error;
              response = new Response(null, { status: 303, headers: { Location: `${origin}/support#discord=${error.status === 400 ? 'expired' : error.status === 403 ? 'not-supported' : 'unavailable'}`,
                'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
            }
          } else if (request.method === 'POST' && ['checkout', 'checkout-status', 'removal-request', 'removal-confirm', 'discord-request', 'discord-status', 'discord-disconnect'].includes(action)) {
            projectOrigin(project, origin);
            const ipHash = await privateHash(env, `ip:${request.headers.get('cf-connecting-ip') || 'local'}`);
            await rateLimit(env.DB, `ip:${action}:${ipHash}`, action === 'checkout-status' ? 60 : action === 'checkout' ? 20 : 10, 600);
            const body = await bodyJson(request);
            if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Expected a JSON object.');
            if (action === 'checkout-status') {
              response = json(await checkoutStatus(env.DB, env, dependencies.stripe || stripeClient(env), projectId, body.token));
            } else if (action === 'checkout') {
              if (env.PAYMENTS_ENABLED !== 'true') throw new HttpError(503, 'Support payments are not available yet.');
              const stripe = dependencies.stripe || stripeClient(env);
              const key = body.kind === 'monthly' && ['5', '10', '20'].includes(body.amount) ? `monthly${body.amount}` : body.kind === 'once' ? 'once' : null;
              if (!key) throw new HttpError(400, 'Choose a supported contribution.');
              const cents = key === 'once' ? amountCents(body.amount) : null;
              const { link, price } = await verifiedLink(stripe, env, project, key);
              if (!link.active) throw new HttpError(503, 'This contribution option is currently unavailable.');
              if (key !== 'once' && origin === project.origin && env.AUTO_PUBLISH_MESSAGES !== 'true') {
                const target = new URL(link.url);
                target.searchParams.set('client_reference_id', projectId);
                response = json({ url: target.href });
              } else {
                const fields = checkoutFields(link.custom_fields);
                const returnToken = env.AUTO_PUBLISH_MESSAGES === 'true' ? randomToken() : null;
                // A separate Checkout Session keeps each interface's return URL
                // without editing the shared Payment Link or creating new prices.
                const session = await stripe.checkout.sessions.create({ mode: key === 'once' ? 'payment' : 'subscription',
                  line_items: [key === 'once'
                    ? { price_data: { currency: 'aud', unit_amount: cents, product: typeof price.product === 'string' ? price.product : price.product.id }, quantity: 1 }
                    : { price: price.id, quantity: 1 }],
                  adaptive_pricing: { enabled: false },
                  custom_fields: fields, client_reference_id: projectId,
                  custom_text: { submit: { message: 'Thank you for supporting Villow. If you choose to share, your name and message usually appear after payment. Some wait for review; individual words may be masked.' } },
                  metadata: { support_integration: 'ftw-support-v1', support_project: projectId, support_link: link.id },
                  success_url: `${origin}/support?payment=returned${returnToken ? '#checkout=' + returnToken : ''}`, cancel_url: `${origin}/support?payment=cancelled`,
                });
                if (new URL(session.url).origin !== 'https://checkout.stripe.com') throw new Error('Unexpected Checkout URL');
                if (returnToken) {
                  if (!session.id) throw new Error('Missing Checkout ID');
                  await env.DB.prepare('INSERT INTO checkout_returns(token_hash, session_id, project, expires_at) VALUES (?, ?, ?, ?)')
                    .bind(await digest(returnToken), session.id, projectId, nowSeconds() + 86400).run();
                }
                response = json({ url: session.url });
              }
            } else if (action === 'discord-request') {
              if (!discordReady(env)) throw new HttpError(503, 'Discord linking is not available yet.');
              if (!env.RESEND_API_KEY || !env.MAIL_FROM) throw new HttpError(503, 'Email management is temporarily unavailable.');
              try { await requestDiscordLink(env.DB, env, projectId, { ...project, origin }, body.email, dependencies.sendEmail || (message => sendEmail(env, message))); }
              catch (e) {
                if (e instanceof HttpError) throw e;
                console.error('support_discord_email_failed');
                throw new HttpError(503, 'We couldn’t send your verification email. Please try again.');
              }
              response = json({ message: 'Verification email sent. Check your inbox to continue.' });
            } else if (action === 'discord-status') {
              response = json(await discordLinkStatus(env.DB, env, projectId, body.token));
            } else if (action === 'discord-disconnect') {
              const result = await disconnectDiscord(env.DB, env, projectId, body.token, dependencies.discordFetch || fetch);
              response = json({ disconnected: result === 'disconnected', message: result === 'disconnected' ? 'Discord disconnected.' : 'We’re finishing the disconnection. Please check back shortly.' });
            } else if (action === 'removal-request') {
              if (!env.RESEND_API_KEY || !env.MAIL_FROM) throw new HttpError(503, 'Email management is temporarily unavailable. Please contact support.');
              // Generic result even on delivery failure: email membership is private.
              try { await requestRemoval(env.DB, env, projectId, { ...project, origin }, body.email, dependencies.sendEmail || (message => sendEmail(env, message))); }
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
        env.DB.prepare('DELETE FROM discord_tokens WHERE expires_at < ? OR used_at IS NOT NULL').bind(now),
        // A consumed state remains the guard against disconnecting during an in-flight callback.
        env.DB.prepare('DELETE FROM discord_oauth_states WHERE expires_at < ?').bind(now),
        env.DB.prepare('DELETE FROM moderation_sessions WHERE expires_at < ?').bind(now),
        env.DB.prepare('DELETE FROM checkout_returns WHERE expires_at < ?').bind(now),
      ]);
      await syncDueDiscord(env.DB, env, dependencies.discordFetch || fetch, now);
    },
  };
}
export default createWorker();
