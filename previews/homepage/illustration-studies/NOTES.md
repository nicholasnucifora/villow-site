# G — artwork and verification

These three illustration studies were generated with the built-in image generation tool and integrated into a local hero plus one following section. The text is real HTML, not generated lettering. The current Villow logo and Varela Round font are used. The source site, its existing configuration change, and earlier previews are untouched.

## Final artwork

All source images were generated under `C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/`.

| Study | Original filename | Workspace copies |
| --- | --- | --- |
| G1 · Quiet banks | exec-4726c3e0-4520-42d3-8d35-af37e3ab4093.png | g1-quiet-banks.png / .webp |
| G2 · Willow & paper | exec-2f0006cf-817d-49ce-9191-62624508ad6f.png | g2-willow-stem.png / .webp |
| G3 · A clearer view | exec-fb54c872-86a1-47d2-a263-c5e17eb0f765.png | g3-open-window.png / .webp |

PNG copies are unchanged. WebP files are format conversions preserving alpha. The precise generation prompts are in [PROMPTS.md](PROMPTS.md).

Correction after the user's feedback: the G2 “Weekly” control was not faithful to the native interface. It has been replaced with a clearly illustrative “Add to Watch Later” example. Earlier generation prompts remain as provenance; they are not product specifications. The F3 image is also flagged as an inaccurate archived concept.

## View and iterate

Open http://127.0.0.1:4399/g.html. Hashes `#g1`, `#g2` and `#g3` open a particular illustration. The same copy, action, typography and following section stay in place across all three.

Edit `g.html`, `g.css` and `g.js` in the parent directory. No render step is needed. The existing local server serves the assets.

## Verification

- Real Varela Round resolves for the header and headline.
- All three illustrations load with alpha.
- Exactly two main sections.
- Image switching and illustrative control visibility checked.
- Desktop, tablet and phone widths checked at 1440, 768, 390 and 320 CSS pixels.
- Desktop and phone captures inspected in `../qa/`.
- JavaScript syntax checked. No production build, deployment or publication.

