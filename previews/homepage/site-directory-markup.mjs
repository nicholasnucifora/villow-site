import {previewPageURL} from './preview-pages.js';
import {navigationStudies} from './navigation-studies.js';
import {siteLinks} from './site-links.mjs';

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// The app owns the live guest preview; the website only supplies its return link.
const demoURL=new URL('http://127.0.0.1:5173/demo');
demoURL.search=new URLSearchParams({return:'website',returnTo:previewPageURL('home')}).toString();

// The same menu is rendered on every page, even without a homepage-style footer.
export function directoryContent(variant='34',{navigationLabel='All site links',loading='eager',showContactEmail=false}={}){
 const study=navigationStudies[variant]||navigationStudies['34'];
 const destinations=[
  [previewPageURL('setup'),previewPageURL('concepts'),previewPageURL('setup-hosting')],
  ['/faq','/privacy',siteLinks.terms || null,previewPageURL('contact')],
  [siteLinks.discord,siteLinks.reddit,previewPageURL('help')],
  [demoURL.href,previewPageURL('partners'),siteLinks.appSource || null,siteLinks.fixTheWeb],
 ];
 const groups=study.groups.map(([heading,labels],group)=>`<div><h2>${escape(heading)}</h2><ul>${labels.map((label,item)=>{
  const href=destinations[group][item];
  return `<li>${href?`<a href="${escape(href)}"><span>${escape(label)}</span></a>`:`<span>${escape(label)}</span>`}</li>`;
 }).join('')}</ul></div>`).join('');
 const email=showContactEmail && siteLinks.contact?.startsWith('mailto:') ? siteLinks.contact.slice(7).split('?')[0] : '';
 const contactEmail=email ? `<a class="shared-footer-email" href="${escape(siteLinks.contact)}">${escape(email)}</a>` : '';
 return `<div class="n-footer-project"><a class="n-footer-brand" href="https://fixtheweb.org"><span class="footer-spidey" data-footer-spidey aria-hidden="true"><img class="footer-spidey-fallback" src="spidey/base-spider.svg" width="48" height="48" alt="" loading="${escape(loading)}" decoding="async"></span><span>${escape(study.project)}</span></a><p>${escape(study.description)}</p>${contactEmail}</div><nav class="n-footer-nav" aria-label="${escape(navigationLabel)}">${groups}</nav>`;
}
