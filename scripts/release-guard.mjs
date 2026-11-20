// Cloudflare currently uses npm run build. This redesign is explicitly private
// until the owner asks to release it. Local validation uses build:local.
if (process.env.VILLOW_PUBLIC_RELEASE_APPROVED !== '1') {
  console.error('Public release is disabled while the Villow redesign is in development. Use npm run build:local for local validation. Enable VILLOW_PUBLIC_RELEASE_APPROVED=1 only after the owner explicitly approves publication.');
  process.exit(1);
}
