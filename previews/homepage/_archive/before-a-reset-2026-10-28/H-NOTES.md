# H — connected choices prototype

A local coded opening and one connected Watch Later section. It tests whether a visitor's choice near the top helps explain the experience when the same video appears below. Saving is the connective interaction, while the copy also introduces finite feeds, chosen boundaries, channel filters, viewing limits and optional reflection after watching.

## Scope

- Sample data and shared state within this page only.
- Three feed videos and one initial Watch Later example.
- No playback, account flow, backend or app changes.
- The live website and production sources remain untouched.
- No new generated artwork. Video imagery is taken from the user's supplied Villow screenshots.

## Verified product language and behavior

Checked read-only against the current app in `C:/Users/Nebula PC/Development/disconnect/`:

- `src/components/VideoCard.tsx`: Add to Watch Later, Remove, outlined clock/trash SVG paths, right-save / left-hide swipe directions.
- `src/components/VideoFeed.tsx`: saving and hiding remove the feed tile; Undo restores the original position.
- `src/pages/WatchLater.tsx`: Remove from Watch Later does not put a video back into the feed.
- `src/utils/thumbnailHoverActions.ts`: neutral circular action surfaces.
- `src/utils/themeColors.ts`: light primary #2d6f6b, background #f6fbf8, text #102e3a, border #cfe5df and dark colors.
- Site `src/components/Logo.astro` and `public/fonts/VarelaRound-Regular.ttf`: real mark and header type.

The desktop prototype keeps the clock and bin visible to make the sample discoverable. It does not claim that its simplified layout is a literal screenshot. The mobile deck can be browsed without making a choice using Next video.

## Interaction

Saving immediately updates both Watch Later counts and the list below. A short local animation points toward the saved indicator. It never animates a card down the whole page or automatically scrolls after a choice.

Remove hides a video from the feed. Removing a saved video clears it from Watch Later without returning it to the feed. Undo restores the previous state and original feed order. Reset restores the initial examples. The state intentionally resets when the page is reloaded.

Right swipe saves; left swipe hides. Native buttons offer the same actions. Reduced motion skips the animated handoff and card movement. Keyboard Undo returns focus to a restored action.

## Asset provenance

`assets/c-thumb-garden.webp`, `c-thumb-mountain.webp` and `c-thumb-pasta.webp` are existing crops from the supplied home screenshot.

`assets/h-thumb-shelf.webp` is a format-preserving crop of `assets/home-light.webp`: left 281, top 720, width 535, height 300. The thumbnail's illustration and duration remain as captured. All titles and channel names describe sample content.

## Navigation and prior corrections

All A–H studies use `study-navigation.mjs`, `study-navigation.css` and `study-navigation.js`. F and G each show three variants in a second row. Parent and variant selection are synchronized, including G's section jump. The legacy C/D header offsets remain 42px on desktop and 40px on phones.

G2's Weekly selector was removed and replaced with an illustrative save action. F3's earlier raster settings sheet is explicitly flagged as an inaccurate archived visual concept.

## Verification

- All A–H links checked in browser at 320px: eight main choices, correct selection, no horizontal overflow.
- F1/F3 and G2/G3 variant selection checked; G2 remains selected after How it works.
- H checked at 320, 390, 768 and 1440px: no horizontal overflow, two main sections, real Varela Round and loaded product images.
- Save, Remove, original-order Undo, Watch Later removal, both empty states and Reset checked.
- Right-save and left-hide gestures performed on the 390px layout.
- Keyboard Save and Undo checked; focus returns to the restored video action.
- Empty-state copy verified when both the feed and Watch Later are clear.
- Browser error log empty. JavaScript syntax checks passed.
- Desktop, phone, saved-result and nested-navigation captures inspected in `qa/`.

## Iterate

Edit `h.mjs` for markup, `h.css` for styling, `h.js` for interactions and `h-data.js` for samples/shared card markup. Then run:

```sh
node previews/homepage/render-h.mjs
```

The existing local server serves http://127.0.0.1:4399/h.html.

