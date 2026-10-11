# villow.app launch checklist

Nicholas signs off every item. Nobody else ticks a box.

Implementation/review note: 12 October 2026. The messaging update was checked against local app and extension code and current official YouTube Help. Local implementation is not evidence that the same app or extension version is deployed. All boxes remain unticked.

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

- [ ] Review the deliberate policy revision at the stable /privacy URL.
  The 12 October update replaces the obsolete one-way-settings assertion, specifies supported shared config, report timing/triggers, received receipts, local 14-day history and revocation/deletion distinctions. The build pins its reviewed source hash and checks the copied output. Do not move or rename the file.
- [ ] Align the policy, store disclosures and release notes with actual shipped packages.
  Local extension manifest is 0.8.3. Compatible local code adopts settings.chosen and sends the supported config fields, but uploaded Chrome/Edge/Firefox package parity is unverified. A website policy edit alone doesn't complete store disclosure or consent requirements.
  [Chrome privacy requirements](https://developer.chrome.com/docs/webstore/program-policies/privacy).
- [ ] Confirm all store destinations and device guidance.
  Chrome, Edge and Firefox URLs match the app's extension-browser-support.ts. Orion is the iPhone/iPad workaround; native Safari remains planned. The web app's availability is separate.
- [ ] Confirm current reporting and retention before release.
  Local usage history retains up to 14 days; this is not a server-wide deletion schedule. Shared-day ticks normally run at most once per minute while focused, with earlier action-triggered requests. Network/retry conditions can delay sync.
- [ ] Keep local recommendation/watched-video lists distinct from saved-video metadata.
  Daily reports are counts/settings. Saved videos transmit identifying metadata; receipt responses also contain video details. Don't describe all extension traffic as anonymous counts.

## App privacy and permissions

- [ ] Complete the app policy's remaining draft fields.
  Effective date, minimum age, general aggregate/social/room/chat retention and provider-backup handling remain unfinished. The page keeps its draft notice.
- [ ] Verify Google scopes and actual account writes against the release.
  Local main-oauth.ts requests youtube.force-ssl plus email/profile. It isn't read-only. Subscriptions and managed playlists can be written; worthwhile verdicts stay in Villow rather than writing YouTube likes.
- [ ] Verify token transition and device storage wording.
  New server writes are encrypted; historical plaintext rows remain readable and encrypt on next write. Browser storage also holds authentication data, profile and local state. Encryption doesn't hide data from the owner who controls secrets.
- [ ] Verify task integration descriptions.
  Google Tasks uses task-management access; Todoist uses data:read_write. Both can write/delete for supported task operations, including moves. The obsolete “Todoist has no delete permission” statement is removed. Disconnect removes local imported rows/credentials without deleting remote originals.
- [ ] Verify owner/member access and deletion.
  Operator database access is separate from app sharing. Admin can revoke another member and then separately delete that revoked member. Logout and Google revocation aren't data deletion. Full member self-service deletion hasn't been verified.
- [ ] Verify optional survey flow and Tally disclosures.
  Voluntary responses go to Fix the Web using a separate participant code. Private installation viewing records aren't automatically submitted. Review Tally's current data handling and form configuration.
- [ ] Complete terms of use and ensure policy links are accessible inside the app.
  The site's terms destination remains TBD. A draft policy and code review aren't a completed compliance sign-off.

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
