# Q thumbnail refresh

Created with the built-in `image_gen.imagegen` tool, using the existing calendar and phone as style references. The reference artwork and all P assets were left unchanged. Each subject was generated independently. No CLI/API fallback was used.

The selected PNGs were encoded to WebP with Sharp at quality 88, with no cropping, resizing, retouching or compositing.

## Saved assets

- `assets/q-video-dog-v1.webp` — 1586 × 992, 21,788 bytes.
- `assets/q-video-rest-v1.webp` — 1586 × 992, 22,106 bytes.

Both are opaque, landscape 16:10 scenes with pale cream backgrounds. They are intended to remain supporting thumbnail images, not visual focal points.

## Reference files

- `assets/m-streak-boundaries-gold.webp`
- `assets/m-streak-return-clean.webp`

The old `assets/i-thumb-rest.webp` was also inspected to understand the relaxed-video subject, but was not supplied to generation.

## Selected source PNGs

- Dog: `C:/Users/Nebula PC/.codex/generated_images/01a18ab7-4fb8-7e50-8e3e-b1e918462c32/exec-bf4a6a99-7fe1-4a58-bae6-03c29dedb975.png`
- Rest: `C:/Users/Nebula PC/.codex/generated_images/01a18ab7-4fb8-7e50-8e3e-b1e918462c32/exec-7b7264d7-addb-4778-a595-c98611d83cc8.png`

## Final dog prompt

```text
Use case: illustration-story.
Asset type: a very small supporting video thumbnail for the calm Villow homepage, intended to be displayed about 200 pixels wide. This is an image inside a tiny player, not the hero artwork.
Input images: references 1 and 2 (Villow calendar and phone) are STYLE REFERENCES ONLY. Do not draw a calendar, phone, streak, flame, checks, controls, borders or any of their content.
Style: match the reference's friendly rounded simple forms and muted warm palette, but simplify further. A quiet cut-paper illustration with barely dimensional edges, just two or three broad tones per shape. Smooth and matte, deliberately sparse. No outlines, no tactile texture, no fur, no fine detail, no shiny toy rendering, no intricate shadows.
Composition: landscape 16:10, full-bleed solid warm pale-cream background; entire subject visible centrally, only roughly half the frame width and height, with generous blank space around it. Gentle grounding shadow only. No room, scenery, extra objects, decorative marks, sparkles or patterned background.
No typography, no numbers, no play symbol, no UI, no logo, no watermark. Low contrast, small and unassuming.
Subject: one friendly golden-brown floppy-eared dog sitting with a slight inquisitive head tilt, rounded normal anatomy, two front paws and two hind paws, a simple dark nose and tiny friendly eyes. Broad sandy terracotta body, deeper brown ears, cream muzzle/chest. Keep the dog a clear silhouette with very simple quiet shapes; no props. Sweet, not babyish or grotesque.
```

## Final rest prompt

```text
Use case: illustration-story.
Asset type: a very small supporting video thumbnail for the calm Villow homepage, intended to be displayed about 200 pixels wide. This is an image inside a tiny player, not the hero artwork.
Input images: references 1 and 2 (Villow calendar and phone) are STYLE REFERENCES ONLY. Do not draw a calendar, phone, streak, flame, checks, controls, borders or any of their content.
Style: match the reference's friendly rounded simple forms and muted warm palette, but simplify further. A quiet cut-paper illustration with barely dimensional edges, just two or three broad tones per shape. Smooth and matte, deliberately sparse. No outlines, no tactile texture, no fur, no fine detail, no shiny toy rendering, no intricate shadows.
Composition: landscape 16:10, full-bleed solid warm pale-cream background; entire subject visible centrally, only roughly half the frame width and height, with generous blank space around it. Gentle grounding shadow only. No room, scenery, extra objects, decorative marks, sparkles or patterned background.
No typography, no numbers, no play symbol, no UI, no logo, no watermark. Low contrast, small and unassuming.
Subject: one simple adult person reclining lazily across a small sage-green two-seat sofa, head relaxed toward the left armrest and socked feet propped over the opposite armrest, an understated humorous relaxed pose. Muted terracotta shirt and dark desaturated green trousers. Simple normal anatomy and blank minimal facial features, no visible fingers or fine details. Only the person and sofa; no extra objects or room. The silhouette and pose must read instantly when small.
```

## Inspection

Both selected outputs were inspected before conversion. The dog has a readable head tilt, ordinary seated anatomy and broad colour areas; it contains no player UI, text or props. The sofa scene has one relaxed person, one sofa and a blank background, with no room decoration or tiny contextual objects. Both use a restrained light edge/shadow treatment rather than the highly detailed rendering rejected in earlier experiments.

