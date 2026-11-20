# Supporter message review

Activated with the owner's explicit authorisation on 16 November 2026.
Live owner page: <https://fixtheweb.org/admin/support>. The main redesign and
draft terms remain private. Only the existing public support page and its
website-privacy explanation were updated from the published design.

Sign in with the password saved in the owner's password manager. The owner
confirmed it was saved, and the one-time plaintext setup copy was removed from
this repository on 16 November 2026. The live password and Worker hash are
unchanged. No database website is needed for routine review. Do not use the
local demo password on the live page.

## Use the review screen

Run the main website with `npm run dev`, then open
<http://127.0.0.1:4411/admin/support>. The demo password is
`villow-local-review`. It only opens fictional, in-memory records. Restarting the
dev server resets them. The linked example public page uses the same isolated
database, so approving or hiding a fixture changes that example feed immediately
on its next fetch. It cannot charge, send email, connect Discord, or access live
supporter records. These dev routes are absent from the static build.

The live address is `https://fixtheweb.org/admin/support`: a private
section on the existing domain, not a separate website. The support Worker serves
the login, assets and authenticated API at that path. The rest of the website
continues using its existing hosting.

| Filter | Public? | Meaning |
| --- | --- | --- |
| Unreviewed | Yes | Passed the initial check; owner has not explicitly approved it. |
| Approved | Yes | Owner reviewed it and chose Approve. |
| Hidden | No | Owner chose Hide; can be approved again later. |
| Needs review | No | Held by the language check, an owner action, or the old manual-review flow. |

Choose a filter, then **Approve** or **Hide** on each card. **Move to…** restores
Unreviewed or holds it for review. Newest/oldest sorting and 25-message pages keep
the queue manageable. Only name, message, status and controls appear; no email,
payment amount or Stripe reference is delivered to the screen. The API uses an
independent opaque review ID and version to reject stale edits. A withdrawal
removes a message from all review views and prevents later approval.

**Preview censored version** proposes masking detected words without publishing
anything. Each detected word or hostile phrase is fully replaced with `♥♥♥`,
with no leading letter or word-length clue. Text hearts inherit the page's styling.
This supersedes the initial asterisk/partial-mask style at the owner's request.
Inspect the whole message,
then choose **Publish censored version**, approve the original or hide it. This
is a literal mask, not a rewrite. Original and public versions appear separately
in the private screen. **Publish original…** provides an explicit restore action.
Hiding and reapproving a censored entry preserves its selected public version.
Withdrawal clears both copies. No message text supplied by the browser can be
substituted through the censor endpoint; the server computes the suggestion.

## Automatic publication and donor confirmation

With `AUTO_PUBLISH_MESSAGES=true`, confirmed payments with explicit sharing
permission publish as Unreviewed unless the name or message matches the local
screening rules. Both fields are checked. The check covers a bounded English
slur/profanity list, common substitutions, repeated/spaced letters, invisible
characters and a few abusive phrases. It is not a complete abuse classifier:
false positives and evasions are possible. Review the Unreviewed queue as well
as Needs review. Nothing is sent to an AI or moderation provider. Held originals
remain private so the owner can decide; the filter never publishes a mask itself.

Names/messages without explicit permission are not retained. Amounts remain
subject to their separate, original versioned sharing permission. Payment
retries, renewals, removal and suppression preserve the owner's and donor's
decisions. Turning automatic publication off affects new arrivals; it does not
hide previously public entries. Use the review screen to hide those entries.

New website checkouts carry a random, scoped 24-hour status token in the return
fragment. The browser moves it into its current history entry so it survives a
refresh without entering server URLs or referrers. D1 stores its hash, project,
checkout reference and expiry. The status endpoint returns only payment and
sharing states. It verifies Stripe server-side when the webhook has not arrived,
using the same idempotent recording path; a redirect alone never confirms payment.

The donor gets a warm thank-you and either publication confirmation, a neutral
review explanation, a private-contribution confirmation, or a processing/retry
state. Held text is not exposed by that endpoint. Old checkout returns and direct
Payment Link returns without a token remain generic; their signed webhooks still
record and screen payments normally. No second payment is requested on error.

## Authentication

The live login uses a generated 256-bit password. Its plaintext belongs in the
owner's password manager; only its hash is stored as a Worker secret. The admin
source shares this repository with the supporter service, but that does not
require storing a credential in either the Villow or Fix the Web source tree.
The existing credential is already installed; do not regenerate it for routine
sign-in.

For a future authorised replacement, the generator requires an explicit,
absolute path to a temporary private file **outside this repository**:

```sh
node support/scripts/create-moderation-password.mjs "<absolute private output path>"
```

It refuses repository paths and existing files, and never prints credentials.
Save `PASSWORD` in the owner's password manager, supply only the generated
`MODERATION_PASSWORD_HASH` through protected stdin to
`node support/scripts/install-moderation-secret.mjs`, then remove the temporary
file. Do not place either value in command-line arguments or shell history.
The optional live verification script also accepts the password through stdin;
it no longer reads a repository file. Normal sign-in uses the browser.
Do not use the demo password or
replace this with a hash of a human-chosen password. A fast SHA-256 digest here
is suitable for a randomly generated high-entropy key, not ordinary passwords.

