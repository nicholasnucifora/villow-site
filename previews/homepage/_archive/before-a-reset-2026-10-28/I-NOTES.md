# I — card stack and real product studies

Local preview: http://127.0.0.1:4399/i.html#i15

## Current Cloud cinema refinement — 29, 2026-10-24

Latest polish: removed Reset at the user's request. The completion question and larger thumbs now form a centred group above the progress bar. Replay uses the existing scrubber; the other playback, pose and rating behavior is preserved.

**29 Cloud cinema** is the user's current favourite. Its illustration is about 23% larger on desktop and uses the available width on phones. The finite cat sample is now six seconds. Its progress bar is a real scrubber: mouse and touch can seek, while keyboard arrows, Home and End move through the sample. The bar remains available at completion so seeking backwards can return to the video. Cat breathing is tied to the playback timeline through `--ig-elapsed`, keeping pause and seeking consistent.

The person watches the projection during playback, moves into the original thoughtful pose only at an unrated ending, and returns to watching once a thumb rating is selected. Three registered generated poses support an approximately 0.72-second softened transition. A feathered CSS mask confines these changes to the person; the original cloud, projector, beam and screen frame remain stationary. Reset stays inside the screen at the end. All other studies, the original 26, Sage/Mint, and the lower sections remain available. The other five cloud scenes also use the shorter clip, scrubber and wider phone layout; their artwork is unchanged.

Pose assets, exact generation prompts and raw paths are recorded in [I-CINEMA-POSE-ART.md](I-CINEMA-POSE-ART.md). Current verification: Cloud cinema checked at 320, 390, 768, 1024, 1280 and 1440px with all end-card content inside its frame, no overlapping controls and no page overflow. All six scenes' compact controls checked at 320px. Native pointer dragging from the end returns to a paused cat frame; Home, End and PageUp seek correctly, and the breathing frame matches elapsed time. Rating changes the person back to watching; Reset and six-second playback were checked. `overflow:clip` prevents keyboard focus scrolling the miniature screen internally. Results and screenshots are in `qa/i-cinema-pose-*`. Syntax/render passed. Records below describe earlier passes.

## Cloud cinema illustrations — 29–34, 2026-10-24

### Playback and reflection inside the screen

Queried the Disconnect chat **Suggest Villo homepage hero concepts** and checked the current `CompletionPrompt`, `WorthIcon.tsx` and `playlist-autoplay.css` read-only. The end card now uses the exact question “Was this video worth your time?”, positive thumb first, the same Bare hand path, outline/solid states, black surface and green/red verdict colours. Play/pause is the projection itself, with a hover/focus overlay. The finite clock pauses with playback. The requested Reset sits at the bottom of the screen, clears this local sample and restarts it. There are no controls or rating pills below the illustration.

This is a condensed showcase: ratings stay selected on the projection for inspection, without saving to an account or navigating away. The actual app normally completes and returns after a solo rating; its replay action is called Restart. No help link or Not sure option was added to this completion prompt. Small screens condense the two thumbs and Reset to a single bottom row of 24px icon targets; full question text remains visible. Keyboard Enter/Space, focus transfer at completion, and Reset work inside the screen.

Screen-control verification: at 320, 390, 768 and 1280px, all end-card targets remain inside the projection, are at least 24px, do not overlap and cause no page overflow. Browser checks confirmed the 12-second completion, frozen progress while paused, keyboard playback, green/red selected fills, Reset clearing local choices and returning focus to playback, and removal of the external buttons. Proof: `qa/i-cinema-screen-*`; geometry results: `qa/i-cinema-screen-checks.json`. Syntax and render passed.

Option 26 is the preferred direction. Six additional scenes retain its spare human illustration style while grounding the person and projector on a low cloud. All earlier designs remain accessible, including the unchanged original 26, the original default card stack, and options 27/28. There are now 39 unique I views. Sage and Mint remain selectable.

The **Compare illustrations** picker shows original 26 and all six new scenes together. Selection preserves the landscape and closes the picker; Escape returns focus to its summary. The new gallery uses a fixed base artwork and a separate cat image inside the screen. Gentle breathing runs for 12 seconds of active, visible viewing, pausing offscreen or when another view is selected. Only the picture fades at completion, revealing a dark screen and “Worth your time?”. Reflection is optional, neutral, skippable and replayable. Reduced motion starts still; “Play animation” explicitly opts into this finite sample.

