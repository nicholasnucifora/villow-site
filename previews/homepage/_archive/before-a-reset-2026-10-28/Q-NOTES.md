# Q — smooth graph inspection and illustrated shared reflection

Local preview: http://127.0.0.1:4399/q.html#o-viewing
Shared room: http://127.0.0.1:4399/q.html#watch-together
Previous P remains available in navigation.

## Scope and preservation

Q replaces only P's chart component and watch-together section. Cloud cinema, its playback/reflection/pose behaviour, the full feed/Watch Later stack, limits/reminders and Good videos / Good company remain byte-identical. Renderer assertions verify this and verify P is not modified. Existing design choices retain visible navigation paths. The internal comparison rail hides its labels/status up to1100px to accommodate A–Q. Production and hosting configuration are untouched.

## Graph

Removed the visible measure heading, Sample data heading, caption and instructions below the chart. Top icon-led choices and axes remain. Accessible instructions/descriptions retain the meaning, optional-rating basis and sample context; hover details identify the sample and units.

Every line view uses one shared monotone Hermite curve for the drawn SVG and marker/value evaluation. Mouse inspection uses continuous x positions, minute-level clock labels and smooth interpolated values. No hourly range or nearest-point snapping. Weekday bars remain categorical. Worthwhile interpolation reports a percentage, avoiding fictional fractional rating counts. The tooltip stays10px above the point and clamps horizontally with a caret at the actual point; it never flips below a peak. Small internal headroom keeps it clear of the controls even on phones. Touch and keyboard inspection remain available; day arrows advance one minute, Shift+arrow15minutes, Home/End/Escape work.

These are illustrative interpolations, not claims of minute-resolution personal measurements. Hourly percentages keep the app's average hourly occupancy meaning. Worthwhile excludes Not sure/unrated responses.

## Shared room

New transparent raster friends replace P's SVG people. It was created with the built-in image_gen tool using the existing Cloud cinema illustration as a style reference. A targeted edit removed the baked screen so the live screen could be sized independently. Both prompts are saved verbatim in Q-ART-PROMPTS.txt.

Final project assets: assets/q-shared-friends.webp and assets/q-shared-friends.png. prepare-q-art.mjs copies the PNG and encodes a lossless WebP only, without resizing or pixel edits. The original generated file remains at its default generated_images location.

The live display matches the hero's actual cat motion: elapsed-driven3.2s breathing, including explicit play/scrub under reduced motion. P incorrectly suppressed it completely under that preference. An absolute image box also prevents the intrinsic square image from overflowing the screen. The screen/people remain registered through playback and completion.

At the six-second ending, the black screen keeps the real completion question and optional thumbs, followed by You and Alex sample room verdicts. The visitor's vote toggles/clears; Alex's fixed positive example remains explicitly labelled as a sample response. Scrubbing back clears the visitor's response and replays; no reset button is added.

Actual app supports this: disconnect/src/components/GroupWatchCompletion.tsx maps joined members to displayName and Worth it / Not worth it / Not decided yet. Only explicit room verdicts are shared; saved personal ratings stay private. The existing fullscreen tests around lines371–405 cover named Alex/Sam responses. No private history, calls or live friends are implied by this local sample.

## Verification

- All four views checked at320,390,768,1024,1280,1440 and1920CSSpixels: no document overflow, exactly one panel, tooltip fits, and a constant10px marker gap.
- Explicit keyboard check2:00pm→2:01pm moves the marker by one minute; pointer check6:01pm4.87%→6:03pm4.92% confirms continuous inspection.
- Highest daily point58minutes checked at320px: tooltip remains above/inside the plot with no position flip.
- qa/check-q-curves.mjs independently compares rendered cubic coordinates with the marker evaluator at8282 positions and checks boundedness. Maximum SVG-unit mismatch0.000475; all pass.
- Named rating layout fits at all seven widths, with44×44px thumb targets, non-overlapping question/controls/names and loaded artwork. Tested opposing You/Alex votes, clearing and scrubber replay.
- Actual reduced-motion browser confirms explicit play enables qt-cat-breath and a non-identity transform; paused sample holds. Console warning/error logs were empty.
- Syntax and renderer preservation checks pass. No publication or production build was needed for these standalone local files.

Proof files: qa/q-viewing-desktop.png, qa/q-together-rated-desktop.png, qa/q-together-rated-mobile.png, qa/q-verification.json.

Regenerate: node previews/homepage/render-q.mjs
