// Upgrade only the existing project-credit badge. The link and visible name
// remain ordinary HTML, including when scripts or canvas are unavailable.
const slot = '<span class="footer-spidey" data-footer-spidey aria-hidden="true"><img class="footer-spidey-fallback" src="spidey/base-spider.svg" width="48" height="48" alt="" loading="lazy" decoding="async"></span>';

export function applyFooterSpidey(html) {
 const result=html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,anchor=>{
  const classes=anchor.match(/\bclass="([^"]*)"/)?.[1].split(/\s+/)||[];
  if(!classes.some(name=>name==='n-footer-brand'||name==='sp-footer-brand'))return anchor;
  if(!/\bhref="https:\/\/fixtheweb\.org\/?"/.test(anchor))return anchor;
  if(anchor.includes('data-footer-spidey'))return anchor;
  return anchor.replace(/<img\b[^>]*\bsrc="assets\/fixtheweb-spider\.svg"[^>]*>/,slot);
 });
 if(!result.includes('data-footer-spidey'))return result;
 let output=result;
 if(!output.includes('href="footer-spidey.css"'))output=output.replace('</head>','<link rel="stylesheet" href="footer-spidey.css"></head>');
 if(!output.includes('src="footer-spidey.js"')&&!output.includes('src="site-directory.js"'))output=output.replace('</body>','<script type="module" src="footer-spidey.js"></script></body>');
 return output;
}
