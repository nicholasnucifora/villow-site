# villow.app launch checklist

Nicholas signs off every item. Nobody else ticks a box.

Implementation/review note: updated 14 November 2026. Terms/privacy work is local and unpublished. The researched wording and cross-product implementation record is in `docs/legal/terms-review-2026-11-14.md`; website data-request operations are in `support/PRIVACY_OPERATIONS.md`. Local implementation is not evidence that the same app or extension version is deployed. All boxes remain unticked.

## Messaging and availability

- [ ] Review the homepage, feature tour and getting-started routes together.
  The story now leads with worthwhile viewing, a finite chronological feed, saved progress, optional reflection and explained suggestions. Entertainment and rest count. The private-instance model appears early.
- [ ] Confirm Watch together availability in the app release used for launch.
  Local code implements invitations/explicit acceptance, synchronized playback, a shared queue and chat for up to 10 accounts. The site describes this as implemented.
- [ ] Verify release of the separate group-limit decision flow.
  The roadmap still marks it unfinished. Intended behaviour: room pauses at a person's limit; they can leave or the whole group agrees to dismiss and continue. Don't mark it live solely because another chat is implementing it.
- [ ] Verify the sharing-choice onboarding release.
  Local Setup now requires a choice between “People on this Villow” and “Only me,” with neither preselected. Connected YouTube-time sharing is a separate opt-in. The website currently uses “You choose what to share” and makes no claim that the new onboarding is already deployed.
- [ ] Confirm exact coverage wording remains clear.
  “Your limits follow you across Villow and connected browsers” covers Villow usage plus YouTube in connected extension browsers. Shared daily time/recommendation/save controls aren't a promise that every app channel/open/schedule control governs arbitrary browser playback. Native apps and unconnected browsers are excluded.
- [ ] Review allowance and streak wording against the deployed player.
  Local daily watch limit can offer current-video continuation once per day. App-open, per-channel daily and watch-free-date blockers don't offer the same option. Bedtime has a separate nightly dismiss and 30-minute snooze. Break warnings and active timeouts differ. Streaks track limit-extension events, not simply exceeding a time threshold.
- [ ] Keep proposals separate from current features.
  Community notes/correction notices live on the roadmap; creator action panels are showcases. Native YouTube integration needs platform support, while an independent verified submission service remains a possible approach.
- [ ] Preserve common-ground rationale without promising results.
  Country charts offer shared reference points. Popularity doesn't establish truth or quality; reduced polarization and wellbeing benefits haven't been demonstrated.

## Sources and comparison

