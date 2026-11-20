// Preview-only navigation: compare the same section across independently served designs.
import {addControlStudyLinks} from './homepage-control-presets.js';
const parameter = 'study-position';
const topics = ['streaks', 'sidebar', 'usage', 'social'];
const landmarks = [
 ['hero','.i-hero'], ['overview','#i-controls'], ['feed','#feed-to-watch-later'], ['integrated','#built-into-watching'],
 ['limits','.sl-limits,.gw-limits,.rf-boundaries,.eb-boundaries,.fs-boundaries,.vh-feed-limit'],
 ['control','#your-control'],
 ['insights','.it-section,.ci-story,.vh-story,.gw-reflection,.rf-insights,#o-viewing,.fs-boundaries'],
 ['devices','#across-devices'], ['social','.n-social-header,.t-social-intro'],
 ['together','#watch-together'], ['sharing','#good-company'], ['comparison','.xl-intro'],
 ['concepts','.rd-concepts,.xl-concepts'], ['practical','.fs-practical'], ['closing','#help-shape-web'], ['footer','.n-footer,footer'],
];
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const round = n => Math.round(n*100000)/100000;

export function decodeStudyPosition(value) {
 try {
  const s = JSON.parse(value);
  if (s?.v!==1 || typeof s.k!=='string' || !landmarks.some(([k])=>k===s.k) && !topics.some(topic=>s.k===`comparison:${topic}`)) return null;
  if (![s.f,s.y,s.r].every(Number.isFinite) || s.f < -2 || s.f > 3 || s.y < 0 || s.y > 1 || s.r < 0 || s.r > 1) return null;
  return {v:1,k:s.k,f:s.f,y:s.y,r:s.r,...(topics.includes(s.t)?{t:s.t}:{}),...(['pattern','villow'].includes(s.s)?{s:s.s}:{})};
 } catch { return null; }
}

export function studyPositionURL(base,state) {
 const url = new URL(base), version = url.pathname.match(/\/([b-w])\.html$/)?.[1];
 // Keep the short device section aligned under the rail when comparing its art.
 if (state.k==='devices') {
  url.searchParams.delete(parameter);
  url.hash='across-devices';
  return url.href;
 }
 const hashes = {feed:'feed-to-watch-later',limits:version==='b'?'o-limits':'room-for-your-day',insights:version==='b'?'o-viewing':'room-for-your-day',social:version==='b'?'watch-with-people':'good-company',together:'watch-together',sharing:'good-company',comparison:'beyond-watching',concepts:version==='b'?'xl-concept-heading':'rd-concepts-heading',closing:'help-shape-web'};
 url.searchParams.set(parameter,JSON.stringify(state));
 url.hash = state.k==='control' ? 'your-control' : hashes[state.k] || (state.k.startsWith('comparison:') ? `xl-topic-${state.k.split(':')[1]}` : '');
 return url.href;
}

// The point within a semantic section stays at the same place in the viewport.
export function studyScrollTarget(state,rect,scrollY,height,maximum) {
 return clamp(rect ? scrollY+rect.top+rect.height*state.f-height*state.y : maximum*state.r,0,maximum);
}

function pageLandmarks() {
 const entries = landmarks.map(([key,selector])=>({key,element:document.querySelector(selector)}));
 for (const element of document.querySelectorAll('[data-xl-topic]')) entries.push({key:`comparison:${element.dataset.xlTopic}`,element});
 return entries.map(item=>({...item,rect:item.element?.getBoundingClientRect()})).filter(item=>item.rect?.width>0 && item.rect.height>1 && !item.element.closest('[hidden]'));
}

function capturePosition() {
 const height = innerHeight, railBottom = document.querySelector('.study-navigation')?.getBoundingClientRect().bottom || 0;
 const point = clamp(Math.max(height*.42,railBottom+24),0,height*.7);
 const entries = pageLandmarks(), distance = r=>Math.max(r.top-point,point-r.bottom,0)+Math.abs(r.top+r.height/2-point)*.001;
 entries.sort((a,b)=>distance(a.rect)-distance(b.rect));
 let chosen = entries[0];
 // Side-by-side social examples may be equally visible. Honour a nearby explicit
 // section anchor so switching to an older, stacked design retains that story.
 const anchored = entries.find(item=>item.element.id && `#${item.element.id}`===location.hash);
 if (anchored && anchored.rect.top < height*.75) {
  const visibleDeviceAnchor = anchored.element.id==='across-devices' && anchored.rect.bottom > railBottom;
  if (visibleDeviceAnchor || anchored.rect.bottom > point && distance(anchored.rect) <= distance(chosen.rect)+Math.min(80,height*.12)) chosen=anchored;
 }
 const maximum = Math.max(0,document.documentElement.scrollHeight-height);
 const tab = document.querySelector('[data-l-topic][aria-selected="true"]');
 const row = tab ? document.querySelector(`[data-xl-topic="${tab.dataset.lTopic}"]`) : document.querySelector('.rd-topic-button[aria-expanded="true"]')?.closest('[data-xl-topic]');
 const topic = chosen?.key.startsWith('comparison:') ? chosen.key.split(':')[1] : tab?.dataset.lTopic || row?.dataset.xlTopic;
 const side = row?.dataset.xcSelected || document.querySelector('[data-xc-select][aria-pressed="true"]')?.dataset.xcSelect;
 return {v:1,k:chosen?.key||'hero',f:round(chosen?clamp((point-chosen.rect.top)/chosen.rect.height,-2,3):0),y:round(point/height),r:round(maximum?clamp(scrollY/maximum,0,1):0),...(topic?{t:topic}:{}),...(side?{s:side}:{})};
}

