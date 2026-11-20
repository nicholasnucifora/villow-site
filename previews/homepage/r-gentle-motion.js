// Progressive enhancement: content is visible without JS or motion support.
const root = document.querySelector('.version-r-motion');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let previewMotion = false;
let clearArrival = () => {};
function setupArrival() {
 if (!root || motion.matches && !previewMotion || !('IntersectionObserver' in window)) return;
  const groups = [...root.querySelectorAll('.wf-layout, .r-control, .it-section, .n-social-inner')];
  const pending = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || !pending.has(entry.target)) continue;
      reveal(entry.target, true);
    }
  }, {rootMargin:'0px 0px -40px 0px', threshold:0});
  function reveal(group, animate) {
    pending.delete(group);
    observer.unobserve(group);
    group.classList.remove('r-arrival-pending');
    if (animate && (!motion.matches || previewMotion)) {
      group.classList.add('r-arrival-entering');
      group.addEventListener('animationend', () => group.classList.remove('r-arrival-entering'), {once:true});
    }
  }
  // Direct anchors/preset comparisons show their current section immediately;
  // only below-viewport content is queued for a first entrance.
  const anchor = document.getElementById(location.hash.slice(1));
  for (const group of groups) {
    if (group.getBoundingClientRect().top < innerHeight || anchor && (group.contains(anchor) || anchor.contains(group))) continue;
    pending.add(group);
    group.classList.add('r-arrival-pending');
    observer.observe(group);
  }
  function revealVisible() {
    for (const group of pending) {
      const bounds = group.getBoundingClientRect();
      if (bounds.top < innerHeight && bounds.bottom > 0) reveal(group, false);
    }
  }
  window.addEventListener('study-position-restored', revealVisible);
  window.addEventListener('pageshow', revealVisible);
  // Keyboard focus must never land in visually hidden content.
  const revealFocused = event => {
    for (const group of pending) if (group.contains(event.target)) reveal(group, false);
  };
  root.addEventListener('focusin', revealFocused);
  clearArrival = () => {
    for (const group of pending) reveal(group, false);
    for (const group of groups) group.classList.remove('r-arrival-entering');
    observer.disconnect();
    root.removeEventListener('focusin', revealFocused);
    window.removeEventListener('study-position-restored', revealVisible);
    window.removeEventListener('pageshow', revealVisible);
  };
}
setupArrival();
// This belongs only to the design-study rail, never the product navigation.
// An explicit opt-in lets this motion study be reviewed on reduced-motion devices.
if (root && motion.matches) {
 const status = root.querySelector('.preview-rail-status');
 const control = document.createElement('button');
 control.type = 'button';
 control.className = 'r-motion-preview';
 control.textContent = 'Preview motion';
 control.setAttribute('aria-pressed', 'false');
 control.addEventListener('click', () => {
   previewMotion = !previewMotion;
   clearArrival();
   root.toggleAttribute('data-r-preview-motion', previewMotion);
   control.setAttribute('aria-pressed', String(previewMotion));
   control.textContent = previewMotion ? 'Motion on' : 'Preview motion';
   if (previewMotion) setupArrival();
 });
 status?.replaceWith(control);
}
motion.addEventListener('change', () => {
 clearArrival();
 setupArrival();
});
