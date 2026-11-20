import {writeFile} from 'node:fs/promises';
import {studyNavigation} from './study-navigation.mjs';
import {renderI} from './i.mjs';

const html = `<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f9faf4"><title>Villow · J · A quiet clearing</title><link rel="icon" href="assets/villow-mark-small-on-light.svg" type="image/svg+xml"><link rel="stylesheet" href="i.css"><link rel="stylesheet" href="i-landscape.css"><link rel="stylesheet" href="j.css"><link rel="stylesheet" href="i-controls.css"><link rel="stylesheet" href="study-navigation.css"><script type="module" src="i.js"></script><script type="module" src="i-controls.js"></script></head>
<body class="version-j"><a class="skip-link" href="#main">Skip to content</a>${studyNavigation('j')}
<header class="i-header i-width"><a class="i-brand" href="j.html" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span>Villow</span></a><a class="i-header-link" href="#your-choices">A little more say <span aria-hidden="true">↓</span></a></header>
<main id="main">${renderI({version:'J'})}</main></body></html>`;

await writeFile(new URL('./j.html', import.meta.url), html);
console.log('Rendered J: http://127.0.0.1:4399/j.html');
