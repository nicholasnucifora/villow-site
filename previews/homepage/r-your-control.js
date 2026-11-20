const stories = document.querySelector('.r-control-stories');
if (stories) {
  const slides = [...stories.querySelectorAll('.r-control-example')];
  const button = stories.querySelector('.r-control-playback');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  let current = 0;
  let timer;
  let visible = false;
  let paused = false;
  let hovered = false;
  let focused = false;
  const staticMode = () => motion.matches && !body.hasAttribute('data-r-preview-motion');
  function schedule() {
    clearTimeout(timer);
    if (visible && !document.hidden && !paused && !hovered && !focused && !staticMode()) {
      timer = setTimeout(() => { next(); schedule(); }, 6500);
    }
  }
  function next() {
    slides[current].classList.remove('is-current');
    slides[current].setAttribute('aria-hidden', 'true');
    slides[current].inert = true;
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-current');
    slides[current].removeAttribute('aria-hidden');
    slides[current].inert = false;
  }
  function updateControl() {
    const label = staticMode() ? 'Show next example' : paused ? 'Resume examples' : 'Pause examples';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.toggleAttribute('data-paused', paused);
    button.toggleAttribute('data-static', staticMode());
    schedule();
  }
  button.addEventListener('click', () => {
    if (staticMode()) next();
    else paused = !paused;
    updateControl();
  });
  // Leave time to read, and do no work while the section or tab is out of view.
  stories.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; schedule(); } });
  stories.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  stories.addEventListener('focusin', () => { focused = true; schedule(); });
  stories.addEventListener('focusout', event => { if (!stories.contains(event.relatedTarget)) { focused = false; schedule(); } });
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', schedule);
  motion.addEventListener('change', updateControl);
  new MutationObserver(updateControl).observe(body, {attributes:true, attributeFilter:['data-r-preview-motion']});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold:0.4}).observe(stories);
  } else visible = true;
  stories.classList.add('is-ready');
  button.hidden = false;
  updateControl();
}
