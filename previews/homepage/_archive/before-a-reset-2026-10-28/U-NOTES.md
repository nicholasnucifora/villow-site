# U — a working blueprint for YouTube

Preview: http://127.0.0.1:4399/u.html
Comparison: T remains directly linked in the top rail and footer; all older choices remain available.

## Positioning

The user clarified that Villow's central purpose is a working prototype/blueprint for how YouTube could be redesigned around viewers. Intentional watching, finite feeds, personal boundaries and viewing reflection are examples of that design. The opening should establish that broader purpose and usable product, with a participation invitation, rather than relying on a feature list to communicate its identity.

U keeps Watch intentionally and the current Cloud cinema design. It adds:
- A blueprint you can use.
- A purpose-first explanation that Villow is a working example of a viewer-centred YouTube, followed by its practical controls.
- Try it, share your feedback, and help make the case for a better YouTube.

This is grounded in existing about.yaml, index.yaml and youtube-could-do-this.yaml: a working product to use, question and improve, supporting Fix the Web's broader campaign. It does not claim proven effects, platform adoption, popularity or automatic sharing of private viewing data. The invitation explicitly asks people to choose to share feedback.

## Scope

Only the current illustrated hero's copy block and its small purpose/invitation styles change. The headline, exact Get started anchor, Cloud cinema illustration/playback/poses/ratings, landscape, feed stack/Watch Later/cue, boundaries carousel, charts, social introduction/demos and final invitation remain. render-u.mjs asserts hero equality after restoring the original copy block and byte equality of all following product sections. Production files and hosted site untouched.

Sources: u-hero-copy.mjs/css and render-u.mjs.

## Verification

Seven widths320,390,600,768,1024,1440,1920: no horizontal overflow; title stays inside the hero and clear of desktop art; body precedes CTA; invitation sits below it; mobile artwork follows the copy; all fit inside the hero. Get started retains https://villow.app/download. Source preservation assertions and module syntax pass. Console warning/error log empty.

The original large headline slightly overhangs its text-column box at wide widths; it is unchanged and remains inside the hero with clear space before the artwork.

Proof: qa/u-hero-desktop.png, qa/u-hero-mobile.png, qa/u-verification.json.

Regenerate: node previews/homepage/render-u.mjs
