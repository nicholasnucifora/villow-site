# V — finite selection, optional sorting

Exports renderVFeed() from v-feed.mjs. Load v-feed.css after the existing feed styles, and replace the n-feed.js script with v-feed.js. Retain t-swipe-cue.js/css: the rendered component includes its markup and all original ifs-* hooks. T and old source files are untouched.

## Meaning

A feed you can finish is the main explanation. The copy says people can watch from the feed and save only if they want to. Five dots with a visible End of selection marker make the bounded selection apparent initially. The quieter Watch Later side area is explicitly Optional; the arrow bridge is hidden.

Browse the sample Previous/Next arrows explore the illustration without watching, moving or removing any video. Earlier cards remain in the DOM, hidden/inert while not current; future cards remain fanned behind the front card. Previous returns to the same video. At the last item, the card remains visible, Next disables and the neutral The end of this selection message appears. There is no completion approval for browsing.

Optional Remove/Watch Later actions still change the example feed and saved list. Their swipe directions, whole-card exit and same-node promotion are retained. Actual empty state says No videos left in this sample and retains replay. The original full sorting demonstration remains available in T.

There is no fake watch button or fabricated video clip. Cloud cinema already demonstrates playback. The sample navigation is labelled as an illustration control, not presented as the app's actual carousel interface.

## Implementation

v-feed.js exports a small createVFeedState model, used by the live DOM code. It keeps a logical array and cursor separate from a saved Set. Browsing only moves the bounded cursor. Saving/removing operates on the current item, preserving prior unacted-on items. Removing the last item selects the preceding remaining item, and empty/reset states are explicit.

Normal optional-action motion keeps620ms whole-card exit then300ms settle. Reduced motion keeps320ms fade then200ms gentle settle. Sample navigation uses a120ms departure fade in normal motion and240ms settle; reduced motion uses200ms settle. No automatic sample browsing is added.

Browser hooks: data-vf-demo/count/position, data-vf-previous/next, data-vf-position/total/dots/end, and unchanged data-ifs-* action/stack/list hooks. All navigation controls are44px targets. Keyboard navigation keeps focus on an enabled sample arrow; action focus follows the next current card or neutral empty heading.

## Verification

Both JS modules pass syntax checks. Node state checks pass for bounded next/back, last-card retention, unchanged feed/saved state after browsing, save/remove at a nonzero cursor, rejecting action on a noncurrent card, removing the last item, unsave, complete empty state, replay/reset, and160 repeated browse transitions. Render checks verify five cards, one pair of browse controls, one touch cue, balanced div structure and no confetti.

Parent performs integrated browser/responsive checks and proof captures.
