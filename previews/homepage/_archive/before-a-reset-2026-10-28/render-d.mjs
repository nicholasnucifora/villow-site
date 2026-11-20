import { writeFile } from 'node:fs/promises';
import { studyNavigation } from './study-navigation.mjs';
import { content } from './content.mjs';
import { renderD } from './d.mjs';
const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const down = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v15m-5-5 5 5 5-5"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const bookmark = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>';
const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f2f9fa"><title>Villow — Homepage D · A little less</title><link rel="icon" href="assets/villow-mark-small-on-light.svg" type="image/svg+xml"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="c-controls.css"><link rel="stylesheet" href="c.css"><link rel="stylesheet" href="d.css"><script type="module" src="c-controls.js"></script><link rel="stylesheet" href="study-navigation.css"></head>
<body class="version-c version-d"><a class="skip-link" href="#main">Skip to content</a>
${studyNavigation('d')}
<header class="site-header"><a href="d.html" class="brand" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span class="brand-name">Villow</span></a><nav class="site-nav" aria-label="Main"><a class="nav-link" href="#your-controls">The idea</a><a class="header-cta" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${arrow}</a></nav></header>
<main id="main">${renderD(content,{arrow,down,check,bookmark})}</main>
<div class="preview-end"><span>Villow · Homepage D · End of preview</span><span>Local design concept. Product details use sample content and data. Villow is not affiliated with, endorsed by, or sponsored by YouTube or Google.</span></div>
</body></html>`;
await writeFile(new URL('./d.html', import.meta.url), html);
console.log('Rendered D: http://127.0.0.1:4399/d.html');
