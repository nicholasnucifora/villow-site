# Native component capture harness

Local review utility only. Not part of the production website or Villow app.

Run `node previews/homepage/product-capture/build-native-capture.mjs` from the Villow site workspace. The builder reads the sibling `disconnect` checkout and writes only here. All sample controls use React state inside this document. Networking is blocked both by CSP and an explicit fetch rejection, and browser storage is replaced with fresh memory stores.

The rendered interfaces come directly from these current source files, without copied interface markup:

- `disconnect/src/components/ChannelFilterEditor.tsx` — delivery, video durations and title filtering.
- `disconnect/src/components/UsageLimitEditorPanel.tsx` — default and per-weekday daily limits.
- `disconnect/src/components/GeneralSettings.tsx` — optional reflection setting.
- `disconnect/src/components/RateRecentVideos.tsx` and `RateRecentControls.tsx` — actual desktop reflection question, Undo and three verdicts; rendered using the component's built-in fictional practice mode with a locally embedded product sample thumbnail.
- `disconnect/src/index.css`, imported component CSS, and `disconnect/src/utils/themeColors.ts` — current app styling and default light palette.
- `disconnect/public/fonts/inter-v20-latin-opsz-normal.woff2` and `varela-round-v21-latin-400.woff2` — actual fonts, embedded into the offline document.

All names and settings values are fictional examples. `reaction` is an excluded title phrase, not a semantic category or format filter. Example channel duration is 2–20 minutes. Daily limits are 1 hour by default, 30 minutes on Sunday and 90 minutes on Saturday. Scheduled channels share the interval chosen elsewhere in Settings.

The native filters component includes **Performance ranking · Not built yet**. Do not use that area to represent working functionality. Capture the existing Title filter column or Video lengths control independently; the source component remains intact in this utility.

Selectors: `[data-capture="filters"]`, `[data-capture="delivery"]`, `[data-capture="limits"]`, `[data-capture="reflection"]`. Inside reflection, `[data-setting="reflection-prompts"]` is the actual optional prompt switch and its explanatory text. In filters, `[role="group"][aria-label="Title filter"]` identifies the native mode choices; its parent is the full title-filter column including phrase input/chips.

`[data-capture="verdict"] .rate-run-actions` is the actual desktop question and verdict controls, without the thumbnail. It includes the genuine Undo row above Not worth it / Not sure / Worth it. Use a desktop-width browser (at least 640px) so native mobile styles do not hide the desktop keyboard controls.

`[data-capture="verdict-mobile"]` uses the same native component with `practice.layout='mobile'`, and the app's own `.rate-recent-practice` class (390px wide, 600px tall). Use a phone viewport below 640px. Mobile rating uses swipes, with three icon-based verdict buttons available after tapping the actual thumbnail (`button[aria-label="Show rating buttons"]`). Native `How to rate` explains the gesture directions. This utility does not add a desktop verdict row to the phone interface.

`[data-capture="verdict-compact"] .rate-run-actions` is an additional native desktop excerpt in a 368px parent (320px after the native side padding), without changed font sizes, control markup, spacing or button styles. View in a desktop browser at least 1024px wide. It may be used as a readable product capability excerpt on a responsive marketing page, but must not be labelled as the mobile app interface.