Source: `i-cinema-gallery.mjs/css/js`, `i-cinema-comparison.mjs`, catalog/render/navigation integration. Art briefs and saved paths: `I-CINEMA-GALLERY-ART.md`; exact sibling prompts: `I-CINEMA-SIBLING-ART.md`.

Verification: all six scenes checked at 320, 390, 768 and 1280 CSS pixels, with loaded assets, contained screens, no horizontal page overflow and 44px interaction targets. Desktop/mobile comparison reviewed; Mint preservation, Escape, playback, 12-second ending, reflection selection, Skip, Replay and keyboard Finish focus checked. No browser warnings/errors. Syntax/render/synchronization pass. Captures and responsive results: `qa/i-cinema-*`. Production and lower sections were not changed.

## Latest refinement — 26–28, 2026-10-24

Consulted the disconnect app chat **Suggest Villo homepage hero concepts** at the user's request. Its central recommendation was to make the person directing their watching visible, and to show reflection as an open judgment rather than a smile or a success check. Three new studies keep the same left copy, CTA and Sage/Mint landscapes:

- 26 `agency-cinema`: a viewer holds the remote to a small projector. Pausing the illustrative scene retracts the beam and offers neutral optional reflection, including Skip. Keyboard Tab reaches those answers after the pause control.
- 27 `agency-line`: a hand places a stopping point around a frameless video illustration. One button moves between three whole-session examples; the video is never trimmed.
- 28 `agency-record`: a fine chosen boundary surrounds a fixed viewing trace. A neutral reflection annotates the record; the recorded geometry never changes.

The lower Home feed stack now matches the original fan, full card contents, front-card styling and alternating back-card rotations. Buttons and left/right swipes use the original 620 ms exit and 300 ms node promotion. Completion uses the original sprout and small confetti burst. Reduced motion uses an opacity exit and skips transform promotion. Watch Later and Good videos. Good company. remain below.

There are now **33 views** (the original five plus 28 concepts), grouped in the same comparison navigation. None were removed. New art assets and built-in generation prompts are documented in `I-AGENCY-ART.md`.

Verification: all three new studies at 320, 390, 768 and 1280 pixels, image loading, 44-pixel button heights, no page overflow, reflection/skip/clear, fixed trace, keyboard Tab after pause, actual right-swipe save and left-swipe remove, stack completion/replay. Proof images: `qa/i-agency-*.png`. Production and live homepage unchanged.

## Earlier refinement — 13–20, 2026-10-24

Eight additional hero takes, **13–20**, respond to the request for a cleaner visual that supports the unchanged left paragraph. They use recognisable video compositions, chosen inputs, finite sequences and optional pause/reflection cues. They avoid the earlier folio, tray, shutter and bookmark metaphors. There are no explanatory captions beneath the new illustrations. The below-illustration captions on the first set are also removed from the visible hero; the earlier choices and their deep links remain.

At this stage the comparison contained **25 views**: the original default stack, four real-interface studies, twelve first takes and eight quieter takes. The **13–20 · Quieter takes** / **01–12 · First takes** tabs keep each set accessible, while **Jump to…** lists every view. Arrow/Home/End navigation stays within the visible view group. Sage and Mint remain independent, and the original stack's choices remain mounted while switching.

New query keys: `quiet-focus` (13 One clear view), `quiet-edit` (14 Choose your mix), `quiet-pace` (15 Set your pace), `quiet-sequence` (16 A clear ending), `quiet-desk` (17 Your viewing space), `quiet-pause` (18 Leave a little room), `quiet-thread` (19 A lighter journey), `quiet-stack` (20 A quieter stack). Append `#i15` or `#i21` for artwork. These are conceptual local samples, not replicas of the app's interface; the adjustable pause point is a symbolic illustration, without minutes, quotas or a claimed automatic viewing plan.

