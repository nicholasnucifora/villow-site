import { writeFile } from 'node:fs/promises';
import { studyNavigation } from './study-navigation.mjs';
import { content } from './content.mjs';
import { renderA } from './a.mjs';
import { renderB } from './b.mjs';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const expand = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>';
const down = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5"/></svg>';
const actions = () => `<div class="actions"><a class="cta" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${arrow}</a><a class="text-link" href="#your-controls">Explore the controls ${down}</a></div>`;
function page(version, render) {
const dark = version === 'b';
return `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="${dark ? 'dark light' : 'light'}"><title>Villow — Homepage ${version.toUpperCase()} · Local preview</title><link rel="icon" href="assets/villow-mark-small-on-${dark ? 'dark' : 'light'}.svg" type="image/svg+xml"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="${version}.css"><script type="module" src="preview.js"></script><link rel="stylesheet" href="study-navigation.css"></head>
<body class="version-${version}"><a class="skip-link" href="#main">Skip to content</a>
${studyNavigation(version)}
<header class="site-header wrap"><a href="${version}.html" class="brand" aria-label="Villow home"><img src="assets/villow-mark-small-on-${dark ? 'dark' : 'light'}.svg" width="25" height="28" alt=""><span class="brand-name">Villow</span></a><nav class="site-nav" aria-label="Main"><a class="nav-link" href="#your-controls">How it works</a><a class="header-cta" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${arrow}</a></nav></header>
<main id="main">${render(content, {arrow,expand,down,actions})}</main>
<div class="preview-end"><span>Villow · Homepage ${version.toUpperCase()} · End of preview</span><span>App screenshots show sample content and data. Villow is not affiliated with, endorsed by, or sponsored by YouTube or Google.</span></div>
<dialog class="image-dialog" aria-labelledby="dialog-title"><div class="dialog-toolbar"><p class="dialog-title" id="dialog-title">Inside Villow</p><button class="dialog-close" type="button">Close <span aria-hidden="true">×</span></button></div><div class="dialog-image-area"><img alt=""></div><p class="dialog-note">Actual Villow app · sample content and data<span class="mobile-pan-note"> · Scroll to explore the full screenshot</span></p></dialog>
</body></html>`;
}
for (const [version, render] of [['a', renderA], ['b', renderB]]) {
 await writeFile(new URL(`./${version}.html`, import.meta.url), page(version, render));
}
await writeFile(new URL('./index.html', import.meta.url), page('a', renderA));
console.log('Rendered local homepage previews A and B.');
