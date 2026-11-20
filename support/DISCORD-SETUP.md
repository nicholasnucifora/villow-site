# Discord supporter setup

Enabled for **live payments in the local design preview** on 4 November, at the
owner's explicit request. The completed end-to-end checks below used sandbox
payments; a completed live payment/webhook/OAuth check is still pending.
Email verification, real Discord OAuth and
assignment of both supporter roles passed on 4 November 2026. Disconnection also
passed: the owner confirmed both roles were removed and D1 contains no remaining
link for that Discord account. Reconnection also passed, restoring both roles;
D1 reports connected again. On 4 November, the owner used View Server As Role
and confirmed the private chat is visible to Supporter and hidden from ordinary
members. This verifies visibility; sending messages was not part of that check.
The combined join/connect flow also passed with the owner's second account:
the owner confirmed automatic joining and roles, and D1 records it as connected.
The website design remains local. Production payments and Discord are enabled;
sandbox Discord automation is disabled to avoid conflicting role updates.

## Owner's policy

- Any confirmed one-time or monthly contribution earns **Supporter** permanently.
- **Ongoing Supporter** marks paid monthly support through its current paid period.
  Scheduled cancellation keeps that role until the paid period ends. Failed
  renewals do not grant another paid period. The permanent role stays.
- A private `supporter-chat` channel is accessible to the Supporter role.
- Public name/message consent is separate. Private contributors have equal access.
- Reddit flair is lower priority and has not been automated.

## Discord configuration

Application: `1567089987013312694` (Spidey, formerly Fix the Web Support)

The owner renamed both the application and bot to **Spidey**. The IDs and
integration configuration are unchanged. Both Discord secrets were confirmed
present on the test Worker on 4 November 2026 when linking was enabled.
The owner completed OAuth and confirmed both roles were assigned. Test D1
records `last_result=connected`. The linked monthly subscription is scheduled
to cancel at the end of its paid period on 3 December 2026, so Ongoing Supporter
correctly remains until that period ends.

| Setting | ID |
| --- | --- |
| Server | `1523582670867791882` |
| Supporter role | `1567088430628737136` |
| Ongoing Supporter role | `1567088983496982620` |

1. Create the two roles without admin/moderation permissions. Create a private
   `supporter-chat` text channel, deny View Channel to `@everyone`, and allow
   Supporter to view the channel, send messages and read message history. Make
   sure no unrelated public role grants access to that channel. The bot does not
   need to read it.
