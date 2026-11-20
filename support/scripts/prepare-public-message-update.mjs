// Narrow update of the published design, never the current private Astro tree.
// First extract git archive 51f29b4 to artifacts/public-support-release and build
// the unchanged baseline. The deployable source is that isolated directory.
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../..');
const destination = resolve(root, 'artifacts/public-support-release');
function replace(file, changes) {
  const path = resolve(destination, file);let value = readFileSync(path, 'utf8');
  for (const [before, after] of changes) { if (!value.includes(before)) throw new Error(`Baseline mismatch: ${file}`);value = value.replace(before, after); }
  writeFileSync(path, value);
}
for (const file of ['src/components/blocks/Support.astro', 'src/scripts/support.ts', 'previews/homepage/help-checkout-return.js']) {
  mkdirSync(resolve(destination, file, '..'), { recursive: true });copyFileSync(resolve(root, file), resolve(destination, file));
}
replace('src/content/support.json', [
  ['The 10 most recent approved supporter entries', 'The 10 most recent shared supporter entries'],
  ['Messages shared with permission will appear here after review.', 'Messages shared with permission will appear here after payment. Some may wait for review.'],
  ['Thank you for supporting Villow. Payment confirmation can take a moment; messages appear only after payment, permission and review.', 'Thank you for supporting Villow. Shared messages usually appear after payment is confirmed. Some wait for a quick review.'],
]);
replace('src/content/pages/support.yaml', [
  ["Approved names and messages may appear on Villow and other Fix the Web projects. We show the contribution date and whether the support is one-time or monthly. Messages are reviewed before appearing. We don't publish payment amounts, email addresses or payment details.", "Names and messages you choose to share may appear on Villow and other Fix the Web projects after payment is confirmed. An automatic language check holds some messages for review. Other messages appear straight away and may be reviewed or hidden later. A moderator may mask individual words while keeping the rest of your message. We show the contribution date and whether the support is one-time or monthly. Your amount may be shown only if the question you answered included it. We never publish email addresses or payment details."],
  ["We wait for successful payment and review messages before publishing. We also need an explicit “Yes” to the public display question. A message can stay private even when you've contributed.", "Thank you for contributing. With an explicit “Yes” to sharing, messages usually appear after payment is confirmed. Some wait for a quick review before appearing. Your contribution is appreciated whether or not you choose to share a message."],
]);
replace('src/content/prose/site-privacy.md', [
  ['**Last updated:** 14 November 2026', '**Last updated:** 16 November 2026'],
  ['We review messages before they appear.', 'An automatic language check holds some messages for review; other shared messages appear after payment and may be reviewed or hidden later. A moderator may mask individual words while preserving the rest of the message. The original remains available privately for review until you remove your public details.'],
  ["Your card and billing details go to Stripe, never to us, and Stripe handles them under", "Stripe receives your card and billing details. As the merchant, we can access payment, contact and billing information Stripe makes available to us, but not your full card number or security code. Stripe handles payment data under"],
  ['Confirming clears your name and message', 'Confirming clears your name and message, including any censored version,'],
  ['- **Stopping abuse.**', '- **Payment confirmation.** A random return token lets the support page verify your payment and tell you whether your message is public or awaiting review. Its protected hash expires after 24 hours. The token stays in your browser’s page history, not in the address sent to the server.\n- **Private moderation.** The owner reviews shared names and messages at fixtheweb.org/admin/support. Sign-in uses a secure, HTTP-only cookie lasting up to eight hours. Session-token hashes are stored server-side and expire or are revoked on sign-out. These cookies are for the owner’s private page, not ordinary visitors.\n- **Stopping abuse.**'],
]);
console.log('Prepared only the message-flow component, controller, support copy and website privacy text in the published design.');
