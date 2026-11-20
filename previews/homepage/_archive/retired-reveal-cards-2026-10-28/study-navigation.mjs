import {comparisonOptions} from './comparison-variants.mjs';
export const studies = comparisonOptions;
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function studyNavigation(current='a'){
 return `<!-- study-navigation:start --><aside class="preview-rail study-navigation" aria-label="Homepage design previews" data-preview="${escape(current)}"><div class="study-navigation-row"><span class="preview-rail-label"><span class="study-label-full">HOMEPAGE PREVIEWS</span><span class="study-label-short">PREVIEWS</span></span><nav class="preview-tabs" aria-label="Choose preview">${studies.map(([key,label])=>`<a href="${key}.html#beyond-watching" aria-label="Version ${key.toUpperCase()}: ${escape(label)}"${key===current?' aria-current="page"':''}><span class="study-letter">${key.toUpperCase()}</span><span class="preview-tab-name">&nbsp;· ${escape(label)}</span></a>`).join('')}</nav><span class="preview-rail-status">Local preview</span></div></aside><!-- study-navigation:end -->`;
}
