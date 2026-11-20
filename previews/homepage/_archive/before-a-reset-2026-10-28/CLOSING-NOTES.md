# Shared closing invitation — P and Q

Preview: http://127.0.0.1:4399/p.html#help-shape-web
Also present: http://127.0.0.1:4399/q.html#help-shape-web

Added one shared final content section after the product story. Copy frames Villow as an experiment in redesigning YouTube and wider social media, asks people to try it/share their experience/help shape the next steps, and repeats the existing Get started action beside Help fix the web.

The Get started markup is copied exactly from each page's existing hero, including its destination https://villow.app/download and button styling. Fix the Web uses the configured destination https://fixtheweb.org from site.config.yaml. The copy is grounded in src/content/pages/about.yaml and index.yaml; no proven outcomes, availability or automatic research-participation claims were added.

Sources: homepage-closing.mjs/css. Both render-p.mjs and render-q.mjs apply the shared helper, which replaces an existing closing rather than duplicating it when Q inherits P. No new page variant/letter or decorative artwork was needed.

Earlier complete pages are preserved as p-before-closing.html and q-before-closing.html. Both are visibly linked as Compare before closing section in the local preview footer. Browser checks verified each snapshot opens with no closing section and can return to the current preview.

Verification: after stripping only the new section, its stylesheet and local comparison link, P and Q each match the saved prior page byte for byte. Both contain exactly one closing and the exact hero action. Browser checks on both pages at320,390,768,1024,1280 and1440CSSpixels found no horizontal overflow; both actions have44px or larger targets and correct destinations. Desktop/mobile screenshots inspected, warning/error logs empty. Source syntax and existing renderer preservation checks pass.

Proof: qa/closing-desktop.png, qa/closing-mobile.png, qa/closing-responsive.json.

Only local previews changed. Production sources, hosting and the existing user edit to site.config.yaml are untouched.