- [ ] Recheck each comparison row at release.
  The table links directly to official YouTube Help and is dated 12 October 2026:
  [break reminders](https://support.google.com/youtube/answer/9012523?hl=en),
  [bedtime](https://support.google.com/youtube/answer/9884905?hl=en),
  [Shorts limits](https://support.google.com/youtube/answer/16671528?hl=en),
  [subscriptions](https://support.google.com/youtube/answer/4489286?hl=en),
  [recommendation feedback](https://support.google.com/youtube/answer/6342839?hl=en),
  [time watched](https://support.google.com/youtube/answer/9052667?hl=en).
  Break reminders already pause until dismissed/resumed. Shorts limits include zero and can be ignored. The copy acknowledges both.
- [ ] Check API/player constraints and data refresh behaviour against the release.
  Local normal feed sync resumes from last success; first sync looks back 24 hours. Batch channels use 1–30 days with at most a 30-day lookback. No precise live-delivery promise is made.
- [ ] Verify made-for-kids tracking and 30-day content refresh/removal in the deployed app.
  Policy requirements alone don't demonstrate implementation.
- [ ] Review YouTube API terms, naming and attribution.
  Every generated page retains the affiliation disclaimer; build checks enforce it.

## Extension policy and stores

- [ ] Review the 14 November extension policy revision at /extension-privacy.
  The local revision now covers separate essential-link/optional-sync consent, old-connection review, Watch now progress, Shorts choices, current-day carryover, local retention/diagnostics, thumbnail requests to YouTube, private-window exclusion and disconnect/deletion distinctions. Source: `src/content/policies/extension-privacy.html`. The build pins the deliberately reviewed source hash and checks the policy verbatim. `/privacy` is the three-policy directory, retaining old incoming store links.
- [ ] Align the policy, store disclosures and release notes with actual shipped packages.
  Check the exact release package, including native Firefox optional technical-data permissions and the custom disclosure on supported older browsers. Verify the explicit opt-out contract with the app backend. Uploaded Chrome/Edge/Firefox package parity is unverified. A website policy edit alone doesn't complete store disclosure or consent requirements.
  [Chrome privacy requirements](https://developer.chrome.com/docs/webstore/program-policies/privacy).
- [ ] Confirm all store destinations and device guidance.
  Chrome, Edge and Firefox URLs match the app's extension-browser-support.ts. Orion is the iPhone/iPad workaround; native Safari remains planned. The web app's availability is separate.
- [ ] Confirm current reporting and retention before release.
  Local usage history retains up to 14 days; this is not a server-wide deletion schedule. Shared-day ticks normally run at most once per minute while focused, with earlier action-triggered requests. Network/retry conditions can delay sync.
- [ ] Keep local recommendation/watched-video lists distinct from saved-video metadata.
  Daily reports are counts/settings. Saved videos transmit identifying metadata; receipt responses also contain video details. Don't describe all extension traffic as anonymous counts.

## App privacy and permissions

- [ ] Review the completed factual app policy against the exact release and operator settings.
  The owner has chosen 16+ for the connected app. Set an effective date only at the approved release. Confirm actual retention, deletion, providers/regions, backups and scheduled cleanup; no policy wording can substitute for the required behavior. The page remains a local draft.
- [ ] Verify Google scopes and actual account writes against the release.
  Local main-oauth.ts requests youtube.force-ssl plus email/profile. It isn't read-only. Subscriptions and managed playlists can be written; worthwhile verdicts stay in Villow rather than writing YouTube likes.
- [ ] Verify token transition and device storage wording.
  New server writes are encrypted; historical plaintext rows remain readable and encrypt on next write. Browser storage also holds authentication data, profile and local state. Encryption doesn't hide data from the owner who controls secrets.
- [ ] Verify task integration descriptions.
  Google Tasks uses task-management access; Todoist uses data:read_write. Both can write/delete for supported task operations, including moves. The obsolete “Todoist has no delete permission” statement is removed. Disconnect removes local imported rows/credentials without deleting remote originals.
- [ ] Verify owner/member access and the revised deletion controls on the release candidate.
  Operator database access is separate from app sharing. The revised local app adds member self-service deletion without requiring new policy acceptance, ownership-transfer handling, provider-revocation retries and explicit incomplete-device-cleanup reporting. Reference cleanup can remove saved video/clip links while preserving authored text and measurements in an account-linked export. The archive has no automatic expiry, so source-row cleanup windows are not universal retention maxima. Verify tracked-data reset against archived activity as well as original records. Confirm migrations and account-owned/shared-copy behavior with the app handoff; test receipts are not production evidence. Clear all remaining API retention/provenance blockers before public activation.
- [ ] Verify required milestone check-ins, optional feedback and Tally disclosures.
  The owner confirms first-use, two-week and three-month check-ins are required; ad hoc feedback and supporter messages are optional. The local app requires the newest due milestone at 14/90 days after onboarding, keeps Settings/privacy controls reachable and does not backfill an older missed survey. Tally receives the account-linked participant code when its form loads, before submission. Completion timestamps sync to settings; this is client-observed completion, not a provider-signed receipt. Private viewing records aren't automatically uploaded with the survey. Verify the actual forms, data categories, retention and lawful basis for required check-ins before release; do not call the code anonymous or all feedback voluntary.
- [ ] Review terms, operator configuration and in-product consent before activation.
  Local `/terms` covers the website, app, extension and support; it is not effective or approved for release. ABN records identify Nicholas Francis Nucifora as an individual/sole trader, and the owner supplied Stripe's matching name/Individual type. Exact Stripe ABN placement is an administrative verification item, not an unresolved operator identity. The approved age and MIT decisions are implemented in the local drafts. Test fresh/returning/demo access, renewed agreement and extension optional-data decline/withdrawal. Local review receipts must never become production acceptance.
- [ ] Obtain focused legal and platform review for the actual product.
  Assess Australian privacy coverage and eSafety classification; self-hosting, a finite feed and 16+ wording do not establish an exemption or age-assurance compliance. Review YouTube retention, extension-derived page metadata and interface-modification requirements. See the source-backed release prerequisites in `docs/legal/terms-review-2026-11-14.md`.

## Website privacy and support terms

- [ ] Verify provider facts and retention operations before publishing the revised website policy.
  The local policy covers Resend/contact correspondence, Cloudflare requests, Stripe merchant access, public-amount consent, Discord linking/cookie/roles and removal retries. Confirm the actual mailbox provider, relevant countries, backup/log settings and successful scheduled cleanup. Do not promise an unimplemented automatic mailbox/payment-record deletion deadline.
- [ ] Confirm checkout and support-offer parity.
  The owner approved private Discord access while the community operates, subject to rules, and individually reviewed voluntary refunds beyond mandatory remedies. Preserve any broader rights already promised to earlier supporters. Verify actual recurring-payment cancellation timing and sharing questions in a controlled test workflow; no live payment/account change is authorised by this review.

## Ownership and practical setup

- [ ] Add the public Windows Setup download and main app source destinations.
  Both remain TBD; don't invent release URLs.
- [ ] Test setup with new users before publishing a duration.
- [ ] Measure group capacity, hosting costs and provider limits.
  No free-hosting guarantee, paid-plan necessity or group-size estimate is asserted. Check current Vercel, Supabase and Google Cloud plans in a realistic installation.
- [ ] Complete tested invitation and Google OAuth Production/verification guidance.
- [ ] Complete the owner guide's update/rollback, backup/restore, member-removal and shutdown checklists.
  Existing local System health diagnostics can help investigate failures. Don't infer a tested recovery lifecycle from their existence.
- [ ] Keep donation destination TBD until Nicholas chooses one.
  Contact is the usable interim support CTA. A tentative payment profile is not authorization to publish it.
- [ ] Complete founder bio, contribution details and chosen community links.

## Visuals, site checks and deployment

- [ ] Replace image placeholders later with approved demo-data imagery.
  Imagery and major visual redesign were explicitly deferred. The guided tour uses fictional channels, titles and activity, with no sign-in.
- [ ] Run npm run build and inspect representative rendered pages.
  The build checks the policy hash, route/fragment links, duplicate ids, prohibited wording, affiliation and third-party asset loads.
- [ ] Review mobile readability, tables, navigation and FAQ disclosure behaviour.
- [ ] Review npm run placeholders and decide which remaining TBDs may be public.
- [ ] Check Cloudflare build command/output and Worker identity.
  Existing workflow: npm run build, dist/, Worker villow-site. Do not introduce a different hosting service for this messaging update.
- [ ] Verify the live host's analytics/cookies/network diagnostics configuration.
  The source adds no analytics or third-party assets. Cloudflare configuration can affect live behaviour.
- [ ] After deployment, verify /privacy still serves the reviewed policy and its redirects, plus new /demo and /running-villow routes.
- [ ] Record the deployed commit/version and date separately from local build success.
