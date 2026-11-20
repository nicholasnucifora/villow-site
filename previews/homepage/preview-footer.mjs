import {directoryContent} from './site-directory-markup.mjs';

// Preserve each page's surrounding scenery, legal note and preview label.
// The actual footer links/branding come from the same source as the top menu.
export function applyPreviewFooter(html){
 return html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/g,footer=>{
  const className=footer.match(/^<footer[^>]*class="([^"]*)"/)?.[1]||'';
  const classes=className.split(/\s+/);
  const baseClass=classes.find(name=>name==='n-footer'||name==='sp-footer')||'';
  // Cards also use semantic footers for their actions. Only replace site footers.
  if(!classes.some(name=>['n-footer','sp-footer','i-preview-note','shared-preview-footer'].includes(name)))return footer;
  const bottom=footer.match(/<div class="(?:n-footer-bottom|sp-footer-bottom|shared-footer-bottom)">([\s\S]*?)<\/div>/)?.[1]
   ||footer.match(/^<footer[^>]*>([\s\S]*?)<\/footer>$/)?.[1]||'';
  const disclaimer=footer.match(/<p class="(?:sp-footer-disclaimer|shared-footer-disclaimer)">([\s\S]*?)<\/p>/)?.[1];
  return `<footer class="${baseClass?baseClass+' ':''}shared-preview-footer" data-directory-variant="34" aria-label="Footer"><div class="shared-footer-inner">${directoryContent('34',{navigationLabel:'Footer navigation',loading:'lazy',showContactEmail:true})}<div class="shared-footer-bottom">${bottom}</div>${disclaimer?`<p class="shared-footer-disclaimer">${disclaimer}</p>`:''}</div></footer>`;
 });
}
