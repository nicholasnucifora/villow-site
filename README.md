# villow.app

The public website for Villow, a Fix the Web project. Built with [Astro](https://astro.build) as a static site, served by Cloudflare.

**Local redesign, not released (14 November 2026).** The main local routes now use homepage 34 / Soft Nunito and the active secondary previews. Keep the preset rail while iterating. Do not push or deploy until the owner explicitly approves publication. `npm run build` is guarded; `npm run build:local` validates the local design without publishing anything. Noindex metadata is a supplement, not access control: the development server binds only to `127.0.0.1`.

## Privacy policy sources and stable URLs

**Privacy pages.** `/privacy` is a short page (`src/content/pages/privacy.yaml`) linking to the three policies: the extension's, the app's (`/app-privacy`) and the website's (`/site-privacy`, text in `src/content/prose/site-privacy.md`). The build fails if it stops linking to any of them.

`src/content/policies/extension-privacy.html` is the reviewed extension policy source. Its bytes are unchanged from the former `public/extension-privacy.html`; the Astro route wraps its full policy content in the shared design at the same `https://villow.app/extension-privacy` URL. The build checks both the pinned source hash and verbatim policy content in the rendered page. Keep that URL stable. Deliberate policy updates must match the app/extension contract and store disclosures; update `PRIVACY_SHA256` in `scripts/check-build.mjs` only after reviewing a wording change. The 14 November 2026 revision covers extension 0.8.4. Store-release parity and disclosure updates remain separate checks, including the pasted Firefox Add-ons policy.

The web app's privacy content lives at `/privacy-overview` (plain-language summary) and `/app-privacy` (formal policy).

## Running it

```sh
npm install
npm run dev           # http://127.0.0.1:4411, with the active page presets
npm run build:local   # builds to dist/ and checks; does not publish
npm run placeholders  # lists everything still TBD
```

Node 22.12 or newer.

For private Android testing, enable USB debugging, connect the phone, accept its computer authorisation, and run `adb reverse tcp:4411 tcp:4411`. Open `http://127.0.0.1:4411/` in the phone's browser. The computer and dev server must stay running. Reconnect forwarding after unplugging/restarting. The optional app demo uses port 5173 and needs its own local server plus `adb reverse tcp:5173 tcp:5173`. No Wi-Fi exposure or public tunnel is needed.

The active design remains in `previews/homepage/`; Astro renders those sources through `src/lib/site-design.mjs`. `scripts/site-design-integration.mjs` serves/copies only their dependency closure under `/_design/`, excluding historical studies, tests and build scripts. Existing policy/FAQ content uses the same header, footer and design through `Base.astro`. Terms remains unset until a real policy is supplied.

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

`npm run build:local` runs `scripts/check-build.mjs` after building, and fails if:

- `/privacy` differs from its deliberately reviewed hash
- an internal link points to a missing page or fragment, or HTML anchor ids are duplicated
- a page is missing the "not affiliated with YouTube or Google" line
- a page loads anything (scripts, styles, images, frames) from another site
- copy uses wording the brief rules out, like "YouTube alternative", "ad-free", "no tracking" about the app, "AI-powered" or "addictive"

## Deploying

The existing public site uses Cloudflare and `dist/` (see `wrangler.jsonc`). Its usual `npm run build` command is deliberately blocked for this private development work. Leave publication disabled until the owner approves a release; that review must also remove the draft noindex rules and check the app demo destination. Local builds never invoke Cloudflare or Git pushes. Pages build to `name.html` and are served without the extension.

The source adds no analytics, cookies or third-party asset loads. Verify Cloudflare's live configuration separately; hosting can add network diagnostics or other behaviour.

## Also in this repo

`review/` holds the database migrations for the separate `review.villow.app` environment. The website doesn't use it.

`support/` is the separate Cloudflare Worker + D1 supporter service for `/support`, designed for future Fix the Web projects too. It is disabled until configured and tested. See [support/README.md](support/README.md) for Stripe test/live setup, email verification, moderation, deployment and the end-to-end checklist. The static site uses only the public `PUBLIC_SUPPORT_API_URL` build variable; all Stripe and email secrets belong to that Worker.

See `LAUNCH_CHECKLIST.md` for everything to verify before launch.
