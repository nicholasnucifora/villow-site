// Whole-page alternatives share this list with the local preview server.
// Compact comparison options remain an independent concern within version B.
import {coreHomeStudies as studies,homeStudies,studyPorts as ports,previewPages as pageDefinitions,previewPageURL,latestPreviewURL} from './preview-pages.js';
export {studies,previewPageURL};
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export const secondaryStudyRoutes=Object.entries(pageDefinitions).flatMap(([page,definition])=>[...(definition.presets?.map(([preset])=>`${page}-${preset}.html`)||[]),...(definition.companionRoutes||[])]);

// A page owns its own preset series. Add future B/C alternatives to that page's
// presets above when there is an actual design to compare.
function pagePicker(current){
 const definition=pageDefinitions[current];
 const options=Object.entries(pageDefinitions).map(([key,{label}])=>`<a href="${previewPageURL(key)}"${key===current?' aria-current="page"':''}>${escape(label)}</a>`).join('');
 return `<details class="study-page-picker"><summary>${escape(definition.summary)}</summary><nav class="study-page-options" aria-label="Choose page to preview">${options}</nav></details>`;
}

export function studyNavigation(current=pageDefinitions.home.selectedPreset){
 if(!homeStudies.some(([key])=>key===current))current=pageDefinitions.home.selectedPreset;
 const choices=homeStudies;
 const links=choices.map(([key,label])=>`<a href="${ports[key]?`http://127.0.0.1:${ports[key]}/${key}.html`:`${key}.html`}" aria-label="Version ${key.toUpperCase()}: ${escape(label)}"${key===current?' aria-current="page"':''}><span class="study-letter">${key.toUpperCase()}</span><span class="preview-tab-name">&nbsp;· ${escape(label)}</span></a>`).join('');
 return `<!-- study-navigation:start --><aside class="preview-rail study-navigation" aria-label="Homepage design previews" data-study-page="home" data-preview="${escape(current)}" data-study-series="focused-story"><div class="study-navigation-row">${pagePicker('home')}<nav class="preview-tabs" aria-label="Choose homepage preview">${links}</nav><span class="preview-rail-status">Local preview</span></div></aside><script type="module" src="study-navigation-scroll.js"></script><script type="module" src="study-page-navigation.js"></script><!-- study-navigation:end -->`;
}

export function pageStudyNavigation(page,preset){
 const definition=pageDefinitions[page];
 if(!definition?.presets)throw new Error(`Use studyNavigation for homepage previews: ${page}`);
 preset ??= definition.selectedPreset ?? definition.presets.at(-1)[0];
 previewPageURL(page,preset);
 const anchor=page==='help'?'#supporter-notes':'';
 const links=definition.presets.map(([key,label])=>`<a href="${previewPageURL(page,key)}${anchor}" aria-label="Version ${key.toUpperCase()}: ${escape(label)}"${key===preset?' aria-current="page"':''}><span class="study-letter">${key.toUpperCase()}</span><span class="preview-tab-name">&nbsp;· ${escape(label)}</span></a>`).join('');
 return `<!-- study-navigation:start --><aside class="preview-rail study-navigation" aria-label="${escape(definition.label)} design previews" data-study-page="${escape(page)}" data-preview="${escape(preset)}" data-study-series="page-studies"><div class="study-navigation-row">${pagePicker(page)}<nav class="preview-tabs" aria-label="Choose ${escape(definition.label.toLowerCase())} preview">${links}</nav><span class="preview-rail-status">Local preview</span></div></aside><script type="module" src="study-page-navigation.js"></script><!-- study-navigation:end -->`;
}

// Route the homepage's existing entry points to the local design drafts, with
// native same-tab links. Content, classes and button styling stay intact.
export function localizePreviewLinks(html){
 return html.replace(/<a\b[^>]*>/g,anchor=>{
  const setup=/\bhref="https:\/\/villow\.app\/download\/?"/.test(anchor);
  const concepts=/\bclass="[^"]*\b(?:rd-concepts-link|xl-concept-link|xl-concepts-link)\b/.test(anchor)||/\bhref="https:\/\/villow\.app\/roadmap#ideas"/.test(anchor);
  if(!setup&&!concepts){
   if(/aria-label="Version /.test(anchor))return anchor;
   return anchor.replace(/\bhref="([^"]+)"/,(original,href)=>{
    const decoded=href.replaceAll('&amp;','&');
    const destination=latestPreviewURL(decoded);
    return destination===decoded ? original : `href="${escape(destination)}"`;
   });
  }
  return anchor.replace(/\s+(?:href|target|rel|aria-disabled|role|tabindex)="[^"]*"/g,'')
   .replace(/\s+data-a-concepts-placeholder(?:="[^"]*")?/g,'')
   .replace(/>$/,` href="${previewPageURL(setup?'setup':'concepts')}">`);
 }).replaceAll('<li><span>Get started</span></li>',`<li><a href="${previewPageURL('setup')}">Get started</a></li>`);
}
