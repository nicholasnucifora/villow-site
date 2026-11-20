import {readFile,writeFile} from 'node:fs/promises';
import {studyNavigation,studies} from './study-navigation.mjs';
import {applyComparisonOption} from './comparison-variants.mjs';
const template=await readFile(new URL('./a-source.html',import.meta.url),'utf8');
const navigation=/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/;
if(!navigation.test(template))throw new Error('Missing comparison navigation marker');
if(!template.includes('<title>Villow · Homepage A</title>'))throw new Error('Unexpected baseline title');
for(const [key] of studies){
  let page=applyComparisonOption(template,key);
  page=page.replace('</head>','<link rel="stylesheet" href="compact-comparisons.css"><script type="module" src="compact-comparisons.js"></script><noscript><style>@media(max-width:600px){.xl-column-headings{display:none}.xl-pair{display:block}.xl-pair>.xl-compare-cell{opacity:1;visibility:visible;transform:none;pointer-events:auto}.xl-comparisons .xc-side-marker{display:block}.xc-reveal-footer,.xc-shared-control{display:none}}</style></noscript></head>');
  if(key!=='a')page=page
    .replace('<title>Villow · Homepage A</title>',`<title>Villow · Homepage ${key.toUpperCase()}</title>`)
    .replace('href="a.html" aria-label="Villow home"',`href="${key}.html" aria-label="Villow home"`)
    .replace('Villow · Homepage A</span>',`Villow · Homepage ${key.toUpperCase()}</span>`);
  const output=page.replace(navigation,studyNavigation(key));
  if(/closing-comparison|data-i-view-choice|data-preview-variant/.test(output))throw new Error('Retired comparison controls found');
  await writeFile(new URL(`./${key}.html`,import.meta.url),output);
  if(key==='a')await writeFile(new URL('./index.html',import.meta.url),output);
}
console.log('Rendered A: Reveal cards and B: Shared switch. http://127.0.0.1:4399/b.html#beyond-watching');

