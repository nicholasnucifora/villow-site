# Homepage A — fresh baseline

The user selected the former X, requested retiring all earlier comparisons, and explicitly authorized deleting unused preview images/assets. A is the sole current design at http://127.0.0.1:4399/a.html.

- Markup: a-source.html. Renderer: render.mjs / render-a.mjs. Generated a.html and index.html are identical.
- One A in the rail; old comparison/footer selectors removed. Old URLs redirect to A. Private archive URLs return404.
- Cloud cinema/Sage are fixed; legacy view queries and artwork hashes cannot revive other designs.
- Removed old hidden stack/library,37 alternate hero panels and unused Mint picture. Current hero and all product sections were preserved by the trimming assertions.
- Accepted desktop layout measurements match before/after obsolete CSS removal. The original product copy and live interactions remain.
- Deleted371 unused preview files,27.84MiB, including obsolete artwork/screenshots/styles/scripts. Fifteen required image/font assets remain. Deletion paths were validated inside this preview directory; production assets were not touched.
- Runtime dependency scan reports no missing files and no remaining unused candidates. Current A proof images are retained as documentation.
- Browser widths320,390,768,1440: no overflow or broken loaded images. Mobile Sage source confirmed. Cloud playback/scrubbing/end-rating and return-to-watching work; feed saving/confirmation/promotion work. No console errors/warnings.
- Browser now has one local preview tab, A. The owned server runs on port4399.

Evidence: qa/a-final-verification.json, qa/a-cleanup-result.json, qa/a-asset-deletions.json, qa/a-hero-desktop.png and qa/a-hero-mobile.png.

Old text/source history is private in _archive, not an active or runnable comparison. Some component CSS/JS filenames retain historical letters because they are used by the current design. Future comparisons should begin at B without restoring the former series.

## Current A refinements

- Remove/Watch Later retain a pointer cursor while in flight; transient feedback below the stack is removed.
- Movement starts immediately: normal360ms exit plus180ms same-node settle; reduced160ms fade plus140ms settle. Real swipes and input-cancellation safeguards remain.
- Completion is All caught up with a single confetti burst. Reduced motion shows a quiet static scatter. No replay/reset action or automatic restart exists; the state stays finished for the current page lifetime.
- Removed visible sample/illustration badges, limits-example footer, task sample label, shared-room caption and sample suffix from chart tooltips. Playback/rating accessible wording is cleaned up as well. Future-feature status labels remain accurate.
- Replaced the inline device SVG with assets/a-connected-devices.webp. Built-in image_gen output and exact prompt are documented in A-DEVICE-ART.md. The current page now uses16 image/font assets; all required references resolve.
- Desktop/mobile checks at320,390,768,1440px: no overflow, no broken images, no visible sample labels. Checked busy cursor during an active transition, five-card terminal state, keyboard focus, real mobile swipes, chart tooltip and shared-video end screen. Current test browser used reduced motion; normal animation durations/one-shot CSS were reviewed.
- Latest proof: qa/a-feed-finished.png and qa/a-devices-illustrated-desktop.png, with mobile counterparts.

## Concepts invitation

The user narrowed the homepage again: detailed Get Involved and Community Notes previews are removed. Their former area is now a short Beyond what we can build alone invitation. It explains the limits of an independent app, the possibilities of YouTube infrastructure at scale, and principles that could apply across social media. It leads directly into the existing Together, we can build a better web closing.

Explore the design concepts is intentionally inactive for this visual review. It is a focusable link role with aria-disabled=true and no href: mouse activation and Enter do not navigate, alter the URL/hash or scroll the page. There is no placeholder page, route, popup or Coming soon message. A future request can supply the destination and enable the link.

The working streak and Things to do examples remain. No other product section changed. Desktop/mobile320,390,768,1440px checked with no overflow; both old concept demonstrations are absent, the closing remains immediately after the chapter, and mouse/keyboard inactivity was verified. Proof is qa/a-concepts-invitation-desktop.png and mobile counterpart.

The life chapter now uses three paired comparisons. See A-LIFE-COMPARISONS.md for source grounding, social-feature limits and layout verification.

The latest comparison refinement makes the engagement-first/Villow headings explicit, strengthens return-streak urgency, replaces the ambiguous video-versus-plans metaphor with matching players and different sidebars, and shows opt-in shared usage as the social accountability mechanism. See A-LIFE-COMPARISONS.md and the sharper proof files for factual grounding and six-width checks. No other homepage section changes.

Latest A pass: a contained app-like To-do list sidebar with circular controls; three recommendation thumbnails without Up next; a recognizable two-tone flame; and punchier comparison copy about return goals, effortless continuation, status and optional social accountability. Responsive evidence and research grounding are in the latest A-LIFE-COMPARISONS.md entry.