**Good videos. Good company.** is now a refined lower section directly after **Your time. Your choices.**, before the original stack's Watch Later library. It adds one example recommendation and personal note, grounded in the verified friend recommendation mechanism. The original 08 hero is retained. The existing controls were not redesigned. `#good-company` is a direct section anchor, and the desktop comparison bar has a Company jump that preserves the current artwork selection.

New sources: `i-quiet-first.mjs/css`, `i-quiet-last.mjs/css`, shared `i-quiet.css/js`, and `i-company.mjs/css`. The illustration helper continues to reuse actual supplied product thumbnails. No artwork image was replaced or generated. All changes stay local under this preview directory.

Checks for this round: all eight new scenes rendered at 1280px desktop and 390px phone widths. At 320px, all eight had no page overflow, their images loaded, and every sample control had a target height of at least 44px. Choosing videos, toggling mix inputs, adjusting the pause marker with the keyboard, optional reflection and pause/resume/sample-next actions were exercised. The company section was checked at desktop and 320px, including its lazy-loaded image and direct section anchor. It follows the unchanged controls in the DOM. Browser Back restores the earlier 08 view and Mint; End stays within the current comparison group. Switching from the original stack through the new set preserves four remaining cards and two saved videos. There are 25 view links, two artwork choices, no duplicate IDs and no browser warnings/errors. Syntax and render checks passed. Captures are saved as `qa/i-quiet-*` and `qa/i-company-mobile.png`.

## Previous direction — 2026-10-23

The original interactive **Card stack** remains I's first and default composition. `i.html#i15` and `i.html?view=stack#i15` open it with Sage. It keeps the accepted original headline, supporting copy, buttons and stack artwork. The four product studies and twelve new conceptual right-hand studies remain beside it with stable query URLs. No earlier composition was removed or hidden from the comparison navigation.

The preferred I15 Sage sunrise remains unchanged. The supplied mintier version is added as I21 Mint sunrise, using the user's actual image with WebP encoding and responsive crops. No new image generation or creative image editing was used in this pass.

Four right-hand product treatments share the same landscape, Villow mark, Varela Round heading, “Watch intentionally.” headline, supporting copy and Get started action:

- **Close-up** (`?view=focus`): one enlarged native title-filter detail and a short benefit caption.
- **Explore** (`?view=explore`): manually selected Your feed / Your boundaries / Your time views, showing actual title filters, daily limits and optional reflection.
- **Rhythm** (`?view=rhythm`): native video-length and Daily/Scheduled delivery controls, framed around what arrives and when.
- **Editorial** (`?view=editorial`): native duration and title-filter details with short external annotations.

The four product studies share the paragraph: “An app for watching YouTube with a feed that ends. Choose what reaches you, set your viewing boundaries, and reflect on what felt worthwhile.” The restored stack keeps its earlier paragraph: “An app for watching YouTube with a finite feed and controls you choose. Keep what interests you. Leave room for what’s next.”

The comparison bar retains **Card stack**, **1 Close-up**, **2 Explore**, **3 Rhythm** and **4 Editorial** in its original row. Twelve new concepts have a separate row. The independent Artwork: Sage / Mint toggle works with all seventeen compositions. Changing one preserves the other. `#i15` selects Sage; `#i21` selects Mint. Missing or invalid composition queries default to Card stack. Earlier artwork choices remain outside the active UI while their files remain archived. The overview compares only the two retained landscapes.

Switching compositions hides rather than rebuilds the stack, preserving feed choices and saved videos when returning from a product study. The stack's original card transitions in `i.js` are unchanged. Both hero artwork roots are synchronized by `i-art.js`; `i-product.js` controls which hero is visible and defaults to the stack.

## Twelve new right-hand studies

All twelve reuse the existing product-study hero, exact shared “Watch / intentionally.” heading, paragraph and Get started action. Only the right object changes. The Sage/Mint image files, typography, palette, hero framing and following section are retained. The original stack keeps its earlier copy and connected library.

