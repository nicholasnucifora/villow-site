# T swipe cue

Files: t-swipe-cue.mjs/css/js. Insert renderTSwipeCue() immediately after `.ifs-stack-space` inside the feed column, then load the CSS and module. Existing n-feed.js and all actions remain unchanged.

The static cue is visible on coarse-pointer devices and narrow layouts up to760px. It gives left Remove / right Watch Later directions, says the top card can be swiped or dragged, and retains the original buttons. A44px-high See a swipe button previews the gesture without sorting a sample.

On coarse input, the first65%-visible cue can trigger one short30px right/left nudge. It never dispatches an action, changes a card node, sets `.is-dragging`, mutates inline card transforms or moves back cards. Reduced motion starts static; explicit preview uses a gentle8px nudge without rotation. The cue is an illustration, not an imitation of the app's real card chrome.

Pointerdown/focus/key capture on the demo cancels cue motion before the existing feed handler runs. Offscreen, hidden-page, resize, changed input/motion preference and page-exit states also cancel. A busy or completed stack prevents previews; a completed feed hides the cue. MutationObserver tracks the stack's real busy/hidden/child state, including replay. The preview button's disabled state agrees with n-feed.js's existing all-button busy lock.

Meaningful fake-DOM/clock checks pass: once-only touch auto; no automatic motion on pointer input or reduced motion; explicit reduced preview completion; cancellation before real pointer handlers; hidden/resize/offscreen cancellation; busy/completion guards; pagehide cleanup; no inline-transform mutation. Both modules pass node syntax checks. Parent performs integrated browser checks of real saving/removing and responsive layout.

Actual app reference: Disconnect VideoCard.tsx maps left touch swipe to onSkip/hide and right to Watch Later. Desktop has top-right thumbnail clock/trash actions, and MobileSwipeTutorial.tsx teaches the same gestures through practice previews. Homepage keeps its existing accessible buttons instead of hiding actions behind hover-only app controls.
