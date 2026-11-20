import {conceptCatalog} from './i-concepts-catalog.mjs';
import {renderCinemaComparison} from './i-cinema-comparison.mjs';
export const studies = [
  ['a', 'Refined'],
  ['b', 'Reimagined'],
  ['c', 'Illustrated'],
  ['d', 'A little less'],
  ['e', 'Contrast'],
  ['f', 'Visual studies'],
  ['g', 'Illustrations'],
  ['h', 'Connected choices'],
  ['i', 'Card stack & studies'],
  ['j', 'Quiet clearing'],
  ['k', 'Channel filtering'],
  ['l', 'Product overview'],
  ['m', 'Overview refinement'],
  ['n', 'Stack and viewing'],
  ['o', 'A little clearer'],
  ['p', 'Patterns and company'],
  ['q', 'Smooth patterns'],
  ['r', 'Shared moments'],
  ['s', 'A little more room'],
  ['t', 'Videos and people'],
  ['u', 'A working blueprint'],
  ['v', 'A finite selection'],
  ['w', 'A simpler selection'],
  ['x', 'Beyond watching'],
];

const variants = {
  f: [['f1', 'Illustrated'], ['f2', 'Expressive'], ['f3', 'Controls']],
  g: [['g1', 'Quiet banks'], ['g2', 'Willow & paper'], ['g3', 'A clearer view']],
};
const defaults = { f: 'f3', g: 'g1' };
const iViews = [['stack', '', 'Card stack'], ['focus', '1', 'Close-up'], ['explore', '2', 'Explore'], ['rhythm', '3', 'Rhythm'], ['editorial', '4', 'Editorial']];
const iArtwork = [['i15', 'Sage'], ['i21', 'Mint']];
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function studyNavigation(current,{variant}={}) {
  const active = String(current).toLowerCase();
  const children = variants[active] || [];
  const defaultVariant = children.some(([key])=>key===variant)?variant:defaults[active] || '';
  const variantLinks = children.map(([key, label]) => `<a href="${active}.html#${key}" data-preview-variant="${key}"${key === defaultVariant ? ' aria-current="location"' : ''}><span>${key.toUpperCase()}</span><span>${escape(label)}</span></a>`).join('');
  let variantNavigation = children.length ? `<nav class="study-variants" aria-label="${active.toUpperCase()} variants">${variantLinks}</nav>` : '';
  if(active==='k')variantNavigation='<nav class="study-k-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="i.html?view=cinema-cloud-cat#i15">Current homepage · I</a><a href="k.html#i15" aria-current="page">Channel filtering · K</a></nav>';
  if(active==='l')variantNavigation='<nav class="study-l-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="i.html?view=cinema-cloud-cat#i15">Previous overview · I</a><a href="k.html#i15">Filtering study · K</a><a href="l.html#i15" aria-current="page">Product overview · L</a></nav>';
  if(active==='m')variantNavigation='<nav class="study-m-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="l.html#your-choices">Previous overview · L</a><a href="m.html#your-choices" aria-current="page">Spacious overview · M</a></nav>';
  if(active==='n')variantNavigation=`<nav class="study-n-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="m.html#your-choices">Previous overview · M</a><a href="n-previous.html#your-choices"${variant==='previous'?' aria-current="page"':''}>Earlier N</a><a href="n.html#your-choices"${variant!=='previous'?' aria-current="page"':''}>Refined N</a></nav>`;
  if(active==='o')variantNavigation='<nav class="study-o-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="n.html#your-choices">Previous overview · N</a><a href="o.html#your-choices" aria-current="page">A little clearer · O</a><a href="o.html#watch-together">Watch together ↓</a></nav>';
  if(active==='p')variantNavigation='<nav class="study-o-comparison study-p-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="o.html#o-viewing">Previous take · O</a><a href="p.html#o-viewing" aria-current="page">Patterns · P</a><a href="p.html#watch-together">Watch together ↓</a></nav>';
  if(active==='q')variantNavigation='<nav class="study-o-comparison study-q-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="p.html#o-viewing">Previous take · P</a><a href="q.html#o-viewing" aria-current="page">Smooth patterns · Q</a><a href="q.html#watch-together">Watch together ↓</a></nav>';
  if(active==='r')variantNavigation='<nav class="study-o-comparison study-r-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="q.html#good-company">Previous take · Q</a><a href="r.html#o-viewing" aria-current="page">Patterns · R</a><a href="r.html#good-company">Social sections ↓</a></nav>';
  if(active==='s')variantNavigation='<nav class="study-o-comparison study-s-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="r.html#your-choices">Previous take · R</a><a href="s.html#o-limits" aria-current="page">Stopping controls · S</a><a href="s.html#o-viewing">Viewing insights ↓</a></nav>';
  if(active==='t')variantNavigation='<nav class="study-o-comparison study-t-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="s.html#your-choices">Previous take · S</a><a href="t.html#watch-with-people" aria-current="page">Social introduction · T</a><a href="t.html#feed-to-watch-later">Feed illustration ↓</a></nav>';
  if(active==='u')variantNavigation='<nav class="study-o-comparison study-u-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="t.html">Previous introduction · T</a><a href="u.html" aria-current="page">A working blueprint · U</a><a href="u.html#help-shape-web">The wider project ↓</a></nav>';
  if(active==='v')variantNavigation='<nav class="study-o-comparison study-v-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="t.html#feed-to-watch-later">Original stack · T</a><a href="v.html#feed-to-watch-later" aria-current="page">Finite selection · V</a><a href="v.html#help-shape-web">The wider project ↓</a></nav>';
  if(active==='w')variantNavigation='<nav class="study-o-comparison study-w-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="t.html#feed-to-watch-later">Original stack · T</a><a href="w.html#feed-to-watch-later" aria-current="page">Simpler stack · W</a><a href="w.html#across-devices">Across devices ↓</a><a href="w.html#help-shape-web">The wider project ↓</a></nav>';
  if(active==='x')variantNavigation='<nav class="study-o-comparison study-x-comparison" aria-label="Homepage comparison"><span>Compare</span><a href="w.html#help-shape-web">Previous page · W</a><a href="x.html#beyond-watching" aria-current="page">Beyond watching · X</a><a href="x.html#help-shape-web">The wider project ↓</a></nav>';
  if (active === 'i') {
    const viewLinks = iViews.map(([key, number, label]) => `<a href="i.html?view=${key}#i15" data-i-view-choice="${key}"${key === 'stack' ? ' aria-current="location"' : ''}>${number ? `<span class="study-i-number">${number}</span>` : ''}<span>${label}</span></a>`).join('');
    const artLinks = iArtwork.map(([key, label]) => `<a href="i.html?view=stack#${key}" data-i-art-choice="${key}"${key === 'i15' ? ' aria-current="location"' : ''}>${label}</a>`).join('');
    const conceptLinks=items=>items.map(([key,number,label])=>`<a href="i.html?view=${key}#i15" data-i-view-choice="${key}"><span class="study-i-number">${number}</span><span>${escape(label)}</span></a>`).join('');
    const first=conceptCatalog.filter(([,number])=>Number(number)<=12);
    const quiet=conceptCatalog.filter(([,number])=>Number(number)>12&&Number(number)<=20);
    const next=conceptCatalog.filter(([,number])=>Number(number)>20&&Number(number)<=25);
    const agency=conceptCatalog.filter(([,number])=>Number(number)>25&&Number(number)<=28);
    const cinema=conceptCatalog.filter(([,number])=>Number(number)>28);
    const jumpOptions=items=>items.map(([key,number,label])=>`<option value="${key}">${number?`${number} · `:''}${escape(label)}</option>`).join('');
    const families=[['cinema','29–34 · Illustrations',cinema],['agency','26–28 · Agency studies',agency],['next','21–25 · Journey takes',next],['first','01–12 · First takes',first],['quiet','13–20 · Quieter takes',quiet]];
    const familyTabs=families.map(([key,label],index)=>`<button type="button" role="tab" id="i-set-tab-${key}" aria-controls="i-set-${key}" aria-selected="${!index}"${index?' tabindex="-1"':''} data-i-family="${key}">${label}</button>`).join('');
    const familyPanels=families.map(([key,label,items],index)=>`<div id="i-set-${key}" role="tabpanel" aria-labelledby="i-set-tab-${key}" data-i-family-panel="${key}"${index?' hidden':''}><nav class="study-i-views study-i-concepts study-i-${key}" data-i-view-options aria-label="${escape(label)}">${conceptLinks(items)}</nav></div>`).join('');
    variantNavigation = `<div class="study-i-comparison"><div class="study-i-existing"><nav class="study-i-views" data-i-view-options aria-label="Existing I compositions">${viewLinks}</nav><nav class="study-i-art" data-i-art-options aria-label="I landscape artwork"><span class="study-i-art-label" aria-hidden="true">Artwork</span>${artLinks}</nav></div><div class="study-i-families"><div class="study-i-family-bar"><div class="study-i-family-tabs" role="tablist" aria-label="Hero illustration sets">${familyTabs}</div><select data-i-jump aria-label="Jump to any I design"><option value="" selected disabled>Jump to…</option><optgroup label="Illustrations">${jumpOptions(cinema)}</optgroup><optgroup label="Agency studies">${jumpOptions(agency)}</optgroup><optgroup label="Journey takes">${jumpOptions(next)}</optgroup><optgroup label="Original compositions">${jumpOptions(iViews)}</optgroup><optgroup label="First takes">${jumpOptions(first)}</optgroup><optgroup label="Quieter takes">${jumpOptions(quiet)}</optgroup></select><a class="study-i-company-jump" href="i.html?view=stack#feed-to-watch-later" data-i-feed-jump>Feed → Later ↓</a><a class="study-i-company-jump" href="i.html?view=stack#good-company" data-i-company-jump aria-label="See Good videos, good company below">Company ↓</a></div>${familyPanels}</div></div>`;
    variantNavigation=variantNavigation.replace('<select data-i-jump',`${renderCinemaComparison()}<select data-i-jump`);
  }
  return `<!-- study-navigation:start --><aside class="preview-rail study-navigation" aria-label="Homepage design previews" data-preview="${active}" data-default-variant="${defaultVariant}"><div class="study-navigation-row"><span class="preview-rail-label"><span class="study-label-full">HOMEPAGE STUDIES</span><span class="study-label-short">STUDIES</span></span><nav class="preview-tabs" aria-label="Choose preview">${studies.map(([key, label]) => `<a href="${key}.html" aria-label="Version ${key.toUpperCase()}: ${escape(label)}"${key === active ? ' aria-current="page"' : ''}><span class="study-letter">${key.toUpperCase()}</span><span class="preview-tab-name">&nbsp;· ${escape(label)}</span></a>`).join('')}</nav><span class="preview-rail-status">Local preview</span></div>${variantNavigation}</aside><script type="module" src="study-navigation.js"></script><!-- study-navigation:end -->`;
}









