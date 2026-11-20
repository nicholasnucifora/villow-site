# T — people-led discovery and an illustrative swipe cue

Preview: http://127.0.0.1:4399/t.html#watch-with-people
Feed: http://127.0.0.1:4399/t.html#feed-to-watch-later
S, R and every earlier option remain in the shared navigation. This is a local comparison; production unchanged.

## Social introduction

A short centered introduction starts the existing peach social chapter before Good videos. Good company. and Watch together. It connects friends' recommendations and shared viewing with laughter, conversation and different perspectives. It does not promise a reduction in polarization. The two existing demonstrations and their copy/behavior are unchanged.

Source: t-social-intro.mjs/css. The intro is left-aligned on phones for natural reading.

## Stack decision

Keep the fanned stack and clear Remove / Watch Later buttons as an interactive illustration. The kicker now explicitly says Interactive illustration / Sample videos. It represents sorting a finite selection, without presenting the layout as the app's literal interface.

The actual Disconnect agent confirmed the current implementation, independently of the local audit:
- VideoCard.tsx:103 wires touch-left to hide/remove from Home and touch-right to Watch Later. Both remove the card from the current feed; the app supports Undo.
- Desktop thumbnails show clock/trash actions at the top right on hover. The metadata ellipsis is a different menu. See VideoCard.tsx:404,525 and thumbnailHoverActions.ts.
- mobileViewport.ts:8 uses mobile/tablet device and coarse-pointer detection. touch-card-swipe.css hides those hover controls on swipe-enabled cards.
- useCardSwipe.ts uses a72px commit and icon/tint feedback; MobileSwipeTutorial.tsx teaches directions with noncommitting practice.

The homepage already supports drag/swipe actions with its own64px threshold. n-feed.js and every action, exit/reshuffle animation, saved list, completion and replay remain unchanged. The accessible buttons stay available in the illustration. No extra screenshot-style app menu was invented.

## Cue

Narrow or coarse-pointer layouts show quiet direction labels plus See a swipe. A preview nudges the top card right/left without saving, removing, promoting or mutating its inline transform. A single automatic nudge is available on coarse input; reduced motion stays static initially. An explicit preview is small8px movement under reduced motion,30px normally. Any real input, focus, resize, offscreen/hidden state or preference change cancels practice motion. Busy/completed stacks are guarded and completion hides the cue.

See T-SWIPE-NOTES.md for component checks. Sources t-swipe-cue.mjs/css/js are isolated additions.

## Verification

- render-t.mjs verifies S remains unchanged, existing hero/limits/insights/social/closing markup byte-identical, and feed markup differs only by cue and illustration label. All action modules reused unchanged.
- Eight widths320,390,600,760,768,1024,1440,1920: no horizontal overflow, one introduction before both social examples, cue fits and keeps44px preview target, both card actions retained.
- Browser: explicit preview leaves all five cards, saved list and card inline styles unchanged. Real right drag saves garden; left drag removes mountain. A button action interrupts preview cleanly. Completion hides cue; replay restores five cards and initial saved sample. Keyboard save forwards focus to the next card's Save action. Console warnings/errors empty.
- Syntax checks pass. Proof: qa/t-social-desktop.png, qa/t-feed-mobile.png, qa/t-verification.json. No deployment.

Regenerate: node previews/homepage/render-t.mjs
