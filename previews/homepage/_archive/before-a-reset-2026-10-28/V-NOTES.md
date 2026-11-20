# V — a finite selection and a wider invitation

Local preview: http://127.0.0.1:4399/v.html#feed-to-watch-later
Original comparison: http://127.0.0.1:4399/t.html#feed-to-watch-later
Closing: http://127.0.0.1:4399/v.html#help-shape-web

## Scope

V starts from T, the user's preferred short hero copy. Only the feed demonstration and final invitation change. Cloud cinema, boundaries, viewing insights, social introduction and both social demonstrations are asserted byte-for-byte equal by render-v.mjs. T and every older study remain in the shared comparison rail. Nothing is published; production content and configuration are untouched by this work.

## Feed

The fanned cards remain a clearly labelled interactive illustration, rather than a claimed replica of the app interface. The focus is a finite selection: a visible five-dot ending, optional saving, and Previous/Next controls labelled Browse the sample. Browsing only changes the selected sample. It never marks it watched, removes it, saves it or consumes the selection. The last card remains visible with a neutral ending message. This avoids equating reaching the end with sorting or watching every video.

Remove, Watch Later, real left/right swipes, save arrival, same-node promotion, unsave and replay remain available. Watch Later is quieter and explicitly Optional. See V-FEED-NOTES.md for the state model and animation details. Interrupted dragging is cancelled before navigation, resize or reduced-motion changes to avoid stale transforms.

The actual app allows watching from Home and leaving a video there. Its mobile gestures are left to hide/remove and right to Watch Later; desktop clock/trash controls appear in the thumbnail's top-right corner on hover. The homepage keeps clearly named buttons as accessible illustrative alternatives, without claiming the app has the same fanned interface. Existing audit: T-NOTES.md and T-SWIPE-NOTES.md.

## Closing and factual grounding

The invitation is headed Together, we can build a better web. It presents Villow as a working experiment joining feeds, boundaries, reflection and shared watching across phone, tablet and computer. The short hero stays unchanged. Get started is copied exactly from T's hero; Help fix the web retains its established destination.

Coverage is described positively and with scope: YouTube time in connected browsers joins Villow usage. It does not claim every browser/device/activity is tracked or that competitors cannot sync usage. Feedback is voluntarily shared, and future research/policy is an ambition rather than a promised outcome.

Read-only source audit:
- src/content/pages/extension.yaml: linked usage/settings and platform support, especially lines57–80.
- src/content/pages/privacy-overview.yaml: voluntary feedback handling.
- src/content/pages/about.yaml and youtube-could-do-this.yaml: prototype, research and broader design ambition.
- ../disconnect/lib/usage-utils.ts:234 combines Villow and external daily usage.
- ../disconnect/lib/api/extension.ts:553–584 scopes reports by user, browser token and date.
- ../disconnect/lib/extension-day.ts:227–246 aggregates connected usage/settings.
- ../disconnect/src/pages/Feedback.tsx and ../disconnect/src/components/TallyFeedbackForm.tsx: explicit feedback submission; no new automatic private viewing-data transfer is implied.

Native YouTube apps, TVs and unconnected browsers are outside the linked-extension coverage. Offline sources are not instantaneous. Homepage copy deliberately does not enumerate unsupported coverage or promise universal enforcement.

## Verification

- Render assertions preserve T, its short hero and every out-of-scope product section.
- Module syntax checked; state assertions cover bounded browsing, unchanged selection/saved state, nonzero-cursor actions, last-item removal, unsave and reset.
- Browser: Next four times retains all five cards and original saved set; Previous restores cards; save/remove at cursor2; real left/right drag; unsave; actual empty state and replay; keyboard Enter and boundary focus all pass.
- Touch swipe practice remains noncommitting and clears its preview transform.
- Responsive checks at320,390,600,768,850,1024,1440 and1920px. No horizontal overflow; stack/navigation clearance corrected at medium widths. Proof in qa/v-feed-desktop.png and qa/v-feed-mobile.png.
- Closing inspected on desktop/mobile, with both CTA destinations preserved. Proof in qa/v-closing-desktop.png and qa/v-closing-mobile.png.
- Reduced-motion fades/settles retained, static meaning complete; browser reported no warnings/errors.

Regenerate with node previews/homepage/render-v.mjs, then node previews/homepage/sync-study-navigation.mjs. Serve with node previews/homepage/serve.mjs. No dependency installation or production build is needed for these static local previews.

