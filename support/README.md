# Shared supporter service

**Contact form activated (13 November 2026):** The owner explicitly approved backend activation. Worker version `f96d0acf-287e-456a-8aa8-f5cf08b1e2ba` has `CONTACT_ENABLED=true` and `CONTACT_TO=support@villow.app`. `POST /v1/projects/villow/contact` accepts an email, one of the fixed topics, a 10–3,000-character message and a UUID request ID. It sends plain text through the existing Resend sender, with the visitor's address as reply-to. It never adds a supporter or mailing-list entry. The API enforces allowed origins, a 16 KiB request limit, a honeypot, per-IP/per-email limits and an aggregate hourly limit. Retry keys prevent duplicate provider sends; provider failures never return success. Email/message contents are not logged or saved to D1. Live readiness reports enabled; invalid input returns 400 with the correct local CORS origin, and an untrusted origin returns 403. Existing live payment/Discord configuration still reports enabled. All 47 backend and six relevant preview tests passed. No real test email was sent, so inbox delivery has not been exercised in this activation. The forms are in the local Get involved and Contact previews; this change does not publish the website.

**Amount-sharing update (5 November 2026):** The owner approved explicit public
amount sharing and confirmed updating all four live Payment Links. Their third
optional field now reads **Share my name, message and amount publicly?**, with
Yes/No and no Yes default. The old label remains accepted for compatibility.
Server-created Checkout Sessions use the new label. Webhooks validate consent
against the authenticated session snapshot, including its original field keys
and options, so subsequent Payment Link edits cannot expand old permission.
`public-name-message-amount-v2` permits publishing the initial paid amount and
currency alongside approved name/message data; `public-name-message-v1` never
exposes amounts. Moderation, removal and suppression still apply. No migration
or additional secret was needed. `GET supporters?recent=50` supplies the bounded
design-preview list; old pagination/default responses remain compatible.

Amount-sharing release Worker: `cfc8d32b-8594-4bef-9e7b-a877a765326e`. All 50 backend/UI checks passed for that release.
The four live options returned 200 after the label edits; an unpaid A$5 checkout
was created without submitting payment. The local redesign remains unpublished.

**Live local support (updated 5 November 2026):** The owner explicitly chose real payments in the local How to help preview. It now uses the live service, with Discord enabled and exact loopback origins allowed alongside villow.app. Migration `0003_discord_return_origin.sql` binds OAuth returns to the trusted initiating origin. All 41 tests pass. Discord now verifies every requesting inbox before revealing eligibility; unmatched emails see No payment found privately, and delivery failures return an error. Live one-time and all monthly checkout creation passed without submitting payment; live payment/webhook/completed OAuth verification remains outstanding. Sandbox Discord stays disabled. The redesign is not published. See [Discord setup and activation](DISCORD-SETUP.md).

