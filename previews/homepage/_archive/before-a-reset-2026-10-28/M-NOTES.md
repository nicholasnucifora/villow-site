# M — spacious, unified overview

Local preview: http://127.0.0.1:4399/m.html#your-choices

Comparison: http://127.0.0.1:4399/l.html#your-choices

M refines the accepted L direction. Each benefit has a spacious row with aligned copy on the left and an open visual on the right; tablet and phone layouts stack naturally. The combined feed/saving example replaces the separate large Watch Later stack only in M. Cloud cinema's markup, playback/rating/scrubbing/pose behaviour and the social section remain unchanged. Existing versions remain available. Nothing was published.

## Feed and saving

Three existing product thumbnail assets illustrate supported sources: followed channels, saved YouTube videos and recommendations. The source mix is a conceptual summary of the app's separate home sections, not a screenshot. The ending is visible in the initial state and explicitly says visitors do not have to watch everything.

Saving is secondary: each sample can toggle a Saved state and enter a compact Watch Later list. All feed items remain visible. Removing a saved item or resetting the local example restores the appropriate state and focus. Changes are announced politely; all data stays in page memory. No account or app writes occur. Controls progressively enhance a meaningful static illustration.

## Allowance

An illustrative chosen daily limit of 30 minutes contains 18 minutes watched and 12 remaining. The bar uses the matching 60/40 split. This static example does not prescribe a common limit or become a settings tutorial. The accompanying copy also introduces watch-free periods, which the app supports.

## Viewing calculations and sample

Actual app source was inspected read-only at `C:/Users/Nebula PC/Development/disconnect`:

- `src/utils/rollingUsageHistory.ts:8,92–97,171–176` and `src/utils/placeholderDesigns.ts:2`: average daily time divides total seconds by calendar days, including zero-use days; the header trend uses up to 30 days and requires at least seven recorded days.
- `src/pages/WatchTime.tsx:761–795`: daily totals include playback, browsing/idle time and companion-extension YouTube time. The website therefore labels its summary **Average daily app time**, rather than implying a playback-only metric.
- `src/utils/viewingReview.ts:373–405`: worthwhile percentage is Worth it / (Worth it + Not worth it), using each video's latest verdict. Not sure and unrated videos are excluded.
- `src/utils/worthWatchingTrend.ts:12,28,50–70` and `src/components/TodayScheduleSection.tsx:280`: the header mini-trend uses up to 30 recent decisive ratings. This sample has exactly 30 distinct decisive ratings in the illustrated period, so the periods coincide.
- `src/pages/WatchTime.tsx:1342–1389`: hourly totals are averaged over all calendar days in the selected range. `:1258–1259` converts them into percentages of an hour in the native chart. M redraws grouped four-hour averages in labelled minutes.
- `src/pages/WatchTime.tsx:4120`: extension time lacks hourly measurements. M's sample contains only Villow playback, with browsing and extension time both zero, so both chart views describe the same time.
- `src/components/GeneralSettings.tsx:93–96`: reflection prompts are optional.

All figures are explicitly labelled **Sample · 1–30 September**. This is illustrative data, not a real user or product statistic.

- Average daily time: 720 minutes / 30 days = **24 minutes**.
- Over time: daily averages of 22, 28, 18, 28 and 24 minutes for 1–7, 8–14, 15–21, 22–28 and 29–30 September. Weighted total: (22 + 28 + 18 + 28) × 7 + 24 × 2 = 720 minutes. This is a grouped overview, not an individual-day breakdown or rolling average.
- Time of day: average minutes of 0, 1, 4, 3, 10 and 6 across consecutive four-hour blocks. They sum to 24 minutes per calendar day.
- Worthwhile: 24 Worth it / (24 Worth it + 6 Not worth it) = **80%**. Both the denominator and optional nature of reflection are visible.

The summary figures remain fixed while switching one chart within a stable space. Over time is the default. Native pressed buttons, labelled axes and accessible SVG titles explain the sample without hover or operating controls.

## Motion and fallback

Figures enter once: the finite selection settles, the watched portion of the allowance appears, and the trend draws to its final sample state. They finish and hold in under a second. Switching chart views uses only a 150ms fade; it does not replay entrance motion.

Static final states are the defaults. No JavaScript, unsupported IntersectionObserver, reduced motion and print retain meaningful illustrations. Enabling reduced motion reveals pending figures immediately and cancels an active chart fade.

## Files and preservation

- `m-overview.mjs/css/js`: row layout, allowance, scoped styling and one-time entry motion.
- `m-feed.mjs/js`: compact sample saving.
- `m-insights.mjs/js`: consistent sample figures and manual chart switch.
- `render-m.mjs`: copies L, replaces exactly one overview and removes exactly one old large feed section. Hero and social markup equality are asserted before writing; L is never written by this renderer. The empty `data-i-feed-save` hook is retained because shared hero switching uses it.
- `study-navigation.mjs` and `sync-study-navigation.mjs`: add M without removing earlier designs. Synchronization changes only shared navigation in existing versions.

Regenerate with `node previews/homepage/render-m.mjs`.

## Verification

Browser checks at 320, 390, 768, 1024, 1280 and 1440 CSS pixels found no overview/page overflow or missing thumbnail assets. Desktop rows share the same copy/visual alignment. Both chart views occupy the same measured chart height at every checked width, with unchanged summary figures and exactly one visible chart. Axis labels fit at 320px.

Save, save-all, unsave and Reset were checked. All feed samples and the ending remain visible; saved counts/list/buttons agree, and removing/resetting restores focus. Reduced-motion rendering shows complete final states. Syntax/render checks and hero/social preservation assertions pass. Captures and responsive measurements are under `qa/m-overview-*`.
