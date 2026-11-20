import {previewPageURL,latestPreviewURL,previewPages} from './preview-pages.js';

// Progressive enhancement only: the native details and links work without JS.
// Saved HTML is localised at build time. This also keeps older study renderers'
// freshly generated entry points within the local page family.
// Link-backed controls should click normally without producing native drag ghosts.
document.addEventListener('dragstart',event=>{
 if(event.target.closest?.('a,button,[role="button"]'))event.preventDefault();
});
for(const menu of document.querySelectorAll('.study-page-options')){
 for(const [page,{label}] of Object.entries(previewPages)){
  let link=[...menu.querySelectorAll('a')].find(item=>item.textContent.trim()===label);
  if(!link){link=document.createElement('a');link.textContent=label;menu.append(link);}
  link.href=previewPageURL(page);
 }
}
for(const link of document.querySelectorAll('a[href]')){
 // An explicit preset choice stays explicit. Page-to-page navigation goes to
 // the rightmost registered preset, including from saved historical pages.
 if(link.closest('.preview-tabs') || link.getAttribute('href')?.startsWith('#'))continue;
 link.href=latestPreviewURL(link.href);
}
for(const item of document.querySelectorAll('.n-footer-nav li>span, .sp-footer-nav li>span')){
 if(item.textContent.trim()!=='How to help')continue;
 const link=document.createElement('a');link.href=previewPageURL('help');link.textContent=item.textContent;item.replaceWith(link);
}
for(const link of document.querySelectorAll('a[href="https://villow.app/download"],a[href="https://villow.app/roadmap#ideas"],a.rd-concepts-link,a.xl-concept-link,a.xl-concepts-link')){
 const setup=link.getAttribute('href')==='https://villow.app/download';
 link.href=previewPageURL(setup?'setup':'concepts');
 for(const name of ['target','rel','aria-disabled','role','tabindex','data-a-concepts-placeholder'])link.removeAttribute(name);
}
for(const item of document.querySelectorAll('.n-footer-nav li>span')){
 if(item.textContent.trim()!=='Get started')continue;
 const link=document.createElement('a');
 link.href=previewPageURL('setup');
 link.textContent=item.textContent;
 item.replaceWith(link);
}

const pickers=[...document.querySelectorAll('.study-page-picker')];
for(const picker of pickers){
 picker.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&picker.open){
   picker.open=false;
   picker.querySelector('summary')?.focus();
   event.preventDefault();
  }
 });
 picker.addEventListener('click',event=>{
  if(event.target.closest('a'))picker.open=false;
 });
}
document.addEventListener('pointerdown',event=>{
 for(const picker of pickers)if(picker.open&&!picker.contains(event.target))picker.open=false;
});

// Secondary pages have their own preset rail. Homepage
// scrolling/position preservation remains owned by study-navigation-scroll.js.
for(const nav of document.querySelectorAll('[data-study-series="page-studies"] .preview-tabs')){
 const current=nav.querySelector('[aria-current="page"]');
 if(current)nav.scrollLeft=Math.max(0,current.offsetLeft-nav.offsetLeft);
}

// Keep the setup return choice when comparing hosting-guide presets.
for(const rail of document.querySelectorAll('[data-study-page="setup-hosting"]')){
 const path=new URLSearchParams(window.location.search).get('path');
 if(['web','both','all'].includes(path)){
  for(const link of rail.querySelectorAll('.preview-tabs a')){
   const destination=new URL(link.href); destination.searchParams.set('path',path); link.href=destination.href;
  }
 }
}

// Compare design concepts using ordinary native hash links.
// The hero keeps an unanchored destination; no scroll state is stored.
for(const rail of document.querySelectorAll('[data-study-page="concepts"]')){
 const links=[...rail.querySelectorAll('.preview-tabs a')].map(link=>{
  const [base,anchor]=link.getAttribute('href').split('#');
  return {link,base,focusAI:anchor==='ai'};
 });
 const topics=[...document.querySelectorAll('.concepts-topic[id],.cb-section[id]')];
 const hero=document.querySelectorAll('.concepts-hero,.cb-hero')[0];
 function linkedHashTopic(){
  let target;
  try{target=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));}catch{}
  return target?.closest('.concepts-topic[id],.cb-section[id]');
 }
 // Preserve a requested topic through native anchor/focus positioning until
 // the visitor explicitly starts reading elsewhere.
 let pendingHashTopic=linkedHashTopic();
 let activatingPreset=false;
 function updateConceptLinks(){
  if(activatingPreset)return;
  const line=Math.max(0,rail.getBoundingClientRect().bottom)+16;
  const positions=topics.map(topic=>({topic,rect:topic.getBoundingClientRect()}));
  const readingHero=hero&&hero.getBoundingClientRect().bottom>line;
  const visible=positions.filter(({rect})=>rect.bottom>line&&rect.top<window.innerHeight);
  let id=pendingHashTopic?.id||'';
  if(!id&&!readingHero){
   const linkedTopic=linkedHashTopic();
   // Native hash alignment and rail focus can leave the previous section a
   // few pixels below the rail. Keep a visibly linked topic through that shift.
   const linked=visible.find(({topic})=>topic===linkedTopic);
   const covering=visible.find(({rect})=>rect.top<=line);
   const nearest=linked||covering||visible[0];
   id=nearest?.topic.id||'';
  }
  const selectedIdea=id==='ai' ? document.querySelector('.cb-ai-panel[role="tabpanel"]:not([hidden])')?.id : '';
  for(const {link,base,focusAI} of links){
   const target=selectedIdea||(focusAI?'ai':id);
   link.setAttribute('href',`${base}${target?`#${encodeURIComponent(target)}`:''}`);
  }
 }
 let queued=false;
 function scheduleConceptLinks(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;updateConceptLinks();});
 }
 window.addEventListener('scroll',scheduleConceptLinks,{passive:true});
 window.addEventListener('resize',scheduleConceptLinks);
 window.addEventListener('hashchange',()=>{pendingHashTopic=linkedHashTopic();scheduleConceptLinks();});
 document.addEventListener('toggle',scheduleConceptLinks,true);
 document.addEventListener('ai-idea-change',scheduleConceptLinks);
 function cancelPendingHash(){
  if(!pendingHashTopic)return;
  pendingHashTopic=undefined;
  scheduleConceptLinks();
 }
 window.addEventListener('wheel',cancelPendingHash,{passive:true});
 window.addEventListener('touchmove',cancelPendingHash,{passive:true});
 window.addEventListener('pointerdown',event=>{if(!rail.contains(event.target))cancelPendingHash();});
 window.addEventListener('keydown',event=>{
  if(['Home','End','PageUp','PageDown','ArrowUp','ArrowDown',' '].includes(event.key))cancelPendingHash();
 });
 // Snapshot before focus can scroll the sticky rail. Leave native activation
 // alone: recomputing href on focus/click can change the destination mid-click.
 rail.addEventListener('pointerdown',event=>{
  if(!event.target.closest('.preview-tabs a'))return;
  updateConceptLinks();
  activatingPreset=true;
 });
 window.addEventListener('pointerup',()=>requestAnimationFrame(()=>{activatingPreset=false;}));
 window.addEventListener('pointercancel',()=>{activatingPreset=false;});
 rail.addEventListener('keydown',event=>{if(event.key==='Enter')updateConceptLinks();});
 updateConceptLinks();
}