Sessions are random, stored hashed, expire after eight hours, and use host-only
HttpOnly/Secure/SameSite=Strict cookies scoped to `/admin/support`. HTTPS and the
exact configured moderation origin are required. POSTs require the same origin;
there is no admin CORS allowance. Login attempts are limited per IP and globally.
Logout revokes the server session; rotating the configured password hash revokes
all old sessions. No password or session token is placed in browser storage.
The HTTP exception works only with explicit local-preview and Stripe test mode.
The login shell is public; messages and all decisions require authentication.

## Activation record and future maintenance

1. Verify the owner controls `fixtheweb.org` in the relevant Cloudflare zone and
   inspect its current routing. Keep the existing site's hosting unchanged.
2. Apply the additive `0004_message_review.sql` and `0005_censored_messages.sql` migrations to the explicitly
   selected database before deploying the new Worker. Existing pending records
   remain Needs review; approved/hidden and withdrawn entries retain their state.
   The insert trigger covers records arriving from the older Worker during rollout.
3. Generate/install the password hash securely. Set `MODERATION_ENABLED=true`,
   `MODERATION_ORIGIN=https://fixtheweb.org`, and `MODERATION_PROJECT=villow`.
   Keep `MODERATION_LOCAL_PREVIEW` absent in production.
4. Route **only** `fixtheweb.org/admin/support` and
   `fixtheweb.org/admin/support/*` to the existing support Worker. Preserve its
   workers.dev webhook/API address and all existing routes. No new domain is needed.
5. Deploy and verify unauthenticated API denial, sign-in, logout, the approved
   live host and no access via alternate hosts. Enable `AUTO_PUBLISH_MESSAGES`
   only with the corresponding frontend and policy update ready. Both flags are
   now true in production; the separate test configuration remains disabled.
6. The owner's exact A$5 Steve message was individually reviewed and approved,
   then verified in the live API and browser. No other messages were changed.
   Do not mass-approve historical pending entries.

Completed deployment evidence:

- Support Worker version: `9a41b335-1f19-4d5d-ae79-9236e3d43840`.
- Later owner-requested full-heart mask refinement:
  `b217830c-0cce-4109-adb6-bb8e1fb966e1`. No credential, migration or message
  record changed in that deployment. Existing saved masks can be previewed again
  and explicitly replaced with the new suggestion.
- Static website version: `43875b76-31cc-497b-92ba-919908f9a323`.
- Migrations 0004 and 0005 applied to the existing production database.
- Unauthenticated message access returns 401, alternate Worker-host admin access
  returns 404, foreign-origin writes return 403, and sign-out revokes the session.
- Login returns a secure HTTP-only cookie; admin responses prohibit caching.
- Stripe accepted both new one-time and monthly Checkout Session requests. These
  verification sessions were left unpaid; no additional donation was made.
- 67 local tests pass, including immediate return/webhook races, four states,
  censor preview/publication, consent withdrawal and replay. Mobile browser QA
  used isolated fixtures; the live browser showed the real Steve entry.
- After the heart/carousel refinement, 73 checks pass. Browser verification
  covered heart publication, automatic rotation, first-click Pause, narrow
  controls without horizontal overflow, and the real single-message view showing
  Today with no carousel controls. The carousel redesign remains local.

The public site release was prepared from `git archive 51f29b4` in
`artifacts/public-support-release`, never from the private root `dist`.
`scripts/prepare-public-message-update.mjs` (relative to this support directory)
applies the bounded source changes. `scripts/verify-public-message-release.mjs`
retains baseline assets for unchanged pages and compares 18 unaffected pages
byte-for-byte against live. Fix the Web's homepage also remained byte-identical.
`/terms` and `/_design/help-page-a.js` still return 404 on the public Villow site.
The root public-release guard remains enabled. Do not rebuild/redeploy the
isolated release without repeating its scope checks; do not deploy root `dist`.

Before this activation, support Worker version
`f96d0acf-287e-456a-8aa8-f5cf08b1e2ba` and static-site version
`2f6b1fb2-5ef1-461e-9c72-d1d16463966f` were live. Prefer a forward fix; reverting
the old backend would remove admin access and automatic publication. Leave the
additive migration columns intact if rolling back code; never undo consent or
owner moderation decisions as part of a rollback.

Expired sessions/status tokens are removed by the existing scheduled cleanup;
the API rejects them at expiry even if cleanup is delayed. Review status and
version stay with contribution records; no new automatic text-retention deadline
is introduced. See PRIVACY_OPERATIONS.md for the other records and provider limits.

References: [Cloudflare path routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
support adding this section to an existing domain. Authentication follows the
cookie, token and expiry guidance in [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
