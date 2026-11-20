# R chart refinement

R keeps Q's four icon-led graph views, open presentation, continuous curve inspection and fixed-above-point tooltip positioning. It changes the sample semantics and numeric readouts only. Q is unchanged.

## Display

- Time of day: minute-resolution clock positions, whole-number percentages (e.g. 2%).
- Day of week: categorical weekdays, whole-number average minutes per day.
- Time spent: whole-number minutes per day; tooltip label is `30-day average`, never fractional `Day 33.5`. The x-axis is Earlier / More recently.
- Worthwhile: whole-number percentage; tooltip identifies Recent 30 ratings.
- Sample context remains in tooltips and accessible descriptions. No visible heading or below-chart copy is reintroduced.

The curve and marker retain their full smooth precision. Rounding affects the readable numeric label only.

## Actual app calculation audit (read-only)

`disconnect/src/utils/rollingUsageHistory.ts`:
- Line 8 sets the window to 30 calendar days.
- Lines 87–98 iterate each covered calendar day, count missing covered days as zero, push usage into a rolling window, evict the oldest day after 30, and divide the total by the window length. The average is rounded to seconds.
- Until 30 days have been tracked, the denominator is the shorter covered history. After that, it is always a trailing 30-day window, not a cumulative lifetime average.
- Lines 166–179 expose each point's actual start/end dates and average.

`disconnect/src/components/TodayScheduleSection.tsx:102` describes this as the daily average over the past N days. The homepage sample plots 90 full-window points computed from 119 illustrative daily totals, so every visible point has a complete trailing 30-day window. It does not plot raw daily totals.

`disconnect/src/utils/worthWatchingTrend.ts:26–74` uses the recent 30 decisive ratings, with a minimum of 10 before a trend is shown. It excludes days without decisive ratings and proportionally samples the oldest day if only part of that day's decisions fit in the 30-rating window. The R sample follows that algorithm and shows 90 points after a warmup. Not sure and unrated videos are excluded; reflection remains optional.

`disconnect/src/pages/WatchTime.tsx:1258–1260` rounds hourly occupancy percentages to whole numbers. R preserves the existing correct hourly occupancy interpretation and smooth interpolation while matching that readable precision.

## Verification

- Syntax checks pass for r-insights.mjs/js/data.js.
- All 90 rolling app-time values independently checked against exact trailing-30 daily totals.
- All 90 worthwhile values independently checked against the recent 30 decisive sample ratings.
- 4,004 inspections confirm integer-only visible numeric values and no fractional Day labels.
- 20,402 rendered-curve/marker coordinate comparisons pass, including no overshoot. Maximum SVG-coordinate mismatch is 0.000475 units.
- Browser integration and responsive QA are performed by the parent task.
