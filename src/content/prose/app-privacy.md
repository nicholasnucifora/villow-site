**Policy status: draft.** Last revised 12 October 2026. **Effective date:** {tbd:appPolicyEffectiveDate}

## Who this policy covers

This policy describes the standard Villow web app, made by Fix the Web. It doesn't cover the [browser extension](link:extensionPrivacy) or [this marketing website](link:sitePrivacy). A privately operated installation may differ; ask its owner which version and services it runs.

Retention details, minimum age and the effective date remain unfinished below.

## How Villow is run

Villow is not one central service. An owner runs an installation on their Vercel, Supabase and Google Cloud accounts and can invite other people.

- Your installation's Supabase database stores account, viewing, settings and social data.
- **The owner controls the hosting, database and server secrets and can access stored data.** Member sharing settings do not restrict provider-level access.
- Fix the Web does not automatically receive measurements from your private installation. Feedback you choose to submit is a separate flow.
- If you use an installation operated by the project team, its operators have the host access described here too. **Only join a Villow run by someone you trust.**

## YouTube API Services and Google permissions

Villow uses YouTube API Services for subscriptions, uploads, playlists, search, channel details and country charts, and uses YouTube's official embedded player.

Google sign-in requests:

- **Account email and profile** (`userinfo.email` and `userinfo.profile`), to identify your account and show profile details.
- **`youtube.force-ssl`**, for YouTube account features including subscription and managed-playlist operations. This is a broad permission with write access. [Google describes its scope](https://developers.google.com/identity/protocols/oauth2/scopes#youtube) as including access to edit or delete videos, ratings, comments and captions. The permission is broader than the operations Villow currently uses.

Villow never receives your Google password. Subscribing or unsubscribing through Villow changes your YouTube subscriptions. Supported managed-playlist actions can change YouTube playlists. Villow's “worth your time” verdicts are stored in its own database and do not write YouTube likes. Saving a video from the extension into Villow's feed is separate from changing a YouTube playlist.

New server-stored Google tokens use encrypted storage. Older plaintext rows remain readable during the transition and are encrypted on their next write. Encryption does not hide data from an owner who controls the server secrets.

You can [revoke Google access](link:googleSecuritySettings) at any time. Revocation prevents further authorized access; it doesn't itself erase data already stored in Villow.

By using Villow, you agree to be bound by the [YouTube Terms of Service](link:youtubeTerms). Google's handling of data is described in the [Google Privacy Policy](link:googlePrivacyPolicy).

## Data stored and its purpose

### Account and settings

Your Google identity, email and profile details; your chosen name, time zone and country; limits, schedules, bedtime, breaks, filters, sharing choices and connected integrations. These support sign-in, your feed, boundaries and preferences.

### YouTube content

Subscriptions, followed channels' uploads, playlists and video/channel details, including titles, thumbnails and duration, plus country charts for chosen topics. These build the feed and library. Stored video details are refreshed or removed within 30 days.

### Viewing and reflection

Watch time by day, hour, channel and source; browsing time within Villow by page type; opens; skipped, finished and rated videos; saved progress; and a 30-day Viewing Review. These show where your time went and support chosen limits and transparent, rules-based suggestions. Ratings are optional. YouTube extension totals have no hourly breakdown.

Tracking is turned off for videos made for kids. Saving and recommending them can still work. Villow cannot see other apps or your device's overall screen time.

### Task integrations

Google Tasks and Todoist are optional, separately authorized connections. Google Tasks uses task-management access; Todoist uses `data:read_write`. Villow imports tasks, and completion, edits and supported moves can synchronize with the provider.

These permissions include write and deletion capability. For example, moving a task between lists or providers can create it at the destination and delete the original remote task. Disconnecting a task integration removes its local imported rows and credentials; that disconnect action does not delete the provider's original tasks.

### Friends and Watch together

Villow stores recommendations to friends and viewing/verdict information used to show their response. Sharing controls cover activity, subscriptions and settings. Review your choices in the app; normal member access and host database access are separate.

Watch together stores room membership and invitations, shared queue and playback state, and chat content needed for a room. Rooms support up to 10 accounts and require explicit acceptance to join. Social data retention is included in the unfinished retention details below.

### Connected extension

Your chosen instance receives saved-video details, daily counts and supported shared settings, plus connection information. Compatible clients synchronize chosen settings in both directions. See the [extension policy](link:extensionPrivacy) for exact fields, local storage and version behaviour.

### Voluntary feedback

Optional first-impression, two-week and three-month check-ins and the Feedback page use surveys hosted on Tally. Responses you submit go to Fix the Web to improve the design. Survey links carry a separate participant code rather than your name or email address. This does not automatically send your private viewing records with the survey.

## Who receives data

- **The installation owner and its providers:** Vercel for hosting, Supabase for the database and Google for sign-in and YouTube API Services.
- **Other members:** information available through your sharing choices, recommendations and shared rooms.
- **Task providers:** Google Tasks or Todoist when you connect and use them.
- **Fix the Web through Tally:** feedback you voluntarily submit.

Villow adds no ads and sells no viewing data. Embedded YouTube videos may still show YouTube ads; YouTube receives data when its player and services are used under Google's policies.

## Storage on your device

The app uses sign-in and OAuth cookies and persistent browser storage for authentication, profile information, settings and local state. This includes Google tokens and an app session credential in browser storage. Browser local/session storage and cookies can be used for persistence; shared devices should be logged out after use.

Logging out clears local account state and login cookies. It does not revoke Google's authorization or delete viewing data from the installation.

## Retention and deletion

- Viewing Review keeps a 30-day timeline.
- Stored YouTube video details are refreshed or removed within 30 days.
- Other account, aggregate, social, room, chat, diagnostic and backup retention: {tbd:appPolicyRetention}.

To leave, ask your owner about revocation and deletion, and revoke Google access if you no longer want the installation authorized. Owners can revoke another member, then separately delete that revoked member's data through the admin controls. Full member self-service account deletion has not been verified. Provider backups can have their own retention.

Disconnecting a browser extension, logging out, revoking Google access and deleting database records are separate actions. [Owner guidance](/running-villow#leaving) explains the distinction.

## Google API Services User Data Policy

Villow's use of Google API data is subject to the [Google API Services User Data Policy](link:googleApiUserDataPolicy), including its Limited Use requirements.

## Children

{tbd:appPolicyMinimumAge}

## Changes and contact

If the standard app's data handling changes, this policy and its date need updating. Operators should explain material differences in their installation.

For questions about stored data or a particular installation, contact its owner. For questions or complaints about this policy, [contact the project](link:contact).

*Villow is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.*
