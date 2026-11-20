# N — restored stack and quieter viewing visuals

Local preview: http://127.0.0.1:4399/n.html#your-choices

Earlier N: http://127.0.0.1:4399/n-previous.html#your-choices

M comparison: http://127.0.0.1:4399/m.html#your-choices

N is a separate local interpretation. It replaces only M's overview, including its feed example. Cloud cinema, its current playback/rating/pose/scrubber behaviour, and the social section retain their existing markup and shared assets/scripts. The production website and hosting configuration are untouched.

## One feed demonstration

Find it now / Watch it later restores the earlier full fanned cards: several complete cards remain visibly layered behind the front one, with depth offsets and slight rotation. The front thumbnail, short sample title and Remove / Watch Later actions stay together. The list sits beside the stack on desktop and below it on phones.

The surrounding copy retains followed channels, saved YouTube videos and recommendations, shaping a finite selection, and an ending. A visible note makes clear that visitors do not have to watch every sample. There is no second large feed demonstration.

The original stack rhythm is restored: the whole card exits over 620ms, then the existing back cards reshuffle over 300ms. Saving heads towards the actual list position, including below the stack on mobile. No thumbnail is detached from its card. Reduced motion keeps the original opacity-only 320ms exit and small 200ms settle, rather than swapping instantly. Ordinary scrolling no longer truncates active animations. Busy/focus/replay handling is retained, and resize or a change in motion preference safely finishes active motion.

`n-data.js` reuses all existing thumbnail assets and IDs with shorter fictional sample titles. The same title and thumbnail are used in each saved row. No new artwork, testimonials, availability claims or product statistics are invented.

## Circular time indicator

The illustrative daily allowance is 60 minutes, with 30 used and 30 remaining. A compact 50% radial arc sits beside “An example daily limit / 60 min per day.” The illustration is explicitly hypothetical; it does not present Today or a live remaining-time status to the visitor.

## Viewing hierarchy

The main chart defaults to seven weekday-average bars labelled Mon–Sun. A manual Day of week / Time of day switch changes only that chart to a smooth percentage curve. The label is “Likelihood of watching,” with an honest 0–10% scale and “Share of each hour spent watching” caption. This matches the app's average hourly seconds / 3600 × 100 calculation (WatchTime.tsx:1258–1260,1349–1389,5781), rather than the percentage of days with any activity.

Two wider history plots form a separate full-width row, side by side on desktop and stacked on phones. Daily app time has a 0/30/60-minute axis; Videos worth watching has a 0/50/100% axis. Both have varied rises and dips over 30 illustrative points, with no calendar dates or headline statistic tiles. Optional reflection and the exclusion of Not sure/unrated videos remain clear. No holiday, illness or other cause is assigned to sample changes.

The app calculation audit is recorded in `M-NOTES.md`. N preserves those meanings: daily app-time averages include all calendar days; the hourly illustration uses Villow-only playback so its scope matches the daily sample; worthwhile is Worth it / (Worth it + Not worth it). The sample is illustrative, not a real person's usage.

The current sample contains 660 minutes over 30 days (22 minutes/day). Weekday means are 24,29,23,28,32,9,7 minutes for Mon–Sun. The hourly curve normalizes to that same 22 minutes/day before converting to percentages. Daily history ranges from 2 to 58 minutes. Worthwhile history shows illustrative snapshots with 10–27 Worth it responses out of 30 decisive ratings (33⅓–90%); it is not a claim that those snapshots correspond to specific dates.

HTML axis labels remain outside the SVG drawing to keep their type naturally proportioned at all widths. SVG titles provide accessible descriptions. Static default charts remain useful without controls or animation.

## Files and preservation

- `n-overview.mjs/css/js`: open composition, radial indicator, scoped refinements and once-on-entry motion.
- `n-data.js`, `n-feed.js`: local sample titles and stack/list interaction.
- `n-insights.mjs/js`: charts, sample data and manual switching.
- `render-n.mjs`: copies M, replaces exactly one overview, asserts hero/social equality and exactly one feed demonstration, and verifies M remains unchanged.
- Shared navigation adds N and direct M/N comparison links while retaining all earlier choices.
- `n-previous.html` and `n-previous/` freeze the earlier N HTML, CSS and browser modules. Earlier N / Refined N are directly selectable beneath N.

Regenerate with `node previews/homepage/render-n.mjs`.

## Verification

Browser checks at 320, 390, 768, 1024, 1280 and 1440 CSS pixels found no horizontal page/overview overflow or missing thumbnails. Both main chart views retain the same 207px phone / 226px larger chart space, with exactly one main chart visible and both history plots retained. Percentage, minute and weekday labels fit at all checked widths; history plots stack on phones. Calendar dates are absent from the current overview.

Checked first save, removal, keyboard focus to the next card, clearing the five-card sample, six saved items including the initial sample, removing all saved items, empty-state focus and replay. Source thumbnail/title match the saved row; mobile destination geometry is below the stack. Normal/reduced-motion flow checks verify whole-card exit followed by promotion of the same actual nodes. Browser inspection confirms a real opacity fade and busy state in reduced motion. Entrance illustrations still show complete static states under reduced motion.

Hero and social equality are asserted on each render; M remains unchanged by the renderer. M/N comparison navigation is retained, and scripts pass syntax checks. Captures and responsive measurements are under `qa/n-overview-*`. Nothing was published.

The refined composition and current breakpoint measurements are saved under `qa/n-refined-*`. Earlier N was opened successfully with its frozen stylesheet and original dated graphs, then Refined N restored the updated version. The restored flow was checked through all five saves, the end state, six saved rows and replay; controls unlock and keyboard focus remains correct.
