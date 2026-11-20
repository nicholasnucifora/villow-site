# O — a little clearer

Local preview: http://127.0.0.1:4399/o.html#your-choices

Comparison: http://127.0.0.1:4399/n.html#your-choices

O is additional. N, Earlier N and all earlier choices remain accessible in the shared navigation. Production and hosting configuration are untouched.

## Composition

- Keep N's entire feed / Watch Later markup and existing `n-feed.js`, including whole-card exit, reshuffle and the original reduced-motion fade/settle.
- Retain the circular allowance. Balance it with short notes about break reminders, bedtime reminders and watch-free time. The 60-minute allowance and 30/30 split remain explicitly illustrative.
- Use one open graph area for the four existing viewing patterns. Remove simultaneous trend rows, numeric ticks and dated sample periods from this iteration. Keep qualitative axes and meaningful varied lines; manually selectable views retain the underlying breadth.
- Keep Cloud cinema and the Good videos / Good company recommendation example byte-identical to N. Add a separate synchronous watching example after the recommendation section.

## Factual reference

Actual app: `C:/Users/Nebula PC/Development/disconnect`.

- Shared rooms, invitations, queues and chat: `src/components/GroupWatchPanels.tsx:98–176,233–260`.
- Synced playback: `src/hooks/useGroupWatchPlayback.ts:181–216`.
- Break warnings are optional: `src/components/BreakWarningPreferences.tsx:15–33`.
- Bedtime is selectable and optional: `src/pages/Settings.tsx:3539–3551`; `src/contexts/SleepReminderContext.tsx:613` offers continuing, snoozing or stopping.
- Daily limits / watch-free time: `src/pages/WatchTime.tsx:6369–6417,4212–4344`.

Viewing semantics remain as audited for N: hourly percentage is the average share of an hour spent watching; daily app time includes browsing; worthwhile is Worth it / (Worth it + Not worth it), excluding Not sure/unrated. All chart patterns and room content are illustrative. No calls, testimonials, population statistics or availability claims are added.

## Implementation

`render-o.mjs` copies N, replaces one overview and adds one section. It asserts unchanged Cloud cinema/social markup, a single feed demo and an unchanged N baseline. Shared comparison navigation is the only update made across earlier HTML previews.

O-specific files: `o-overview.mjs/css/js`, `o-insights.mjs/css/js`, `o-together.mjs/css`.

Regenerate: `node previews/homepage/render-o.mjs`.

## Verification

Browser checked at 320, 390, 768, 1024, 1280 and 1440 CSS pixels: no horizontal overflow or failed images. All four chart choices switch within one fixed-height plot, with accurate qualitative measure/axis changes and optional-rating context. Actual reduced-motion environment shows complete static visuals. Mobile and desktop compositions were visually inspected.

Tested saving the front card into Watch Later, the next existing card being promoted, then removing it and promoting the following card. Busy state clears correctly; the existing n-feed.js and full card markup are reused unchanged. Reopened O with the initial five-card sample for review. Browser warning/error logs were empty.

Renderer preservation assertions pass for the hero, existing social section, exact feed markup and N baseline. Source modules pass Node syntax checks. Proof and responsive measurements: qa/o-overview-desktop.png, qa/o-viewing-mobile.png, qa/o-together-desktop.png, qa/o-together-mobile.png, qa/o-responsive.json. Nothing was published.
