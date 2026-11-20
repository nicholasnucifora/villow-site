# E — Keep the videos. Lose the rabbit holes.

Local preview: http://127.0.0.1:4399/e.html

This study contains the opening section only. It tests a communication idea: show the same sample videos in a recommendation environment and a viewer-chosen finite subscription feed. It is static, with no animated transformation or simulated app controls.

Two differences lead the composition:

1. What enters the feed: recommendations versus channels the viewer chooses.
2. Where the feed ends: further suggestions versus a maximum feed size the viewer chooses.

The main video and the other sample videos are identical on both sides. Desktop uses enlarged selected details inside illustrative interfaces. On phones, both views retain the same featured video, the source label and the continuation/ending cue; incidental interface chrome and extra video rows are omitted for readability. The caption explicitly says the screens are simplified illustrations and that the number shown is an example. The feed ending says viewers can watch, save or skip, so it does not imply completion is mandatory.

## Grounding

Villow's finite subscription feed, viewer-chosen maximum size, chronological order and channel selection are documented in `src/content/pages/features.yaml`, under `feed`. Watching, saving and skipping are documented under `sorting`.

The YouTube side is specifically a recommendation surface, not a claim that all YouTube modes are uncontrolled. YouTube also offers subscriptions and recommendation controls. Its [official explanation of recommendations](https://support.google.com/youtube/answer/16089387?hl=en) describes recommendations on the homepage and in Up Next. The study makes no claim that autoplay is mandatory; [YouTube's autoplay documentation](https://support.google.com/youtube/answer/6327615?hl=en) explains that it can be switched off.

The illustration uses only supplied Villow sample thumbnails and titles. It is not a literal screenshot, and does not invent users, testimonials, outcomes, availability or video statistics. No new image generation was used.

## Iteration

Edit `e.mjs` / `e.css`, then run `node previews/homepage/render-e.mjs`. All five previews use `study-navigation.mjs` / `study-navigation.css` for the comparison rail.

Earlier-study refinements in this pass are limited to complete A–E navigation and allowing D's tree tips to render beyond its cropped SVG viewport. The earlier compositions, copy and controls are retained. Production source, hosting configuration and the live homepage were not changed.

Verification: E was checked in-browser at 320, 390, 600, 601, 768, 900 and 1440 CSS pixels with no horizontal overflow, one main section and no console warnings or errors. Its static HTML has no scripts. All A–E navigation links and local asset references resolve, and each of the three sample videos occurs once per side. D's SVG overflow repair was checked at 1920 pixels. Screenshots are saved in `qa/e-desktop.jpg`, `qa/e-mobile.jpg`, `qa/e-mobile-comparison.jpg` and `qa/d-clipping-fix.jpg`.
