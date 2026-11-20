**Local review revision:** 2026-11-14. **Effective date:** Not set — this revision is unpublished.

## Who this policy covers

This policy describes the standard Villow web app, developed by Nicholas Francis Nucifora, an individual/sole trader (ABN 68 737 669 690), based in Queensland, Australia, as a Fix the Web project. The [browser extension](link:extensionPrivacy) and [website](link:sitePrivacy) have separate policies.

**Your installation's operator is responsible for its service and stored data.** It may be you, someone who invited you, or the project operator if they expressly offer you an installation. The project does not automatically operate or receive the records from independently hosted installations. Before joining, check the operator identity, contact details and installation-specific privacy information shown there.

This local revision describes implementation under review. In particular, the retention and deletion limitations below must be resolved before public activation; this document is not a claim that every API-data deletion requirement has been met.

## How Villow is run

A Villow normally uses its operator's Vercel, Supabase and Google Cloud accounts. Supabase stores account, viewing, settings and social data. The operator controls the hosting, database, secrets and backups and can access stored data and server credentials. Member sharing settings govern what other members see through the app; they do not remove the operator's access. Only join a Villow run by someone you trust.

Each operator must provide accurate contact details, applicable policies, provider/region information and a workable way to handle privacy requests. Their installation may use a different version or configuration. Ask the operator about differences before using it.

The app's local policy flow separates terms agreement, privacy agreement and confirmation that the connected user is 16 or older. It records no date of birth. Published-mode acceptance records identify the account, installation/operator, document URLs, revision and acceptance time. A signed browser receipt lasts up to 30 days; server acceptance records remain with the account until its deletion and do not expire just because that cookie expires. Changed policy/operator details require another check. **Local review uses test-only state, not legal acceptance or production acceptance records.**

## YouTube API Services and Google permissions

Villow uses YouTube API Services for subscriptions, uploads, playlists, search, channel details and country charts, and uses YouTube's official embedded player.

Google sign-in requests:

