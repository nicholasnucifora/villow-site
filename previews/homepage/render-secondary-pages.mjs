import {writeFile,copyFile} from 'node:fs/promises';
import {pageStudyNavigation,localizePreviewLinks} from './study-navigation.mjs';
import {previewHeader,applyPreviewHeader} from './preview-header.mjs';
import {setupPageBodyB} from './setup-page-b.mjs';
import {setupInstructionsBodyB} from './setup-instructions-page-b.mjs';
import {setupHostingBodyB} from './setup-hosting-b.mjs';
import {setupHostingBodyC} from './setup-hosting-c.mjs';
import {setupHostingBodyD} from './setup-hosting-d.mjs';
import {helpPageBody} from './help-page-a.mjs';
import {contactPageBody} from './contact-form.mjs';
import {partnersPageBody} from './partners-page.mjs';
import {conceptsPageBodyB} from './concepts-page-b.mjs';
import {conceptStudies} from './site-routes.js';
import {applyFooterSpidey} from './footer-spidey-markup.mjs';

// Buildless previews use the same install chooser as the main site.
await copyFile(new URL('../../src/lib/extension-store-links.js',import.meta.url),new URL('extension-store-links.js',import.meta.url));
await copyFile(new URL('../../src/styles/extension-store-links.css',import.meta.url),new URL('extension-store-links.css',import.meta.url));
const header = () => previewHeader();
const footer = (label,preset) => `<footer class="sp-footer" aria-label="Footer"><div class="sp-width"><div class="sp-footer-inner"><div class="sp-footer-project"><a class="sp-footer-brand" href="https://fixtheweb.org"><img src="assets/fixtheweb-spider.svg" width="37" height="37" alt=""><span>A Fix the Web project</span></a><p>Villow is an app for YouTube, made by Fix the Web to show what better looks like.</p></div><nav class="sp-footer-nav" aria-label="Footer navigation"><div><h2>Villow</h2><ul><li><a href="setup-a.html">Get started</a></li><li><span>Running your Villow</span></li><li><span>About</span></li></ul></div><div><h2>Help</h2><ul><li><span>FAQ</span></li><li><span>Privacy</span></li><li><span>Terms</span></li><li><a href="mailto:support@villow.app">Contact</a></li></ul></div><div><h2>Community</h2><ul><li><span>Discord</span></li><li><span>Reddit</span></li><li><span>How to help</span></li></ul></div><div><h2>Project</h2><ul><li><span>GitHub</span></li><li><a href="https://fixtheweb.org">fixtheweb.org</a></li></ul></div></nav><div class="sp-footer-bottom"><span>This site uses no analytics.</span><span>${label} · ${preset.toUpperCase()} · Local preview</span></div></div><p class="sp-footer-disclaimer">Villow uses YouTube’s videos and official player. An independent project, not affiliated with YouTube or Google.</p></div></footer>`;
const pages = [
 {key:'setup',preset:'b',title:'Set up your feed',body:setupPageBodyB,css:['setup-page-a.css','setup-page-b.css','setup-extension-guide-b.css','assets/extension-story-demo/extension-story-demo.css'],js:'setup-guide.js',className:'setup-b-preview setup-choice-page'},
 {key:'setup',navigationKey:'setup-instructions',preset:'b',fileName:'setup-instructions-b.html',title:'Setup instructions',body:setupInstructionsBodyB,css:['setup-page-a.css','setup-page-b.css','setup-extension-guide-b.css','assets/extension-story-demo/extension-story-demo.css'],js:'setup-instructions-b.js',className:'setup-b-preview'},
 {key:'setup',navigationKey:'setup-hosting',preset:'b',fileName:'setup-hosting-b.html',title:'Hosting your Villow',body:setupHostingBodyB,css:['setup-page-a.css','setup-page-b.css','hosting-guide-b.css'],js:'setup-hosting-b.js',className:'setup-b-preview setup-hosting-preview'},
 {key:'setup',navigationKey:'setup-hosting',preset:'c',fileName:'setup-hosting-c.html',title:'Hosting your Villow',body:setupHostingBodyC,css:['hosting-guide-c.css'],js:'setup-hosting-c.js',className:'setup-hosting-c-preview'},
 {key:'setup',navigationKey:'setup-hosting',preset:'d',fileName:'setup-hosting-d.html',title:'Hosting your Villow',body:setupHostingBodyD,css:['hosting-guide-d.css'],js:'setup-hosting-d.js',className:'setup-hosting-d-preview'},
 ...conceptStudies.map(([preset]) => ({
  key:'concepts',preset,title:'Design concepts',body:conceptsPageBodyB,
  css:['concepts-page-a.css','concepts-page-b.css'],
  js:'concepts-b-interactions.js',className:`concepts-b-preview concepts-ai-${preset}`,
 })),
 {key:'help',preset:'c',title:'Get involved',body:helpPageBody,css:['help-page-a.css','help-support.css','help-support-presets.css','help-preview-controls.css'],js:'help-page-a.js',className:'help-notes-compact'},
 ...[['d','quotes'],['e','paper'],['f','bubbles']].map(([preset,treatment]) => ({key:'help',preset,title:'Get involved',body:helpPageBody,css:['help-page-a.css','help-support.css','help-support-presets.css','help-preview-controls.css'],js:'help-page-a.js',className:`help-notes-compact help-notes-${treatment}`})),
 {key:'contact',preset:'a',title:'Contact',body:contactPageBody,css:['contact-form.css'],js:'contact-form.js'},
 {key:'partners',preset:'a',title:'Partners',body:partnersPageBody,css:[]},
];
const requestedPage = process.argv.find(arg => arg.startsWith('--page='))?.slice(7);
const requestedPreset = process.argv.find(arg => arg.startsWith('--preset='))?.slice(9);
const selectedPages = pages.filter(page => (!requestedPage || page.key === requestedPage || page.navigationKey === requestedPage) && (!requestedPreset || page.preset === requestedPreset));
if (!selectedPages.length) throw new Error(`Unknown preview: ${requestedPage || 'all'} / ${requestedPreset || 'all'}`);
for (const page of selectedPages) {
 const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light"><meta name="theme-color" content="#fbfaf3"><title>${page.title} · Villow · Preview ${page.preset.toUpperCase()}</title><link rel="icon" href="assets/villow-mark-small-on-light.svg" type="image/svg+xml"><link rel="stylesheet" href="secondary-preview.css"><link rel="stylesheet" href="study-navigation.css">${page.css.map(css=>`<link rel="stylesheet" href="${css}">`).join('')}${page.js?`<script type="module" src="${page.js}"></script>`:''}</head><body class="secondary-preview ${page.key}-preview${page.className?` ${page.className}`:''}"><a class="skip-link" href="#main">Skip to content</a>${pageStudyNavigation(page.navigationKey||page.key,page.preset)}${header(page.key,page.preset,page.navigationKey)}<main id="main" class="sp-main">${page.body()}</main>${footer(page.title,page.preset)}</body></html>`;
 await writeFile(new URL(`./${page.fileName||`${page.key}-${page.preset}.html`}`,import.meta.url),applyPreviewHeader(applyFooterSpidey(localizePreviewLinks(html))));
}
console.log(requestedPage ? `Rendered the ${requestedPage} preview.` : 'Rendered the current secondary previews.');
