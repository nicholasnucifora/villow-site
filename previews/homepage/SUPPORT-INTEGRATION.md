# Support in the How to help design preview

## Message-review activation (16 November; redesign remains local)

The latest private design puts the heading outside individual borderless sage
cards, in two rows confined to the content width (maximum 1100px). Desktop edge
fades span 20% on each side; mobile fades use 10%. The rows contain disjoint
messages, staggered and drifting in opposite directions at 24px/second. Drag
horizontally with a mouse or touch, or use arrow keys. Click/tap or Space toggles
pause. There are no visible arrow/playback controls or separate sample caption.
Fewer than four records use one row; a lone message stays static. The name, permitted amount and relative
date (Today, 1 day ago, weeks/months/years) stay together on each card.
Hovering, keyboard interaction, hidden tabs and offscreen rows pause movement.
Normal motion starts automatically. Reduced-motion visitors use Preview motion
in the top design rail, matching the homepage's explicit opt-in and body attribute.
Vertical touch gestures
retain native page scrolling. Visual loop copies are hidden from screen readers,
which receive each record once. Cards share the tallest message height, and
resizing preserves the current position. The feed remains limited to the newest 50.
The live admin's censor suggestion fully masks detected words with `♥♥♥`.

At the owner's request, a successful normal feed on exactly
`http://127.0.0.1:4411` or `http://localhost:4411` is filled to six entries with
sample messages labelled on each card. One real entry gets five samples, each
additional real entry replaces one, and six or more get none. These are browser-only preview records: they are
never sent to the API or database and never fill a public-host feed. Loading or
failed requests stay quiet; a successful empty local feed can show six samples.
The isolated preview-state fixtures retain their exact selected state.

The two-row refinement passed 17 focused checks (disjoint rows, opposite motion,
drag/cancel, vertical touch gestures, loop copies, keyboard navigation,
pause/preview-motion opt-in, resize, sample replacement and checkout refresh
races). The local static build passes; this refinement has not been published.
Browser checks at 2520px confirmed a 1090px content-aligned message area, with
no page overflow; the 375px view also fits. The rail's Preview motion / Motion on
control was checked in both directions, starting and stopping both rows. Each
row responds to its own hover/drag without repeating the other row's records.

The owner now prefers immediate publication of consented, screened messages,
with Unreviewed/Approved/Hidden/Needs review queues in a password-protected page
on the existing Fix the Web domain. The live implementation, isolated local
preview at `/admin/support`, activation steps and limitations are in
[`support/MODERATION.md`](../../support/MODERATION.md). It supersedes the earlier
manual-approval design. The owner explicitly authorised activation at
`https://fixtheweb.org/admin/support` and the new message flow. Migrations, protected
routes, password setup and the bounded existing-public-site update are deployed.
The owner's exact Steve message was individually approved and is now public.
The website redesign and draft policies remain local.
The page chooses sharing/return wording from the service configuration, so the
live-backed local page remains accurate before activation. New isolated donor
previews cover published, held, private and still-processing confirmations.

The current editable page is `help-a.html`, generated from `help-page-a.mjs` and
`help-support.mjs`. Its support styles are in `help-support.css`, and browser
behaviour is in `help-page-a.js`. This is local design work, not a deployed site.

Run from the repository root:

```powershell
node previews/homepage/render-secondary-pages.mjs --page=help
node previews/homepage/serve-r.mjs
```

Open <http://127.0.0.1:4411/help-a.html#financial-support>. If the shared preview
server is already running, only regenerate the page and refresh it. The targeted
renderer leaves the other page drafts untouched.

## Reviewing interface states

Click **Preview states** at the right of the How to help preview bar. A · First
draft remains selected. The sidebar overlays the page without reducing its
width. It contains 55 states grouped into payments, Discord email, verified
accounts, joining/rewards and public messages/removal. Search filters the list;
Previous/Next steps through the filtered results. Closing the sidebar keeps the
selected state on screen. **Exit preview** restores the normal live page. On
phones, choosing a state closes the sidebar to reveal it.

