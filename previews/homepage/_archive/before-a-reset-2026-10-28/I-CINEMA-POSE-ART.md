# Cloud cinema pose artwork

Built-in image_gen edits, 24 October 2026. Existing artwork was not overwritten. Both assets preserve the original 1774 × 887 RGBA canvas; PNG → WebP conversion only used Pillow lossless=True, method=6.

## Watching endpoint

- Workspace: `assets/i-cinema-cloud-watching-v1.webp`
- Input: `assets/i-cinema-cloud-cat.webp`
- Raw: `C:/Users/Nebula PC/.codex/generated_images/01a16c06-4983-76f1-9c95-d83924966477/exec-f0726d3f-ef5d-4287-b70a-7346d2d3eb08.png`

Exact prompt:

```text
Use case: precise-object-edit.
Asset type: registered animation pose for an existing website illustration, transparent 2:1 canvas.
Input image 1 is the EDIT TARGET. Keep its exact composition, scale, canvas dimensions 1774x887 and placement. Change ONLY the woman's head/face and her hand-to-cheek arm on the left.
Primary request: show this same dark-teal-haired woman actively watching the projection to her right, before she later thinks about it. Turn her face into a gentle right-facing three-quarter profile, eyes clearly directed to the right-hand screen, neutral engaged expression. Lower the current hand from her cheek, letting that arm rest naturally on her lap/armchair. Keep her other hand holding the remote exactly as it is, keep legs and body pose exactly as-is.
Invariants: preserve the chair silhouette, position and mint colours, woman's torso/clothes/legs/hair identity, projector, cable, projection beam, blank screen and all its supports, cloud, every object size and every object position. Do not reframe or rescale anything. The right 65% of this image must be completely unchanged. Preserve genuine transparent background and soft flat clean illustration style. No text, UI, cat, new objects, scenery or shadows beyond original. The pose change should be subtle and plausible for a smooth transition back to the provided thoughtful pose.
```

## In-between turn

- Workspace: `assets/i-cinema-cloud-turn-v1.webp`
- Inputs: original thoughtful asset and watching endpoint above.
- Raw: `C:/Users/Nebula PC/.codex/generated_images/01a16c06-4983-76f1-9c95-d83924966477/exec-411a8ba5-5fec-428f-9c27-e8d285515542.png`
- This is a brief transition pose; its hand is at upper chest height, between lap and cheek. Use only the person's region for overlays so any regenerated scene edges remain hidden.

Exact prompt:

```text
Use case: precise-object-edit.
Asset type: registered intermediate animation frame for transparent website illustration, 1774x887 2:1 canvas.
Input image 1 is the primary EDIT TARGET: thoughtful hand-to-cheek pose. Input image 2 is the same scene in the watching pose, a supporting endpoint reference. Produce ONE halfway pose between them by changing ONLY the woman's head and the hand/arm which travels between cheek and lap.
Intermediate pose: her face is angled toward the right-hand projection as in image 2, with head tilted only slightly toward the image 1 thinking pose. Her moving hand is in transit at upper chest/collarbone height, below the chin, fingers relaxed and elbow bent, naturally between lowered lap pose and cheek pose. Her other remote-holding hand must remain unchanged. Same dark teal hair identity. Keep her torso, legs, chair, all proportions and clothing otherwise exactly as in image 1.
Every other pixel/object should preserve the first reference's composition and registration: chair silhouette, projector, cable, beam, blank screen, supports and cloud. No reframing, zoom, scale, position, extra objects or scenery. Genuine transparent background, same soft clean flat shading. Right 65% unchanged. No text or UI. This will be a brief animation in-between frame, so match the subject position very carefully.
```