**Live website:** [villow.app/support](https://villow.app/support), launched 3 November 2026 (Australia/Brisbane). Live checkout is enabled on the production Worker. Monthly A$5/A$10/A$20 link responses, the A$5 minimum, the live Customer Portal login page, and opening an unpaid A$5 one-time Checkout Session were verified. No real payment was submitted. The first genuine contribution still needs a successful live webhook delivery check; public messages require moderation as described below.

Website source release: `44702bb` on the repository's `main` branch; initial Cloudflare website version `fff1af9a-4795-4e84-9148-f42829ca7699`. Current production Worker version: `cfc8d32b-8594-4bef-9e7b-a877a765326e` (5 November; explicit amount-sharing consent and latest-50 feed). The website release was built in an isolated checkout so unrelated local website work was not published. Future website builds must retain the public build variable documented below. To pause new checkout, set production `PAYMENTS_ENABLED=false` and deploy with `--config wrangler.production.jsonc`; portal access, removal and webhook processing remain available.

## Setup and verification record

**Test backend deployed; sandbox checkout, moderation, emailed removal, and portal cancellation scheduling verified.** The test Worker is [fixtheweb-support-test.nuciforan.workers.dev](https://fixtheweb-support-test.nuciforan.workers.dev), bound to D1 database `771fc8a2-e821-4065-aca5-e2ba3b7c8c59`; migration `0001_support.sql` is applied. Its allowed website origin is `http://127.0.0.1:4411` (the current How to help design preview); this test Worker handles sandbox payments only. The website is Astro static content on Cloudflare (`../wrangler.jsonc`). Its existing `review/` Supabase migrations belong to the separate extension review environment. This service uses a separate Cloudflare Worker and D1 database. **No Supabase project is needed.** No app or extension code is changed.

**Production infrastructure prepared and launched on 2026-11-03.** `wrangler.production.jsonc` deploys Worker `fixtheweb-support` at `https://fixtheweb-support.nuciforan.workers.dev`, with its own Oceania D1 database `71446adf-ba53-4cd2-9efb-b1c782e8c996`. Migration `0001_support.sql` is applied; all seven application tables exist. A fresh `EMAIL_HASH_SECRET` was generated in memory and saved directly to Cloudflare. Cloudflare confirms all four production secrets are present: `EMAIL_HASH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `RESEND_API_KEY`. `STRIPE_MODE=live`, `PAYMENTS_ENABLED=true`, and `MAIL_FROM=Villow <support@mail.villow.app>` are set. `PROJECTS_JSON` maps the four owner-supplied live Payment Link IDs below to `https://villow.app`, in AUD, with the supplied live Customer Portal URL. The deployed config endpoint confirms enabled live checkout. The owner reported no activation/verification warnings in the main Stripe dashboard. The public website is connected to this Worker.

Live Stripe account: `acct_1SyvUsKrVuH4uUXY` (separate from the sandbox account). These non-secret IDs have been validated through Stripe using the saved live restricted key:

| Option | Live Payment Link ID |
| --- | --- |
| One-time | `plink_1UXPaMKrVuH4uUXYu052bdnG` |
| A$5/month | `plink_1UXPDWKrVuH4uUXYGnL6gNLV` |
| A$10/month | `plink_1UXPU5KrVuH4uUXYs6DJOXjM` |
| A$20/month | `plink_1UXPV2KrVuH4uUXYVdsaF44O` |

A temporary, read-only Cloudflare remote preview used the existing secret to call `verifiedLink` for all four options, without printing the secret, modifying Stripe, creating Checkout Sessions, or changing the deployed production handler. Every link was active, matched the originally supplied public URL, used AUD, and passed the custom-field and consent checks. The one-time minimum was 500 cents; monthly amounts were 500/1000/2000 cents with the expected monthly interval. The preview was stopped after validation. This verifies authentication and the link-read API paths, not live Checkout creation, subscription retrieval, webhook delivery, or email delivery.

The owner was instructed to configure a **live**, **Your account**, **snapshot** webhook destination named `fixtheweb-support-live`, API version `2026-10-28.endive`, at `https://fixtheweb-support.nuciforan.workers.dev/v1/stripe/webhook`, using the seven events documented below, and reported saving it. The production Worker has `STRIPE_WEBHOOK_SECRET`; an unsigned POST returns HTTP 400 (`Invalid Stripe signature.`). This verifies signature enforcement, but a successful signed delivery from the actual live Stripe destination is still pending and is needed to confirm the signing secret matches that destination. The owner checked its Event deliveries tab and reported no deliveries yet; no live payment has been made during setup.

The owner saved the production Resend API key as `RESEND_API_KEY`. A temporary remote preview used it to send one idempotent configuration-check message from `Villow <support@mail.villow.app>` to Resend's built-in simulated delivery recipient. Resend returned HTTP 200. This verifies the production key and sender are accepted, not delivery to a real inbox. The preview was stopped and did not read or write supporter records. Real inbox delivery and the removal flow were verified earlier with the sandbox key and the same sender/domain.

The owner saved `PUBLIC_SUPPORT_API_URL=https://fixtheweb-support.nuciforan.workers.dev` in the **website's build variables** (separate from the supporter Worker's runtime variables). The isolated source release built successfully with the committed website lockfile, including policy-hash and internal-link checks for 19 pages. Cloudflare then deployed the pushed commit through the existing build flow, and the public page loaded the production configuration, portal and empty supporter feed. No Stripe or Resend keys belong in the website build.

Post-launch checks: all three monthly API requests returned the expected live Payment Link with `client_reference_id=villow` and the correct CORS origin. A$4.99 returned HTTP 400. The public website opened a live one-time Checkout Session showing A$5.00 and all three optional fields, with no contact or payment details entered and no payment submitted. This exercises the live restricted key's Checkout creation permission. The live portal opens the owner's billing login page; live subscription cancellation has not been exercised because no live subscription was created during setup. Production D1 still contained zero contributions, zero payments and zero subscriptions after these checks.

The test Worker has `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `EMAIL_HASH_SECRET`, and `RESEND_API_KEY` saved. An unsigned request to the deployed webhook returns HTTP 400 (`Invalid Stripe signature.`). The sandbox portal and all four Payment Link IDs are configured. Hosted checks passed for A$5/A$10/A$20 monthly and creation of an unpaid A$12.34 one-time Checkout Session; A$4.99 was rejected. The A$10/month custom-field labels were corrected and rechecked successfully. The local automated suite has 16 passing tests, including failed-renewal recovery without an extra payment or premature public date change, and delayed-payment failure/success with moderation and deduplication preserved.

A full A$10/month sandbox subscription succeeded through the local website and Stripe Checkout using Stripe's test card and a fictional `example.com` email. Consent was left blank despite entering a display name and message. The signed Stripe events populated D1 with exactly one payment and an active monthly subscription; the optional name and message were discarded (`consent = 0`, both text columns NULL). Test Checkout ID: `cs_test_a1AzS8rwvRiOZ7541ZGZ64Yz3KRuQ497ANJukkFGicyM4iW8EzvzKG5iDJ`.

An A$12.34 one-time sandbox payment with explicit Yes succeeded using an owner-authorized inbox and fictional public text. It remained absent from the public feed until its exact record was approved through authenticated D1 access. The feed then returned only the permitted public fields. Resend delivered the removal email; opening its link left the record intact. The owner confirmed removal, and D1 then showed cleared text, withdrawn consent, a used token and a suppression record. The feed became empty. Test Checkout ID: `cs_test_a1sy8uQA5dgEZTtk0Jaxl5z8N0yRfZxLXXhWmYy7oOP1cWMnGBtqxFmn60`.

A later A$5/month sandbox payment with that same inbox and explicit Yes also succeeded. D1 recorded exactly one A$5 payment and an active subscription while discarding the name/message (`consent = 0`, both text columns NULL), confirming that subsequent payments respect the removal preference. Test Checkout ID: `cs_test_a1nI4HfB539EEtrmld8QeewsqFuFNSaCD5i7VZQEMTG7vkaXdUj0CAkVAi`. The website's portal link opened the correct sandbox, but Stripe rejected the login-email request for that inbox: until the Stripe account is activated, this sandbox sends portal emails only to verified Stripe team addresses. Testing continued with the owner's verified Stripe email below. The A$5 and A$10 monthly subscriptions remain active in the sandbox and should be canceled during test cleanup. No live payments were made.

An A$20/month sandbox payment using the owner's verified Stripe email and explicit No succeeded. D1 recorded one A$20 payment and an active subscription, with no stored display name or message. Test Checkout ID: `cs_test_a1hlDRJ2etOURLvt9TyzohH5YQvijYu7QFpXkSEFiV5ABA7f2pInbVepeK`. Stripe accepted the portal login-email request for that verified address, and the owner confirmed cancellation through the portal. The signed webhook updated D1 to `status = active`, `cancel_at_period_end = 1`; this means cancellation is scheduled for the end of the current billing period, rather than immediate termination. Exactly one payment remains, both public text columns are NULL, and the public feed is empty. The terminal `canceled` transition at period end has not yet been observed in the sandbox. All three monthly tiers have completed successful sandbox payments; blank, No and Yes consent handling have been exercised.

The one-time A$5, A$10 and A$20 presets each created an unpaid hosted Checkout Session. Stripe's Checkout order summary confirmed `livemode = false`, currency `aud`, and totals of 500, 1000 and 2000 cents respectively. These preset checks did not submit payments; the completed one-time payment remains the A$12.34 custom-amount test above.

Actual sandbox checks still outstanding include payment completion for the other one-time presets and renewal/failure/delayed-payment scenarios. Automated coverage of privacy, deduplication and event ordering is not a claim that these hosted scenarios have been exercised. Launch does not mark those additional hosted scenarios complete; the completed sandbox payment, consent, moderation, removal, cancellation-scheduling and replay checks are recorded above.

The owner resent an existing `checkout.session.completed` event from the sandbox destination and confirmed the new delivery returned HTTP 200. Before and after the replay, D1 contained four contributions, four payments, three subscriptions, twelve processed event IDs, and one suppression. All four contributions retained consent withdrawn or absent and both public text columns NULL; the removed one-time contribution retained its removal marker. The public feed remained empty. The replay created no duplicate records and restored no public details.

The current live interface is the local How to help design preview at `http://127.0.0.1:4411/help-a.html#financial-support`. Run `node previews/homepage/serve-r.mjs` from the repository root, or reuse the existing shared server. Its `/support` alias handles Stripe returns and email-removal links. See [preview integration notes](../previews/homepage/SUPPORT-INTEGRATION.md). The earlier Astro preview on port 4321 is no longer the configured sandbox origin.

Sandbox account: `acct_1UXQtn3AH36bMHbI`. These are test configuration identifiers, not credentials:

| Option | Sandbox Payment Link ID |
| --- | --- |
| One-time | `plink_1UXQuP3AH36bMHbIZ1bBK4eu` |
| A$5/month | `plink_1UXQuM3AH36bMHbIQEM4lQrI` |
| A$10/month | `plink_1UXQuR3AH36bMHbIA7ekVyds` |
| A$20/month | `plink_1UXQuN3AH36bMHbIHSNgA9Se` |

The one-time ID comes from the supplied Markdown link's actual destination; its visible label repeated the A$10 link. The backend successfully validated that destination as a variable-amount AUD link with a minimum of at least A$5 and the required optional fields. Sandbox portal: [customer login](https://billing.stripe.com/p/login/test_00wcMYfgc6YF8RW4rG3ks00).

## Architecture

```text
villow.app/support ── public API ── Cloudflare Worker ── D1
       │                                │
       └── Stripe Checkout              ├── Resend (requested verification emails)
                    └── signed webhook ─┘
```

Use a separate Worker so the existing site's hosting remains unchanged. Start on its Cloudflare-assigned `workers.dev` URL; later a hostname such as `support.fixtheweb.org` can point to the same service. The origin is configurable in the website build. A versioned API and `project` column support other projects without building their interfaces now.

Monthly contributions use your three existing Payment Links. The supplied variable-amount link is also accepted by the webhook if shared directly. For an exact preset/custom amount selected on Villow, the Worker creates a one-time Checkout Session using that link's product and three custom fields. Payment Links do not document an amount-prefill URL parameter. This does **not** inherit every Payment Link setting: the generated one-time session uses the Stripe account's applicable payment settings, no discounts, and the explicitly configured success/cancel URLs. Review it in the sandbox.

Amounts are AUD, with a server-enforced A$5 minimum and A$10,000 per-checkout cap. The recurring options are exactly A$5, A$10 and A$20 per month. The public feed includes an amount only for an approved contribution with the explicit v2 amount-sharing permission. Earlier amounts remain private.

## Before you start

You need:

1. A Cloudflare account able to create Workers and D1 databases.
2. A Stripe **sandbox/test environment**, four matching test Payment Links, and a test Customer Portal login URL. The links in `stripe-links.json` are the supplied **live** links; do not use them for testing.
3. A Stripe test API key, webhook signing secret, and later separate live equivalents.
4. A Resend account, verified sending domain, and sending API key for removal verification. Use an inbox you control for testing. Turn off email open/click tracking, especially link rewriting, so the removal token's URL fragment is preserved.
5. The public origin of the test website, and eventually `https://villow.app`.

Never put secrets in `PUBLIC_*`, the website's YAML/JSON, source control, command arguments, screenshots, or chat. Only `PUBLIC_SUPPORT_API_URL` is a frontend build setting. `.dev.vars` is ignored. Inject the discovery key using a password manager or your shell's secure environment facility rather than a literal command that leaves it in history.

## 1. Configure Stripe test links

Create test equivalents of all four links, in AUD:

- One-time: customer chooses amount, minimum **500 cents**, suggested amount **1000 cents**.
- Monthly: recurring 500, 1000 and 2000 cents, interval **month**, interval count **1**, quantity **1**, no adjustable quantity, no trial, no discounts or promotion codes.
- For each link add exactly these **optional** fields:
  1. Text: `Display name`
  2. Text: `Supporter message`
  3. Dropdown: `Share my name, message and amount publicly?` — `Yes` and `No`. Do not default to Yes. The older `Can we publicly display your name and message?` label remains supported for name/message-only consent.
- Set text limits to 80 characters for the name and 255 for the message when available. The backend independently caps them.
- Add consent help explaining that approved names, messages and permitted contribution amounts can appear on Villow and other Fix the Web projects. Link to `https://villow.app/support#supporter-privacy` (or your staging equivalent).
- Set successful-payment redirect to `<WEBSITE_ORIGIN>/support?payment=returned`. The page does not treat this redirect as proof of payment.
- Enable the Customer Portal's hosted login link, payment-method updates, invoice access, and subscription cancellation. Keep product/quantity switching and trials off for this initial setup. Enable test mode separately from live mode.
- Set the account's public business/support information and receipt settings in Stripe.

The backend reads the actual custom-field **keys and dropdown values** from Stripe. You don't need to guess them from the labels, their order, or screenshots. Missing permission, No, and any unrecognised value all mean private. Checkout's billing/customer name is never substituted for the optional display name.

## 2. Install and discover the configuration

From the repository's `support/` directory:

```sh
npm ci
```

Copy `stripe-links.json` to an ignored local file such as `.env.test-links.json`. Replace its four payment URLs and portal URL with their test equivalents. Keep `currency` as `aud`. Set `STRIPE_SECRET_KEY` securely in the shell environment, then run:

```sh
npm run discover -- --links .env.test-links.json --origin http://127.0.0.1:4411 --mode test
```

For hosted staging, pass its HTTPS origin instead. This is read-only: it matches the URLs, checks amounts, currency, minimum and consent fields, and prints a **non-secret** JSON value for `PROJECTS_JSON`. Missing or mismatched configuration fails closed. Its structure is:

```json
{"villow":{"origin":"https://your-test-site.example","currency":"aud","portal":"https://billing.stripe.com/p/login/test_REPLACE","links":{"once":"plink_REPLACE1","monthly5":"plink_REPLACE2","monthly10":"plink_REPLACE3","monthly20":"plink_REPLACE4"}}}
```

Use actual `plink_` IDs returned by discovery. The short URL suffixes are not Payment Link IDs.

**Stripe key permissions:** use a restricted key from the start. The runtime/discovery paths require Payment Links read (including list/line items), Prices and Products read as required for their expanded prices, Checkout Sessions write (includes read), and Subscriptions read. Leave other permissions at None. Do not grant refunds, payouts, balances, customer writes, or webhook-endpoint management. The backend receives invoice snapshot data and does not fetch invoices or create subscriptions directly. Permission labels can vary in Stripe; verify each exercised endpoint using the restricted key before switching live.

## 3. Local testing

Copy `.dev.vars.example` to `.dev.vars` and fill in the following values:

| Setting | Value/location |
| --- | --- |
| `STRIPE_SECRET_KEY` | Test API/restricted key, `sk_test_…` or `rk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` from the local Stripe CLI listener (different from a hosted endpoint secret) |
| `EMAIL_HASH_SECRET` | Random secret of at least 32 characters; generate 32 random bytes as hex |
| `RESEND_API_KEY` | Sending-only Resend key |
| `MAIL_FROM` | `Villow <support@YOUR_VERIFIED_DOMAIN>` |
| `PROJECTS_JSON` | Discovery output, with exact local website origin |
| `STRIPE_MODE` | `test` |
| `PAYMENTS_ENABLED` | `true` only once configuration is complete |

Generate a hashing secret locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and place it directly in the secret store. Keep it stable: changing it breaks matching existing supporters' email fingerprints. Back it up securely. Use different values/databases for test and production.

```sh
npm test
npx wrangler d1 migrations apply DB --local
npm run check
npm run dev
```

In another terminal, install/authenticate the official Stripe CLI and run:

```sh
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,invoice.paid,invoice.payment_failed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted --forward-to http://localhost:8787/v1/stripe/webhook
```

Copy its signing secret into `.dev.vars`, then restart the Worker. The CLI uses your Stripe test environment; verify the account/sandbox shown. Generic `stripe trigger` fixtures don't use your allowlisted links and are intentionally ignored: use the actual **test checkout links** to verify this integration.

In the repository root, set `.env` to `PUBLIC_SUPPORT_API_URL=http://localhost:8787`, then run `npm run dev`. Visit `/support` at the exact origin used during discovery. Local HTTP is accepted only during Astro development and with `STRIPE_MODE=test`. Do not commit `.env`. With the API unset the UI clearly shows that contributions are not open and cannot charge anyone.

## 4. Hosted test environment

From `support/`:

```sh
npx wrangler login
npx wrangler d1 create fixtheweb-support-test
```

Replace the all-zero `database_id` in `wrangler.jsonc` with the returned ID. Set its `PROJECTS_JSON` to the discovery output for your HTTPS staging website and leave `STRIPE_MODE=test`. The Worker name is `fixtheweb-support-test`. Deploy its schema:

```sh
npx wrangler d1 migrations apply DB --remote
```

Set secrets using interactive prompts, individually:

```sh
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put EMAIL_HASH_SECRET
npx wrangler secret put RESEND_API_KEY
```

Set the non-secret sender address `MAIL_FROM` in the configuration's `vars`; the test configuration uses `Villow <support@mail.villow.app>`. Keep the Resend API key in the secret store.

Deploy initially with `PAYMENTS_ENABLED=false`:

```sh
npx wrangler deploy
```

Use the exact hostname Cloudflare returns. In Stripe's **test** Workbench, create a **snapshot** webhook destination for your account at:

```text
https://<ACTUAL-WORKER-HOSTNAME>/v1/stripe/webhook
```

Pin snapshot API version **2026-10-28.endive**, matching `lib/config.mjs`, and select exactly the seven events in the local listener command above. This implementation expects snapshot events, not thin events. Replace `STRIPE_WEBHOOK_SECRET` with this endpoint's signing secret. The URL must be publicly reachable by Stripe (no login/Cloudflare Access challenge on this path).

Set `PAYMENTS_ENABLED=true`, deploy again, and set the staging website build's `PUBLIC_SUPPORT_API_URL` to `https://<ACTUAL-WORKER-HOSTNAME>`. Rebuild the site; this variable is read at build time. No publishable Stripe key is needed because Checkout is hosted by Stripe.

## 5. End-to-end verification before live use

Use only Stripe test credentials and official [test payment methods](https://docs.stripe.com/testing). No real card or real payment is necessary.

- Complete A$5/A$10/A$20 monthly checkouts and A$5/A$10/A$20/custom one-time checkouts; confirm exact AUD amounts and all three optional fields. Try A$4.99 and a crafted API request: both must fail before Checkout creation.
- Pay with a name/message but no permission; then No; then Yes. Only Yes records can become public. Verify the database stores no optional text for the first two.
- Before moderation, the public feed stays empty. Approve a Yes entry using the queries below; verify only display name, message, type/status and date are returned.
- Leave the name empty and consent to a message: the website uses “A kind supporter”, never the billing name. Test HTML-looking text: it must appear as text, not markup.
- Test an unfinished, failed, and delayed payment. Checkout completion alone with `payment_status=unpaid` must not publish anything; `checkout.session.async_payment_succeeded` records it after success.
- Resend a delivered webhook from Stripe Workbench; counts must not increase. Exercise an actual renewal (Stripe test clocks where available), a failed renewal and portal cancellation. The feed has one entry per checkout/subscription; successful renewals advance its date, and canceled/inactive support is labelled as previous monthly support.
- Request removal with the checkout email. An unknown email receives the same browser response without sending mail. Open the email link: **opening it alone must not remove anything**. Confirm removal; the feed must immediately stop returning the entry. Reusing/expiring the token or changing projects must fail. Replaying payment events and paying again with the same email must not restore public text.
- Verify the portal can cancel a test subscription. Removing a message must leave the subscription alone.
- Verify `GET /v1/projects/villow/supporters` returns at most 10 entries, with no email, email hash, amount, customer ID, Checkout ID, payment ID or raw Stripe data. Confirm CORS rejects another site's write requests.
- Inspect Stripe's delivery log for HTTP 200 responses and test retries after an intentional local failure. Invalid/modified signatures return HTTP 400; processing failures return HTTP 503 so Stripe retries.
- Verify Resend delivery, sender DNS, spam placement, and fragment preservation. Check desktop/mobile layouts, keyboard controls and dark mode on staging.

Automated tests use the real Stripe SDK for signed webhook verification and SQLite transactions for database behavior, with mocked Stripe API responses. These tests **do not substitute for the Stripe sandbox checks above**.

## Moderation

The live owner interface is <https://fixtheweb.org/admin/support>, activated on
16 November 2026. Use it to filter Unreviewed, Approved, Hidden and Needs review,
approve/hide messages and preview optional censorship. Screened, consented paid
messages publish immediately as Unreviewed. See [the moderation guide](MODERATION.md)
for sign-in, the isolated local preview and deployment evidence.

### Legacy operator recovery only

Routine review does not need D1. The historical queries below are for operator
recovery only. Prefer the authenticated admin API, which also handles versioned
decisions and original/censored public text. Limit database access to trusted operators.

Review pending records:

```sql
SELECT session_id, project, display_name, message, kind, created_at
FROM contributions
WHERE consent = 1 AND moderation = 'pending' AND removed_at IS NULL
ORDER BY created_at DESC LIMIT 50;
```

Check for personal email/phone/payment details, spam, links, abusive content or impersonation before approving. Publish one reviewed entry by substituting its exact ID:

```sql
UPDATE contributions SET moderation = 'approved'
WHERE session_id = 'cs_REPLACE' AND consent = 1 AND removed_at IS NULL
  AND NOT EXISTS (SELECT 1 FROM suppressions s
    WHERE s.project = contributions.project AND s.email_hash = contributions.email_hash);
```

Hide an entry at any time:

```sql
UPDATE contributions SET moderation = 'hidden' WHERE session_id = 'cs_REPLACE';
```

Hiding keeps a private moderation record; supporter removal clears original and censored text. New screened messages publish as Unreviewed; Approved remains an explicit owner decision. Browser rendering uses `textContent`, not HTML. Entries are returned with `Cache-Control: no-store`, so removal is effective on the next fetch. Already-open pages or copies made by others cannot be recalled.

## Going live — only after the test checklist

1. Use the **separate production D1 database** and non-secret configuration file `wrangler.production.jsonc` prepared above. Keep `STRIPE_MODE=live` and `PAYMENTS_ENABLED=false` during setup. Never bind production to the test database.
2. Re-run discovery with `--links stripe-links.json --origin https://villow.app --mode live` and a live key. This validates your supplied live links. Put the output in the production config.
3. Run each Wrangler migration, secret and deployment command with `--config wrangler.production.jsonc` to target production explicitly. Set the live API key, the new endpoint's webhook signing secret, and the production Resend key. The production email-hash secret and `MAIL_FROM` are already configured; preserve the hashing secret.
4. Create the equivalent **live** snapshot webhook endpoint on the production Worker URL with the same seven events/API version. Install its own signing secret. Review Stripe live portal and redirect configuration separately.
5. After verification, set production `PAYMENTS_ENABLED=true` and deploy. Set Villow's Cloudflare build variable `PUBLIC_SUPPORT_API_URL` to the production API origin; rebuild/deploy the static website through its existing flow. The root Wrangler config does not change.
6. Confirm live configuration is correct without making a payment automatically. Monitor the first real contribution's delivery and moderation manually. Configure Stripe failed-webhook email notifications and Cloudflare availability monitoring.

You can immediately disable new website checkouts with `PAYMENTS_ENABLED=false` while leaving webhook, removal and public-feed processing running. This does not deactivate separately shared Stripe Payment Links or cancel subscriptions; control those in Stripe.

## Maintenance, scope and future projects

- Keep dependencies pinned and upgrade the SDK/API version together after sandbox regression testing.
- D1 transactions atomically commit payment records with event deduplication. Stable Checkout/invoice IDs provide a second deduplication layer. No raw webhook payloads or payment method details are stored.
- Email addresses stay with Stripe and the user's requested Resend delivery. D1 keeps only a secret-keyed email fingerprint for matching. Preserve the hashing key; don't rotate it without a migration plan. IP rate-limit keys are also hashed and expire.
- Scheduled cleanup removes expired rate limits and tokens and event IDs older than 90 days. The prepared production Worker runs every 15 minutes. Contribution/payment references, consent evidence and suppression records remain until an operator's retention/deletion action. Test and confirm your retention policy before launch. D1 backups have their own retention.
- Refunds/disputes do not automatically remove a consenting message. Hide it manually if appropriate; payment reconciliation remains in Stripe. “Monthly supporter” means Stripe currently reports an active subscription, not a promise of a future payment.
- Status changes rely on delivered webhooks. Investigate delivery failures and replay events in Stripe Workbench before its retry window ends. If missed for longer, reconcile against Stripe rather than inventing payment records.
- Configuration failures emit a fixed diagnostic category (for example, `support_link_configuration_failed field_labels`) available through authenticated Cloudflare tail logs. Stripe authentication/permission failures have separate fixed categories. Raw SDK error messages, secrets, and supporter data are never logged by the application; avoid retaining platform-generated request metadata from temporary tail sessions.
- To add Fix the Web, create its own four Payment Links and add a `fixtheweb` entry to `PROJECTS_JSON` with its exact origin. Links cannot be reused between projects: source attribution comes from the server-side mapping, not a forgeable URL parameter. Directly shared links are attributed to the project owning that link.
- Other projects may read Villow's explicitly consented feed server-side. Browser readers must be configured as trusted origins. Keep the public response allowlist and removal behavior when reusing data; don't maintain unrevocable cached copies. Build only the Villow interface in this release.

### Payment-email privacy boundary

Stripe sends the payment email to the Worker in its verified webhook. The Worker
normalises it and stores only an HMAC-SHA-256 fingerprint made with
`EMAIL_HASH_SECRET`, which is a Worker secret, not a D1 value. A later email entered
by the supporter is fingerprinted the same way to match their payment. The original
address is used transiently to request delivery from Resend; it is not recovered
from D1 or fetched from Stripe just to send that link. The application logs fixed
error categories, never email addresses, request bodies or raw Stripe payloads.

A D1-only disclosure does not provide a list of payment email addresses or the
secret needed to test guesses against their fingerprints. D1 still contains
private Discord IDs, contribution references and permitted public text, so it
must remain private. If someone enters an email address in their own public name
or message, that free text can contain an address; moderation must check it.

This is not protection against complete account/backend takeover. A compromised
Worker could capture incoming addresses or use Stripe credentials and stored
references to retrieve payment records. Stripe retains payment contact details.
Resend receives email recipients and message bodies, including the expiring link;
its current policy retains email/log data for 30 days on Free, Pro and Scale
plans, with separate backup retention. Protect those accounts and use limited
API keys. Never rotate the fingerprint secret casually: existing matches depend
on it. See [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
and [Resend retention](https://resend.com/security/gdpr/).

`test/privacy.test.mjs` verifies keyed normalisation and checks every application
table after payment, removal and Discord verification for raw payment emails,
secrets and usable email/OAuth tokens. This is a regression check of our storage,
not a claim about third-party storage or total compromise resistance.

Discord supporter linking and role updates are verified in the sandbox, with permanent Supporter access and a separate Ongoing Supporter role through the paid monthly period. The production backend is prepared with linking disabled. See [Discord setup](DISCORD-SETUP.md) for activation, privacy boundaries and current limitations. Reddit flair automation remains deferred.

References: [Stripe webhook signatures, duplicates and event order](https://docs.stripe.com/webhooks), [Payment Link parameters](https://docs.stripe.com/payment-links/url-parameters), [Checkout Session creation](https://docs.stripe.com/api/checkout/sessions/create), [Cloudflare D1 batch transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/), [Resend email API](https://resend.com/docs/api-reference/emails/send-email).
