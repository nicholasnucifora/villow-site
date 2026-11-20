# Pinned footer Spidey

Local browser entry: `pinned-footer-spider.js`.

```js
import { mountPinnedFooterSpider } from './spidey/pinned-footer-spider.js';
const spider = mountPinnedFooterSpider(slot);
spider.setActive(false); // optional owner pause
spider.setActive(true);
spider.dispose();       // safe to call repeatedly
```

The slot is an `aria-hidden` 48px square inside the ordinary Fix the Web anchor, positioned `relative` and with `pointer-events: none`. Include `<img class="footer-spidey-fallback" src="spidey/base-spider.svg" alt="">` in it. The adapter appends its own canvas and hides that image only after drawing successfully. Disposal or genuine initialization/frame failure restores the image; failures also report `console.error` with the stage and original error. Repeated mounting of the same slot returns the existing handle; a disposed slot may be mounted afresh.

The drawing is 44px wide within that slot, preserving the source's 596 × 401 proportions and outline. The wrapper size and link name belong to the footer. This recipient uses a quiet profile: the face, body and legs stay neutral and still, with no blinking, emotions, breathing or wandering idle gaze. Only the pupils respond gradually when the pointer is nearby, then settle back when it moves away. Both motion preferences use this same profile. The visible RAF loop supplies real elapsed time to `spider.update` and a canvas draw for eased pupil tracking; no mood instance or animation scheduler is advanced. The adapter pauses its loop while offscreen, document-hidden or explicitly inactive, and resumes without advancing its clock by paused wall time. Resize, intersection, visibility and pointer resources are released on disposal.

Read-only browser diagnostics on the slot are `data-ready`, `data-spidey-status`, `data-spidey-frame`, `data-spidey-blink`, `data-spidey-blink-count` and `data-spidey-error`. Frame values come from the actual successful update/draw path; blink values remain zero in this profile. Readiness/status/error reflect lifecycle and genuine failures. These observations install no animation triggers or UI controls.

## Source and adaptation

The working-tree handoff was read first on 31 October 2026: `C:/Users/Nebula PC/Development/fixtheweb/docs/SPIDER-INTEGRATION.md`. The user's later explicit request on the same date supersedes its animated-face requirement for this site footer only: keep the logo still apart from nearby-pointer pupil tracking, because ambient animation distracts from the page. The Fix the Web source and app integration are outside this change. `source-provenance.json` preserves the original SHA-256 hashes and historical `correctionAuthority`, with the newer site-only choice recorded as `recipientProfile`. Nothing in the source workspace was edited.

`base-spider.svg` is an exact copy of `src/assets/spider/spider.svg`. `core/config.ts` is an exact copy with all approved defaults intact; no shared configuration is changed by the adapter. The original source paths, neutral face, gradual pupil attention and pupil clipping are retained. The core's general blink/expression capabilities remain available to other profiles, but this adapter does not run them. A fresh private `blankLook()` and neutral face are used for every instance. The exported API offers no appearance or tuning controls and imports no saved-look module.

Local source differences:

- `core/spider.ts`: embeds the SVG at its local path; guards favicon creation with a per-instance `showFavicon` option (the adapter always passes `false`); adds a per-instance `fixedLegs` path that bypasses all cursor, animation, expression, spring and fidget articulation. The original placed shapes and hidden roots share the full torso transform. The `pinned` path omits tether tilt/snapping and DOM grab-target writes. The site adapter's per-instance `ambientMotion: false` disables breathing without changing the core defaults or cursor attention. Cursor callbacks honor instance activity.
- `core/animation.ts`: adds complete listener disposal and a `pinned` profile. That profile accepts only blink/gaze requests, suppresses independent idle-leg stretches and never resets/gathers a rope. The footer keeps its animation state at rest, does not advance its scheduler, installs no global animation listeners and never requests a performance.
- `core/mood.ts`: retains the earlier isolated `interactive: false` option for other uses. The quiet footer does not instantiate a mood controller or install mood pointer handlers.

Other copied modules remain unchanged. `anchor.ts`, `rope.ts` and `particles.ts` satisfy source type references only; esbuild removes them from the browser dependency graph. The old viewport renderer is never instantiated. Only its source width helper is reachable from the core. The adapter owns a slot-sized canvas and draws only `spider.draw()`. Its one-point position carrier has equal current/previous positions even as the slot scrolls: no rope is created, stepped, drawn or hidden; no artificial velocity, string, drag, pluck, click handler, food, saved appearance or network fetch is wired.

## Build and verification

Uses the repository's already installed esbuild; no package changes or downloads:

```powershell
node previews/homepage/spidey/build.mjs
node --test previews/homepage/qa/footer-spidey.test.mjs previews/homepage/spidey/qa/adapter.test.mjs previews/homepage/spidey/qa/core.test.mjs
```

The build embeds the SVG text, emits the ready-to-serve ESM `.js`, and checks that tether/food/storage entry points are absent from its runtime dependency graph. Adapter checks exercise the shipped bundle with recorded vector operations: unchanged neutral drawing through long idle periods and nearby-pointer holds, zero blinks, eased pupil tracking in both directions and return to rest, the same quiet behavior under both motion preferences, fixed attached legs, repeated mount/dispose, pauses/resume, source-coordinate movement, and SVG recovery with error diagnostics on missing-context, first-draw and later-frame failure. Core checks retain coverage of the general source behavior and unchanged config. Markup checks cover native link/fallback preservation, all eight saved recipients and unchanged pages without the credit. The fixture does not rasterize; actual browser review should verify the still logo at rest, pupil response near both sides and return to rest, unchanged expressions during a held pointer, layout and normal credit-link behavior. Earlier live-blink evidence documents the previous profile, not acceptance criteria for the quiet footer.
