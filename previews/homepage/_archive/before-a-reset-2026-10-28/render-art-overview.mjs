import { writeFile } from 'node:fs/promises';
import { artChoices } from './i-art-data.js';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const activeChoices = artChoices.filter(choice => !choice.archived);
const suppliedCount = activeChoices.filter(choice => choice.supplied).length;
const introduction = `${activeChoices.length} illustrations${suppliedCount ? `, including ${suppliedCount} you supplied` : ''}. Choose one to see it with the product.`;

const cards = activeChoices.map(choice => {
  const label = `${choice.id.toUpperCase()} ${choice.title}`;
  const kept = choice.id === 'i1' || choice.id === 'i4';
  const badge = choice.supplied ? 'Yours' : kept ? 'Kept' : '';
  return `    <a class="art-card" href="i.html#${escape(choice.id)}" aria-label="View ${escape(label)} in homepage">
      <img class="art-card-image" src="${escape(choice.desktop)}" alt="" decoding="async">
      <div class="art-card-caption"><span><span class="art-card-id">${escape(choice.id.toUpperCase())}</span>${escape(choice.title)}</span>${badge ? `<span class="kept-badge">${badge}</span>` : ''}</div>
    </a>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="color-scheme" content="light">
  <title>I — Illustration studies · Villow local preview</title>
  <link rel="stylesheet" href="art-overview.css">
</head>
<body>
  <a class="skip-link" href="#illustrations">Skip to illustrations</a>
  <main class="art-overview">
    <header class="overview-header">
      <div><h1>I — Illustration studies</h1><p>${escape(introduction)}</p></div>
      <a class="back-link" href="i.html"><span aria-hidden="true">←</span> Back to I</a>
    </header>
    <div class="art-grid" id="illustrations" aria-label="Illustration studies">
${cards}
    </div>
  </main>
</body>
</html>
`;

await writeFile(new URL('./art-overview.html', import.meta.url), html);
console.log(`Rendered illustration overview with ${activeChoices.length} active studies.`);
