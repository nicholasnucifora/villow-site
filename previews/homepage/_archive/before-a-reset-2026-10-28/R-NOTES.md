# R — shared social colour and clearer reflection

Local preview: http://127.0.0.1:4399/r.html#good-company
Comparison: Q remains in the shared navigation and the preview footer. All older options remain available. Production is untouched.

## Changes

- A full-width warm peach chapter groups Good videos. Good company. and Watch together. The final experiment invitation keeps its own sage backdrop. The social copy/recommendation demo is preserved.
- A new transparent cartoon illustration has a curly-haired woman in terracotta rather than the hero's teal-haired woman. Both viewers face the enlarged central display. On phones the art gains vertical space rather than cropping faces.
- The ending question is larger, with thumbs in the lower portion of the display and a quieter named-response row below. Both people initially show an unrated dash. After1.8seconds of visible completion, sample friend Alex chooses Worth it. Pending time pauses while offscreen/hidden; replay before the decision cancels/restarts it. Once made, the choice persists through replay, as does the visitor's optional vote. The six-second cat, play/pause and scrubber remain.
- Whole-number graph readouts retain smooth pointer movement. Daily app time follows the actual trailing30-calendar-day average; worthwhile uses the latest30 decisive ratings. See R-INSIGHTS-NOTES.md for source audit and calculation checks. The active Disconnect agent was also asked a read-only calculation question; implementation was verified directly in source.

## Assets and scope

Generated with the built-in image_gen tool. Exact prompt, input and source are in R-ART-PROMPT.txt; project PNG/WebP in assets/r-shared-friends.*. prepare-r-art.mjs performs copying and lossless encoding only.

render-r.mjs starts from Q and asserts the hero, feed, limits, existing recommendation markup and closing copy remain identical. Changes are limited to charts/shared room and social presentation. Existing Q is read without modification except its shared comparison navigation gaining R.

## Verification

- Seven widths320,390,768,1024,1280,1440,1920: no horizontal overflow; question/buttons/names do not overlap;44px thumb targets; social colour spans the page; artwork loaded.
-28 chart cases: all four views at those widths, one active chart, fitting tooltip, integer values, no fractional day labels. Curve tooltip stays10px above the point; weekday bars remain categorical.
- Browser confirms initially unrated You/Alex, delayed Alex choice, opposing You vote and persistence through replay. Syntax and renderer preservation checks pass. Calculation/curve and fake-clock checks recorded by implementing agents.
- Proof: qa/r-social-desktop.png, qa/r-together-mobile.png, qa/r-viewing-desktop.png, qa/r-verification.json. No publication/deployment.

Regenerate: node previews/homepage/render-r.mjs

Playback QA also caught a click-to-pause issue inherited from Q: the play/pause SVG was being replaced on every animation frame, which could remove the pointer target between press and release. R updates that icon only when playback state changes. Browser verifies Play→playing and click→paused reliably.
