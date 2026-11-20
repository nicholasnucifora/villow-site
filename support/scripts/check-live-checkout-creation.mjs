// Creates unpaid Checkout Sessions only. Never follows checkout or pays.
import assert from 'node:assert/strict';
for (const kind of ['once', 'monthly']) {
  const response = await fetch('https://fixtheweb-support.nuciforan.workers.dev/v1/projects/villow/checkout', {
    method: 'POST', headers: { Origin: 'https://villow.app', 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, amount: '5' }),
  });
  const body = await response.json();assert.equal(response.status, 200, body.error);
  assert.equal(new URL(body.url).origin, 'https://checkout.stripe.com');
  console.log(`${kind}: live Stripe checkout creation accepted; no payment made.`);
}