function restoreComparison(state) {
 if (state.t) {
  const tab = document.querySelector(`[data-l-topic="${state.t}"]`);
  if (tab && tab.getAttribute('aria-selected')!=='true') tab.click();
  else if (!tab) {
   const button = document.querySelector(`[data-xl-topic="${state.t}"] .rd-topic-button`);
   if (button && button.getAttribute('aria-expanded')!=='true') button.click();
  }
 }
 if (state.s) {
  const shared = document.querySelector(`[data-xc-select="${state.s}"]`);
  if (shared) shared.click();
  else for (const row of document.querySelectorAll('[data-xl-topic]')) if (row.dataset.xcSelected!==state.s) row.querySelector('[data-xc-toggle]')?.click();
 }
}

const frame = ()=>new Promise(resolve=>requestAnimationFrame(resolve));
async function bounded(promise,ms) {
 let timer;
 await Promise.race([promise,new Promise(resolve=>{timer=setTimeout(resolve,ms);})]);
 clearTimeout(timer);
}

function setup() {
 const nav = document.querySelector('.study-navigation .preview-tabs');
 if (!nav) return;
 addControlStudyLinks(nav);
 const links = [...nav.querySelectorAll('a')], current = nav.querySelector('[aria-current="page"]');
 if (current) {
  const start = nav.clientWidth>=700 ? links[Math.max(0,links.indexOf(current)-2)] : current;
  nav.scrollLeft = Math.max(0,start.offsetLeft-nav.offsetLeft);
 }
 const originals = new Map(links.map(link=>[link,link.href]));
 let activationState = null;
 const refresh = event=>{
  const link = event?.target?.closest?.('a'), state = activationState || capturePosition();
  for (const choice of link && originals.has(link)?[link]:links) choice.href=studyPositionURL(originals.get(choice),state);
 };
 // Focusing a link in the sticky rail can scroll the page before click fires.
 // Keep the section captured before that focus for the whole activation.
 nav.addEventListener('pointerdown',event=>{activationState=capturePosition();refresh(event);},{capture:true});
 nav.addEventListener('pointerup',()=>setTimeout(()=>{activationState=null;},0));
 nav.addEventListener('pointercancel',()=>{activationState=null;});
 // Enrich the native href before ordinary/keyboard/modified/new-tab navigation.
 for (const type of ['click','auxclick','contextmenu','focusin','dragstart']) nav.addEventListener(type,refresh,{capture:true});
 refresh();
 const state = decodeStudyPosition(new URL(location.href).searchParams.get(parameter));
 if (!state) return; // Ordinary bookmarks and section anchors keep native behavior.
 const previousRestoration = history.scrollRestoration;
 history.scrollRestoration = 'manual';
 let cancelled = false;
 const cancel = ()=>{cancelled=true;}, inputs = ['wheel','touchstart','pointerdown','keydown'];
 for (const type of inputs) window.addEventListener(type,cancel,{passive:true,once:true});
 const restore = async()=>{
  try {
   restoreComparison(state);
   await frame();
   const animations = document.querySelector('[data-xc-comparison]')?.getAnimations({subtree:true}).filter(a=>Number.isFinite(a.effect?.getComputedTiming().endTime)) || [];
   // Lazy images elsewhere must never delay this single restoration.
   await Promise.all([bounded(document.fonts?.ready||Promise.resolve(),700),bounded(Promise.allSettled(animations.map(a=>a.finished)),550)]);
   await frame(); await frame();
   if (cancelled) return;
   const target = pageLandmarks().find(item=>item.key===state.k), maximum = Math.max(0,document.documentElement.scrollHeight-innerHeight);
   const root = document.documentElement, oldBehavior = root.style.scrollBehavior;
   root.style.scrollBehavior='auto';
   window.scrollTo({top:studyScrollTarget(state,target?.rect,scrollY,innerHeight,maximum),behavior:'instant'});
   root.style.scrollBehavior=oldBehavior;
   window.dispatchEvent(new CustomEvent('study-position-restored',{detail:{key:state.k,semantic:!!target}}));
  } finally {
   for (const type of inputs) window.removeEventListener(type,cancel);
   history.scrollRestoration=previousRestoration;
   const clean = new URL(location.href); clean.searchParams.delete(parameter);
   history.replaceState(history.state,'',clean);
   refresh();
  }
 };
 if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',restore,{once:true});
 else restore();
}

if (typeof document!=='undefined') setup();
