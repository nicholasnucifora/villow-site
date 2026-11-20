import {sViews,sInspect,sGeometry} from './s-insights-data.js';
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
for(const visual of document.querySelectorAll('.si-insights')){
 const controls=visual.querySelector('[data-si-switch]'),buttons=[...visual.querySelectorAll('[data-si-view]')],panels=new Map([...visual.querySelectorAll('[data-si-panel]')].map(panel=>[panel.dataset.siPanel,panel]));
 const plot=visual.querySelector('[data-si-plot]'),tooltip=visual.querySelector('[data-si-tooltip]'),tipLabel=visual.querySelector('[data-si-tooltip-label]'),tipValue=visual.querySelector('[data-si-tooltip-value]'),tipUnit=visual.querySelector('[data-si-tooltip-unit]'),status=visual.querySelector('[data-si-status]');
 if(!controls||buttons.length!==4||panels.size!==4||!plot||!tooltip||!tipLabel||!tipValue||!tipUnit||!status)continue;
 let current=sViews[0],selected=null,mode='pointer',transition=null,pending=null,frame=0;
 controls.hidden=false;
 function cancelPending(){if(frame)cancelAnimationFrame(frame);frame=0;pending=null;}
 function hide(){cancelPending();selected=null;tooltip.hidden=true;for(const panel of panels.values()){panel.querySelector('[data-si-guide]').hidden=true;panel.querySelector('[data-si-dot]').hidden=true;for(const bar of panel.querySelectorAll('[data-si-bar]'))bar.classList.remove('is-selected');}}
 function show(fraction,announce=false){
  visual.dataset.siTouched='true';
  const detail=sInspect(current,fraction),panel=panels.get(current.key),drawing=panel.querySelector('.si-drawing');
  selected=detail.fraction;
  const vertical=(sGeometry.bottom-detail.value/current.max*(sGeometry.bottom-sGeometry.top))/sGeometry.height;
  const guide=panel.querySelector('[data-si-guide]'),dot=panel.querySelector('[data-si-dot]');
  guide.style.left=`${selected*100}%`;guide.style.top=`${vertical*100}%`;guide.hidden=!!current.bars;
  dot.style.left=`${selected*100}%`;dot.style.top=`${vertical*100}%`;dot.hidden=!!current.bars;
  const barIndex=Math.floor(selected*current.values.length);
  for(const bar of panel.querySelectorAll('[data-si-bar]'))bar.classList.toggle('is-selected',Number(bar.dataset.siBar)===barIndex);
  tipLabel.textContent=detail.label;tipValue.textContent=detail.display;tipUnit.textContent=detail.unit;tooltip.hidden=false;
  const bounds=drawing.getBoundingClientRect(),root=plot.getBoundingClientRect(),pointX=bounds.left-root.left+selected*bounds.width,pointY=bounds.top-root.top+vertical*bounds.height;
  const left=Math.max(3,Math.min(root.width-tooltip.offsetWidth-3,pointX-tooltip.offsetWidth/2));
  tooltip.style.left=`${left}px`;
  // Always above the same curve point. There is no threshold that flips it below.
  tooltip.style.top=`${pointY-tooltip.offsetHeight-10}px`;
  tooltip.style.setProperty('--si-caret-x',`${pointX-left}px`);
  if(announce)status.textContent=`${detail.label}: ${detail.display} ${detail.unit}.`;
 }
 function fromPointer(event,immediate=false){
  const bounds=panels.get(current.key).querySelector('.si-drawing').getBoundingClientRect();
  if(event.clientY<bounds.top||event.clientY>bounds.bottom||event.clientX<bounds.left||event.clientX>bounds.right){if(mode==='pointer')hide();return;}
  const fraction=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
  if(immediate){cancelPending();show(fraction);return;}
  pending=fraction;
  if(!frame)frame=requestAnimationFrame(()=>{frame=0;const next=pending;pending=null;if(next!==null)show(next);});
 }
 plot.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){mode='pointer';fromPointer(event);}});
 plot.addEventListener('pointerdown',event=>{mode=event.pointerType==='mouse'?'pointer':'touch';fromPointer(event,true);});
 plot.addEventListener('pointerleave',()=>{if(mode==='pointer')hide();});
 plot.addEventListener('focus',()=>{if(selected===null){mode='keyboard';show(.5,true);}});
 plot.addEventListener('blur',hide);
 plot.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();hide();return;}
  let next;
  const step=current.bars?1/current.values.length:current.key==='day'?(event.shiftKey?15:1)/1440:(event.shiftKey?10:1)/600;
  if(event.key==='ArrowRight')next=(selected??(current.bars?-.5/current.values.length:-step))+step;
  else if(event.key==='ArrowLeft')next=(selected??(current.bars?1+.5/current.values.length:1+step))-step;
  else if(event.key==='Home')next=current.bars ? .5/current.values.length : 0;
  else if(event.key==='End')next=current.bars?1-.5/current.values.length:1;
  else return;
  event.preventDefault();cancelPending();mode='keyboard';show(next,true);
 });
 for(const button of buttons)button.addEventListener('click',()=>{
  const next=sViews.find(view=>view.key===button.dataset.siView);if(!next||next.key===current.key)return;
  transition?.cancel();hide();visual.dataset.siTouched='true';current=next;
  for(const [key,panel] of panels)panel.hidden=key!==current.key;
  for(const candidate of buttons)candidate.setAttribute('aria-pressed',String(candidate===button));
  plot.setAttribute('aria-label',`${current.label} chart: ${current.measure}.`);status.textContent='';
  if(!reduced.matches&&typeof plot.animate==='function')transition=plot.animate([{opacity:.6},{opacity:1}],{duration:160,easing:'ease-out'});
 });
 reduced.addEventListener('change',event=>{if(event.matches)transition?.cancel();});
 window.addEventListener('resize',()=>{if(selected!==null)show(selected);});
}




