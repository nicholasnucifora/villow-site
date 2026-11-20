const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !document.body.hasAttribute('data-setup-preview-motion');
const easing = 'cubic-bezier(.22,.61,.36,1)';

// Native details fallback, reversible height easing and immediate keyboard exclusion on close.
export function createAnimatedDisclosure(details, {contentSelector,onOpen,reducedMotion=prefersReducedMotion}={}) {
 const summary = details?.querySelector('summary');
 const content = details?.querySelector(contentSelector);
 if (!summary || !content) return {open(){},close(){},finish(){}};
 let desiredOpen=details.open, animation, fade, sequence=0, targetHeight=0;
 const stop = () => {
  sequence++;
  if(animation){animation.onfinish=null;animation.cancel();animation=null;}
  if(fade){fade.onfinish=null;fade.cancel();fade=null;}
 };
 const finish = () => {
  stop(); details.open=desiredOpen;
  details.style.height=''; details.classList.remove('is-expanding');
  content.inert=!desiredOpen;
  summary.setAttribute('aria-expanded',String(desiredOpen));
 };
 const naturalHeight = () => {
  const height=details.style.height;
  details.style.height='';
  const measured=details.getBoundingClientRect().height;
  details.style.height=height;
  return measured;
 };
 const setOpen = (open, animate=true) => {
  const from=details.getBoundingClientRect().height;
  stop(); desiredOpen=open;
  summary.setAttribute('aria-expanded',String(open));
  content.inert=!open;
  if(open){details.open=true;onOpen?.();}
  if(!animate || !details.animate){finish();return;}
  const ticket=sequence;
  const reduced=reducedMotion();
  targetHeight=open ? naturalHeight() : summary.getBoundingClientRect().height;
  details.classList.add('is-expanding');
  details.style.height=`${from}px`;
  animation=details.animate([{height:`${from}px`},{height:`${targetHeight}px`}],{duration:reduced?0:400,easing,fill:'forwards'});
  fade=content.animate(open ? [{opacity:0},{opacity:1}] : [{opacity:1},{opacity:0}],{duration:reduced?140:200,delay:open&&!reduced?70:0,fill:'both'});
  (reduced?fade:animation).onfinish=()=>{if(ticket===sequence)finish();};
 };
 summary.addEventListener('click',event=>{event.preventDefault();setOpen(!desiredOpen);});
 // Keep programmatic/native changes and the no-JS details behavior compatible.
 details.addEventListener('toggle',()=>{
  if(details.open===desiredOpen || animation) return;
  desiredOpen=details.open;
  if(desiredOpen) onOpen?.();
  finish();
 });
 // The first demo render can settle after opening. Follow its natural height
 // while expanding rather than snapping at the end of the animation.
 if(typeof ResizeObserver!=='undefined') new ResizeObserver(()=>{
  if(animation && desiredOpen && Math.abs(naturalHeight()-targetHeight)>2) setOpen(true);
 }).observe(content);
 finish();
 return {open:({animate=true}={})=>setOpen(true,animate),close:()=>setOpen(false,false),finish};
}
