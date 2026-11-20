# I — card stack, minimal illustration studies

Local preview: http://127.0.0.1:4399/i.html

## Current direction — 2026-10-23

The user prefers I and asked to focus solely on its top section. Hills and Meadow are retained unchanged. Ten further illustrations explore clearer evergreen silhouettes, broader gradients, open valleys, rounded crowns, warm light and trees at different edges. Six subsequently supplied images are appended as I15–I20, with no existing options replaced. Eighteen choices now appear beneath I in one horizontally scrollable row with previous/next buttons, a counter and an overview link:

- I1 Hills: low rolling terrain and two small evergreens.
- I4 Meadow: smooth fields and a restrained group of rounded trees.
- I5–I14: Pine grove, Long valley, Sunlit ridge, Paper hills, Blue distance, Round grove, Forest edge, Open meadow, Warm light and Twin pines.
- I15–I20, supplied by the user: Sage sunrise, Soft horizon, Low sun, Morning glow, Open countryside and Green valley. The overview marks these six “Yours”.

They share a small mint/teal/cream palette, gentle gradients and open pale sky. Each has a dedicated phone crop; Twin pines preserves its left-side tree group. The new prompts, saved assets and source paths are in `illustration-studies/i-more/PROMPTS.md` and `assets.json`. Earlier prompts remain in `i-minimal/`. Built-in image generation was used. Willow/Lake are now archived choices, with old deep links retained. Earlier detailed and SVG assets remain archives.

The six supplied options use the user's actual artwork with its sage palette, broad gradients and open warm sky. They were encoded and cropped only, with no new image generation or creative editing. I18's phone crop retains its left-hand sun; the other five retain the sun and trees on the right. The two slightly taller sources lose only empty sky at the top in the desktop slot. `illustration-studies/i-supplied/SOURCES.md` and `assets.json` record the original filenames, paths and exact crop rectangles.

The original lower section is restored: horizontal Your feed / Your boundaries / Your time controls, followed by the original saved-video grid. The rejected editable-sentence section is retained only as unused source files; its CSS and JS are not loaded. J remains archived and is not the current direction.

## Behavior

- The real Villow mark and Varela Round type, hero working copy, CTA and five-video stack remain consistent across art choices.
- Each card has Remove and Watch Later actions. Right swipe saves; left swipe removes. Saved picks appear in the library below, which begins with one separate sample.
- All cards remain full, persistent articles with equal dimensions. Choosing removes only the outgoing node; existing rear nodes keep their fan angles and settle forward. They are not rebuilt, faded back in or teleported.
- Ordinary motion uses a 620ms directional exit and a 300ms settle. Reduced motion uses a 320ms dissolve and a small 200ms settle, with static confetti.
- Five choices reveal a sprout, restrained confetti, “All done.”, one short line and an icon replay control. Removed helper text and visible counters remain absent.
- Keyboard choices, replay and saved removal maintain usable focus. Rear cards are inert; controls disable during transition. Removing a saved item does not restore it to the feed.
- Selecting art changes only the decorative image. Card choices and scroll persist. Native hash back/forward and Home/End work; ordinary reload starts a fresh five-card sample. There is no account or backend connection. The review-only `art-overview.html` displays all eighteen active illustrations together and links each to the matching hero.

## Product grounding

Thumbnail images are crops of the supplied real product screenshots. Native clock/trash paths, labels and gesture directions follow the product audit in `H-NOTES.md`. The stack is an illustrative explanation rather than a literal app screenshot. The restored time panel uses the real product chart, labelled sample data. The Watch Later note retains the factual correction to current saved-age reminders; retired expiry/pinning claims were not restored.

## Files

- `i.mjs`, `i.css`, `i.js`, `i-data.js`: hero, card behavior and library rendering.
- `i-controls.*`, `i-library.mjs`: restored original following section.
- `i-art-data.js`, `i-art.js`, `i-illustration.mjs/css`: art choice map, hash handling and responsive presentation.
- `prepare-i-minimal.mjs`: WebP encoding and phone crops; no creative raster edits.
- `prepare-i-more.mjs`: the ten additional illustrations and their phone crops.
- `prepare-i-supplied.mjs`: the six user-supplied images and their responsive crops; earlier assets are untouched.
- `render-art-overview.mjs`, `art-overview.css`: compact artwork comparison sheet.
- `study-navigation.*`: shared parent row and nested F/G/I variants.

Regenerate only the active I page with `node previews/homepage/render-i.mjs i1`, then run `node previews/homepage/sync-study-navigation.mjs` when shared navigation changes. The old I2–I4 static section-layout files remain archives; their names are distinct from the new same-page art hashes `i.html#i2` etc.

## Verification

Desktop art choices, latest-request switching, one visible picture, saved-state preservation and native back navigation checked. All twenty sources (eighteen active, two archived) have valid desktop and phone assets. The six supplied phone images load at320px; left- and right-sun crops were inspected at390/320px. No page overflow at320/390/1280px. Saving a card, then changing to a supplied illustration preserves the saved pick and the remaining stack. The eighteen-card overview loads every image and marks the six supplied images “Yours”; it scrolls normally. Browser error/warning log is empty. The original lower section and card code remain unchanged. Source and JavaScript syntax reviewed. New captures are `qa/i-supplied-*`; earlier checks and captures remain available.

All changes are under `previews/homepage/`. Production and the live homepage are untouched.