| View query | Concept | Visual story |
| --- | --- | --- |
| `?view=stop` | A place to stop | A finite stepped sequence, a visible end, and open space. |
| `?view=journey` | Before, during, after | One folded strip connects choosing, watching and reflection. |
| `?view=room` | Room for the rest | Video postcards give way to an open paper path. |
| `?view=shape` | The feed you shape | Viewer-chosen sources become a small personal mix. |
| `?view=programme` | Your own programme | An open viewing folio with sources and a stopping place. |
| `?view=worth` | Was it worth your time? | A comedy postcard opens into subjective reflection. |
| `?view=day` | A day with room | A bounded watching portion in a larger ribbon. |
| `?view=company` | Good videos, good company | One friend's video and personal note, chosen in the viewer's own time. |
| `?view=tray` | The finite tray | A shallow tray with an optional put-aside action. |
| `?view=object` | One object, the whole journey | One upright folding video card, a reflection flap and an open tail. |
| `?view=window` | The viewing window | A bounded opening and an optional pause shutter. |
| `?view=bookmark` | The attention bookmark | A large ribbon marks a place to put watching down. |

Append `#i15` for Sage or `#i21` for Mint. New options have a separate, fully visible navigation row on desktop and a horizontally scrollable strip on phones. Keyboard arrows, Home and End select compositions; the artwork choice remains independent. All seventeen compositions retain their DOM when switching, including the original stack's choices.

These objects are explicitly labelled conceptual illustrations with sample videos, not replicas of app screens. Existing product thumbnail artwork is reused. Titles and notes are illustrative; no new product availability, algorithms, outcomes, quotas or objective wellbeing metrics are claimed. Entertainment and music sit beside everyday interests. Friend recommendations with optional notes were verified in `disconnect/src/components/VideoRecommendationModal.tsx` (recipient selection and optional note submission); no watch-together mechanics are implied by the illustration.

Five optional local samples provide reflection choices, putting a card aside, turning paper, pausing a window and placing a bookmark. They change illustration state only, preserve that state between comparisons, and do not change an account or launch playback. Motion occurs only after a button action and is disabled for reduced-motion preferences. Buttons support touch and keyboard input; visible face changes update accessible state.

Sources: `i-concepts-catalog.mjs`, `i-concepts.mjs`, `i-concepts-shared.mjs`, `i-concepts.js`, shared `i-concepts.css`, and the three scoped `i-concepts-first/middle/last.mjs/css` pairs. `i-product.mjs/js` mounts and selects their panels. The lower section is unchanged.

## Real-interface product grounding

The four product-study heroes use cropped captures of current Villow components. They remain available as alternatives to the original illustrative card-stack demonstration, which is not a literal reproduction of the app's interface. The local fixture in `product-capture/` imports the actual app components, fonts and styles from the neighbouring app source. It uses fictional local settings, no account, in-memory storage and a Content Security Policy that blocks network connections.

`prepare-i-product.mjs` encodes eleven native UI crops: desktop and small-screen title filters, a closer title-control detail, video-length and delivery controls, daily limits, and reflection. Labels and controls are not redrawn. `product-capture/SOURCES.md` and `crops.json` document their provenance and exact crop rectangles. The controls come from `ChannelFilterEditor`, `UsageLimitEditorPanel` and `RateRecentVideos`. The unfinished ranking control is excluded.

The narrow reflection excerpt displayed on phones is the actual desktop reflection component in a narrower container. It is provided for homepage readability and does not claim to reproduce the app's phone layout. Interface images open at their captured size for inspection; they do not simulate editing app settings.

Scheduled delivery uses the shared update schedule chosen in Settings. It does not imply a separate calendar for each channel. The original lower Your feed / Your boundaries / Your time controls remain shared across all five compositions. The connected Watch Later library is restored beneath Card stack and shown only with that composition. The lower feed description retains its factual correction from a stale feed-size claim to verified Daily/Scheduled delivery.

## Archives and files

The additional `i-stack-archive.html` copy and previous `I-STACK-NOTES.md` remain available alongside the restored active stack. Its source, library, animations and historic artwork files are retained.

