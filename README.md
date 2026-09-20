# villow.app

The public website for Villow, a Fix the Web project. Built with [Astro](https://astro.build) as a static site, served by Cloudflare.

## ⚠️ `/privacy` is the extension's privacy policy

`public/privacy.html` is served at `https://villow.app/privacy` and is linked from the extension store listings. **Don't edit, move or rename it.** Astro copies it into the build unchanged, and `npm run build` fails if its contents change at all. If you deliberately update the extension policy, update `PRIVACY_SHA256` in `scripts/check-build.mjs` to match.

The web app's privacy content lives at `/privacy-overview` (plain-language summary) and `/app-privacy` (formal policy).

## Running it

```sh
npm install
npm run dev           # http://localhost:4321, with a theme picker in the corner
npm run build         # builds to dist/, then runs the checks
npm run placeholders  # lists everything still TBD
```

Node 22.12 or newer.

## Where things live

| To change… | Edit |
|---|---|
| Links, TBD values, images, feature status, theme | `site.config.yaml` |
| A page's copy and which sections it has | `src/content/pages/<page>.yaml` |
| The Principles essay, the app privacy policy | `src/content/prose/*.md` |
| Header, footer, small interface words | `src/content/site.yaml` |
| Colours | `src/styles/themes.css` |
| Type, spacing, radii, shadows | `src/styles/tokens.css` |
| Buttons, text, placeholders, badges | `src/styles/base.css` |
| How a kind of section looks | `src/components/blocks/<Block>.astro` |
| The logo, the tab and app icons | `public/` and `public/brand/` — see Icons, below |

Copy never lives in components, and styling never lives in content files.

### Icons

The mark comes from the Villow icon kit (version 3, 20 September 2026), whose master copy lives in
the design repo — it is handed over and installed here, never kept as a folder in this repo.
The tab and app icons are the files in `public/` (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
`icon-*.png`, `safari-pinned-tab.svg`, `site.webmanifest`), wired up by the five `<link>` tags in
`src/layouts/Base.astro`. The logo in the header is `public/brand/villow-mark-*.svg`, drawn by
`src/components/Logo.astro`, which picks the light or dark palette from the visitor's system setting.

The three brand SVGs are three different drawings, not one scaled: `villow-mark-*` above 32px,
`villow-mark-small-*` at 21–32px, `villow-mark-micro-*` at 20px and under. `Logo.astro` picks by its
`size` prop. Keep the filenames as they are, don't add other favicon tags, and don't recolour, resize
or re-export any of the files. If a size is missing, ask for it rather than making it.

`/privacy` is a hand-written file and has no icon tags of its own; browsers fall back to
`/favicon.ico` there, which is correct and needs no change.

### Pages

Each file in `src/content/pages/` becomes a page: `index.yaml` is `/`, `faq.yaml` is `/faq`. A page is a title, a description, and a list of **blocks** rendered top to bottom. Reorder blocks to reorder the page. Change a block's `type` to lay it out differently.

| Block | For |
|---|---|
| `hero` | The top of a page: eyebrow, title, lead, buttons, small print, image |
| `section` | Heading and Markdown body, with optional image, callouts, tagline, buttons. `variant: statement` for one big centred line |
| `steps` | Numbered steps, `layout: row` (side by side) or `column` |
| `cards` | A grid of cards, optionally linked |
| `spotlight` | A highlighted band with an image |
| `feature` | A feature area: what it does, why it's there, image (used on How it works) |
| `table` | Any table. `variant: comparison` for the YouTube comparison |
| `faq` | Questions and answers |
| `cta` | A call to action. `variant: fixtheweb` uses Fix the Web's colours and spider |
| `roadmap` | Generated from feature statuses |
| `extensionTable` | Generated from `features.extension` |
| `prose` | A Markdown file from `src/content/prose/` |
| `notice` | A note box. `tone: draft` for unfinished things |
| `toc` | Jump links to every block on the page with an `id` and `heading` |

Most blocks also take `id` (for `/page#id` links), `eyebrow` and `background: soft | strong`. If you mistype a field, the build stops and names the file and field.

### Writing copy

Text fields accept Markdown: `**bold**`, `*italic*`, `[links](/faq)`, and lists in multi-line fields (`body: |`). Plus:

- `[label](link:contact)` or `href: link:contact` uses a URL from `links:` in the config. While it's empty, the link shows, is marked TBD, and does nothing.
- `{tbd:setupMinutes}` shows the value from `tbd:` in the config, or a pink TBD chip with its note while it's empty.
- `{status:watch-together}` shows the feature's badge ("Coming soon", "Showcase"…) and disappears once its status is `live`.

In YAML, wrap text in quotes if it starts with `{` or `[`, or contains `: ` (a colon then a space).

### Images

Add an image under `images:` in the config (or fill in an existing one's `src`), put the file in `public/images/`, and reference it from a block with `image: key`. Until `src` is set, a labelled frame the same shape shows instead. `.mp4` and `.webm` play as recordings.

## Changing the look

- **Try a different theme:** set `theme:` in `site.config.yaml` to `fern`, `forest`, `sunset`, `beach` or `dusk`. In `npm run dev`, the picker in the bottom corner switches instantly without saving.
- **Adjust a theme:** edit its light and dark blocks in `src/styles/themes.css`. Every colour on the site comes from those tokens.
- **Add a theme:** copy a block in `themes.css`, rename it, and add the name to `src/lib/themes.ts`.
- **Type, spacing, corners:** `src/styles/tokens.css`. System fonts for now; to self-host a font, put the `.woff2` files in `public/fonts/`, add `@font-face` rules to `base.css`, and put the font first in `--font-body` or `--font-heading`.
- **Restyle a kind of section:** each block's layout and styles are in its own file in `src/components/blocks/`.

Light and dark follow the visitor's system setting. Animations respect reduced motion.

## Build checks

`npm run build` runs `scripts/check-build.mjs` after building, and fails if:

- `/privacy` changed at all
- a page is missing the "not affiliated with YouTube or Google" line
- a page loads anything (scripts, styles, images, frames) from another site
- copy uses wording the brief rules out, like "YouTube alternative", "ad-free", "no tracking" about the app, "AI-powered" or "addictive"

## Deploying

Cloudflare serves `dist/` as static files (see `wrangler.jsonc`). In the Cloudflare dashboard, set the build command to `npm run build` and the output directory to `dist`. Check that the Worker name matches `wrangler.jsonc`. Pages build to `name.html` and are served without the extension, the same way `/privacy` always has been.

No analytics, no cookies, no third-party requests.

## Also in this repo

`review/` holds the database migrations for the separate `review.villow.app` environment. The website doesn't use it.

See `LAUNCH_CHECKLIST.md` for everything to verify before launch.
