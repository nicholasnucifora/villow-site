# Villow homepage comparison

[V · Your kind of watching](http://127.0.0.1:4411/v.html#your-control) is the latest direction: one illustrated watcher at a time beneath a centred heading about control. The channel gardener, Shorts fan, curious browser and evening planner use simple symbolic illustrations matching the supplied hero art. Stories fade together, with four selectable markers, a pause button and reduced-motion support. Rebuild only V with `node previews/homepage/render-v.mjs`. The shared `serve-r.mjs` server includes V on port 4411; R and earlier saved pages remain unchanged.

Latest control-section alternatives, served together on port 4411:

- [S · Choose your way](http://127.0.0.1:4411/s.html#your-control) — centred heading with three manual illustrated examples.
- [T · Three possibilities](http://127.0.0.1:4411/t.html#your-control) — all three examples visible, with no interaction.
- [U · A day your way](http://127.0.0.1:4411/u.html#your-control) — illustrated workday/weekend choices, without characters.

Run `node previews/homepage/render-control-studies.mjs` to rebuild S/T/U from saved R, then `node previews/homepage/serve-r.mjs` to serve the current preview family. R and earlier saved pages are preserved. Their shared preview bar gains S/T/U through progressive enhancement.

The older B–D setup below is retained for historical context.

Three local previews share the comparison bar:

- **B · Shared switch** — the accepted, detailed homepage. Its content and composition are preserved.
- **C · Focused story** — a shorter alternative based on the attached editorial feedback, using the same visual identity and interactive feed.
- **D · Balanced story** — C's clear opening with the illustrated devices chapter, sharing and watch-together in one peach section, four broader app-pattern comparisons and an unboxed concepts invitation. The new Usage and controls pair shows usage and limit editing in the main interface, with more customization available. Repeated captions are removed, the daily allowance uses a compact progress bar, and the closing is a direct invitation to try Villow. Setup details are left to Get Started.

Open http://127.0.0.1:4399/d.html to see the latest alternative. B and C remain in the top bar. The server root opens B. All navigation links open the top of the chosen page.

From the project root:

```sh
node previews/homepage/render.mjs
node previews/homepage/serve.mjs
```

No install or production build is needed. `VILLOW_PREVIEW_PORT` can override port 4399.

`a-source.html` is the accepted source for B. `comparison-variants.mjs` adds its compact shared comparison switch. `focused-story.mjs` derives C without editing the accepted source. C's additions are scoped in `focused-story.css` and `focused-story.js`; shared illustrations and feed/cinema behavior retain their existing files. `balanced-story.mjs` builds D from C and the original device, shared-watching and comparison sections, with scoped `balanced-story.css`. `usage-comparison.mjs` supplies D's fourth comparison pair. Run the renderer after markup changes, then refresh the browser. CSS/JS edits need only a refresh. Restart the server after changing the active navigation list.

C leads with “YouTube, with a stopping point.” The finite feed follows the hero, then a combined boundaries/reflection section, one personal-note sharing example, a single streak contrast, practical setup answers, and “Make watching work for you.” The five-part limits carousel, extra graph tabs, device chapter, full shared-watching scene and extra comparisons are omitted from C rather than moved into hidden panels. D restores the user's preferred selling points with tighter spacing and simpler copy. Its comparison labels explain that examples come from different social and video apps. D's closing says “Try Villow” and describes its finite YouTube feed and chosen limits. The concepts invitation remains intentionally inactive in all three versions.

Validation:

```sh
node previews/homepage/qa/verify-comparison-options.mjs
```

This checks B/C preservation, accessible references and local assets across all three pages, each alternative's intended structure, and the three-version navigation. Historical layouts remain private under `_archive`; old inactive preview URLs redirect to B. Nothing in this folder publishes or changes the production homepage.