- `i.mjs`: the original stack hero, rendered without its following sections through `stackHeroOnly` for the shared comparison page.
- `i.js`: the unchanged original card-stack interactions and transitions.
- `i-product.mjs/css/js`: the four product treatments, manual topic selection, restored stack integration and composition visibility.
- `prepare-i-product.mjs`, `product-capture/`: actual-component capture fixture, crop preparation and provenance.
- `prepare-i-mint.mjs`, `illustration-studies/i-selected/`: supplied mint artwork and crop records.
- `i-art-data.js`, `i-art.js`, `i-illustration.mjs/css`: the two active landscapes and archived art records.
- `i-controls.*`: the retained lower controls shared across all five compositions.
- `i-library.mjs`: the connected library, visible only with Card stack.
- `study-navigation.*`: independent composition/artwork comparison.
- `render-i.mjs`: render the active page with `node previews/homepage/render-i.mjs i1`.

## Previous product-study verification

All eight composition/artwork combinations were checked at a 1280 × 800 CSS-pixel viewport. All four treatments were also checked at 320, 390 and 768px widths: product images loaded, headlines fit and no page overflow was found. All three Explore topic panels load their correct real-interface crops and expose one panel at a time. Keyboard Skip to content keeps Mint selected and focuses the main content. Browser Back restores both artwork and treatment. Product and navigation JavaScript syntax checks passed. Captures are saved as `qa/i-product-*`.

## Restoration checks

Navigation markup and JavaScript syntax checks passed with all five composition choices present. Browser checks confirmed the default stack, save/remove transitions, five-card completion and replay, connected Watch Later updates, and preserved picks after switching through Explore and Mint back to Card stack. Both artwork roots remain synchronized. The restored stack was checked at 1280px and phone widths of 319px and 390px with no page overflow. There are no duplicate DOM IDs or browser console warnings/errors. Captures are saved as `qa/i-stack-restored-desktop.png` and `qa/i-stack-restored-mobile.png`. The previous product-study checks above describe the earlier pass.

All changes remain under `previews/homepage/`. No app source, production site or live homepage was changed.

## New concept verification — 2026-10-23

All twelve new concepts were checked at 1280px desktop and 320px phone widths: no page overflow, missing images or changed CTA destinations. The twelve phone compositions were visually reviewed at 390px, with denser folded-strip/booklet/folding-card views also reviewed at 320px. A 768px tablet check confirmed the shared headline fits its column and stays separate from the right object. Desktop captures and phone captures are saved as `qa/i-concept-*`.

Reflection, putting a card aside, paper turning, window pause/reopen and bookmark pause were exercised. Keyboard activation was checked; action targets are at least 44px on phones. Browser Back restores artwork/composition; End selects the final concept. Saving an original stack card, switching through a new concept and Mint, then returning preserves four remaining cards and two saved videos. All seventeen composition links and both artwork choices remain in the UI. No duplicate IDs or browser warnings/errors were found. JavaScript syntax and the complete generated render passed. The server remains available at `http://127.0.0.1:4399`.
# 21–25: simpler journey studies and a connected lower demo

Added five further hero compositions without replacing any earlier choice. The new family is first in the comparison navigation; the original card stack remains the default.

- 21 `flow-ribbon`: O2’s continuous spread with its supporting prose removed.
- 22 `flow-triptych`: three staggered moments around one larger viewing frame.
- 23 `flow-orbit`: a large video with small choice and reflection cues.
- 24 `flow-native`: actual video-length and optional reflection interface crops around a sample video.
- 25 `flow-open`: the same left-hand copy and landscape, with no right-hand object.

The shared copy, call to action, typography, Sage artwork and Mint artwork remain unchanged. The new conceptual illustrations have no explanatory captions below them. The native controls are static images rather than live app settings.

Below Your time. Your choices., a new interactive sample places Home feed on the left and Watch Later on the right. It uses the existing five sample videos, with saving, removing, saved-row removal, completion and replay. These sample choices are independent of the original hero stack. The new lower section appears on product/concept studies; the preserved original stack retains its original connected library. Good videos. Good company. follows the new demonstration.

Verification: all five new heroes checked at 320, 390, 768 and 1280 CSS pixels; no horizontal page overflow, missing images or content outside their illustration stages. The lower demo was checked at 320 and 1280 pixels, including save/remove, keyboard focus, completion, empty list and replay. Controls have 44-pixel targets. Original stack save/library, earlier O2 access, artwork switching, unique IDs and browser logs checked. Reduced-motion handling reviewed. Proof images are in `qa/i-next-*`. Production files and the live site were not changed.

