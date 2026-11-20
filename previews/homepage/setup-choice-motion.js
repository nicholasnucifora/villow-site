import {createAnimatedDisclosure} from './disclosure-motion.js';
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !document.body.hasAttribute('data-setup-preview-motion');
const easing = 'cubic-bezier(.22,.61,.36,1)';

// A single surface becomes two joined halves before the gap opens. Only the
// backgrounds resize; text retains its normal proportions throughout.
export function splitCardSurfaces(cards, stacked) {
 if (cards.length !== 1) return cards.map(card=>({...card,borderRadius:'12px 12px 12px 12px'}));
 const card = cards[0];
 return stacked ? [
  {...card,height:card.height/2,borderRadius:'12px 12px 0px 0px'},
  {...card,top:card.top+card.height/2,height:card.height/2,borderRadius:'0px 0px 12px 12px'},
 ] : [
  {...card,width:card.width/2,borderRadius:'12px 0px 0px 12px'},
  {...card,left:card.left+card.width/2,width:card.width/2,borderRadius:'0px 12px 12px 0px'},
 ];
}

export function createRecommendationTransition(container, reducedMotion = prefersReducedMotion) {
 const panels = [...container.querySelectorAll('[data-result]')];
 let animations = [], layer, pendingChange, sequence = 0;
 const activePanel = () => panels.find(panel=>!panel.hidden);
 const stacked = () => matchMedia('(max-width:500px)').matches;
 const frame = rect => Object.fromEntries(Object.entries(rect).map(([key,value])=>[key,typeof value==='number'?`${value}px`:value]));
 const geometry = elements => {
  const origin = container.getBoundingClientRect();
  return elements.map(element=>{
   const rect = element.getBoundingClientRect();
   return {left:rect.left-origin.left,top:rect.top-origin.top,width:rect.width,height:rect.height};
  });
 };
 const cards = () => [...(activePanel()?.querySelectorAll('.setup-option-cards article') || [])];
 const measure = () => {
  container.style.removeProperty('--setup-card-height');
  if (stacked() || container.hidden) return;
  // Measure the real copy at the available width, including font/zoom changes.
  // Hidden alternatives never paint or become focusable during this sync pass.
  let height = 0;
  panels.forEach(panel=>{
   const hidden = panel.hidden;
   panel.classList.add('is-measuring');
   panel.hidden = false;
   height = Math.max(height,panel.querySelector('.setup-option-cards').getBoundingClientRect().height);
   panel.hidden = hidden;
   panel.classList.remove('is-measuring');
  });
  container.style.setProperty('--setup-card-height',`${height}px`);
 };
 const cancel = () => {
  sequence++;
  pendingChange = null;
  animations.forEach(animation=>{animation.onfinish=null;animation.cancel();});
  animations = [];
  layer?.remove(); layer=null;
  container.classList.remove('is-morphing','is-transitioning');
  container.style.height = '';
 };
 const finish = () => {const change=pendingChange;cancel();change?.();measure();};
 const makeLayer = surfaces => {
  layer = document.createElement('div');
  layer.className = 'setup-card-surfaces';
  layer.setAttribute('aria-hidden','true');
  surfaces.forEach(surface=>{
   const shape = document.createElement('div');
   Object.assign(shape.style,frame(surface));
   layer.append(shape);
  });
  container.append(layer);
  container.classList.add('is-morphing');
 };
 const run = (change,{animate=true,outgoing,incoming}={}) => {
  const oldHeight = container.hidden ? 0 : container.getBoundingClientRect().height;
  const oldSurfaces = layer ? geometry([...layer.children]).map((rect,index)=>({...rect,borderRadius:getComputedStyle(layer.children[index]).borderRadius})) : splitCardSurfaces(geometry(cards()),stacked());
  cancel();
  if (!animate || !container.animate) {change();measure();return;}
  const ticket = sequence, reduced = reducedMotion();
  if (oldSurfaces.length) makeLayer(oldSurfaces);
  container.style.height = `${oldHeight}px`;
  container.classList.add('is-transitioning');
  let exit;
  const commit = () => {
   if (ticket !== sequence) return;
   pendingChange = null;
   change(); measure();
   exit?.cancel();
   container.style.height = '';
   const nextHeight = container.getBoundingClientRect().height;
   const nextSurfaces = splitCardSurfaces(geometry(cards()),stacked());
   if (!layer) makeLayer(nextSurfaces);
   [...layer.children].forEach((shape,index)=>{
    const next = frame(nextSurfaces[index]);
    Object.assign(shape.style,next);
    if (!reduced && oldSurfaces[index]) animations.push(shape.animate([frame(oldSurfaces[index]),next],{duration:360,easing}));
   });
   if (!reduced && oldHeight) {
    container.style.height = `${oldHeight}px`;
    animations.push(container.animate([{height:`${oldHeight}px`},{height:`${nextHeight}px`}],{duration:360,easing,fill:'forwards'}));
   }
   const target = typeof incoming==='function' ? incoming() : incoming;
   // The frame begins moving before the new text appears. The surrounding
   // surface stays solid instead of flashing through the page background.
   const enter = target.animate([{opacity:0,offset:0},{opacity:0,offset:reduced?0:.22},{opacity:1,offset:1}],{duration:reduced?140:360,easing:'ease-out'});
   animations.push(enter);
   enter.onfinish = () => {if(ticket===sequence) cancel();};
  };
  pendingChange = change;
  if (outgoing && !outgoing.hidden) {
   exit = outgoing.animate([{opacity:1},{opacity:0}],{duration:80,easing:'ease-out',fill:'forwards'});
   exit.onfinish = commit; animations.push(exit);
  } else commit();
 };
 return {run,cancel,finish};
}

export function createStoryDisclosure(details,options={}) {
 return createAnimatedDisclosure(details,{...options,contentSelector:'.setup-story-content'});
}
