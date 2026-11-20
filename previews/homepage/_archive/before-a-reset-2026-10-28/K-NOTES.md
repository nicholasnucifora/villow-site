# K — channel-filtering demonstration

Local iteration: http://127.0.0.1:4399/k.html#your-choices

Baseline: http://127.0.0.1:4399/i.html?view=cinema-cloud-cat#i15

K replaces only the following tabbed controls section with one title-filter example. Cloud cinema, its rating, Watch Later and the social section are retained. The user explicitly clarified that the rating should remain unchanged. I remains available in the shared navigation, with a direct comparison link in K. Nothing was published.

## Verified product behaviour

The actual app implementation was read before building. The chosen setting is **Title filter → Must exclude**, restricted to one phrase for this demonstration.

- `C:/Users/Nebula PC/Development/disconnect/src/components/ChannelFilterEditor.tsx:570`: real mode names and meaning.
- `C:/Users/Nebula PC/Development/disconnect/src/components/TitleFilterTermsInput.tsx:10`: outer whitespace is trimmed; empty phrases are rejected.
- `C:/Users/Nebula PC/Development/disconnect/api/sync.ts:2759`: the feed compares lowercase titles and phrases using literal `String.includes`.
- `C:/Users/Nebula PC/Development/disconnect/src/utils/filterUtils.ts:56`: matching channel-page predicate.

An excluded phrase matches anywhere in the title, without case sensitivity. It is not regex, whole-word matching, or livestream detection. An empty phrase means no title restriction. The demo immediately applies edits to its single phrase; the full app's add/remove phrase editor and other controls are intentionally omitted. No scheduling or unimplemented capability is implied.

## Example and presentation

Slow Sunday is an explicitly labelled sample channel. Four sample titles reuse the existing garden, pasta, shelf and mountain thumbnail assets. Starting phrase `live` excludes the two titles containing `LIVE`/`Live`; garden and shelf reach the feed. The sample channel remains visibly followed throughout.

All four uploads remain visible for comparison. Matching text is highlighted; excluded thumbnails are subdued and have an explicit “Left out of your feed” decision. The count and decision states update immediately. Reset example restores the meaningful `live` starting state. These are local demonstration choices, with no account writes or video playback.

Desktop uses four readable upload columns; tablet uses two; phones use thumbnail-and-title rows. Controls retain 44px targets, and reduced motion disables the restrained transitions. Screen-reader result announcements are debounced separately from immediate visual changes.

## Files and preservation

- `k-filter-data.js`: sample data and the supported matching predicate.
- `k-filter.mjs`: server-rendered meaningful starting state.
- `k-filter.js`: safe text highlighting and live interaction.
- `k-filter.css`: scoped demonstration and K comparison styling.
- `render-k.mjs`: copies the current I output, replaces exactly one controls section, and asserts that hero and lower content remain byte-identical. It never writes to I.

The shared navigation gains K. A small default-view hook in `i-product.js` lets K open Cloud cinema directly without changing I's existing default or selected views.

Regenerate with:

```sh
node previews/homepage/sync-study-navigation.mjs
node previews/homepage/render-k.mjs
```

## Verification

Checked default, case variation, a different phrase, an empty phrase, all excluded, no matches, literal regex-looking input, outer spaces and Reset. Seventeen model assertions also covered substring matching and repeated highlighting. Browser checks at 320, 390, 768, 1280 and 1440 CSS pixels found no page overflow or clipped titles; images loaded and input/reset targets measured 46/44px. An 80-character unbroken phrase wraps safely.

Comparison links correctly return to the original three-tab I page and back to K. Watch Later and social remain present, and their markup plus all hero markup match I exactly. Syntax/render passed, HTTP returned 200, and no browser console warnings/errors were found. Captures and check results are saved under `qa/k-filter-*`. Production files and the live homepage were not changed.
