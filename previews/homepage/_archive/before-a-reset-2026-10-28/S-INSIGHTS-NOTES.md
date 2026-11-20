# S chart presentation

S preserves R's four views, factual sample data, rolling30-day daily app-time calculation, recent30 decisive worthwhile ratings, whole-number readouts and continuous curve inspection. R files are untouched.

## Presentation changes

- Line-view inspection uses a2px dashed guide from the selected point down to the bottom baseline only. Its top is computed from the exact same interpolated value used by the dot/tooltip. It never extends above the point.
- Weekdays show no guide or dot; the selected bar alone changes colour. The callout remains anchored10px above that bar.
- Tooltip width is `max-content` with a responsive maximum, replacing R's fixed174/166px widths. The label and value/unit row are both centred; row items align vertically at their centres.
- SystemUI600/700 typography provides real heavier glyphs rather than synthetic bold Varela Round. Label/unit11–11.5px; value21–23px. Padding and row spacing are consistent and the caret still points to the actual chart position after horizontal clamping.
- Internal plot headroom begins at96/286 rather than66/286 so the larger tooltip remains clear of the view controls, including at320px. Bottom baseline276/286, SVG width600 and drawing CSS heights244desktop/224mobile are unchanged. This adjusts the website illustration's y mapping only; it changes no data.

## Integration

Import `renderSInsights()` from s-insights.mjs and load s-insights.css plus s-insights.js. All component classes/IDs/data attributes are si-* / data-si-*. s-insights-data.js re-exports factual R views/inspection and contains only S's adjusted plotting geometry/path.

## Verification

Syntax checks pass.4,004 inspections match R's values, units, labels and integer formatting exactly; all computed guides stay within the selectedpoint-to-baseline range. Browser integration/responsive checks are performed by the parent task.