2. In the [Developer Portal](https://discord.com/developers/applications), open
   the application. Under OAuth2, register this exact test redirect:
   `https://fixtheweb-support-test.nuciforan.workers.dev/v1/discord/callback`.
3. Install the bot with **Manage Roles** and **Create Invite** using
   [this installation link](https://discord.com/oauth2/authorize?client_id=1567089987013312694&scope=bot&permissions=268435457&guild_id=1523582670867791882&disable_guild_select=true).
   The owner confirmed Create Invite enabled on 4 November. This lets one
   authorised connection add a new supporter to the server when needed.
4. In Server Settings → Roles, move the bot's role above the two supporter roles,
   below admin/moderator roles. Leave privileged intents off. No gateway process,
   message-reading permission, or always-on computer is required.
5. In Cloudflare → Workers & Pages → **fixtheweb-support-test** → Settings →
   Variables and Secrets, add these as **Secret**, then deploy/save:
   - `DISCORD_CLIENT_SECRET`: application OAuth2 client secret.
   - `DISCORD_BOT_TOKEN`: token on the application's Bot page.
   Do not put these in chat, frontend files, Git, or D1 settings.

The non-secret application/server/role/redirect settings are already in
`wrangler.jsonc`. Test role assignment is additionally restricted to the owner's
Discord User ID through `DISCORD_TEST_USER_ID`. A fake payment cannot grant roles
to another Discord member. Configuration does not expose that ID publicly.

## End-to-end verification

Completed on 4 November: the owner received the linking email, authorised Spidey,
and confirmed Supporter plus Ongoing Supporter in Discord. The persisted link
reports connected with its next scheduled reconciliation recorded. The workflow
below remains the repeatable test procedure. The owner subsequently confirmed
role removal through the disconnect flow, and a read-only D1 check confirmed
the private link was deleted. Reconnection restored both roles, with D1 recording
connected again. The owner subsequently confirmed the private chat's visibility
for Supporter and its absence for ordinary members using View Server As Role.
A real new-member join subsequently passed with the owner's second account.

For that join check, use a second owner-controlled Discord account that has not
joined this server. Obtain its public User ID before temporarily changing the
sandbox's single allowed test identity. Do not remove the owner from their server
or disable the test identity restriction. Use a separate payment-email identity
from the owner's existing Discord link, verify automatic joining and any rules
screening, then restore the owner-only test configuration and record the outcome.
The second account `165268731121893376` passed the new-member check on 4 November,
using the existing Hotmail sandbox payment. The owner confirmed joining and roles;
a subsequent read-only D1 check recorded both accounts connected. The Hotmail
identity has no current ongoing entitlement, so its expected role is Supporter.
No new real payment was needed. Test restriction was restored to the main account
`1523582210056126494` in deployed version
`dd64d598-ef0d-43aa-8a09-79b7c891f46d`. The second link and its permanent role remain.

The interface now shows a distinct email-sent state with the submitted address,
resend cooldown and edit action. Callback failures have specific headings and a
visible retry action. Success is a centered thank-you with a sprout and the
supporter role labels; no further account actions or setup commentary appear.
Returning through a fresh verified email link checks connection status and only
offers Disconnect when a link exists. The read-only `discord-status` POST requires
an unused, unexpired token for this project and the trusted website origin;
it returns no Discord ID, payment identity or profile. Opening it never consumes
the token or changes a role. All 35 backend/display/privacy tests pass.

1. Open <http://127.0.0.1:4411/help-a.html#financial-support> and click **Connect
   Discord** beside the support introduction. Enter a confirmed contribution's
   email in the dialog and choose **Email me a link**.
2. Open the emailed link. Merely opening it must not link anything. Click
   **Connect Discord**, sign in as the allowed test user, and approve identity
   and server joining. The callback adds the user if needed, then respects any
   rules screening. Existing members are not added again.
3. Verify Supporter is assigned, and Ongoing Supporter is assigned only when a
   paid monthly period is still current. Verify the private channel permissions
   with a non-admin account or Discord's View Server As Role tool: the owner's
   Administrator access alone cannot prove that the channel is private.
4. Stripe subscription webhooks queue role reconciliation immediately. A cron
   every 15 minutes handles retries/period expiry. Stable accounts are checked
   daily; a missing member retries after joining. Provider outages or a backlog
   can delay an update. Background checks never rejoin someone who leaves.
5. Request another email link. If this payment is already linked, the verified
   screen shows **Discord is connected** with a quiet **Disconnect** action.
   Only the two designated roles should be removed. The private link is deleted
   after Discord confirms removal; failed removals retry. Payments, public notes
   and unrelated Discord roles must stay unchanged. Reconnecting is possible.

Existing automated tests cover CSRF/browser binding, token purpose/expiry/replay,
owner-only sandbox assignment, consent independence, paid-period expiry, failed
renewal, retries, concurrent updates, screening, and disconnection. Real provider
credentials, email delivery, the OAuth redirect and role assignment have now
been verified through the owner's completed connection.

## Deployment and live activation

The owner chose **Use real payments locally** on 4 November. Do not publish the
redesign or require its completion. The How to help preview now uses the live
service, with exact additional origins `http://127.0.0.1:4411` and
`http://localhost:4411`. The primary `https://villow.app` origin is unchanged.
Checkout/email returns follow the validated request origin. OAuth stores that
origin in the browser-bound state and validates it again at callback; arbitrary
client return URLs are ignored. Local `/support` serves the working preview.

Production migration `0003_discord_return_origin.sql` is applied. Worker version
`33fdf7e1-72b6-4c8f-b908-368cc1fe9e50` has live payments and Discord enabled and the
15-minute sync cron. Deployed config checks passed from the local and public
origins. Live one-time checkout and all three monthly options were opened/created
without submitting any payment. All 41 backend tests pass, including the new
origin/return and monthly-session attribution regressions.

Sandbox Discord remains disabled in version
`e6163c70-f6a0-45e6-8017-1dd1d97c34dc`; existing roles are not removed. Keep test
sync disabled for these shared role IDs. Use a separate test server/roles for
further role-write tests. Test payments/records are not imported into production
and cannot qualify an email for live linking. Migration 0003 must also be applied
to test D1 before deploying this new code there.

The owner registered the live callback
`https://fixtheweb-support.nuciforan.workers.dev/v1/discord/callback` and saved both
Discord secrets on **fixtheweb-support**. All six secret names are verified present;
no values were read or pasted in chat. A completed live contribution, successful
live webhook, delivered live verification email and completed live OAuth still
need verification. The previous real-payment test was deferred; activation does
not mean the agent submitted a charge.

The public support page has not acquired the preview's Discord UI. Requests made
from the local page return locally, where that UI exists. Publishing it remains
separate work. Turning `DISCORD_ENABLED=false` pauses linking/syncing without
removing existing roles. Preserve `EMAIL_HASH_SECRET` so identities still match.

## How the implementation works

As of 5 November, every valid rate-limited Discord email request sends a
verification link, including addresses without payments. Eligibility is disclosed
only by `discord-status` with the unused emailed token. No-match links remain
usable for 30 minutes so delayed payment webhooks can be rechecked. OAuth cannot
start without a qualifying payment, and callback eligibility is checked again.
The browser shows No payment found with retry/change-email controls after inbox
verification. Provider delivery failures invalidate the token and return a
sanitised 503 rather than an inaccurate success. Raw email is still never stored.

Payment-email verification uses separate expiring single-use tokens, not removal
tokens. A top-level form POST starts OAuth so the Worker can set a first-party,
HttpOnly, Secure, SameSite=Lax browser-binding cookie. OAuth state is single use,
bound to that browser and verified against Discord's issuer. The `identify` and
`guilds.join` scopes are requested. The short-lived token can add the authorised
user to the configured server during that callback only, after payment and test-
account checks. Tokens are revoked and never persisted. Joining sends no role
array, so server rules screening is not bypassed. If joining fails, the UI offers
a manual invitation while preserving the verified link.

Private `discord_links` store the email fingerprint and Discord ID. The same
shared Fix the Web server can recognise contributions from multiple configured
projects. One Discord account maps to one payment-email identity. Changing either
requires disconnecting first. Public feeds expose none of this identity data.

Webhook queues and a leased retry loop perform idempotent changes to the two role
IDs only. The loop handles up to 12 due identities per invocation, with a daily
check for stable links and earlier checks for expiry, missing membership or failed
updates. Watch backlog/provider failures if the community grows. The bot uses the
HTTP API and does not keep a Discord gateway connection.

Refund/dispute-based revocation is not implemented: the chosen permanent policy
currently recognises a recorded successful payment. Account transfers and multiple
payment emails per Discord identity are also not implemented.

Official references: [OAuth2](https://docs.discord.com/developers/topics/oauth2),
[role management](https://docs.discord.com/developers/resources/guild#add-guild-member-role),
[private channels](https://support.discord.com/hc/en-us/articles/206143877-How-do-I-set-up-a-Role-Exclusive-channel).

## Reddit, later

In r/FixTheWeb → Mod Tools → User Flair, create a **Supporter** template, set it
to mod-only and disable user text edits for that template. Do not disable all
other community flair choices merely to protect this one label.

Automatic assignment still needs an approved Reddit integration. External Data
API access requires approval; a subreddit-installed Devvit app is another route
to investigate. No Reddit app or flair automation is deployed. Prioritise Discord
first, as requested.

References: [User Flair](https://support.reddithelp.com/hc/en-us/articles/15484503095060-User-Flair),
[Developer FAQ](https://developers.reddit.com/docs/guides/faq).
