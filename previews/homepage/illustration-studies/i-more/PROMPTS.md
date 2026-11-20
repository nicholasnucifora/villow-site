# I — ten further illustration studies

Built-in image generation, 2026-10-23. Ten new text-free illustrations, with no CLI/API fallback. Original Hills (I1) and Meadow (I4) assets are retained untouched. Willow (I2) and Lake (I3) are archived and removed from the active picker; legacy deep links still resolve them.

## Review

- All twelve active illustrations: http://127.0.0.1:4399/art-overview.html
- Hero context: http://127.0.0.1:4399/i.html
- Each thumbnail in the overview opens its corresponding hero. The I picker has horizontal scrolling, previous/next controls, a position counter and a grid overview link. Only the scenery changes.

## Saved assets

All new files below are in `previews/homepage/illustration-studies/i-more/`.

| Choice | Desktop | Phone |
| --- | --- | --- |
| I5 · Pine grove | [pine-grove.webp](pine-grove.webp) | [pine-grove-mobile.webp](pine-grove-mobile.webp) |
| I6 · Long valley | [long-valley.webp](long-valley.webp) | [long-valley-mobile.webp](long-valley-mobile.webp) |
| I7 · Sunlit ridge | [sunlit-ridge.webp](sunlit-ridge.webp) | [sunlit-ridge-mobile.webp](sunlit-ridge-mobile.webp) |
| I8 · Paper hills | [paper-hills.webp](paper-hills.webp) | [paper-hills-mobile.webp](paper-hills-mobile.webp) |
| I9 · Blue distance | [blue-distance.webp](blue-distance.webp) | [blue-distance-mobile.webp](blue-distance-mobile.webp) |
| I10 · Round grove | [round-grove.webp](round-grove.webp) | [round-grove-mobile.webp](round-grove-mobile.webp) |
| I11 · Forest edge | [forest-edge.webp](forest-edge.webp) | [forest-edge-mobile.webp](forest-edge-mobile.webp) |
| I12 · Open meadow | [open-meadow.webp](open-meadow.webp) | [open-meadow-mobile.webp](open-meadow-mobile.webp) |
| I13 · Warm light | [warm-light.webp](warm-light.webp) | [warm-light-mobile.webp](warm-light-mobile.webp) |
| I14 · Twin pines | [twin-pines.webp](twin-pines.webp) | [twin-pines-mobile.webp](twin-pines-mobile.webp) |

The two retained choices remain at `../i-minimal/hills.webp` / `hills-mobile.webp` and `../i-minimal/meadow.webp` / `meadow-mobile.webp`.

Desktop artwork is 2172 × 724. Every phone crop is 1272 × 724 resized to 1000 × 569. Crop left=900 for right-hand compositions and left=0 for Twin pines, preserving its left tree group. Some peripheral decorative elements are intentionally absent from phone crops. Encoding is WebP quality92; no creative changes outside the image tool. `assets.json` records each exact original PNG path and saved output path. `prepare-i-more.mjs` reproduces the encoding/crops without touching earlier assets.

## Exact prompts

The complete prompt for each study is its batch's common prompt followed immediately by its specific variation paragraph below.

### Common prompt A — I5–I9

Input image was solely a loose style reference: `C:/Users/NEBULA~1/AppData/Local/Temp/codex-clipboard-5d210cf1-ffdb-41a1-9dab-c2196a86daf2.png`.

Use case: stylized-concept.
Asset: a text-free panoramic illustration for the shallow bottom edge of Villow's minimalist homepage. Artwork only; no webpage mockup.
Reference role: the attached screenshot is a LOOSE STYLE REFERENCE for the natural silhouettes and soft mint gradients only. DO NOT reproduce its text, logo, interface, video cards, mountains, numerous tiny trees, or complicated terrain.
Format: very wide 3:1 panorama, approximately 2400 by 800. Upper 65% is uninterrupted nearly solid pale blue-white #f2f9fa. Land occupies the bottom 20–25%. A SMALL but well-defined tree group at the extreme right can reach into the bottom 30%, leaving the left and middle empty for real HTML text and a product card stack.
Style: polished, clean cartoon illustration. Recognisable nature. Smooth confident contours, broad flat areas, gentle two-tone gradients within the hills. No brushwork or grain. The appeal should come from excellent silhouettes, natural proportions, elegant landform geometry and restrained colour, not detail. Trees should be a little more pronounced than tiny generic symbols: a few gently swept branch tiers, a visible slender trunk, one or two simple shaded green planes. Do not turn trees into repeated cones, drooping blobs, or detailed botanical drawings.
Palette: very limited pale mint #dcefe6, celadon #acd8c7, soft teal #78b69f, evergreen #4b937c and pale cream #fff0bc, over #f2f9fa sky. Gentle gradients interpolate these shades. Trees can be deeper than the hills without becoming dark focal points.
Terrain: at most THREE broad asymmetric hill layers, each with one clear rise or dip. Organic, softly varied contours. No jagged distortions, narrow wiggly ribbons, repetitive sine waves, tiny undulations, distorted terrain, or confusing intersecting layers. At most three trees unless the scene explicitly says otherwise. A small pale sun may sit low on the right, fully visible and clear of the tree crowns; never a bright focal point.
Avoid absolutely: text, UI, cards, lettering, logos, watermark, grass, shrubs, flowers, leaf/needle detail, many little trees, textured surfaces, realistic landscape painting, glows, dramatic light, complex mountains, busy scenery, 3D render.
Specific variation: 

