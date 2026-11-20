# I — minimal illustration studies

Built-in image generation, 2026-10-23. Four new text-free illustrations; each refined once to reduce the tree group. No CLI/API fallback. The former detailed riverbank is retained as an archive and is no longer displayed in I.

## Saved assets

All files below live in `previews/homepage/illustration-studies/i-minimal/`.

| Choice | Desktop | Phone crop |
| --- | --- | --- |
| I1 · Hills | [hills.webp](hills.webp) | [hills-mobile.webp](hills-mobile.webp) |
| I2 · Willow | [willow.webp](willow.webp) | [willow-mobile.webp](willow-mobile.webp) |
| I3 · Lake | [lake.webp](lake.webp) | [lake-mobile.webp](lake-mobile.webp) |
| I4 · Meadow | [meadow.webp](meadow.webp) | [meadow-mobile.webp](meadow-mobile.webp) |

Desktop artwork is 2172 × 724. The phone crop uses left 900, top 0, width 1272, height 724, resized to 1000 × 569. WebP quality 92. No creative image edits outside the image tool; only encoding and cropping. `assets.json` records exact source and output paths. `prepare-i-minimal.mjs` recreates these delivery assets.

## Prompt set

The exact generation prompt for each scene is the following common prompt followed immediately by its scene paragraph.

### Common prompt

Use case: stylized-concept.
Asset: a text-free decorative panoramic illustration for the lower edge of a minimalist Villow app homepage. Artwork only, no website layout.
Format: very wide 3:1 image, approximately 2400 by 800.
Visual language: extremely clean, simple, friendly cartoon illustration with smooth carefully shaped contours and broad flat colour areas. Gentle flat two-tone gradients only. Think refined illustrated app onboarding art, not a painting, not realism, not abstract art.
Composition is strict: upper 70% uninterrupted solid pale blue-white #f2f9fa sky. Low landforms only in the bottom 25%. A small tree group, if specified, sits at the extreme RIGHT edge and reaches no higher than the bottom 35%. A small pale cream sun fully visible low on the right, not behind central text area. Left and centre must stay very open so real HTML headlines and product cards dominate.
Palette: only pale blue-white #f2f9fa, pale mint #d9eee5, celadon #add6c3, muted teal-green #6eac95, and pale cream #fff0bc. Trunks may use the same muted teal. No extra accent colours. Gradients can interpolate these shades very gently, without dramatic shading.
Absolutely avoid: detailed leaves, individual needles, branches within foliage, grass, shrubs, flowers, pebbles, grain, paper texture, brushwork, watercolor, realistic bark, haze, glow, sun rays, mountains, birds, buildings, people, paths, UI, lettering, logos, watermark, a thick forest, complex scene detail. No repeated geometric cones or amorphous abstract blobs. A few recognisable, naturally proportioned cartoon forms. No more than about 12 large shapes overall.
Scene variation: 

### Hills

Three asymmetrically rolling, softly overlapping hills. At the far right, two small stylized evergreen trees of different heights. Their evergreen silhouettes have just a few softly stepped outward branches, graceful proportions, simple trunks, and no internal detail. Smooth illustrated shapes, a gentle colour transition within the closest hill. Classic airy nature landscape with excellent restraint.

Initial output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-9bda3357-3d85-4e8e-a3b4-82014622a66f.png`
Final output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-92b44a59-f895-4fb1-98f5-ae03d7850512.png`

### Willow

Two low curved riverbanks with a wide simple ribbon of pale water between them. One small stylized willow tree at the far right: a slender curved trunk with two forks and five broad hanging leaf-cluster silhouettes making a graceful drooping crown. Each cluster is a single clean shape without veins, tiny leaves or stippling. The tree is recognizable as a willow while beautifully simple. Very few landforms.

Initial output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-92a176f9-7d52-4b3f-a7a8-c08bf5d5b812.png`
Final output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-425d3be4-3141-485f-b65a-3fbd1ffda639.png`

### Lake

A broad still lake occupying the low bottom edge, with two clean flat water-colour bands. One very low rounded island at the far right with a small pair of slender stylized conifers. One pale distant bank, no reeds, no bush shapes, no detailed reflections. The calm open water and exceptionally sparse forms make this composition lighter than a rolling-hill landscape.

Initial output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-b718ce18-b89f-4452-ae00-5ad7980ee0e0.png`
Final output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-842eb7a5-724f-4737-902d-47c80acf86d9.png`

### Meadow

Two broad smooth sloping meadows at the bottom edge. A small grove of three simple deciduous trees at the far right, with slender single trunks and clean gently lobed rounded crowns at different heights. One solid shape per crown, minimal overlapping two-tone shading, no individual leaf detail or small bush shapes. Soft, charming, recognisable cartoon trees with generous space all around them.

Initial output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-1fb4be60-8e1d-48ef-a8ea-6130028e70d0.png`
Final output: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-8d4184d0-d70f-4301-9eee-818c2d8d6141.png`

### Exact refinement prompt

Each initial output was supplied as the sole edit target with this identical prompt:

Use case: precise-object-edit. Input image is the edit target.
Change ONLY the tree group: reduce the entire tree group to approximately HALF its present width and height, anchored at its existing ground level, and tuck it toward the extreme right edge. Preserve the tree type and clean cartoon style. The tree group should feel like a small understated detail of this wide landscape, not a focal point. Keep the roots touching the same hill or bank. Do not shrink or move the sun.
Preserve everything else: exact 3:1 panoramic framing, sky, horizon, hill/bank/water contours, existing limited colours, gentle flat gradients, smooth clean shapes, lightness and all open space. No added detail, grass, shrubs, leaves, textures, branches, words or objects. No painting effects. All other pixels/composition should remain as close to the original as possible.

## Integration and checks

- Select I1–I4 under I in the common study bar: `i.html#i1` through `#i4`.
- Hash changes swap only preloaded, equal-size decorative pictures after decode. Text, cards, saved choices and scroll position persist. Native back/forward selection is supported. No art transitions or new feature demonstrations.
- Every scene uses the same pale sky, muted mint/teal and pale cream palette, with broad flat gradients, simple recognizable trees and no detailed shrubs or painted grass.
- Artwork stays at the bottom edge with proportional subjects; mobile has a separate right-side crop below the card stack. The component is aria-hidden, empty-alt and pointer-inert.
- The original `Your feed / Your boundaries / Your time` controls and saved-video grid are restored. The rejected terms section is not loaded. J is not used for this iteration.
- Desktop art selection, saved-state preservation, back navigation and the 320px phone crop/nav were checked in the browser. The restored tabs work, no page overflow was found, and the page still contains only two main sections.