The comparison presentation is now three joined, colour-paired bands under shared topic headings. The redundant global comparison key is removed. Existing six demonstrations and their copy remain; small arrows make the familiar-pattern-to-Villow relationship explicit on desktop and mobile. Current proof and scope checks use the a-comparisons-joined filenames.

## Built-in experience message — 28 October 2026

Added a compact text bridge between the stopping-point carousel and viewing insights: Built into the way you watch. It connects checking remaining time, optional end-of-video reflection and Time Usage in the main navigation. The small placement line identifies the centre mobile control and desktop sidebar. Existing Set your own stopping point copy, all demonstrations and the later comparisons stay intact; removing the one inserted block reproduces the previous canonical source exactly.

Read-only app grounding: Header.tsx:2173–2184 puts Time usage at the centre of five mobile bottom items; Header.tsx:93–99,1828–1851 includes desktop Time Usage in the main sidebar; Header.tsx:1735–1758 has the clickable allowance ring/status; VideoPlayer.tsx:6909,9408–9415 places ratings at the video/completion. Reflection remains optional. Navigation can hide in scrolling/fullscreen/compact contexts, so the homepage avoids an always-visible promise.

Only a-source.html plus scoped A CSS changed. No new assets, controls or JavaScript. Desktop/mobile320,390,768,1440px checks show no overflow, fitting text and deliberate spacing. Proof: qa/a-built-in-desktop.png, qa/a-built-in-mobile.png, qa/a-built-in-scope.json and qa/a-built-in-verification.json. Private source backup: _archive/a-before-built-in-message-2026-10-28.html.

Current comparison layout is one continuous surface with a single, larger sticky pair of headings and full-width topic dividers. Repeated cell labels and the three separate rounded comparison boxes are gone. All six visual/copy/control payloads and the built-in-experience message remain. Evidence and mobile orientation details are in the latest A-LIFE-COMPARISONS.md entry.

## New comparison options B, C and D — 28 October 2026

A's accepted comparison layout remains the baseline. The user requested new named alternatives, so the active series now includes A/B/C/D in the shared top navigation. Every navigation link opens the comparison section directly. Wider screens show each option's descriptive name; mobile retains four clear letter links with full accessible names.

- B — Visuals first: keeps the three topic dividers, removes the six individual headlines and all arrows, then shows each illustration with its original explanatory paragraph.
- C — Messages first: removes visible topic bars, keeps the paired message headlines and moves the same paragraph directly under each headline, followed by the illustration. No arrows. Shared grid rows keep paired visuals aligned despite different copy lengths. Topic headings remain available to assistive technology.
- D — Topic rail: moves topics into a narrow left gutter on wide desktop (above1100px), removes individual headlines, and uses plain decorative arrows without circles. Narrower layouts return topics above their pairs to preserve illustration scale. Mobile uses down arrows.

Canonical A markup is untouched. comparison-variants.mjs derives B/C/D and asserts all content before x-life and from xl-concepts onward is unchanged. It also verifies all six explanation paragraphs are preserved. The shared comparison-options.css is loaded only for B/C/D. render.mjs regenerates four pages plus index(A); render-a.mjs remains an alias. The local server now serves the four active entries, while all other retired .html URLs still redirect to A. Authoring/archive resources remain private.

Verification: all four routes returned200 and the retired R route302. Baseline output matches canonical A exactly apart from the expanded navigation. Browser checks at320,390,768,1100,1440px across all four options show no overflow, fitting headers, no broken comparison images, contained player compositions, resolving accessible labels and44px task targets. Paired desktop visuals align at every checked width. B/C/D keyboard task completion and mobile sticky legend were verified; no console warnings/errors. Dependency scan retains62 runtime files and16 shared image/font assets, with no missing or unused candidates. Source checks: qa/verify-comparison-options.mjs and qa/comparison-options-scope.json. Browser evidence: qa/comparison-options-verification.json, qa/comparison-options-interaction.json, and b/c/d-comparison-desktop.png and mobile counterparts.

## Current active comparison series - 28 October 2026

The selected former B Visuals first is now the shared baseline. Only A Reveal cards and B Shared switch remain active. Their wide-screen comparison is identical to the accepted B; at max-width600px they replace stacked halves with clearly attributed, manually selectable single examples (default Villow). See the latest A-LIFE-COMPARISONS.md entry and qa/compact-comparison-*.json for scope/responsive evidence. Other homepage content and behavior are unchanged. Old A/C/D presentation sources are private archive history; do not restore or run their old render chain.
