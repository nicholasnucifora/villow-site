# Website/support privacy operations

Local review revision: 14 November 2026. This is an operator runbook, not evidence of deployment or a new retention setting. Do not run live deletion, provider mutations or publication as part of this local review.

The separately authorised 16 November moderation activation adds hashed eight-hour admin sessions, hashed
24-hour checkout-status tokens, and a separate opaque review ID/version on
contributions. Expired tokens are rejected independently of scheduled cleanup.
The login screen and admin API return no email, amount or payment identifier;
the donor status endpoint returns only payment/sharing states. The language
check runs within the support service with no additional provider. These
changes are deployed. Censored public copies retain the private original for
owner review; withdrawal clears both. This activation does not publish the
remaining draft policies or authorise unrelated provider/deletion changes.
See [MODERATION.md](MODERATION.md).

## Responsibility and scope

Nicholas Francis Nucifora, Individual/Sole Trader, ABN 68 737 669 690, Queensland. Public contact: support@villow.app. Website privacy: `src/content/prose/site-privacy.md`; shared terms: `src/content/prose/terms.md`. Do not retain identity-verification documents, date of birth or a residential address in this repository.

The support database is separate from app installations. Its email fingerprints are pseudonymous, not anonymous. Use proportionate ownership verification for data requests; never reveal whether an email has paid through the unauthenticated request endpoint.

## Current records and deletion paths

| Records | Actual current handling | Request/action |
| --- | --- | --- |
| Contact email, topic and body | Forwarded via Resend to support mailbox; no body/plain email persisted in D1. Mail provider copies can remain. | Review mailbox, Resend records and any necessary case records; reply to access/correction/deletion request. Website code does not schedule mailbox expiry. |
| Contribution/payment/subscription references, amounts, dates, status, consent evidence and email HMAC | No automatic expiry. Necessary accounting/dispute records must be distinguished from removable optional data. | Review necessity and applicable accounting/legal retention before deleting; do not promise total erasure or treat all records as permanently necessary. |
| Public name/message and display eligibility | Approved only with explicit consent; amount needs amount-specific consent version. | Verified removal clears text and turns off display; suppression prevents later webhook republication. Keep suppression separately from marketing or public display. |
| Email-verification token hashes | Expire after 30 minutes; expired/used records cleaned on schedule. | Invalid/expired links fail even if a cleanup run is delayed. Do not put raw credentials in logs. |
| Rate-limit counters | IP/email HMAC bucket windows of 10 minutes or 1 hour by action. | Scheduled deletion of expired buckets. Cloudflare separately receives ordinary request metadata. |
| Stripe event deduplication IDs | Scheduled deletion after 90 days. | Verify schedule actually runs; do not remove recent dedupe IDs in a way that reprocesses payments. |
| Discord ID/email HMAC mapping and sync status | Retained while linked. Disconnect sets a tombstone and retries role removal; mapping deleted after successful removal/absent membership. | Pending cleanup is not completion. Investigate repeated failures. Do not erase the retry record before removing roles or explaining an exception. |
| Discord OAuth state/cookie | State expires after 10 minutes; secure HTTP-only cookie maximum age 10 minutes. | Scheduled expired-state cleanup. Access token is temporary in callback and revocation is attempted; verify failures without logging tokens. |

Both Worker configurations specify cleanup every 15 minutes and disable application observability. Repository settings do not verify the live account's logs, cron history or provider retention. `support/worker.mjs` performs cleanup; `support/lib/contact.mjs`, `privacy.mjs`, `events.mjs` and `discord.mjs` implement the flows above.

## Handling a privacy request

1. Identify the relevant service and operator. Forward an independent installation request to its operator only with appropriate authority; do not imply the website can delete that database.
2. Verify only what is necessary. Prefer existing verified email flows for public removal and Discord disconnection. Never ask for card numbers or Google/Discord passwords.
3. Locate relevant records across the support database, Stripe, Resend, receiving mailbox and any operator exports. Restrict the working copy and record the request's scope/outcome without unnecessary copied personal data.
4. Explain distinctions: public removal does not cancel payments; Discord disconnection does not leave the server; cancelling monthly support does not erase accounting records. Follow the person's requested combination.
5. Correct/remove optional records where appropriate. Identify a concrete reason for any necessary retention and explain it, rather than promising deletion from providers outside our control. Respond to complaints and explain applicable regulator options.
6. Track unfinished provider actions until resolved. A queued role-removal attempt is not a completed disconnect.

## Backup recovery

Cloudflare documents D1 recovery history of up to 30 days, depending on plan. Verify the actual plan and any manual exports; do not describe that ceiling as every copy's deletion deadline. Keep a restricted record sufficient to reapply removals. After a restore, keep public display and outgoing sync disabled until removal/suppression choices and pending Discord disconnections are reconciled. Remove unnecessary exports securely. See [Cloudflare D1 recovery](https://developers.cloudflare.com/d1/reference/time-travel/).

## Before a later authorised release

- Confirm the actual receiving mailbox provider, storage regions, provider log/backup settings and current cleanup success. Update disclosures with countries where practicable. Provider location is distinct from the Queensland operator's legal identity.
- Review necessary accounting retention and mailbox review practices; apply a justified schedule operationally before promising it. Current policy candidly states where there is no automatic expiry.
- Verify actual Stripe checkout sharing wording and portal cancellation timing using a controlled test flow. Do not change live payments or make a real contribution for QA.
- Community access lasts while the community operates, subject to rules. Voluntary refunds are individually reviewed; mandatory remedies and earlier accrued rights remain. Keep a record of the offer actually made to existing supporters.
- Confirm whether Australian privacy legislation applies; sole-trader/small-business status is not enough to assume exemption. Have the terms/operator model and any international obligations reviewed. This runbook does not establish a legal conclusion.
- Finalise the effective date and publish only after the owner's explicit instruction. Ensure app/extension links and shipped behavior match the exact approved policy version.

Useful primary sources: [OAIC APP 1](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information), [OAIC small business](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business), [ACCC remedies](https://www.accc.gov.au/consumers/problem-with-a-product-or-service-you-bought/repair-replace-refund-cancel).
