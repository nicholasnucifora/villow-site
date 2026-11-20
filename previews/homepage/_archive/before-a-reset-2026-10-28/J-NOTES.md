# J — a quiet clearing

Local preview: http://127.0.0.1:4399/j.html

J is a close companion to refined I. It uses exactly the same working copy, CTA, Villow mark and Varela Round type, five-card interaction, completion, controls explorer and connected Watch Later list. It changes the composition through warmer paper tones, a faint mint clearing behind the cards, a larger and flatter front card, a quieter fan and slightly different spacing.

The renderer calls `renderI({version:'J'})`. Shared interaction, imagery and product grounding are documented in `I-NOTES.md`. There are no new product claims, artwork generation, account flows or playback. Production and earlier studies remain unchanged apart from shared preview navigation.

## Verification

- Browser inspections at 320, 390, 768 and 1280px: no horizontal overflow, ten navigation choices and two main sections.
- Both save and remove gestures performed at phone width; saved choices carry to Watch Later.
- Same shared completion/replay behavior as I, reviewed in source. Shared reduced-motion branch observed.
- Sun geometry stays within the hero and clear of the hills/card at narrow widths; final desktop and phone captures saved under `qa/j-*`.
- JavaScript syntax checked. No production build or deployment performed.

## Iterate

`j.css` contains only J overrides. Shared markup, landscape and interactions live in `i.mjs`, `i-landscape.mjs`, `i-landscape.css`, `i.js` and `i-data.js`. Use:

```sh
node previews/homepage/render-j.mjs
```
