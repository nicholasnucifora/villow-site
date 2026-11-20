# W feed — one finite selection

## Composition

renderWFeed() renders one open row: heading/explanation on the left, original full fanned stack on the right. Mobile places copy above the illustration. There is no Home feed heading, Watch Later panel, destination arrow, sample pagination, dot indicator, numerical progress counter or automatic browsing.

The kicker identifies an interactive illustration with sample videos. Copy identifies a selection with an ending and makes watching, saving and leaving videos in the feed distinct possibilities. The small note states that watching/sorting every video is optional. The finite stack is a conceptual visual rather than a claimed exact app screen.

Both visible Remove and Watch Later actions remain accessible. The saved action is now a pale, restrained treatment rather than a strong default CTA. The exact app uses different desktop/touch presentation; the homepage's clear labels intentionally explain this illustration without claiming identical interface styling. Mobile retains T's noncommitting swipe cue.

## Engine

w-feed.js is independent of n-feed.js and removes its saved-library dependency. It exports createWFeedState() for model verification. Only the current front card accepts an action. Save records the sample id and dismisses right; Remove dismisses left. A short visible confirmation appears after promotion for 2.2seconds, with a separate persistent live announcement for accessibility. It does not fabricate a Watch Later destination panel.

Normal motion retains a620ms whole-card exit followed by300ms same-node fan promotion. Reduced motion retains the320ms fade and200ms settle. Swipes use the actual leftRemove/rightWatchLater mapping; short/vertical drags return rather than commit. Resize, reduced-motion changes and busy transitions cancel an active incomplete drag to prevent stale transforms. Ordinary scroll does not interrupt the exit/promotion.

After all five samples are deliberately dismissed, a neutral The end of this sample state appears with Try again. Replay restores the five original cards and clears sample saved state. There is no confetti or requirement that real Villow feeds must be processed in this way. All old full Watch Later demonstrations remain untouched in earlier versions.

## Integration

- Import renderWFeed from w-feed.mjs.
- Load w-feed.css after existing i-feed-save.css/n-overview styles.
- Replace n-feed.js with w-feed.js in W only.
- Keep t-swipe-cue.css/js; the rendered component retains its data-ifs-demo/data-ifs-stack hooks.
- New read-only QA state: data-wf-count and data-wf-saved on data-wf-demo.
- Neutral completion hook: data-wf-complete.

## Checks

Syntax checks passed for both JS modules. Render assertions confirm five cards and no list, panel headings, pagination or confetti. State checks cover refusing a noncurrent action, saving, removing to empty, and reset. Integrated desktop/mobile visual and native-interaction QA is performed by the parent agent.

Owned files: w-feed.mjs, w-feed.css, w-feed.js and W-FEED-NOTES.md only. No earlier component or app source was changed.