### Common prompt B — I10–I14

These five were generated without image inputs to explore a wider range of compositions.

Use case: stylized-concept.
Asset: a text-free panoramic illustration for the shallow bottom edge of Villow's minimalist homepage. Artwork only; no webpage mockup.
Format: very wide 3:1 panorama, approximately 2400 by 800. Upper 65% is uninterrupted nearly solid pale blue-white #f2f9fa. Land occupies the bottom 20–25%. A SMALL but well-defined tree group at the extreme right can reach into the bottom 30%, leaving the left and middle empty for real HTML text and a product card stack.
Style: polished, clean cartoon illustration. Recognisable nature. Smooth confident contours, broad flat areas, gentle two-tone gradients within the hills. No brushwork or grain. The appeal should come from excellent silhouettes, natural proportions, elegant landform geometry and restrained colour, not detail. Trees should be a little more pronounced than tiny generic symbols: a few gently swept branch tiers, a visible slender trunk, one or two simple shaded green planes. Do not turn trees into repeated cones, drooping blobs, or detailed botanical drawings.
Palette: very limited pale mint #dcefe6, celadon #acd8c7, soft teal #78b69f, evergreen #4b937c and pale cream #fff0bc, over #f2f9fa sky. Gentle gradients interpolate these shades. Trees can be deeper than the hills without becoming dark focal points.
Terrain: at most THREE broad asymmetric hill layers, each with one clear rise or dip. Organic, softly varied contours. No jagged distortions, narrow wiggly ribbons, repetitive sine waves, tiny undulations, distorted terrain, or confusing intersecting layers. At most three trees unless the scene explicitly says otherwise. A small pale sun may sit low on the right, fully visible and clear of the tree crowns; never a bright focal point.
Avoid absolutely: text, UI, cards, lettering, logos, watermark, grass, shrubs, flowers, leaf/needle detail, many little trees, textured surfaces, realistic landscape painting, glows, dramatic light, complex mountains, busy scenery, 3D render.
Specific variation: Composition variation is encouraged: the scene-specific positions below override the default far-right group when explicitly stated. All artwork must still stay low, quiet, minimal and out of the upper/central product area. 

### I5 — Pine grove

A clean evolution of the reference: three simple low mint hills and a small group of two clearly drawn evergreens at the far right. Each pine has a different graceful outline with just three or four gently curved branch tiers, visible trunks, and subtle two-plane shading. A restrained sunny, fresh green palette. The hills are broad and sculpted rather than perfectly wavy.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-f066a42b-1f28-421c-a11a-0d40e3c174c2.png`
Phone crop left: 900.

### I6 — Long valley

Explore a broad open valley. One foreground slope descends very gently from the left into a wide low centre, and a second broad slope rises at the right. A very pale distant hill gives depth without mountains. Two slender, slightly asymmetrical evergreens stand at the far-right crest. The opening in the valley and elongated hill contours carry this composition. Quiet gradients show distinct hill planes.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-b17ee0a7-3ce4-4839-9cae-4c714b5f51bb.png`
Phone crop left: 900.

### I7 — Sunlit ridge