The picker is in `help-preview-controls.js` and `help-preview-controls.css`;
`help-preview-scenarios.js` supplies fictional data to the real support controller.
An iframe fills the original viewport, allowing native dialogs and the sidebar
to stay independently usable. The live content underneath is inert. Fixture
requests never use fetch, a document CSP blocks network connections and form
navigation, and external links are disabled. Checkout and Discord buttons only
switch to simulated success states. No emails, payments or role changes occur.
The ordinary page continues using the live service.

Copy the address to refer to a state in feedback, for example
`help-a.html?preview-state=discord-no-payment#financial-support`. The inner
`support-preview` URL is generated with all real return parameters/tokens removed.
Unknown fixture IDs remain in preview mode and fall back to the first state.

Latest verification on 5 November: all **55 individual states** were visited and
checked in the browser. Dialog heading/close alignment, centered notices, plain
errors, missing mail art, privacy copy, amount validation and all removal states
passed. That check used the former five-entry layout; the latest 16 November
design uses a continuous row. Public empty/loading/error feeds remain hidden.
Mobile checks passed at 390px; the invalid-amount tooltip is
keyboard-accessible. Earlier sidebar search/stepping/isolation checks still apply.
The backend and relevant UI tests total **50 passing checks**:

```powershell
node --test support/test/*.test.mjs previews/homepage/qa/help-preview-states.test.mjs previews/homepage/qa/help-support-review.test.mjs previews/homepage/qa/page-preview-navigation.test.mjs
```

## Working live integration from localhost

16 November: the initial read-only investigation found the owner's real A$5
contribution in the old pending queue. The later explicitly authorised activation
approved that exact Steve entry and verified it in the live feed. New checkouts
return a scoped random fragment token, enabling server-verified payment/sharing
feedback and an immediate feed refresh even if the webhook arrives later.
The old bare `payment=returned` URL remains a generic thank-you, not proof of a
payment. Normal visits do not show a return notice. Public messages still require
explicit sharing permission and paid status; screened messages now publish as
Unreviewed, while flagged messages wait privately for the owner's decision.

On 4 November the user explicitly chose real payments locally. The local design
now uses the production Worker with live payments and Discord enabled. The test
Worker's Discord automation remains disabled to prevent competing role updates.
The redesign remains local; this does not publish it. Errors now use plain coloured
text without a box, outline or side stripe.

- A$5, A$10 and A$20 monthly; one-time presets and custom amounts from A$5.
- Existing production Cloudflare Worker/D1, live Stripe prices and Customer Portal.
- Only explicitly consented, moderated public entries from the existing feed.
- Secure removal request and explicit confirmation. Opening an email does not
  remove anything. The token is removed from the address bar without being sent
  to the local server.
- Example messages are fictional, explicitly labelled, and never stored or sent
  to the backend. The default local view shows public live records, filled to
  six entries with samples until there are six real messages.
- Discord email/OAuth linking, role assignment, disconnection, reconnection, private-channel visibility and automatic joining of a real new member are verified in the sandbox. Reddit flair is deferred.

The preview pins its API to `fixtheweb-support.nuciforan.workers.dev` and requires
live mode/AUD before enabling payment or removal controls. The live project keeps
`https://villow.app` as primary origin, with exact additional origins
`http://127.0.0.1:4411` and `http://localhost:4411`. `/support` serves the same local
help page. Checkout and email returns follow the trusted Origin header, never a
client-supplied return URL. OAuth stores that validated origin in its browser-bound
state. Migration `0003_discord_return_origin.sql` is applied on production D1.
Local monthly checkout uses sessions with the existing recurring Stripe prices;
the public website retains its existing monthly Payment Links and return paths.

No keys belong in this preview. Deploy backend changes with:

```powershell
node support/node_modules/wrangler/bin/wrangler.js deploy --config support/wrangler.production.jsonc
```

## Latest design and behaviour

