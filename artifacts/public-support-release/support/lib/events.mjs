import { CONSENT_VERSION, publicFields, sessionSource, verifiedLink } from './config.mjs';
import { privateHash, normaliseEmail, nowSeconds } from './privacy.mjs';

const idOf = value => typeof value === 'string' ? value : value?.id || null;
const subOfInvoice = invoice => idOf(invoice.parent?.subscription_details?.subscription || invoice.subscription);
const eventInsert = (db, event) => db.prepare('INSERT INTO webhook_events(event_id, processed_at) VALUES (?, ?) ON CONFLICT DO NOTHING').bind(event.id, nowSeconds());

async function contributionStatements(db, env, stripe, session, event) {
  const source = sessionSource(session, env);
  if (!source) return [];
  if (session.livemode !== (env.STRIPE_MODE === 'live')) throw new Error('Checkout mode mismatch');
  if (session.payment_status !== 'paid') return [];
  const kind = source.key === 'once' ? 'once' : 'monthly';
  if (session.mode !== (kind === 'once' ? 'payment' : 'subscription') || session.currency !== source.project.currency || !Number.isSafeInteger(session.amount_total) || session.amount_total < 500) throw new Error('Unexpected paid Checkout Session');
  const { mapping } = await verifiedLink(stripe, env, source.project, source.key);
  const fields = publicFields(session.custom_fields, mapping);
  let emailHash = null;
  if (session.customer_details?.email) emailHash = await privateHash(env, `email:${normaliseEmail(session.customer_details.email)}`);
  const consent = fields.consent && !!emailHash;
  const subscription = idOf(session.subscription);
  const invoice = idOf(session.invoice);
  const payment = kind === 'monthly' ? invoice : idOf(session.payment_intent);
  if (!payment || (kind === 'monthly' && !subscription)) throw new Error('Missing payment identifiers');
  // Never update user text, consent, moderation or removal on webhook retries.
  return [
    db.prepare(`INSERT INTO contributions(session_id, project, kind, subscription_id, email_hash,
      display_name, message, consent, consent_version, consent_at, created_at)
      SELECT ?, ?, ?, ?, ?,
        CASE WHEN EXISTS(SELECT 1 FROM suppressions WHERE project = ? AND email_hash = ?) THEN NULL ELSE ? END,
        CASE WHEN EXISTS(SELECT 1 FROM suppressions WHERE project = ? AND email_hash = ?) THEN NULL ELSE ? END,
        CASE WHEN EXISTS(SELECT 1 FROM suppressions WHERE project = ? AND email_hash = ?) THEN 0 ELSE ? END,
        ?, ?, ? ON CONFLICT(session_id) DO NOTHING`).bind(
      session.id, source.id, kind, subscription, emailHash,
      source.id, emailHash, consent ? fields.name : null,
      source.id, emailHash, consent ? fields.message : null,
      source.id, emailHash, consent ? 1 : 0, consent ? CONSENT_VERSION : null, consent ? event.created : null, session.created),
    db.prepare(`INSERT INTO payments(payment_id, session_id, subscription_id, amount, currency, paid_at)
      VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(payment_id) DO NOTHING`).bind(payment, session.id, subscription, session.amount_total, session.currency, event.created),
  ];
}

function subscriptionStatement(db, subscription, event) {
  return db.prepare(`INSERT INTO subscriptions(subscription_id, status, cancel_at_period_end, event_created) VALUES (?, ?, ?, ?)
    ON CONFLICT(subscription_id) DO UPDATE SET status = excluded.status,
      cancel_at_period_end = excluded.cancel_at_period_end, event_created = excluded.event_created
    WHERE excluded.event_created >= subscriptions.event_created AND subscriptions.status != 'canceled'`)
    .bind(subscription.id, subscription.status, subscription.cancel_at_period_end ? 1 : 0, event.created);
}

export async function processEvent(db, env, stripe, event) {
  if (event.livemode !== (env.STRIPE_MODE === 'live')) throw new Error('Webhook mode mismatch');
  if (await db.prepare('SELECT 1 FROM webhook_events WHERE event_id = ?').bind(event.id).first()) return;
  const statements = [];
  const object = event.data.object;
  if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    statements.push(...await contributionStatements(db, env, stripe, object, event));
    if (statements.length && idOf(object.subscription)) {
      // Retrieve current state; Stripe does not guarantee event delivery order.
      statements.push(subscriptionStatement(db, await stripe.subscriptions.retrieve(idOf(object.subscription)), event));
    }
  } else if (['invoice.paid', 'invoice.payment_failed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted'].includes(event.type)) {
    const subscriptionId = event.type.startsWith('invoice.') ? subOfInvoice(object) : object.id;
    if (subscriptionId) {
      let known = await db.prepare('SELECT project FROM contributions WHERE subscription_id = ?').bind(subscriptionId).first();
      if (!known) {
        // Recover the initial checkout when Stripe delivers an invoice/subscription first.
        const sessions = await stripe.checkout.sessions.list({ subscription: subscriptionId, limit: 1 });
        const session = sessions.data[0];
        const source = session && sessionSource(session, env);
        if (source) {
          known = { project: source.id };
          statements.push(...await contributionStatements(db, env, stripe, session, event));
        }
      }
      if (known) {
        const current = await stripe.subscriptions.retrieve(subscriptionId);
        statements.push(subscriptionStatement(db, current, event));
        if (event.type === 'invoice.paid' && object.status === 'paid' && object.amount_paid >= 500 && object.currency === 'aud') {
          statements.push(db.prepare(`INSERT INTO payments(payment_id, subscription_id, amount, currency, paid_at) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(payment_id) DO UPDATE SET paid_at = excluded.paid_at, amount = excluded.amount, currency = excluded.currency`)
            .bind(object.id, subscriptionId, object.amount_paid, object.currency, object.status_transitions?.paid_at || event.created));
        }
      }
    }
  }
  // If any write fails, D1 rolls back the entire batch, including event deduplication.
  await db.batch([...statements, eventInsert(db, event)]);
}

export async function recentSupporters(db, project) {
  const { results } = await db.prepare(`SELECT c.display_name, c.message, c.kind,
      CASE WHEN c.kind = 'monthly' AND s.status = 'active' THEN 'active'
           WHEN c.kind = 'monthly' THEN 'previous' ELSE NULL END AS monthly_status,
      MAX(p.paid_at) AS contributed_at
    FROM contributions c
    JOIN payments p ON (p.session_id = c.session_id OR (c.subscription_id IS NOT NULL AND p.subscription_id = c.subscription_id))
    LEFT JOIN subscriptions s ON s.subscription_id = c.subscription_id
    WHERE c.project = ? AND c.consent = 1 AND c.moderation = 'approved' AND c.removed_at IS NULL
      AND (c.display_name IS NOT NULL OR c.message IS NOT NULL)
      AND NOT EXISTS(SELECT 1 FROM suppressions x WHERE x.project = c.project AND x.email_hash = c.email_hash)
    GROUP BY c.session_id ORDER BY contributed_at DESC, c.session_id DESC LIMIT 10`).bind(project).all();
  // Explicit response allowlist: no IDs, emails, amounts, Stripe objects or hashes.
  return results.map(row => ({ displayName: row.display_name, message: row.message, kind: row.kind,
    monthlyStatus: row.monthly_status, date: new Date(row.contributed_at * 1000).toISOString().slice(0, 10) }));
}
