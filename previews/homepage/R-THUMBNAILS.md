# R social thumbnail refresh

Created with the built-in `image_gen.imagegen` tool. The dog is a background-focused edit of Q's dog image. The active comedy thumbnail is a human dancing in a homemade cardboard costume; the earlier goose/bread trial below was rejected and is retained only as history. No CLI/API fallback was used. Q, the source reference assets and earlier presets remain unchanged.

The selected PNGs were encoded to WebP with Sharp at quality 88, with no cropping, resizing, retouching or compositing.

## Current R assets

- `assets/r-video-dog-v1.webp` — 1672 × 941, 25,408 bytes, opaque.
- `assets/r-video-comedy-v2.webp` — 1672 × 941, 21,404 bytes, opaque. Human comedy scene, replacing the rejected goose/bread trial. See the v2 prompt below.

## Earlier trial retained for history

- `assets/r-video-mischief-v1.webp` — 1672 × 941, 23,860 bytes, opaque. Rejected by the user; do not use in the active preview.

## Selected source PNGs

- Dog: `C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-af5222db-f06f-45a5-a667-aa03ef8a6d03.png`
- Mischief: `C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-e3212eaa-0ae8-4253-84db-1c898c5ed011.png`

## Dog prompt

```text
Use case: precise-object-edit.
Asset type: small supporting video thumbnail for the calm Villow homepage.
Input image 1 is the EDIT TARGET: the existing golden-brown floppy-eared dog. Keep the dog itself, its normal anatomy, head tilt, expression, scale and simple rounded matte illustration style unchanged.
Change only the background: replace the pale cream with an opaque, full-bleed solid muted slate/sage-blue, approximately #b5c7c8. The background must clearly separate this image from a warm off-white webpage. Keep a very subtle grounding shadow in a darker blue-grey tone.
Keep the dog warm golden brown with cream muzzle/chest and broad simple shapes; no added fur, outlines or fine detail. Recompose only enough to give a landscape 16:9 image, with the full dog visible centrally and breathing room. The dog should fill about two thirds of the image height, not become tiny.
No room, furniture, other objects, decorative marks, text, numbers, play symbols, UI, borders, logos or watermark. This is image artwork only, not a video player mockup. Do not add a vignette, cream edge, white margin or fading background.
```

## Comedy prompt

```text
Use case: illustration-story.
Asset type: very small supporting comedy-video thumbnail for the calm Villow homepage, displayed roughly 200 pixels wide.
Input images are STYLE REFERENCES ONLY: the existing dog and the Villow streak calendar. Match their friendly simple broad rounded matte shapes with restrained soft shading. Do not reproduce their subjects, interface, calendar, phone, checks or other objects.
Subject: one cheeky white goose holding an absurdly oversized golden-brown baguette crosswise in its orange beak. The long baguette is clearly much too large for the small bird. The goose is mid-waddle, with a comically self-satisfied deadpan sideways glance. This is one instantly legible, slightly mysterious comic moment from a funny video, rather than a restful lifestyle scene.
Composition: landscape 16:9, full-bleed opaque solid muted warm clay/peach background, approximately #d6b3a0, giving the ivory goose a clear silhouette. Show the whole bird and baguette with generous breathing room. The simple subject and bread together occupy about two thirds of the image width. Tiny grounding shadow only.
Style: sparse calm cut-paper-like illustration, smooth and matte, only two or three broad tones per shape, very little detail. Readable at thumbnail size. Normal goose anatomy, two webbed orange feet, one simple wing shape, tiny dark eye; the beak holds the middle of the single baguette. The loaf has only a few broad diagonal scores, no crumb texture.
No scenery, room, extra props, people, speech bubbles, exclamation marks, motion streaks, sparkles, typography, numbers, UI, controls, play symbol, frame, logo or watermark. No photorealism, glossy toy rendering or fine feathers. No vignette, white edges or fade to cream.
```

## Original trial inspection (before user rejection)

Both selected outputs were inspected before encoding. The dog preserves the existing friendly seated silhouette with a clear opaque blue-grey backdrop. The new thumbnail shows an amused, waddling white goose with an absurdly long baguette; the single unexpected gag reads as a funny clip rather than a relaxation video. Both retain broad matte shapes and restrained shading. Neither contains text, player controls, play icons or a frame.
+
## Comedy v2 — human robot dance

Generated with the built-in `image_gen.imagegen` tool as a completely different human comedy scene after the goose/bread thumbnail was rejected. The dog asset was left unchanged. References: `assets/r-video-dog-v1.webp` and `assets/m-streak-boundaries-gold.webp`, both style-only. The final PNG was encoded with Sharp at quality 88 with no resizing, cropping, retouching or compositing.

Selected source: `C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-4a8ff9fd-4a05-4484-8e45-1decb76b5252.png`

Final asset: `assets/r-video-comedy-v2.webp`.

```text
Use case: illustration-story.
Asset type: one small comedy-video thumbnail for the calm Villow homepage, displayed about 200 pixels wide.
Input images 1 (dog) and 2 (calendar) are STYLE REFERENCES ONLY. Use their broad simple rounded matte shapes and very restrained soft shading; do not draw dogs, animals, calendars, phones or app UI.
New subject: a grown adult doing a goofy, awkward little robot dance in a homemade cardboard robot costume. This must plainly be a real person in a silly costume, not a robot character. The adult's smiling human head with short dark hair is visible above a simple boxy cardboard torso. Ordinary forearms and two simple hands emerge from the short cardboard arm holes; one hand points out sideways, the other is bent at the elbow. Two normal trousered legs and socked feet come out below the torso; one knee is raised a little in a stiff dance pose. Keep anatomy natural and the cardboard costume physically plausible.
The torso is one large warm-brown cardboard box, with just three simple colored circle decorations on its front and clear open holes for the head, arms and legs. No intricate robot machinery, silver foil, wires or lots of details. The comic moment is the person's confident dance in the clumsy box costume.
Composition: landscape 16:9, entire figure visible and centred, about two thirds of the frame height. Full-bleed opaque muted clay-pink backdrop, approximately #d7b9ae, clearly distinct from a warm white webpage. One small soft grounding shadow. Generous quiet space around the figure. This is a video still illustration, not an icon, poster or detailed scene.
Style: sparse matte cut-paper-like illustration with friendly rounded forms, two or three broad tones per shape. Tiny simple face, no fine fingers, clothing folds, paper corrugation, tactile grain or realism. The funny silhouette should read instantly at thumbnail size.
Avoid animals, food, bread, any bird, any sofa or reclining person. No room, furniture, stage, audience, captions, typography, numbers, logos, watermarks, controls, play icons, player frame, speed lines, sparkles or comic punctuation. Do not fade the background to white or cream.
```

Inspection: one normal adult with two arms, two hands and two legs, in a physically plausible oversized cardboard torso, one knee raised and one arm pointing. The broad box silhouette and playful dance are understandable at small scale. Simple background, minimal costume decoration, no animals, food, scenery, typography or fake player controls.