- **Account email and profile**, to identify your account and show profile details.
- **`youtube.force-ssl`**, a broad YouTube permission with write access. [Google's scope description](https://developers.google.com/identity/protocols/oauth2/scopes#youtube) includes editing or deleting videos, ratings, comments and captions. This permission is broader than the operations Villow currently uses.

Villow does not receive your Google password. Subscribing or unsubscribing in Villow changes your YouTube subscriptions. Supported managed-playlist actions can change YouTube playlists. Villow's “worth your time” ratings stay in Villow; they are not YouTube likes. Saving a video from the extension into Villow is separate from changing a YouTube playlist. Broad policy agreement does not authorise a remote write action you have not chosen.

New server-stored Google credentials are encrypted. Legacy plaintext rows remain readable during transition and are encrypted on later writes. Encryption does not hide credentials from an operator who controls the server and its keys. Browser storage also contains sign-in information, described below.

You can [revoke Google access in your Google Account](link:googleSecuritySettings). This stops further authorised access. Removal of stored information is a separate responsibility; see the controls and current limitations below.

By using the Villow web app, you agree to be bound by the [YouTube Terms of Service](link:youtubeTerms). Google's handling is described in the [Google Privacy Policy](link:googlePrivacyPolicy).

## Information and its purpose

### Account, settings and permissions

Google identity, email and profile details; chosen name, time zone and country; limits, schedules, bedtime, breaks, filters, sharing choices and integration settings support account access, your feed and preferences. Session credentials and companion tokens authenticate browsers and extensions. Policy records support versioned access and agreement checks. An ownership-transfer request identifies the existing owner and proposed recipient and expires after seven days.

### YouTube content

Subscriptions, followed channels' uploads, playlists, and video/channel details such as IDs, titles, thumbnails, dates and duration build the feed and library. Search and chosen country/topic charts use Google's services. These records include information imported automatically as well as videos you choose to save. They must not all be described as user-created bookmarks.

### Viewing and reflection

Villow records watch time by day, hour, channel and source; browsing time by page type; app opens; skips, finishes and optional worthwhile ratings; saved progress; breaks and allowance choices; and a 30-day Viewing Review. These show where time went, support chosen limits and inform transparent, rules-based suggestions. Ratings are optional. Connected extension totals do not provide the same hourly breakdown as app playback.

Tracking is turned off for videos designated made for kids. Saving and recommending them can still work. Villow does not measure native YouTube apps, unrelated apps or your device's overall screen time.

### Optional tasks

Google Tasks and Todoist are separately authorised integrations. Google Tasks uses task-management access; Todoist uses `data:read_write`. Villow stores connection credentials and imported task details to display and synchronise supported changes.

These permissions include writing and deletion. A supported move between lists or providers may create a task at the destination and delete the original remote task. Disconnecting an integration removes its imported local rows and credentials; that disconnect action does not delete the provider's original tasks. Manage provider authorisations separately when needed, including Todoist's integration settings.

### Friends, recommendations and Watch together

Villow stores membership and profile information, recommendations, response/viewing/verdict indicators, shared items and the information you choose to share about activity, subscriptions or settings. Sharing controls are separate from the operator's database access. Sending a recommendation or joining a room shares the information needed for that feature even if unrelated activity-sharing controls are off.

Watch together stores room membership and invitations, shared queues, playback state and chat. Rooms support up to 10 accounts and require acceptance to join. Other members can see the material shared with them and may copy it outside Villow.

### Connected browser extension

An authorised extension can send selected saved-video details and identified Watch now progress, and receive subscriptions, queue state and connection responses. Optional activity/settings/Shorts synchronisation has a separate permission choice in the revised extension. The [extension policy](link:extensionPrivacy) explains its fields, identifiers, background requests, local storage and withdrawal. Compatible app and extension releases are needed to enforce the same choice at both ends.

### Diagnostics

The installation stores operational information such as account identifiers, routes, status, request timings/counts and selected error classifications to diagnose failures and monitor provider usage. These are not anonymous simply because raw message bodies are omitted. Hosting and database providers may keep their own request, security and error records. Review a diagnostic export before sharing it with someone else.

### Required check-ins and optional feedback

Villow requires the first-use check-in before completing setup and further check-ins at the configured milestones, currently two weeks and three months after onboarding. These scheduled check-ins are a condition of continuing ordinary app use when due. If several milestones have passed, the app asks for the most recent due check-in. Settings and privacy controls remain accessible. The separate Feedback page is available for feedback you choose to send. Optional messages attached to project support payments are a different flow, covered by the [website policy](link:sitePrivacy).

These forms are hosted by [Tally](https://tally.so/help/privacy-policy). Displaying an embedded form contacts Tally before you submit answers and supplies a random participant code in the form address. That code is stored in your account settings, so your installation's operator can associate it with your account; it is not anonymous. Survey-completion timestamps are also stored locally and synchronised with account settings. Answers you submit go to the project operator to understand experience with Villow and improve the design. The form does not automatically upload your installation's private viewing records. The required/optional status of individual questions is shown in the form.

Avoid adding sensitive information that is unnecessary for feedback. Deleting an app account does not issue a deletion request for a Tally response; [contact the project](link:contact) about feedback records.

## Recipients and overseas handling

Recipients include your installation operator and their hosting/database providers, Google/YouTube, other members through the features you use, optional task providers, and the project operator/Tally for required check-ins and optional feedback. Standard providers' own policies include [Vercel](https://vercel.com/legal/privacy-notice), [Supabase](https://supabase.com/privacy), [Google](link:googlePrivacyPolicy) and [Todoist](https://www.todoist.com/privacy).

Villow adds no ads and does not sell viewing data. YouTube's embedded player can serve YouTube ads and receives data when its player loads and plays. Thumbnails and other provider content can also make requests before you press Play. External services receive ordinary browser/network information, such as the IP address needed to respond.

Providers may process information outside the operator's country. Your installation's provider regions, backups, support access and subprocessors determine where processing occurs; a Queensland operator or a “private” installation does not guarantee Australian storage. The operator must supply the relevant installation-specific details. Data may also be disclosed where necessary to comply with applicable law or address security incidents and legal claims.

## Storage on your device

The app uses cookies and local browser storage, including localStorage, sessionStorage and IndexedDB, for authentication, profile details, settings, pending changes and cached content. These stores include Google credentials and an app-session credential. The app-session cookie normally has a 30-day browser lifetime; temporary OAuth/exchange records have shorter lifetimes.

Ordinary logout removes local sign-in credentials and profile information, including their IndexedDB copies. Cached settings, content and activity can remain. Logout does not by itself revoke Google's authorisation or delete the installation's database records. Account deletion and Google disconnection also attempt a full local reset and report incomplete clearing if browser storage blocks it. Use your browser's site-data controls for remaining device data. Logging out is particularly important on a shared device.

Cached API-bearing browser snapshots have a 30-day lifetime checked when accessed. Ordinary local edits do not restart that clock. A closed or suspended browser cannot run cleanup, and a local cache timestamp is not proof that its server source was freshly retrieved from YouTube.

## Retention in the current local implementation

The following are configured cleanup behaviors, not proof that a particular deployment has run them successfully. The operator must apply the migrations, run maintenance, resolve backlogs and account for provider backups.

- Viewing Review and several detailed viewing, break-response and operational-log source records use approximately 30-day cleanup windows. Measurements preserved in the separate archive below can remain longer.
- Country recommendation history uses a 14-day window. Recommendation deliveries and notes use a 365-day cleanup window in their original tables; authored notes preserved in the separate archive below can remain longer.
- Watch together rooms normally expire after six hours. Daily cleanup removes rooms more than 24 hours past expiry, subject to batch limits; this is not deletion exactly six hours after creation. Chat keeps the latest 100 messages per room, up to 1,000 characters each.
- Account preferences, authored tasks and some aggregate usage/history do not share one automatic expiry. They remain until their applicable removal/reset/deletion action or an operator retention process removes them. Saved content can lose its YouTube reference through the cleanup described below.
- Server maintenance starts refreshing YouTube details at about 25 days. The revised cleanup removes covered video references whose recorded source date is missing or at least 29 days old, together with covered expired playlist and recommendation copies. This can remove a saved item's link to its former YouTube video. Authored notes, clip titles/ranges and app measurements are preserved separately in an exportable archive, without copying the removed provider identifiers or metadata into it. That archive has no automatic expiry. Clearing tracked activity also removes archived activity and responses while preserving authored text and preferences; account deletion removes the remaining account-owned archive.
- **Coverage of older and shared API-data copies, and the source dates carried through every copy, remains incomplete.** The implemented cleanup is not a claim that all API data meets YouTube's retention rules. Public activation remains blocked on that review.
- Revocation retry records contain encrypted credentials for that purpose only and have a seven-day expiry; expired records are removed by maintenance. Short deletion-result receipts also expire after seven days. They do not restore the deleted account.
- Provider logs, backups, manual exports and survey responses have separate handling. The repository alone does not establish their retention or completed erasure. Operators must identify these copies and handle requests across them.

## Leaving, revoking and deleting

**Delete my account** is provided in the revised local app's account settings, paused-access and policy-review flows. You do not need to accept new terms to request deletion. After verifying the account and confirming, it deletes the member's profile, settings, activity, saved library, local task records and account-owned shared content through the database deletion lifecycle, and invalidates its app sessions and extension connections. A retry receipt helps determine the result if a response is lost. The installation owner cannot be deleted while still responsible for that installation; ownership transfer or a controlled shutdown is required first.

Deletion attempts Google grant revocation immediately. If that cannot be confirmed, the result distinguishes pending or manual provider action. Encrypted revocation retries are bounded as described above; legacy credentials and Todoist authorisation may require manual removal at the provider. It does not delete your Google/YouTube account, videos, YouTube playlists or tasks stored by Google or Todoist.

**Disconnect Google** is separate from deleting the Villow account. The current local action removes credentials and the imported data covered by its confirmation, revokes companion connections and retains the Villow account, owner role, settings, manual/Todoist tasks and covered authored records and measurements. Covered saved video and clip references are removed; retained authored content can therefore lose its link to a YouTube item. A protected identity fingerprint can be retained to recognise a later authorised reconnection to the same account; it remains personal data. **The audit has not yet established removal of every API-origin reference or shared copy. Public activation is blocked until that gap is resolved.**

The confirmed disconnection response offers an authored-data export for download before device clearing. An authenticated export control is also available in Settings and the policy-review flow; after disconnection, access requires reconnecting to the same account. Copies you download remain outside later app cleanup. If the disconnection response is lost, the app reports uncertainty and cannot recover that result using the invalidated session. Contact your operator for help; do not treat a missing response as proof that disconnection failed or that all data was removed.

External revocation in Google is detected by scheduled validity checks. Inactive or owner-paused accounts must be included. Invalid or unverified grants trigger cleanup; a provider outage must not silently extend authorisation indefinitely. The current local implementation checks at about 25 days and targets cleanup at 29 days, with bounded batches and backlog reporting. This is not a guarantee of operation on an independently administered host.

The operator must meet applicable YouTube deletion requirements, including the shorter deadline for user-requested deletion or in-app revocation; those obligations do not become optional because a job failed. If a control is unavailable, or you need access, correction, deletion or help with a privacy complaint, contact your operator promptly. They may need proportionate identity verification and should explain the action taken and any lawful reason for retaining information.

Disconnecting an extension, clearing tracked activity, logging out, removing Google authorisation and deleting an account have different effects. None cancels separate financial support for the project. Other people's external copies and provider records need separate handling. See the [owner guidance](/running-villow#leaving).

## Google data, age and changes

Villow's use of Google API data is subject to the [Google API Services User Data Policy](link:googleApiUserDataPolicy), including its Limited Use requirements.

{tbd:appPolicyMinimumAge}

Material changes must be explained, with renewed agreement or specific permission where required. The required check-ins are described above; their timing must be shown in the app. General terms/privacy agreement does not itself submit survey answers or opt you into ad hoc feedback, task integrations, social sharing or extension activity synchronisation.

For a particular installation's records, contact its identified operator. For questions or complaints about the standard app or project-held feedback, email [support@villow.app](link:contact). Applicable privacy rights and regulator complaint routes depend on the relevant laws; this policy does not limit them. Australian users can seek guidance from the [Office of the Australian Information Commissioner](https://www.oaic.gov.au/privacy/privacy-complaints).

*Villow is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.*
