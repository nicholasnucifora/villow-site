import { writeFile } from 'node:fs/promises';
import { studyNavigation } from './study-navigation.mjs';
import { renderH } from './h.mjs';
const html=`<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f6fbf8"><title>Villow · H · Connected choices</title><link rel="icon" href="assets/villow-mark-small-on-light.svg" type="image/svg+xml"><link rel="stylesheet" href="h.css"><link rel="stylesheet" href="study-navigation.css"><script type="module" src="h.js"></script></head>
<body class="version-h"><a class="skip-link" href="#main">Skip to content</a>${studyNavigation('h')}
<header class="h-header h-width"><a class="h-brand" href="h.html" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span>Villow</span></a><a href="#watch-later">Your Watch Later <span aria-hidden="true">↘</span></a></header>
<main id="main">${renderH()}</main></body></html>`;
await writeFile(new URL('./h.html',import.meta.url),html);
console.log('Rendered H: http://127.0.0.1:4399/h.html');

