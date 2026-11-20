import { HttpError, sessionSource } from './config.mjs';
import { digest, nowSeconds } from './privacy.mjs';
import { recordPaidCheckout } from './events.mjs';
import { reviewStatus } from './message-review.mjs';

export async function checkoutStatus(db, env, stripe, project, token) {
  if (!/^[a-f0-9]{64}$/.test(token || '')) throw new HttpError(400, 'This confirmation link is invalid or expired.');
  const receipt = await db.prepare('SELECT session_id FROM checkout_returns WHERE token_hash = ? AND project = ? AND expires_at > ?')
    .bind(await digest(token), project, nowSeconds()).first();
  if (!receipt) throw new HttpError(400, 'This confirmation link is invalid or expired.');
  async function read() {
    return db.prepare(`SELECT c.moderation, c.auto_publish, c.consent, c.removed_at, c.display_name, c.message,
      EXISTS(SELECT 1 FROM suppressions s WHERE s.project = c.project AND s.email_hash = c.email_hash) AS suppressed
      FROM contributions c WHERE c.session_id = ? AND c.project = ? AND EXISTS(SELECT 1 FROM payments p WHERE p.session_id = c.session_id)`).bind(receipt.session_id, project).first();
  }
  let record = await read();
  if (!record) {
    const session = await stripe.checkout.sessions.retrieve(receipt.session_id);
    if (session.id !== receipt.session_id || sessionSource(session, env)?.id !== project || session.livemode !== (env.STRIPE_MODE === 'live')) throw new HttpError(400, 'This confirmation link is invalid or expired.');
    if (session.payment_status !== 'paid') return { payment: 'processing' };
    await recordPaidCheckout(db, env, stripe, session);
    record = await read();
    if (!record) return { payment: 'processing' };
  }
  let sharing = 'private';
  if (record.consent && !record.removed_at && !record.suppressed && (record.display_name || record.message)) {
    const state = reviewStatus(record);
    sharing = ['approved', 'unreviewed'].includes(state) ? 'published' : state === 'needs_review' ? 'review' : 'hidden';
  }
  // No payment IDs, amounts, email, private message text or filter reasons.
  return { payment: 'paid', sharing };
}
