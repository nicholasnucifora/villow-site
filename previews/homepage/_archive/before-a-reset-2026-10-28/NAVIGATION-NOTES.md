# Shared study navigation

Every local study uses the same A–J parent navigation. I is labelled “Card stack & studies”. F and G retain their three existing hash variants beneath the selected parent.

- `study-navigation.mjs` is the markup and label source.
- `study-navigation.css` isolates comparison controls from each study’s visual design. The parent row is 42px high (40px on phones). Below 1600px it shows letters; below 900px the study label shortens, and below 700px the label hides while all ten parent choices share the available width.
- `study-navigation.js` synchronizes selection with the URL. Its dedicated I branch does not change F/G hash handling.
- Renderers call `studyNavigation()`. The helper includes the client script.
- Run `node previews/homepage/sync-study-navigation.mjs` after changing navigation markup. It updates only marked navigation blocks in the local study files.

F3 remains an archived visual study, with its inaccurate settings sheet clearly identified as unsuitable for product reference.

## I — product composition and artwork

I keeps the original card stack alongside all four product studies, independently of its two retained artwork choices:

- `?view=stack`: Card stack, the default. The unqualified `i.html#i15` URL also opens this original design.
- `?view=focus`: 1 Close-up.
- `?view=explore`: 2 Explore.
- `?view=rhythm`: 3 Rhythm.
- `?view=editorial`: 4 Editorial.
- `#i15`: Sage, the default artwork.
- `#i21`: Mint.

The five composition links and separate Artwork: Sage / Mint links share one compact desktop row. On phones they form two short rows beneath the parent navigation; the composition row scrolls horizontally when needed so every label stays readable. Earlier art IDs are removed from this active comparison UI; their assets and archive status are handled separately. The eighteen-choice strip, previous/next buttons, count and overview shortcut are no longer shown.

Changing composition preserves artwork; changing artwork preserves composition. Links remain usable without JavaScript and from archived `i2.html`, `i3.html` and `i4.html` pages. On the active `i.html` page, ordinary clicks update history without navigating or scrolling vertically. Modified clicks retain ordinary browser behavior. Arrow Left/Right and Home/End select within the focused group, using `focus({preventScroll:true})`.

After a local selection, the navigation dispatches `i-preview-change` with `detail: {view, art}`. An artwork change additionally dispatches `hashchange` for compatibility with the art controller. Native back/forward updates both selected groups through `popstate`; the hero controller can listen to those same events. Unspecified or invalid view/art values default to Card stack/Sage. Selected composition links are revealed by changing only the horizontal strip's scroll position; the page stays in place.

No production or live-site files are changed by the comparison navigation.

