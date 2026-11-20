import {controlStudies} from './homepage-control-presets.js';
import {conceptStudies,mainSiteURL,selectedConceptPreset} from './site-routes.js';

// 34 is the selected homepage.
export const homeStudies = [...controlStudies];
export const coreHomeStudies = [...homeStudies];
export const retiredNavigationStudies=['35','36','37'];
export const retiredHomeStudies=[...'abcdefghijklmnopqrstuvwxyz','27','28','29','30','31','32','33',...retiredNavigationStudies,'38','39','40','41','42','43','44','45','46','47','48','49','50','51','52'];
export const studyPorts = Object.fromEntries(homeStudies.map(([key])=>[key,4411]));
export const previewPages = {
 home:{label:'Homepage',summary:'Homepage previews',selectedPreset:'34'},
 setup:{label:'Set up your feed',summary:'Set up your feed previews',presets:[['b','Guided choice']]},
 'setup-instructions':{label:'Setup instructions',summary:'Setup instructions previews',presets:[['b','Setup']]},
 'setup-hosting':{label:'Hosting your Villow',summary:'Hosting your Villow previews',presets:[['b','Owner guide'],['c','Host essentials'],['d','Hosting, simplified']]},
 concepts:{label:'Design concepts',summary:'Design concepts previews',selectedPreset:selectedConceptPreset,presets:conceptStudies},
 help:{label:'Get involved',summary:'Get involved previews',selectedPreset:'c',presets:[['c','Compact cards'],['d','Quotations'],['e','Folded notes'],['f','Conversation']]},
 contact:{label:'Contact',summary:'Contact previews',presets:[['a','Send a message']]},
 partners:{label:'Partners',summary:'Partners previews',presets:[['a','Partners']]},
};
export function previewPageURL(page,preset) {
 const definition=previewPages[page];
 if(!definition) throw new Error(`Unknown preview page: ${page}`);
 const presets=page==='home'?homeStudies:definition.presets;
 preset ??= definition.selectedPreset ?? presets.at(-1)[0];
 if(!presets.some(([key])=>key===preset)) throw new Error(`Unknown ${page} preset: ${preset}`);
 const file=page==='home'?`${preset}.html`:`${page}-${preset}.html`;
 return mainSiteURL(file) || (page==='home' ? `http://127.0.0.1:${studyPorts[preset]||4411}/${file}` : `http://127.0.0.1:4411/${file}`);
}

// Keep useful anchors and setup choices while returning to the current page draft.
export function latestPreviewURL(href) {
 let url;
 try {url=new URL(href,'http://127.0.0.1:4411/');} catch {return href;}
 if(!['127.0.0.1','localhost'].includes(url.hostname)) return href;
 const file=url.pathname.slice(1);
 if(file==='about-a.html'){
  const destination=new URL(previewPageURL('help'));
  destination.search=url.search;destination.hash=url.hash||'#get-involved';return destination.href;
 }
 // Saved links to any retired homepage resolve to the current homepage.
 const page=file==='index.html'||retiredHomeStudies.some(key=>file===`${key}.html`)||homeStudies.some(([key])=>file===`${key}.html`) ? 'home'
  : Object.keys(previewPages).find(key=>key!=='home' && new RegExp(`^${key}-[a-z]+\\.html$`).test(file));
 if(!page) return href;
 const destination=new URL(previewPageURL(page));
 destination.search=url.search; destination.hash=url.hash;
 return destination.href;
}
