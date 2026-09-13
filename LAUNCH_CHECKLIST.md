# villow.app launch checklist

Nicholas signs off every item. Nobody else ticks a box.

Notes under an item are research to help you check it. They were written on 14 September 2026 and aren't sign-off. Official pages change, so re-read the source before ticking.

---

## Read first: things that need a decision

- [ ] **The extension privacy policy contradicts the site copy about editing limits.**
  The brief (checked against the source code on 14 Sept) says limits can be edited "in the extension or inside Villow". The site says so on `/extension` ("One set of limits. Edit them in the extension or inside Villow") and in the extension feature table ("Edit limits in Villow…").
  `/privacy` (8 Sept) says: *"Your limits travel one way. The extension is the only thing that can change a limit; there is no endpoint by which Villow could set one."*
  One of them is out of date. `/privacy` hasn't been touched. If the policy needs updating, that's your call, and the build check (`scripts/check-build.mjs`) will ask you to update its hash.
- [ ] **Vercel's Hobby plan is for non-commercial, personal use only.** Villow for yourself and a few friends looks like personal use, but confirm that matches how people will run it. Source: [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) ("the Hobby plan restricts users to non-commercial, personal use only").
- [ ] **Supabase pauses free projects after a week of inactivity.** Someone who stops using their Villow for a week would find it paused. Consider saying so on `/download` under "Worth knowing". Source: [Supabase pricing](https://supabase.com/pricing) ("Free projects are paused after 1 week of inactivity").
- [ ] **Terms of use.** YouTube's policies (III.A.1) require a link to YouTube's Terms of Service, and a statement *in the app's own terms of use* that users agree to be bound by them. The site's Terms link is still empty. (The draft app privacy policy includes the statement too, but the rule is about terms of use.)

---

## YouTube and Google

- [ ] Each row of the comparison table (section 6.5) matches YouTube's current features
  Rows live in `src/content/pages/youtube-could-do-this.yaml`. Delete any row you can't confirm rather than softening it. Then fill in `tbd.comparisonCheckedDate` in `site.config.yaml`.
- [ ] "Where the API stopped" points (section 14.4) match current YouTube Data API documentation
  - Recommendations and watch history not available through the API: check against the [YouTube Data API reference](https://developers.google.com/youtube/v3/docs).
  - Background playback: [Developer Policies III.I.9](https://developers.google.com/youtube/terms/developer-policies) prohibits playing content "from a background player, meaning a player that is not displayed". ✔ consistent with the copy.
  - "Nothing may cover it": I couldn't find an explicit no-overlay clause in the Developer Policies. III.I.6 prohibits modifying or blocking "any portion or functionality of a YouTube player". Also check the [Required Minimum Functionality](https://developers.google.com/youtube/terms/required-minimum-functionality) page. If nothing says it plainly, reword this point on `/youtube-could-do-this`.
  - Daily quota: the [getting started page](https://developers.google.com/youtube/v3/getting-started) currently says projects get "a default quota allocation of 100 `search.list` calls, 100 `videos.insert` calls, and 10,000 units per day combined for all other endpoints".
- [ ] YouTube API Developer Policies III.I.1 (substitute clause) is quoted accurately and current
  Policies page last updated 24 June 2026. III.I.1 prohibits using YouTube API Services to "create, offer, or act as a substitute for, or substantially similar service to, any YouTube Applications". Matches the brief. The site copy doesn't quote it; it follows it.
- [ ] YouTube API Developer Policies III.A.2 privacy policy requirements are summarised accurately, and the Villow app privacy policy meets them
  III.A.2 currently requires the policy to be prominently displayed and always accessible, and to:
  - say the app uses YouTube API Services
  - reference and link to the Google Privacy Policy
  - explain what user information is accessed, collected and stored, and how it's used, processed and shared
  - disclose whether third parties serve content, including ads
  - disclose storing or accessing information on users' devices
  - explain revoking access via `https://security.google.com/settings/security/permissions`
  - explain how to contact the developer

  The draft at `/app-privacy` covers each of these, but device storage, Google scopes, retention, deletion, minimum age and contact are still TBD. **Does the Villow app link to this policy from inside the app, prominently and at all times?** That's part of III.A.2 too.
- [ ] YouTube Branding Guidelines: naming ("for YouTube" / "works with YouTube") and logo rules followed across the site
  No YouTube logos or red-and-white styling are used. The build check fails on "Villow for YouTube", "VillowTube", "YouTube replacement/alternative" and similar. Check against the current [YouTube Branding Guidelines](https://developers.google.com/youtube/terms/branding-guidelines).
- [ ] "Not affiliated with, endorsed by, or sponsored by YouTube or Google" appears on every page
  It's in the footer on every generated page, and the build fails if any page is missing it. `/privacy` has it too.
- [ ] Google Cloud: no billing account needed for YouTube Data API access; the default daily quota
  The copy doesn't currently claim either. `/download` says YouTube access "uses a daily quota from your Google Cloud project, shared by everyone on your Villow". The getting started page doesn't mention billing either way, so confirm in a fresh Google Cloud project before adding any claim.
- [ ] Google OAuth Testing status: test-user limits and roughly seven-day sign-in expiry described accurately
  [Google's OAuth 2.0 docs](https://developers.google.com/identity/protocols/oauth2#expiration): a Testing, external project "is issued a refresh token expiring in 7 days, unless the only OAuth scopes requested are a subset of name, email address, and user profile". Villow requests YouTube scopes, so the seven days applies. Also check the current test-user cap on the Audience page of the Google Auth Platform in Google Cloud.
- [ ] Google OAuth Production status: what moving a project to Production involves for Villow's YouTube permissions (review/verification), and how the site describes it
  Linked to `tbd.productionMove`. See [sensitive scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification).
- [ ] **(New)** The draft app policy's Limited Use statement is accurate
  `/app-privacy` says Villow "adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements". Only keep it if it's true.
- [ ] **(New)** "YouTube requires tracking to be off for videos made for kids" (FAQ, privacy pages)
  [Developer Policies III.E.4.j](https://developers.google.com/youtube/terms/developer-policies): API clients "must look up the Made For Kids status of each YouTube video" and "must turn off tracking" for those videos. ✔ consistent.
- [ ] **(New)** "Stored video details are refreshed or removed within 30 days" (`/youtube-could-do-this`, `/app-privacy`)
  III.E.4.c and III.E.4.d: most stored data kept "for no longer than 30 calendar days", then deleted or refreshed. ✔ consistent. Check that Villow does this.
- [ ] **(New)** "Popular in Your Country Today" is drawn from YouTube's country charts (`mostPopular` chart by region) and filtered by the topics you choose
- [ ] **(New)** The official URLs in `site.config.yaml` under "Official third-party pages" are the ones you want to link

## Hosting providers

- [ ] Vercel free plan: what's included and what happens when a limit is reached
  [Hobby plan](https://vercel.com/docs/plans/hobby) (updated 31 Aug 2026): free, personal non-commercial use only. "In most cases, if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again." Includes e.g. 1,000,000 function invocations, 4 active CPU-hours and 360 GB-hours of provisioned memory. Fill in `tbd.freeLimitReached`.
- [ ] Supabase free plan: what's included, project limits, backups, inactivity pausing, and what happens when a limit is reached
  [Pricing](https://supabase.com/pricing): 2 active projects, 500 MB database, 5 GB egress, 50,000 monthly active users, **no backups**, paused after 1 week of inactivity. The page doesn't clearly say what happens when a limit is exceeded, so check the [billing docs](https://supabase.com/docs/guides/platform/billing-on-supabase).
  Worth noting on `/download`: the 2-project limit matters if someone already has Supabase projects.
- [ ] "Setup never picks a paid plan" and "Setup asks you to confirm you've reviewed your plans" still match the current Villow Setup release
- [ ] **(New)** "Your Villow gets a free `.vercel.app` address. A custom domain is optional and costs extra."
- [ ] **(New)** "Uninstalling Setup doesn't stop your Villow or its accounts" matches Villow Setup
- [ ] **(New)** "Put it on your phone… It installs like an app on iPhone, iPad and Android" (add to home screen works for your Villow on current iOS Safari and Android Chrome)

## Extension

- [ ] Chrome Web Store, Edge Add-ons and Firefox Add-ons listings are live, including Firefox for Android
  Then fill in `links.chromeStore`, `links.edgeAddons` and `links.firefoxAddons`.
- [ ] Every feature in section 7.2 matches the released extension, on its own and linked
  The table is generated from `features.extension` in `site.config.yaml`. See the limits contradiction at the top.
- [ ] Every point in "What it can see" (section 13.6) matches the extension and its privacy policy
  Compared with `/privacy`: "only works on YouTube pages" ✔ ("It never reads pages other than YouTube"). "Sends videos you click and daily totals to your own Villow" ✔. "Doesn't send your browsing history" ✔. The policy also mentions the time zone, extension version, browser name and a random install identifier, which the summary leaves out. That's fine for a summary, since it links to the policy. Remove `tbd.extensionPointsConfirmed` when done.
- [ ] Which other Android browsers to mention, if any

## Privacy and data

- [ ] Tally's data handling, for the feedback check-in note
  [Tally privacy policy](https://tally.so/help/privacy-policy): data "stored on high-security servers within the European Union". The policy is written about Tally's account holders and doesn't separately describe form-respondent data. Check Tally's [DPA](https://tally.so/help/data-processing-agreement) for respondent data, and whether forms set cookies.
- [ ] The feedback check-in description (optional, participant code, goes to Fix the Web) matches the current app
- [ ] villow.app itself sets no cookies and loads no trackers (test in a clean browser)
  On 14 Sept 2026 the live site (old placeholder page) set no cookies and injected no scripts. Cloudflare can add cookies or scripts later if features like Bot Fight Mode or Web Analytics are switched on, so re-test after deploying.
  **Cloudflare sends `Report-To` / `NEL` headers**, which let browsers report *failed* requests to `a.nel.cloudflare.com`. `/privacy-overview` says "Nothing loads from YouTube or anyone else when you visit". Decide whether to turn NEL off in the Cloudflare dashboard, or reword.
  The build check fails if a page loads scripts, styles, images or frames from another site.
- [ ] Click-to-load YouTube embeds load nothing from YouTube before play
  There are no YouTube embeds on the site yet. If you add a demo video, build it as click-to-load and re-check.
- [ ] **(New)** Every claim in the draft `/app-privacy` matches the app: what's collected, token encryption, Todoist having no delete permission, the 30-day timeline, sharing defaults, and the "Who your data is shared with" list

## Content and legal

- [ ] No real creators' thumbnails, titles or faces in marketing images without written permission
- [ ] No real people's names or usage in screenshots
- [ ] Openly licensed media (if any) is attributed correctly
- [ ] Every "Coming", "Showcase" and "Exploring" feature is labelled as such
  Badges come from `features:` in `site.config.yaml`. Copy uses `{status:id}`, which shows the badge until the feature is live. Check the wording around each one too.
- [ ] Nothing on the "Never claim" list (section 20) appears anywhere
  The build check catches the obvious wording. It can't catch meaning (e.g. implying Safari support), so give the pages a read.
- [ ] All placeholders (Appendix A) are either filled or deliberately left visible
  Run `npm run placeholders`.
- [ ] Legal review of the site copy, the privacy policies and the terms, as Nicholas decides
  `/app-privacy` is a draft written from the brief. It has a visible DRAFT notice until you remove it.

## Site and deployment

- [ ] **(New)** Cloudflare build settings changed to build command `npm run build`, output directory `dist`
  The old setup published the repository root, which also made `review/README.md` and the review SQL migrations public at `villow.app/review/…`. Building to `dist` stops that.
- [ ] **(New)** The Worker name in `wrangler.jsonc` (`villow-site`) matches the one in the Cloudflare dashboard
- [ ] **(New)** After deploying, `https://villow.app/privacy` still serves the extension policy unchanged, and `/privacy.html` still redirects to `/privacy`
- [ ] **(New)** Contact link decided (the extension policy uses nuciforan+villow@hotmail.com)
- [ ] **(New)** "YouTube is a trademark of Google LLC." in the footer is wanted (it matches the extension policy)

## Future (only if pursued)

- [ ] Creator channel-ownership verification approach for a creator submission portal
- [ ] Privacy messaging updated for any central service (creator submissions, global recommendations)
  `/privacy-overview` and `/app-privacy` both say there's no central Villow server collecting viewing data.
