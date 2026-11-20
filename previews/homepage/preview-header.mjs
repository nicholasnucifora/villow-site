import {previewPageURL} from './preview-pages.js';
import {navigationStudies} from './navigation-studies.js';
import {directoryContent} from './site-directory-markup.mjs';
import {applyPreviewFooter} from './preview-footer.mjs';

export function previewHeader({home=false,directory=true,directoryVariant='34'}={}) {
 const labels=navigationStudies[directoryVariant]?.primary||['Get involved','Get started'];
 const studyAttribute=directoryVariant?` data-directory-variant="${directoryVariant}"`:'';
 if(directory)return `<header class="preview-site-header site-directory-header ${home?'i-header i-width':'sp-header'}" data-site-directory${studyAttribute}><a class="preview-site-brand ${home?'i-brand':'sp-brand'}" href="${previewPageURL('home')}" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span>Villow</span></a><div class="site-directory-standard" data-directory-standard><nav class="preview-site-nav n-header-nav" aria-label="Main navigation"><div class="site-directory-primary"><a href="${previewPageURL('help')}">${labels[0]}</a></div><a class="preview-site-cta n-header-cta" href="${previewPageURL('setup')}">${labels[1]}</a></nav></div><button class="site-directory-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-directory-panel" data-directory-toggle hidden><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8h18"/><path d="M3 16h18"/></svg></button><section class="site-directory-panel" id="site-directory-panel" aria-label="More about Villow" aria-hidden="true" inert><div class="site-directory-content" data-directory-content>${directoryContent(directoryVariant)}</div></section></header>`;
 return `<header class="preview-site-header ${home?'i-header i-width':'sp-header'}"><a class="preview-site-brand ${home?'i-brand':'sp-brand'}" href="${previewPageURL('home')}" aria-label="Villow home"><img src="assets/villow-mark-small-on-light.svg" width="25" height="28" alt=""><span>Villow</span></a><nav class="preview-site-nav n-header-nav" aria-label="Main navigation"><a href="${previewPageURL('home')}#feed-to-watch-later">How it works</a><a href="${previewPageURL('home')}#beyond-watching">Our approach</a><a class="preview-site-cta n-header-cta" href="${previewPageURL('setup')}">Get started</a></nav></header>`;
}

export function applyPreviewHeader(html,{home=false,directory=true,directoryVariant='34'}={}) {
 html=html.replace(/<header class="[^"]*\b(?:i-header|sp-header)\b[^"]*"[^>]*>[\s\S]*?<\/header>/,previewHeader({home,directory,directoryVariant}));
 html=applyPreviewFooter(html);
 // Load the shared header after page-specific CSS, in the same order everywhere.
 const styles=['preview-header.css',...(directory?['site-directory.css']:[]),'preview-footer.css',...(directory&&directoryVariant?['navigation-studies.css']:[])];
 if(directory&&!html.includes('href="footer-spidey.css"'))html=html.replace('</head>','<link rel="stylesheet" href="footer-spidey.css"></head>');
 for(const file of styles)html=html.replaceAll(`<link rel="stylesheet" href="${file}">`,'');
 if(directory)html=html.replaceAll('<script type="module" src="site-directory.js"></script>','');
 html=html.replace('</head>',styles.map(file=>`<link rel="stylesheet" href="${file}">`).join('')+(directory?'<script type="module" src="site-directory.js"></script>':'')+'</head>');
 return html;
}