5 November: the preview has no live-mode banner, repeated One-time/AUD sentences,
support arrows, underlines or permanent thin borders/dividers. Controls use soft
fills, hover feedback and visible keyboard focus. Currency is just a clickable
code backed by a native select; only foreign-currency estimates show a short AUD
charge note. The minimum is shown only as an invalid-button tooltip. The custom
amount replaces its choice row, without spinner controls or an extra form section.
Payment statuses have centered text and 24px spacing; management links are quiet
text. Dialog headings align with the close control, with compact 24px padding.
Email inputs remain left-aligned. Sent states have no mail illustration. Errors
are plain text; Sharing & privacy has no disclosure accordion and explicitly
names the contribution amount in its public-sharing explanation.

One-time is the default, on the left of Monthly. The financial introduction is
left of the payment card, with two rows of borderless message cards underneath,
within the same content width. The Notes from supporters heading sits above them.
Each note has a header
with name, permitted amount (`A$5 / month` or `A$12.34`) and a relative date, then
its message without quotation marks. `help-support-feed.js` continuously moves
the latest 50, with drag, keyboard and hover/tap pause.
One entry stays static where preview samples are disabled.
See the 16 November note above. Loading/failed feeds do not show placeholders;
empty feeds stay hidden except for the successful local sample preview.
The API's `?recent=50` caps this window; legacy paginated/default responses remain compatible.
Nine explicitly fictional example notes can be shown with `?example-messages=1`
for design review. The normal loopback preview now uses only enough samples to
reach six entries across both rows, and removes them as genuine messages arrive.

Discord benefits and one **Connect Discord** action sit beside the introduction.
Monthly management and sharing/privacy are quiet links beneath the payment card;
message removal is available inside Sharing & privacy. Native dialogs hold
the email forms, confirmation and account controls, with Escape, focus restoration
and narrow-screen layouts. There is no separate benefits/management section at
the bottom. Existing general community links stay in Spread the word.

After email verification, **Connect Discord** authorises identity and server
joining together. The callback adds the supporter if needed, then assigns roles
after any server rules screening. There is no separate Join/Continue sequence.
Joining failures offer the manual invitation. The bot never automatically rejoins
someone who leaves. The owner enabled Create Invite on 4 November.

Discord verification is now sent to every valid, rate-limited inbox, whether or
not it has paid. Only the private emailed token can reveal eligibility. An
unmatched verified email gets **No payment found**, **Check again** (for delayed
webhooks), and **Use another email**. No OAuth state or roles are created without
a qualifying payment. Delivery failures return 503 and invalidate the new token;
the frontend keeps the form and shows the error instead of claiming success.
No raw emails are stored. Public-message removal retains its conditional email
response and the inbox copy now describes that condition accurately.

The AUD selector offers supported local currencies using recent Frankfurter
reference rates fetched and cached by the Worker. Estimates round upward at the
currency's precision, capped at two decimal places (JPY remains whole units).
No approximation glyph is used; the short note still explains that checkout is
AUD and the bank's rate may differ.
Custom input is explicitly AUD, with its converted estimate in the button and the
exact AUD charge below it. This avoids silently changing the actual contribution.
Rate failure leaves AUD checkout usable. Crypto/metals/accounting units are excluded.

Currency helpers: `help-currency.js`; service: `support/lib/exchange.mjs`.
Reference: https://frankfurter.dev/

## Discord implementation and owner setup

See [Discord setup](../../support/DISCORD-SETUP.md) for the current policy,
application/role IDs, exact manual steps, security design and pending live test.
The backend is in `support/lib/discord.mjs`; migration `0002_discord.sql` is now
applied to test and production D1. Both one-time and former monthly supporters keep permanent
Supporter access. Ongoing Supporter follows the current paid monthly period.
Public text removal is separate from Discord disconnection.

