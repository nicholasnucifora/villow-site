# S — focused boundaries and a more varied scroll

Local preview: http://127.0.0.1:4399/s.html#o-limits
Graph: http://127.0.0.1:4399/s.html#o-viewing
Previous R remains in the top navigation and footer comparison link. All earlier options remain available. Local preview only; no production files or publication.

## Composition

Keep the wide feed stack and compact Watch Later interaction, with an editorial heading/explanation split. Introduce stopping controls with a centered heading above one focused visual/explanation stage. Let viewing insights lead with a large graph on the left and its short explanation on the right. Mobile stacks naturally with explanation first. This varies hierarchy rather than alternating identical rows.

Cloud cinema, the feed/card movement, both warm peach social sections and the final sage invitation retain their exact R markup and scripts. render-s.mjs asserts these boundaries and that the R source remains unchanged; only shared comparison navigation gains S.

## Graph details

Line views use a2px dashed guide from the selected point down to the zero baseline. Nothing extends above the point. Weekday bars have no guide or dot; only the selected bar darkens. Tooltips size to their content, center both lines, and use readable system-ui semibold/bold with21px values on phones and23px on desktop. No fabricated bold rounded font. The existing minute-resolution inspection, integer readouts and source-faithful rolling averages/ratings remain.

See S-INSIGHTS-NOTES.md for data/geometry checks. All line tooltips remain10px above their selected point. Internal headroom accommodates the larger callout, including peaks on320px phones; no visible chart heading/footer copy returns.

## Stopping controls

Five examples: daily allowance, weekday allowances, break reminders, bedtime reminder, watch-free hours/days. Each has a short explanation and a simple open visual. Minimal chevrons plus quiet count and Play/Pause control. The stable stage avoids page jumps.

Normal motion starts rotating every7.5seconds while visible and unhovered. Any direct interaction stops rotation until explicit Play. Reduced motion starts paused; explicit Play can opt into timed changes without animation. Offscreen/hidden/hover states suspend the timer. See S-LIMITS-NOTES.md for actual app source audit, supported settings and fake-clock validation. No unsupported date-range personal allowance or advanced channel settings were added.

## Verification

-28 graph cases: four views at320,390,768,1024,1280,1440,1920. No overflow; fitting centered tooltips;2px dashed guide starts at the point and ends at the baseline; weekday guide/dot hidden with one selected bar. Popup gap10px.
-50 limits cases: all five slides at320,390,600,700,701,768,900,1024,1440,1920. No overflow, overlapping copy or clipped diagrams. Stage stays400px at320,380px at other phone widths,252px on desktop/tablet layout.
- Browser confirms explicit automatic advancement under reduced motion and persistent stop after manual navigation. Both normal/reduced timer state machines independently tested by the component agent.
- Narrow-phone peak tooltip97% fits above the point and below the selector. Console warning/error log empty; module syntax checks and renderer preservation assertions pass.

Proof: qa/s-limits-desktop.png, qa/s-limits-mobile.png, qa/s-viewing-desktop.png, qa/s-viewing-mobile.png, qa/s-verification.json.

Regenerate: node previews/homepage/render-s.mjs
