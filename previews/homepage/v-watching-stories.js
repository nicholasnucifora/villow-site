const carousel = document.querySelector('.v-watching-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-watching-story]')];
  const controls = carousel.querySelector('.v-watching-controls');
  const pause = carousel.querySelector('.v-watching-pause');
  const markers = [...carousel.querySelectorAll('[data-watching-select]')];
  const announcement = carousel.querySelector('.v-watching-announcement');
  const stage = carousel.querySelector('.v-watching-stage');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, timer, visible = false, paused = false, hovered = false, focused = false;
  const staticMode = () => motion.matches && !document.body.hasAttribute('data-r-preview-motion');
  const canRotate = () => visible && !document.hidden && !paused && !hovered && !focused && !staticMode();
  function schedule() {
    clearTimeout(timer);
    if (canRotate()) timer = setTimeout(() => { showStory((current + 1) % slides.length, false); schedule(); }, 9000);
  }
  function update() {
    pause.hidden = staticMode();
    pause.setAttribute('aria-label', paused ? 'Resume stories' : 'Pause stories');
    pause.title = paused ? 'Resume stories' : 'Pause stories';
    carousel.dataset.rotation = staticMode() ? 'static' : canRotate() ? 'playing' : 'paused';
    schedule();
  }
  function showStory(index, manual) {
    if (index !== current) {
      const previous = slides[current];
      previous.classList.remove('is-current');
      previous.setAttribute('aria-hidden', 'true');
      previous.inert = true;
    }
    current = index;
    const active = slides[current];
    active.classList.add('is-current');
    active.removeAttribute('aria-hidden');
    active.inert = false;
    markers.forEach((marker,i) => marker.setAttribute('aria-pressed', String(i === current)));
    carousel.dataset.currentStory = active.dataset.watchingStory;
    // Auto-rotation never interrupts a screen reader. Manual navigation announces.
    if (manual) {
      paused = true;
      announcement.textContent = active.getAttribute('aria-label');
    }
  }
  slides.forEach((slide,i) => {
    if (i) { slide.setAttribute('aria-hidden','true'); slide.inert = true; }
  });
  carousel.dataset.currentStory = slides[0].dataset.watchingStory;
  pause.addEventListener('click', () => { paused = !paused; update(); });
  markers.forEach((marker,i) => {
    marker.addEventListener('click', () => { showStory(i,true); update(); });
    marker.addEventListener('keydown', event => {
      const target = {ArrowRight:(i+1)%slides.length,ArrowLeft:(i-1+slides.length)%slides.length,Home:0,End:slides.length-1}[event.key];
      if (target === undefined) return;
      event.preventDefault();
      showStory(target,true);
      markers[target].focus();
      update();
    });
  });
  // Pause while reading or operating controls. Always restart with a full interval.
  stage.addEventListener('pointerenter', event => { if(event.pointerType==='mouse') { hovered=true; update(); } });
  stage.addEventListener('pointerleave', () => { hovered=false; update(); });
  carousel.addEventListener('focusin', () => { focused=true; update(); });
  carousel.addEventListener('focusout', event => { if(!carousel.contains(event.relatedTarget)) { focused=false; update(); } });
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', update);
  motion.addEventListener('change', update);
  new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['data-r-preview-motion']});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible=entries[0].isIntersecting; update(); },{threshold:.45}).observe(stage);
  else visible=true;
  carousel.classList.add('is-ready');
  controls.hidden=false;
  update();
}
