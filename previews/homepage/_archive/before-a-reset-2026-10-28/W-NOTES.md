# W — simpler stack, device continuity and a focused invitation

Preview: http://127.0.0.1:4399/w.html#feed-to-watch-later
Across devices: http://127.0.0.1:4399/w.html#across-devices
Closing: http://127.0.0.1:4399/w.html#help-shape-web

## User correction

V added dots and Previous/Next browsing that the user did not request. W removes that presentation. The requested composition is heading/copy left, fanned cards right, with no Home feed heading, saved-list panel, counters or sample pagination. T and V remain available; production is unchanged.

## Actions

Keep visible, labelled Remove and Watch Later buttons as understandable, keyboard-accessible alternatives to swiping. Match their weight more closely: Watch Later uses a pale fill rather than a dominant dark action. Left removes; right saves. The original fan, whole-card exits and same-node promotion remain. Saving gives a short confirmation rather than travelling into another large panel. The illustration is labelled sample content, and surrounding copy says watching directly, saving or leaving a video are all possible. No invented video playback is added.

The stack is a conceptual finite selection, not the literal app layout or a requirement to classify every upload. The end state is neutral, with replay. See W-FEED-NOTES.md for engine details.

## Separate messages

After viewing insights and before the social chapter, a compact open section introduces account continuity across phone, tablet and computer. The small browser note qualifies external YouTube usage to supported connected browsers. Device shapes identify platforms; they are not app screenshots or a promise of native apps on every platform.

The closing drops V's feature recap and connected-browser explanation. It keeps Together, we can build a better web, a concise working-experiment statement, and an invitation for voluntarily shared feedback to improve the prototype and inform research/the case for better design. It does not claim a guaranteed policy outcome or competitor exclusivity.

Sources inspected read-only:
- src/content/pages/extension.yaml:42–61,72–80, account synchronization and supported extension browsers.
- ../disconnect/api/videos.ts:169–171, user-scoped feed/library storage.
- ../disconnect/lib/api/extension.ts:553–653, user/token-scoped usage/settings synchronization.
- src/content/pages/about.yaml:7–9,31–43,64–69, experiment and design ambition.
- src/content/pages/youtube-could-do-this.yaml:74–76, wider change intent.
- src/content/pages/privacy-overview.yaml:49–51, voluntary feedback.

## Preservation and verification

render-w.mjs starts from T and asserts that the short hero, Cloud cinema, boundaries, insights, social introduction and both social demonstrations remain exactly equal. It changes the feed and closing, adds the small device section, and updates only comparison metadata/scripts/styles. All A–W remain in the top rail.

- Module syntax, rendered structure and bounded state checks pass.
- Browser save via Enter, focus continuation, left/remove and right/save drags, full empty state and keyboard replay pass.
- Swipe practice leaves sample count, saved state and inline card transforms unchanged.
- 320,390,600,768,850,1024,1440,1920px: no horizontal overflow; card clearance remains positive; desktop copy left/visual right, mobile stacking.
- Reduced-motion fades and settles retained; no console warnings/errors during checks.
- Desktop/mobile visuals inspected, proof in qa/w-feed-desktop.png and qa/w-feed-mobile.png; device/closing proof also in qa/.
- Existing Get started and Help fix the web destinations retained. Static local preview only, nothing published.

Regenerate: node previews/homepage/render-w.mjs
Synchronize rail: node previews/homepage/sync-study-navigation.mjs
Serve: node previews/homepage/serve.mjs
