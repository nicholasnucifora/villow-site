# Life-beyond-screen comparisons

Current A replaces the two side-by-side working examples with three paired rows. The left shows a familiar engagement-oriented pattern; the right shows Villow's intended alternative in stronger greens. These are general design patterns, not claims about every platform or replicas of another app's interface.

1. Daily return streak → days without raising limits. Villow's count does not need daily use. Lowering a limit keeps the streak; it does not award bonus days or points.
2. Related videos/autoplay → Things to do. Native local demonstration checkboxes remain usable. The list represents the viewer's own plans, including rest; no live creator-action recommendation service is implied.
3. Activity scores → optional sharing/shared boundaries. Villow lets people choose whether to share usage/streaks and join group limits. The illustration does not invent a reward system, friend-congratulation feed or lower-use leaderboard, and does not claim social features cause lower use or improved wellbeing.

## Primary-source grounding

- Daily communication is required for Snapchat Streaks; a lapse can end the streak. [Snapchat's Streak explanation](https://help.snapchat.com/hc/en-us/articles/7012394193684-How-do-Streaks-work-and-when-do-they-expire).
- Snapchat's activity score incorporates sending/receiving Snaps and posting Stories. [Snapscore explanation](https://help.snapchat.com/hc/en-us/articles/7012326657044-What-is-a-Snapscore).
- YouTube Autoplay, when on, plays another related video after one ends. It can be disabled; the homepage does not claim every viewer has it enabled. [YouTube Autoplay help](https://support.google.com/youtube/answer/6327615?hl=en).
- TikTok documents return-based message streaks too, but the source was only search-readable during this pass. The factual comparison does not depend on that page.

Checked 28 October 2026 using official sources. Homepage visuals intentionally avoid brand logos or invented competitor screenshots. Interpretive phrasing about what a pattern rewards is a design framing, not an addiction diagnosis or a measured causal result.

## Villow implementation audit

- ../disconnect/src/utils/socialSharing.ts:13: sharing defaults off, with separate controls.
- ../disconnect/lib/group-streaks.ts:67: shared streak calculation.
- ../disconnect/src/components/GroupBanCoordinator.tsx:536,621: explicit membership and shared limits.
- ../disconnect/src/components/SocialSettingsPanel.tsx:90: sharing/exit changes can affect grouped streaks. Do not promise leaving has no consequences.
- src/content/pages/features.yaml:95 describes these as optional support experiments.
- Earlier streak/task implementation audit remains in the private reset history and A-NOTES.md.

## Scope and verification

Only the life-beyond-screen working-example block, its intro sentence and scoped stylesheet change. The existing platform-level concepts invitation and inactive link remain byte-identical, as do all page contents before this chapter and after it. No separate page or new design version is created.

Desktop has aligned side-by-side pairs; mobile puts each familiar pattern immediately before its Villow counterpart. Positive-side labels repeat for orientation. One-time entrance motion and reduced-motion fallback remain. Responsive320,390,600,768,1024,1440px checks show no horizontal overflow or broken new-section images. Task checkbox keyboard interaction is retained. Proof in qa/a-life-comparisons-desktop.png and mobile counterpart.


## Clearer comparison refinement — 28 October 2026

- Prominent column headings identify Engagement-first social media versus Villow. Each pair repeats the labels so the comparison remains clear on mobile and while scrolling.
- The return streak now uses a warmer fire cue and a visible Streak at risk / Come back today warning. The Villow side retains Days without raising limits, including time away and decreases preserving the streak.
- The second pair shows the same cat video on both sides. Only the sidebar changes: Up next recommendations versus an optional Things to do list. This does not imply Villow removes video discovery or requires task completion. The two native task checkboxes work by pointer and keyboard.
- Activity scores are paired with opt-in shared usage. Varied bars represent time spent across completed fortnights; the visible axis is simplified to Over time. Visibility to chosen friends is the accountability mechanism. The copy presents an extra reason to keep or lower limits, without claiming a measured reduction, automatic shaming, a low-use ranking or reward points.
- Source check: VideoPlayer.tsx around5869 and5986–6000 implements the optional To-do list sidebar. FriendsUsagePanel.tsx uses sharing-gated completed-fortnight charts. socialSharing.ts defaults sharing off.
- Official YouTube documentation confirms suggested videos can appear alongside the current video under Up Next: https://support.google.com/youtube/answer/141805?hl=en . Snapchat's official streak help documents the expiry hourglass; no precise countdown or competitor screen was invented.
- Scope assertions preserved all source before x-life and from xl-concepts onward byte-for-byte. Current Cloud cinema, feed, limits, viewing insights, devices, social chapter, inactive concepts invitation and closing remain unchanged.
- Responsive checks at320,390,600,768,1024,1440px: no page or section overflow, no broken section images, task label targets remain44px high. Space checks and unchecks the native task input. Existing reduced-motion styling remains.
- Latest proof: qa/a-life-comparisons-sharper-desktop.png, qa/a-life-comparisons-sharper-mobile.png, qa/a-life-comparisons-sharper-verification.json. Runtime asset manifest has58 files,16 image/font assets and no unused candidates.

## Punchier patterns and app-like task sidebar — 28 October 2026

- To-do illustration now follows the actual player sidebar: a pale mint contained surface, rounded corners, subtle shadow, To-do list heading and circular completion marks. Native checkbox semantics/keyboard input remain, with44px task rows. App sources: VideoPlayer.tsx:7702–7737, index.css:205,217,2068,2398 and styles/things-to-do.css:9–38.
- Removed Up next from the recommendation graphic. Three existing thumbnails now form the list, with the third partly visible and gently fading at the edge. Both sides retain the same video.
- Replaced the ambiguous single-color flame with a pointed, two-tone flame. No new bitmap asset needed.
- Copy now explains design incentives: preserving a return streak can become a goal; recommendations make continuing effortless; activity scores can serve as a status signal. Villow instead celebrates keeping/lowering chosen limits, keeps personal plans available without interrupting playback, and makes shared usage a reason to reconsider watching when accountability is wanted.
- No bonus days/points for lowering limits were invented: the app preserves the streak and marks a decrease distinctly (streakCalendar.ts:96–105). Sharing remains optional/default-off (socialSharing.ts:13–87).
- Research grounding: Jackie Silverman & Alixandra Barasch, On or Off Track: How (Broken) Streaks Affect Consumer Decisions, Journal of Consumer Research. Their seven-study result concerns continued behavior with intact vs broken logged streaks and maintaining the streak as a goal; it does not establish clinical addiction or prove a Villow outcome. Accepted manuscript: https://udspace.udel.edu/bitstreams/7e3e3b64-8bf2-4527-ac93-94a160358165/download . Snap's official explanations support the daily-activity streak and activity-score examples; interpretation as pressure/status is the comparison's design framing.
- Scope: assertions/hash checks preserve all markup before this chapter and from xl-concepts onward. No other homepage section or production code changed. Private source backup: _archive/a-before-comparison-copy-2026-10-28.html.
- Desktop/mobile checks320,390,600,768,1024,1440px: no overflow, no broken section images, player illustrations fit their art areas, task text fits and completion rows remain44px high. Space toggles native completion and the circular mark fills green. No new JS is required; existing one-time/reduced-motion handling remains.
- Evidence: qa/a-comparison-copy-scope.json, qa/a-comparisons-punchier-verification.json, qa/a-comparisons-punchier-desktop.png and mobile counterpart.

## Joined comparison presentation — 28 October 2026

- Replaced the detached global column key and six independent-looking blocks with three joined pairs. Shared topic headings are Streaks, Beside the video and Social incentives.
- Each pair has a warm common-pattern half and a mint Villow half, with equal-weight labels A common social-app pattern / Villow’s approach. A small decorative connector points from the first half toward Villow. No new factual claims, comparison prose, controls or product behavior were added.
- Mobile retains each paired unit as one joined surface, with a down arrow at the exact transition. Desktop keeps the two halves side by side. The grouping has no enclosing outline and remains legible without animation or colour alone (topic, labels and direction remain).
- All six existing visual/copy/control payloads are preserved. Assertions also preserve the markup before x-life and from xl-concepts onward. The previous source is private in _archive/a-before-joined-comparisons-2026-10-28.html.
- Browser checks320,390,600,768,1024,1440px: no overflow or broken section images, all player compositions fit, all paired edges join and connector centres align. Native task controls remain keyboard-operable with44px rows. Existing reduced-motion and one-time entrance handling are retained.
- Proof: qa/a-comparisons-joined-desktop.png, qa/a-comparisons-joined-mobile.png, qa/a-comparisons-joined-verification.json and qa/a-comparisons-joined-scope.json.

## Single comparison surface — 28 October 2026

The user requested column labels once, larger and easier to read, and one combined comparison rather than three separate boxes. Current A therefore has one continuous rounded surface with Common social-app patterns / Villow’s approach headings at28px on desktop. Full-width neutral divider bars label the three topics. Individual side labels are removed. Only the overall container has rounded outer corners.

The same header stays visible below the local preview rail while scrolling. On mobile it serves as a compact two-part legend (17–18px); each topic still stacks the warm pattern before the mint Villow example with a downward connector. No duplicate visible side headings, tabs or horizontally scrolling miniature table. Each article is labelled for assistive technology using its global column heading and individual benefit heading.

Stable data-xl-topic selectors replace child-order-dependent sizing, so adding the global header does not break the streak or player composition heights. Existing figures, prose, controls, one-time entrance treatment and reduced-motion fallback are unchanged. The new built-in-experience bridge and every other earlier/later section are preserved by source assertions. Backup: _archive/a-before-comparison-table-2026-10-28.html.

Checks320,390,600,768,1024,1440px: no overflow, fitting headings, all player compositions contained, no broken section images,44px task rows and all six accessible article labels resolve. Keyboard completion still toggles. Sticky header was observed at40px on mobile and42px on desktop, exactly below the local preview rail. Proof: qa/a-comparison-table-desktop.png, qa/a-comparison-table-mobile.png, qa/a-comparison-table-mobile-sticky.png, qa/a-comparison-table-verification.json and qa/a-comparison-table-scope.json.

## Comparison hierarchy alternatives B/C/D — 28 October 2026

The user has requested alternatives alongside preserved A. B removes individual headlines and arrows, retaining topic bars and visual/caption pairs. C removes visible topic bars and arrows, retaining message headlines with copy before aligned illustrations. D moves topic labels into a wide-desktop rail and keeps only unframed arrows; smaller screens retain topic bars and readable stacked pairs. The two global comparison headings remain shared/sticky in all options. Existing explanatory paragraphs, working checkboxes and all product demonstrations outside this chapter are preserved.

Implementation and verification details are in the latest A-NOTES.md entry. The new options are derived from the canonical baseline by comparison-variants.mjs; do not edit generated b/c/d.html by hand or run archived render chains. The server and navigation use the same active option list. Only local previews change; no publishing or app changes.

## Selected Visuals first + compact comparisons - 28 October 2026

The user chose the former B and retired the other three presentation layouts. Its topic bars, illustrations, six captions, side-by-side desktop composition and absence of secondary headlines/arrows are now the shared canonical baseline. The old four-option source and helpers are preserved privately in _archive/before-compact-comparisons-2026-10-28; they are not active preview pages.

There are two active options: A Reveal cards and B Shared switch. Both retain the same wide-screen layout. At the existing stacking breakpoint (max-width600px), A shows one labelled example per topic with a Compare / See Villow action. B shows one sticky Common patterns on other apps / Villow's approach switch for all three topics. Both start with Villow, deliberately making the product approach the first encounter. No automatic switching or3D card flip. Background colour supports explicit textual attribution rather than carrying it alone.

The same two articles occupy one grid cell on narrow screens, reserving enough height for either face. Only the active face is visible and interactive. Inactive faces are inert/aria-hidden; labels, live announcements and native buttons work with keyboard input. Checkbox selections survive switches and resizing. Focus moves safely when a previously active face or compact control becomes hidden at the breakpoint. Reduced motion switches immediately. Without scripting, both faces retain explicit labels and the inactive controls are removed.

The source verifier checks the canonical source is exactly the previously selected B transformation, preserves all six original article payloads, and verifies all content before the chapter and from the concepts invitation onward. Browser measurements at1440px exactly match the previously selected B:1100px surface,550px columns,363.671875px topic rows. Tests at320,390,600,601,768,1440px found no page/art overflow or broken images, with3visible faces on compact layouts and6on wide screens. Keyboard reveal/switch actions, stable panel heights, sticky control position at40px, checkbox persistence and desktop focus recovery were checked. No browser errors were captured. Old C redirects to A; private archive pages return404.

Proof: qa/compact-comparison-scope.json, qa/compact-comparison-responsive.json, qa/compact-a-mobile.png, qa/compact-b-mobile.png, qa/compact-b-common-pattern.png and qa/compact-comparison-desktop.png. Renderer is render.mjs; shared compact behavior is compact-comparisons.css/js. Local preview only; all other homepage features and production files were untouched.

## B selected as the sole preview - 28 October 2026

The user retained B Shared switch and removed A Reveal cards. B is the only active navigation entry, index.html now renders B, and inactive preview URLs redirect to b.html. The previous A is preserved privately in _archive/retired-reveal-cards-2026-10-28. B's generated markup is identical to the selected previous B apart from removing A from the preview navigation; desktop CSS and all mobile/desktop content and behavior are unchanged. The scope verifier checks that exact preservation and the root entrypoint.
