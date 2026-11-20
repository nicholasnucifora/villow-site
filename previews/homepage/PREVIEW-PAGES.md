# Local page studies

The local preview has independent page families:

- Homepage — **34 · Soft Nunito**, the sole active homepage preset. `/` and `index.html` show the same page; retired homepage URLs redirect to 34.
- Set up your feed — `setup-b.html` (Guided choice).
- Setup instructions — `setup-instructions-b.html`.
- Hosting your Villow — `setup-hosting-b.html`, `setup-hosting-c.html`, and `setup-hosting-d.html`.
- Design concepts — `concepts-b.html` (Open chapters).
- Get involved — `help-a.html`.
- Contact — `contact-a.html`, sharing the message form embedded in Get involved. The former `about-a.html` contribution page redirects to Get involved; the team/personal message belongs on Fix the Web.

Use the page-name selector at the left of the preview rail to move between them. Each page owns its preset list. Historical homepage files remain source material only and must not be regenerated or advertised as active presets.

## Rendering and serving

```text
node previews/homepage/sync-preview-pages.mjs
node previews/homepage/serve-r.mjs
```

The shared server runs at `http://127.0.0.1:4411`. The secondary pages share `secondary-preview.css`, the Villow brand/navigation/footer shell, and page-specific body modules/styles. The page registry and rail live in `study-navigation.mjs`. Homepage position preservation remains in `study-navigation-scroll.js`.

The homepage setup and concepts actions navigate to these local previews in the same tab. The page-family selector uses ordinary links and remains usable without JavaScript. The previews are buildless, local only, and excluded from production changes.

## Content grounding

The live pages were inspected on 30 October 2026 and checked against their content files:

