import { writeFile } from 'node:fs/promises';
import { renderE } from './e.mjs';
import { studyNavigation } from './study-navigation.mjs';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const down = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f7f4e9"><title>Villow — Homepage E · Keep the videos</title><link rel="icon" href="assets/villow-mark-small-on-light.svg" type="image/svg+xml"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="e.css"><link rel="stylesheet" href="study-navigation.css"></head>
<body class="version-e"><a class="skip-link" href="#main">Skip to content</a>${studyNavigation('e')}
<header class="site-header"><a class="brand" href="e.html" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span class="brand-name">Villow</span></a><nav class="site-nav" aria-label="Main"><a class="nav-link" href="#comparison">See the difference</a><a class="header-cta" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${arrow}</a></nav></header>
<main id="main">${renderE({arrow,down,check})}</main>
<div class="preview-end"><span>Villow · Homepage E · End of preview</span><span>Local design concept. Villow is not affiliated with, endorsed by, or sponsored by YouTube or Google.</span></div>
</body></html>`;
await writeFile(new URL('./e.html',import.meta.url),html);
console.log('Rendered E: http://127.0.0.1:4399/e.html');