Two broad rounded ridges with a gentle warm-cream-to-mint gradient on their upper slopes, and one almost invisible pale background bank. A small pale sun is entirely visible low toward the right. Three restrained evergreen silhouettes of differing heights sit at the far-right edge, spaced enough to read separately. Keep the warmth subtle and keep the sky blue-white. No sunbeams, glow or yellow wash.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-85e656f5-8b2a-4e5f-b523-8520abeb1f8b.png`
Phone crop left: 900.

### I8 — Paper hills

A graphic interpretation with three carefully composed overlapping landforms resembling smooth cut paper, but absolutely no paper texture, drop shadows or 3D rendering. Slightly crisper clean contours and very broad two-tone gradients. Two handsome small pines at the far right use simple curved tier silhouettes with a single darker side plane. Off-centre hill peaks and an open centre give a deliberate composition.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-6856081e-8a8c-49e9-9957-481f5c57f9e3.png`
Phone crop left: 900.

### I9 — Blue distance

Cool atmospheric depth expressed with only three flat illustrated layers: one very pale blue-mint distant low ridge with two softly angled contour changes, one celadon hill, and one mint-green foreground bank. No pointed mountains. A restrained pair of deeper teal-green evergreens at the far right is clearly readable. A tiny pale cream sun. The distant ridge nearly blends into the sky so the result stays airy and quiet.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-c45a6b78-47a3-4539-a06f-bb6e3eb64894.png`
Phone crop left: 900.

### I10 — Round grove

Three small deciduous trees at the far right, rather than pines. Their individually shaped rounded crowns have just two or three broad softly lobed masses and a restrained darker side plane. Visible slender trunks with at most one fork. Natural differing heights, clearly readable silhouettes, no tiny leaves or detailed shrubs. A pale distant bank and two long overlapping meadows with a gentle sea-glass gradient.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-b23c0b92-7d68-483d-b068-72e9ccd265f3.png`
Phone crop left: 900.

### I11 — Forest edge

Frame a very open landscape with only THREE conifers total: one small slender pine at the far LEFT edge and two at the far RIGHT edge. The middle remains almost empty over two broad low hills. Tree heights occupy only the bottom20% of the image. The trees have elegant softly stepped silhouettes and a tiny darker side plane. No forest line or extra small trees. A small cream sun sits low near the right group. This should feel like sparse nature around the edges, not an elaborate scene.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-80e89030-18a9-40d7-9116-c71d25a8ddee.png`
Phone crop left: 900.

### I12 — Open meadow

One single beautiful small broad-canopied tree at the extreme right, with a slightly bent visible trunk and a clean asymmetrical rounded crown. The crown has only two large gently overlapping green shapes, no internal details. Only TWO low hill layers: a broad pale mint foreground field sloping gently downward toward an expansive open centre, and a very faint distant sage hill. Less layered than the other studies, still clearly recognizable and charming. A tiny pale sun near the right, with generous breathing room.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-c331877f-7145-4100-81d7-d24f4b0e318a.png`
Phone crop left: 900.

### I13 — Warm light

Explore a warmer gentle daylight treatment: two pale sage-green meadows with a restrained cream-to-mint gradient near their upper edges. Keep the sky exactly pale blue-white, not yellow. Place a small pale cream sun LOW ON THE LEFT, above the low foreground field; the upper left stays completely empty. A modest pair of soft evergreen trees at the far right has a slightly warmer eucalyptus green. Only three broad land contours, no rays, glow, mist, texture or pink/orange colours.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-b4ad151f-e135-424f-bc60-cec689f30acb.png`
Phone crop left: 900.

### I14 — Twin pines

A deliberately different composition: two elegant evergreen trees at the FAR LEFT BOTTOM edge, NOT on the right. Both are small enough to remain entirely within the bottom22% of the image, with unequal heights, visible slim trunks and three graceful gently swept branch tiers. One simple darker side plane, no detailed branches. Their roots sit near the lower edge. Three softly sloping mint hills open broadly to the right, with off-centre peaks and smooth broad gradients. A tiny pale cream sun LOW ON THE RIGHT. The upper65% and central area remain empty.

Source: `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-dfce1ef4-b39b-49bc-b997-8fb1ef0f6815.png`
Phone crop left: 0.

## Scope and checks

The homepage copy, Varela Round font, logo, five-card stack, transitions, CTA, original lower controls and Watch Later grid were not redesigned. All work remains under `previews/homepage/`, outside the production build. Every new illustration was visually inspected before integration.

Browser checks cover twelve active choices, one visible decorative picture, decoded desktop/phone sources, next/previous, native Home/End, hash back navigation, preserved card/saved state and vertical scroll, and no page overflow at1280/320px. A real pointer click and native keyboard navigation retain the page position. The overview shows all twelve cards in the desktop viewport; each links to its matching hero hash. Screenshots live in `qa/i-more-*` and `qa/i-art-overview.png`.