- [Getting started](https://villow.app/download) — `src/content/pages/download.yaml`.
- [Roadmap and ideas](https://villow.app/roadmap#ideas) — `src/content/pages/roadmap.yaml`.
- [For creators](https://villow.app/creators) — `src/content/pages/creators.yaml`.

Setup preserves the distinction between creating a private installation, joining a trusted person's installation, and using the standalone extension. It does not promise an instant hosted signup or a finished installer download. Hosting requirements, incomplete availability, and operator access to stored data must remain accurate when copy is shortened.

The concepts page presents correction notices and creator actions as proposals, separate from implemented Villow features. Any broader-web or generative-AI material retains its early-idea status. Mockups illustrate designs; they do not create services, publish content, authorize accounts, or perform real setup.

## Concepts A: topics to explore

Six native disclosures now keep the first view compact: useful context, creator next steps, people-led recommendations, AI, choices across the web, and comments/bots/trust. They start closed and work by mouse, touch and keyboard without JavaScript. `concepts-topics.js` only enhances direct links, opening the enclosing topic before scrolling. A brief desktop entrance respects reduced motion.

The first two topics retain their existing illustrations. The new recommendation concept draws on the roadmap's shared discovery-service idea and the user's preference for recommendations with a reason. [YouTube Hype guidance](https://support.google.com/youtube/answer/15509925?hl=en), checked 30 October 2026, is linked as a related existing direction; do not describe it as Villow's proposal or a guarantee of quality. The final trust discussion treats bots and coordinated engagement as an open design problem, includes false accusations and appeals, and makes no claim about bot prevalence or a working Villow bot detector. [YouTube's fake engagement policy](https://support.google.com/youtube/answer/3399767?hl=en) grounds the policy reference.

`concepts-ai-copy.mjs` condenses all six ideas from `src/content/pages/ai.yaml`: chapters, video questions, comment interpretation, topic preferences, recommendation refinement, and conversation beside Things to do. Each includes its benefit, limitation and current stance. Keep the distinction between transparent rules used today and speculative generative-AI features, with no imminent release promise or automatic truth/intent/bot scoring. The full discussion is readable locally, with the original AI page retained as a deeper reference.

Homepage R and setup A are unchanged by this expansion. Source files remain `concepts-page-a.mjs/css`, `concepts-ai-copy.mjs` and `concepts-topics.js`; regenerate with `render-secondary-pages.mjs`.

## Concepts B: open chapters

Preset B preserves A for comparison and presents six ordinary headed sections. Its first three chapters have B-only copy and demonstrations: a fictional correction update in a native dialog, a creator action with an illustrative add-to-list button, and public recommendations without invented written reasons. The static note placeholder and adjacent thumbnail have matching dimensions. YouTube already offers notes for eligible users; reaching past video viewers is a proposal. The alert's video, claim, viewing history and rating interaction are illustrative; its NASA link describes the real 2017 eclipse. X and YouTube permit note helpfulness ratings; the example's selection is local only and is not submitted. YouTube Hype's country-specific leaderboard is a related, more narrowly eligible example. The AI chapter has a B-only introduction and six individually expandable native cards retaining each idea's benefit, concern and current stance; cards work without JavaScript, and JavaScript opens the relevant card for direct links. `concepts-b-interactions.js` also drives the mock dialog and button; neither sends or saves data. There is no closing CTA in B; navigation and footer links remain available.

`concepts-page-b.css` layers on the shared artwork styles with aligned desktop content columns, larger headings and restrained sage/cream/peach surfaces. Each static SVG boundary has explicit, off-centre crest and trough points joined by a long sweep, mirrored between chapters. This replaces the earlier shallow, symmetrical contour so the boundary reads clearly as a wave. Its canvas is 120px on desktop and 64px on mobile; chapter padding keeps it clear of the content. There are no animated waves, new bitmap assets or bright focal points. The last wave and B's footer use the same `#e5ebdc` fill and have no gap. The chapter index supplies native local links for the longer open page, and content stacks at smaller widths. The revised shape was checked in the browser at 1280px and 390px, with no overflow or content overlap; `qa/concepts-b-swish-desktop.jpg` and `qa/concepts-b-swish-mobile.jpg` record the result. Regenerating B left concepts A, setup A and homepage R byte-for-byte unchanged.

The concepts preset list is independent of the homepage list. A/B comparison links carry the currently read topic hash through `study-page-navigation.js`; A opens that disclosure, while B scrolls to the open chapter. A requested hash stays in place through initial positioning and rail focus movement until a user scroll key, wheel, touch or outside-rail interaction releases it. Normal reading then uses visible hash targets and geometry. Returning to the hero with user input clears chapter context. Focused navigation regression checks live in `qa/page-preview-navigation.test.mjs`.

Render both concepts presets and setup A with `render-secondary-pages.mjs`. The shared server route list includes `concepts-b.html`; restart it when changing that route registry. Homepage R and setup A content are unchanged by B.

No new external pages, production deployment, analytics, authentication or account provisioning are part of these studies.

## Live Fix the Web footer credit

The eight existing project-credit footers (homepages N/O/P/Q/R, setup A, concepts A/B) use the actual base spider from the current working tree of `C:/Users/Nebula PC/Development/fixtheweb`. The user's later explicit instruction on 31 October 2026 supersedes the handoff's animated-face requirement for this site footer only: keep it still except for gradual nearby-pointer pupil tracking, so it does not distract from the page or encourage play with a credit link. The source SVG and approved config are copied unchanged; `spidey/source-provenance.json` preserves the upstream hashes and historical handoff authority alongside this newer `recipientProfile`. `spidey/README.md` details the isolated source modifications. The source project and app integration remain outside this site-only choice.

`footer-spidey-markup.mjs` replaces only the existing `.n-footer-brand` / `.sp-footer-brand` credit image with an aria-hidden 48px slot. The visible credit name and native `https://fixtheweb.org/` link remain. Canvas and fallback art have no pointer hit targets or extra keyboard stops. `footer-spidey.css` fixes the size; the ready browser module is `spidey/pinned-footer-spider.js`.

The adapter renders the real source paths with a neutral, still face/body/legs. It has no blinking, emotions, breathing or wandering idle gaze. Pupils follow a nearby pointer gradually and settle back when it moves away. Both motion preferences use the same quiet profile: a visible RAF loop supplies real elapsed time to pupil tracking and drawing, without a mood controller or an advancing animation scheduler. The per-instance `ambientMotion: false` option suppresses breathing while preserving shared source defaults for other profiles. It creates no rope, drag/pluck system, click-to-play, saved appearance, wardrobe UI, feeding or user controls. Its visibility/intersection handling pauses work offscreen, while the document is hidden or when explicitly inactive; resumed clocks exclude paused wall time. All instance frames, observers and listeners are released on disposal. `footer-spidey.js` adds idempotent DOM replacement and pagehide/pageshow handling, including back/forward-cache suspension and restoration. Genuine initialization/frame failures report `console.error` and restore the local SVG fallback; the SVG also remains usable without scripts.

The slot exposes `data-ready`, `data-spidey-status`, `data-spidey-frame`, `data-spidey-blink`, `data-spidey-blink-count` and `data-spidey-error` for browser inspection. Frame values observe the actual successful draw path, while status/error describe lifecycle or genuine failures. Blink values remain zero in this profile. These are read-only observations, with no animation triggers or UI controls.

Every active source renderer applies the idempotent markup helper. To update the eight saved designs without rebuilding their histories:

```text
node previews/homepage/spidey/build.mjs
node previews/homepage/sync-footer-spidey.mjs
node --test previews/homepage/qa/footer-spidey.test.mjs previews/homepage/spidey/qa/adapter.test.mjs previews/homepage/spidey/qa/core.test.mjs
```

Focused adapter checks cover a stable neutral drawing through long idle periods and nearby-pointer holds, zero blinks, eased left/right pupil response and return to rest, identical quiet behavior under both motion preferences, fixed attached legs, mount/dispose, pauses, source-coordinate movement and fallback failures with error diagnostics. Core checks retain coverage of the general source behavior and untouched config. Markup checks cover the native link/fallback, all saved recipients and pages without the credit. Browser review should verify the still logo at rest, pupils near both sides and their return to rest, no expression changes during a held pointer, normal clicking/Enter navigation to Fix the Web, returning without duplicate canvases, and desktop/phone layout. Recorded-vector tests supplement that browser review. Earlier live-blink evidence records the previous profile; it does not define the current footer's acceptance criteria.

## Setup A: three ways to use Villow

The entry comparison separates **Villow web app**, **Extension on its own**, and **Web app + extension**. The introduction explains who each route suits. The web app has a finite feed from subscriptions, country-popular videos and friends, without importing YouTube's personalized recommendations. The extension keeps discovery on YouTube. Connecting both adds shared usage and supported limits, with connected YouTube usage informing the web app's insights and gentle nudges. A short connected-route panel explains creating or joining a Villow, installing the extension and connecting each browser.

The local app source `disconnect/lib/attention-vectors-api.ts:335` and `lib/extension-attention.ts:144` confirm that YouTube time, recommendation exposure and saves can inform insights and suggestions; they do not imply general per-video YouTube rating or skip tracking. Extension `src/background.js:2994` owns the daily connected payload. The standalone column says today's usage in this browser, avoiding the site's unsupported daily-average claim and the old comparison's overly broad “No habit tracking.” Keep supported shared limits distinct from every app-specific setting, and native YouTube/TV apps outside extension coverage.

Creating a private installation and joining a friend's installation remain under the web-app route. The extension route has Chrome, Edge and Firefox store links, with Safari visibly unavailable. All three comparison options have working local anchors, and the three choices stack within each comparison row on small screens.

The extension chat was consulted directly for the original comparison, whose wording was checked against `villow_extension/src/options/options.js`, `COMPARISON` (around line 1273). The current three-column version refines that wording following the user's request and checks the connected data path in both repositories. Keep connected-browser coverage distinct from the web app's own features. Both products can be used independently or connected later.

“Allow about 30 minutes” is the user's setup estimate. Do not claim five-second end-to-end joining: new members still sign in, choose settings and complete onboarding. No public installer URL was found in the current site or Setup release documentation; the Windows executable button remains a labelled placeholder.

Hosting prices checked on 30 October 2026: [Vercel Pro](https://vercel.com/pricing) is listed at US$20/month and [Supabase Pro](https://supabase.com/pricing) from US$25/month. If both are needed, their combined base is US$45/month before tax, add-ons and extra usage; this is not a total-cost ceiling or a claim every group needs both. Free allowances may not cover a group. Membership revocation is implemented in the app Admin page, but does not delete stored data, reset provider quotas or reverse accrued billing.

## Setup B: guided choice

### Current owner-guide preview (2 November 2026)

`setup-hosting-b.html` is separately selectable as Hosting your Villow. Its original light/dark paused-deployment images are retained in `assets/hosting-help`. The owner-guide copy was checked with the app agent in **Explain paused Vercel deployments** against Admin, SystemHealthPanel, API accounting and quota recovery sources. It does not simulate real account changes or payments.

Provider references: [YouTube quota rules](https://developers.google.com/youtube/data/determine_quota_cost), [Vercel usage](https://vercel.com/docs/pricing/manage-and-optimize-usage), [one-time support boost](https://community.vercel.com/t/what-to-do-when-your-team-is-paused-or-blocked/45069), [Hobby recovery](https://vercel.com/docs/plans/hobby), [Supabase billing](https://supabase.com/docs/guides/platform/billing-faq), [database restrictions](https://supabase.com/docs/guides/platform/database-size), [subscription changes](https://supabase.com/docs/guides/platform/manage-your-subscription), and [cost controls](https://supabase.com/docs/guides/platform/cost-control). Live recovery, current owner quotas and payment flows were not tested.

The second preview gives the recommendations question the central focus. A no suggests the Villow web app; a yes shows the standalone extension and the connected web app plus extension together, including the usual YouTube-to-Villow handoff. Both setup routes begin as native disclosures; selecting an option opens and moves its route first, while the other remains available below. Direct route links also reveal their containing disclosure. Answers can be changed, and the original comparison remains available as a disclosure. With JavaScript unavailable, the route disclosures and direct links remain available.

`setup-page-b.mjs` reuses A's comparison and setup sections, while `setup-page-b.css` and `setup-guide.js` provide the guided presentation and interaction. The two setup previews are independent choices in the preview rail. Run `node --test previews/homepage/qa/page-preview-navigation.test.mjs previews/homepage/qa/setup-guide.test.mjs` for focused navigation and recommendation checks.
