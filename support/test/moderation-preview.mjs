// Dev middleware only. In-memory SQLite + fake Stripe; no network writes.
import { readFile } from 'node:fs/promises';
import { database, environment, project, session, event, fakeStripe } from './helpers.mjs';
import { processEvent } from '../lib/events.mjs';
import { digest, randomToken, nowSeconds } from '../lib/privacy.mjs';
import { createWorker } from '../worker.mjs';
import { renderDesignPage } from '../../src/lib/site-design.mjs';

export async function createModerationPreview() {
  const db = database(), origin = 'http://127.0.0.1:4411';
  const env = { ...environment(db), AUTO_PUBLISH_MESSAGES: 'true', MODERATION_ENABLED: 'true', MODERATION_LOCAL_PREVIEW: 'true', MODERATION_ORIGIN: origin,
    MODERATION_PASSWORD_HASH: await digest('villow-local-review'), PAYMENTS_ENABLED: 'false',
    PROJECTS_JSON: JSON.stringify({ villow: { ...project, origin, additional_origins: ['http://localhost:4411'] } }) };
  const samples = [
    ['Alex', 'A calmer internet sounds lovely. Happy to help it grow.', 'unreviewed'],
    ['Morgan', 'Love this fucking project. Keep going!', 'needs_review'],
    ['Sam', 'Thanks for making room for a better way to watch.', 'approved'],
    ['Taylor', 'This is a fictional message hidden by the reviewer.', 'hidden'],
    ['Jamie', '<img src=x onerror=alert(1)> This stays plain text.', 'unreviewed'],
  ];
  const stripe = fakeStripe(); const links = {};
  for (const [index, [name, text, state]] of samples.entries()) {
    const checkout = session({ id: `cs_preview_${index}`, payment_intent: `pi_preview_${index}`, created: nowSeconds() - index * 60 });
    checkout.custom_fields[0].text.value = name; checkout.custom_fields[1].text.value = text;
    await processEvent(db, env, stripe, event('checkout.session.completed', checkout, { id: `evt_preview_${index}`, created: checkout.created }));
    if (['approved', 'hidden'].includes(state)) await db.prepare('UPDATE contributions SET moderation = ? WHERE session_id = ?').bind(state, checkout.id).run();
    const token = randomToken(); links[state] ||= token;
    await db.prepare('INSERT INTO checkout_returns VALUES (?, ?, ?, ?)').bind(await digest(token), checkout.id, 'villow', nowSeconds() + 86400).run();
  }
  const worker = createWorker({ stripe, sendEmail: async () => { throw new Error('Preview email disabled'); }, fetch: async () => new Response('{}', { status: 503 }) });
  return async (req, res) => {
    const host = req.headers.host;
    if (!['127.0.0.1:4411', 'localhost:4411'].includes(host)) { res.writeHead(403); res.end(); return; }
    const url = new URL(req.url, `http://${host}`);
    const localEnv = { ...env, MODERATION_ORIGIN: url.origin };
    if (url.pathname === '/__support-review/controller.js') {
      const source = await readFile(new URL('../../previews/homepage/help-page-a.js', import.meta.url), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
      res.end(source.replaceAll("from './", "from '/_design/")
        .replace('https://fixtheweb-support.nuciforan.workers.dev/v1/projects/villow', url.origin + '/__support-review/v1/projects/villow')
        .replace("config.mode === 'live'", "config.mode === 'test'")); return;
    }
    if (url.pathname === '/__support-review/' || url.pathname === '/__support-review') {
      let html = renderDesignPage('get-involved').replace('/_design/help-page-a.js', '/__support-review/controller.js');
      const choices = [['unreviewed', 'Published message'], ['needs_review', 'Held message'], ['hidden', 'Hidden message']]
        .map(([state, label]) => `<a href="/__support-review/?payment=returned#checkout=${links[state]}">${label}</a>`).join(' · ');
      html = html.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="connect-src \'self\'; form-action \'none\'; frame-src \'none\'">')
        .replace('<main ', `<aside style="padding:24px;background:#f1ead9;text-align:center">Fictional supporter preview · no payments or emails. <a href="/admin/support">Review messages</a><br>${choices}</aside><main `);
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });res.end(html);return;
    }
    const route = url.pathname.replace(/^\/__support-review/, '') + url.search;
    let body = ''; for await (const chunk of req) { body += chunk; if (body.length > 8192) { res.writeHead(413);res.end();return; } }
    const request = new Request(url.origin + route, { method: req.method, headers: req.headers, ...(['GET', 'HEAD'].includes(req.method) ? {} : { body }) });
    // New payments, outgoing emails and account operations are unavailable here.
    if (route.startsWith('/v1/') && !/\/(config|supporters|checkout-status|exchange-rates)(\?|$)/.test(route)) { res.writeHead(403);res.end('{}');return; }
    const response = await worker.fetch(request, localEnv);
    res.writeHead(response.status, Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  };
}
