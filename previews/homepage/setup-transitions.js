// Fade out before changing content, then settle to its natural height.
// Cancelling drops an obsolete pending choice; finish commits it (e.g. resize).
export function createSetupTransition(container, reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches && !document.body.hasAttribute('data-setup-preview-motion')) {
 let animations = [], pendingChange, sequence = 0;
 const releaseHeight = () => {
  if (!container) return;
  container.style.height = '';
  container.classList.remove('is-transitioning');
 };
 const cancel = () => {
  sequence++;
  pendingChange = null;
  animations.forEach(animation => {animation.onfinish = null; animation.cancel();});
  animations = [];
  releaseHeight();
 };
 const finish = () => {const change = pendingChange; cancel(); change?.();};
 const run = (change, {outgoing, incoming, animate = true} = {}) => {
  const previousHeight = container && !container.hidden ? container.getBoundingClientRect().height : 0;
  const previousOpacity = outgoing && !outgoing.hidden ? getComputedStyle(outgoing).opacity : '1';
  cancel();
  if (!animate || !container?.animate) {change(); return;}
  const ticket = sequence;
  const reduced = reducedMotion();
  if (!reduced) {
   container.style.height = `${previousHeight}px`;
   container.classList.add('is-transitioning');
  }
  let exit;
  const commit = () => {
   if (ticket !== sequence) return;
   pendingChange = null;
   change();
   exit?.cancel();
   if (container.hidden) {releaseHeight(); return;}
   if (!reduced) {
    container.style.height = '';
    const nextHeight = container.getBoundingClientRect().height;
    container.style.height = `${previousHeight}px`;
    const size = container.animate([{height:`${previousHeight}px`},{height:`${nextHeight}px`}],{duration:320,easing:'cubic-bezier(.22,.61,.36,1)'});
    size.onfinish = () => {if (ticket === sequence) releaseHeight();};
    animations.push(size);
   }
   const target = typeof incoming === 'function' ? incoming() : incoming;
   if (target && !target.hidden) animations.push(target.animate([{opacity:0},{opacity:1}],{duration:reduced?200:260,easing:'ease-out'}));
  };
  pendingChange = change;
  if (outgoing?.animate && !outgoing.hidden) {
   exit = outgoing.animate([{opacity:previousOpacity},{opacity:0}],{duration:reduced?90:120,easing:'ease-in',fill:'forwards'});
   exit.onfinish = commit;
   animations.push(exit);
  } else commit();
 };
 return {run,cancel,finish};
}