The public website design remains unchanged. Production Worker version
`cfc8d32b-8594-4bef-9e7b-a877a765326e` includes versioned amount-sharing consent and
the latest-50 feed. The owner confirmed all four live Payment Links now use
`Share my name, message and amount publicly?` (optional Yes/No, no Yes default).
All four live checkout options returned 200 after that change; one unpaid checkout
was created, with no payment submitted. Old contributions retain their original
name/message-only consent. New server-created sessions use the explicit amount
wording automatically. Webhooks use the session's original fields, not a later
edited link. No migration or new secret was required.
Both production Discord secrets are present and the live callback is owner-confirmed.
Test contributions are not copied into production and do not qualify for live
linking. The first real payment, live webhook and completed live OAuth connection
still need verification. See DISCORD-SETUP.md for the current record.

## Validation

All 41 backend/display/privacy tests pass. New regressions cover live local origins,
payment and email returns, OAuth state, and metadata attribution for monthly
sessions including invoice-first and duplicate webhook deliveries, verification
without a payment, eligibility after a delayed payment and email delivery errors. Tests
cover payment/privacy regressions, extended supporter pagination, rounding,
reference-rate validation, and Discord identity/role lifecycle. Real Discord
OAuth, email delivery and assignment of both roles passed on 4 November.

5 November UI checks used `support/test/ui-fixture-server.mjs` on port 4422 for
email success/failure, no-payment retry/change-email and eligible connection
states. This isolated server sends no mail and cannot create payments or update
accounts. The real page and fixture were checked at desktop and 390px widths;
currency conversions, empty wall, nine example cards, borders and link decoration
were inspected. The fixture server is stopped after QA; port 4411 remains running.
Disconnection and reconnection also passed. The owner confirmed the private chat
is visible to Supporter and hidden from ordinary members using View Server As
Role. The owner also confirmed automatic joining and roles for the second account;
D1 records that account as connected. Existing payment/email-
removal verification from the preceding work still applies.

Browser checks on 3 November confirmed the one-time default, USD/custom estimates,
large VND values at 320px without horizontal overflow, nine example notes in three
desktop columns, and an estimated USD checkout opening the exact A$10 sandbox
session. No payment was submitted during these checks. The sandbox Worker version
is `a50b68bb-3bb1-4e6c-b443-4e5df9f9825c` (before the owner's secret deployment).
On 4 November, both Discord secrets were confirmed saved, the deployed config
reported linking enabled, and the preview's email-link button was enabled. The
owner renamed both the application and bot to Spidey. The owner then completed
the email/OAuth flow and confirmed both roles in Discord. D1 reports connected;
its monthly paid period ends on 3 December 2026 with cancellation scheduled.
Reconnection restored both roles and D1 reports connected again. The latest test
Worker version is `dd64d598-ef0d-43aa-8a09-79b7c891f46d`, including combined
join/connect. Tests cover successful joining, screening, provider failure and
never rejoining from background sync. Browser checks confirmed the compact layout,
dialog focus/escape, a single confirmation action, return/account-management states
and 320px layout without horizontal overflow. Private-channel visibility is now
verified by the owner, as is automatic joining with the second account.

## Connection feedback refinement (4 November)

Email requests now keep the entered address in a distinct Check your inbox state,
with Resend and Use another email. Resend has a 30-second UI cooldown; server rate
limits remain authoritative. Removal emails use the same pattern. Responses stay
the same for unknown and recognised email addresses. The label is Email used for
your payment: this is Stripe's `customer_details.email`, separate from public text.

The Discord privacy accordion, routine sandbox restriction copy and authorisation
instructions are removed. The connected result is centered with a small sprout,
thanks and role badges. It has no Open Discord or account-management buttons.
Errors use specific headings, a contrasting callout and a retry action. A link to
Discord appears only when joining or rules screening still requires it. Fresh
verified email links inspect private connection state; Disconnect appears only
for an existing link. No status is disclosed by entering an email alone.

Browser checks passed for the email-sent address, resend cooldown and resend,
editing the address, expired-link recovery against the deployed endpoint, the
wrong-account callout, matching removal-email confirmation and both role labels
on success. At 320px the dialog and page have no horizontal overflow; desktop
layout was also inspected. The success screen has only its close control. No
browser JavaScript errors remained on the clean preview. Email UI checks used
reserved example.com addresses; no supporter records or roles were changed.
