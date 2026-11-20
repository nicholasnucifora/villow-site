# P — readable patterns and shared watching

Local preview: http://127.0.0.1:4399/p.html#o-viewing

Watching together: http://127.0.0.1:4399/p.html#watch-together

O remains available at http://127.0.0.1:4399/o.html#o-viewing.

## Changes

Only the viewing illustration and synchronous watch-together section are replaced. Cloud cinema, the full animated feed/Watch Later stack, the limits/reminders composition and Good videos / Good company retain O's markup and browser modules. No production or hosting changes.

Four icon-led choices sit above one open chart. Sparse percentage/minute ticks and recognisable time/weekday labels restore meaning. Hover or tap reveals the actual nearest sample, with a guide/dot or highlighted bar. Arrow keys, Home/End and Escape support keyboard inspection, with live announcements. Tooltips remain within the plot at phone and desktop widths. Worthwhile details show the Worth it / Not worth it counts behind the sample percentage; optional ratings and excluded Not sure/unrated responses are clear. The graphs remain illustrative and preserve the app meanings audited in N/O.

The new shared-watching composition places two seated viewers around one screen on the left, with copy on the right at desktop sizes. Phones put copy before the illustration. An optional six-second shared sample supports play, pause and replay; its common timeline finishes for both viewers. No autoplay, looping, voice or video calling is implied. Playback pauses offscreen or when the page is hidden. Reduced motion avoids the cat breathing movement while retaining playback status/progress.

The tablet comparison rail now fits the growing A–P choices; all older previews retain visible navigation paths.

## Source

- p-insights.mjs/css/js and p-insights-data.js: graph rendering, shared sample data and inspection.
- p-together.mjs/css/js: new shared-screen illustration/sample playback.
- render-p.mjs: copies O, changes only those two components, verifies the hero/feed/limits/social markup remains identical and verifies O is unchanged.

Run: node previews/homepage/render-p.mjs

## Verification

All four chart views checked at 320, 390, 768, 1024, 1280 and 1440 CSS pixels. Verified one visible panel, consistent plot height, correct sample values, readable scales, selected bars, tooltip bounds and no failed assets. Final responsive checks including 1920 pixels pass after the tablet rail fix. Tested pointer selection and keyboard inspection, including endpoint samples. Browser warning/error logs were empty. The actual reduced-motion environment renders all visuals in their complete static state.

Shared sample tested through play, pause, resume and completion at 100%, with completion status and replay label. Mobile and desktop layouts inspected visually. Renderer preservation assertions and module syntax checks pass. Existing stack interaction source is reused unchanged. Nothing was published.

Proof: qa/p-viewing-desktop.png, qa/p-viewing-mobile.png, qa/p-together-desktop.png, qa/p-responsive.json.
