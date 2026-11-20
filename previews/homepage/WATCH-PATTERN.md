# Homepage: habits and controls

The local homepage 34 and its index alias show “See your habits. Adjust on
the spot.” followed by “Learn from what you watch.” Keep these saved pages
synchronized via `sync-preview-pages.mjs`.

“See your habits. Adjust on the spot.” explains the benefit of seeing activity
and editing settings together. The example uses fictional activity only. It has
no account, network, storage or app-setting writes.

`watch-pattern-demo.css` retains the Villow web app’s WatchFreeTimeDemo animation,
including desktop drag and phone tap sequences and their original ten-second loop.
The app itself has not been changed. `watch-pattern-section.css` supplies homepage
layout, Inter within the example, a chart title integrated into the chart
surface, and a compact drawer. The explicitly requested explanatory loop
continues under reduced motion, overriding this homepage’s legacy global reset
only within this section. Other motion behavior is unaffected.

The saved markup uses the default fictional curve from
`watch-pattern-geometry.js` and `watch-pattern-spline.js`. The weekday-selector
script is historical source. The adjacent “Learn from what you watch” example
shows how ratings and skips for the fictional Rory, Somehow channel can
inform a suggestion to consider unsubscribing.

The implementation came from Fix the Web’s VillowReflectionExample, originally
ported from disconnect’s WatchFreeTimeDemo.tsx and monotone-spline utility. The
illustration has been removed from Fix the Web’s principles section, keeping its
six principles at equal visual weight. Do not add Daily use, playback controls or
manual editing forms here. This is a local preview change, not a publication.
