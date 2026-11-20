// Rows drift continuously; only reading, keyboard controls and visibility pause them.
export function mountSupporterRow(viewport, list, { direction, canMove, card, announce, refreshDate, onMeasure, read, readFrom }) {
  let records = [], originals = [], frame, lastTime;
  let stride = 0, cycle = 0, offset = 0, anchor = 0, page = 0;
  let paused = false, onPage = true, inView = !('IntersectionObserver' in window);
  let manuallyPaused = false;
  const wrap = (value, length) => ((value % length) + length) % length;
  function paint(manual = false) {
    if (cycle) offset = wrap(offset, cycle);
    list.style.transform = cycle ? `translate3d(${-cycle + wrap(offset + anchor, cycle)}px,0,0)` : '';
    page = stride ? wrap(Math.round(-offset / stride), records.length) : 0;
    if (manual) announce(`Message ${page + 1} of ${records.length}, from ${records[page]?.displayName || 'Anonymous'}.`);
  }
  function tick(time) {
    if (lastTime !== undefined) { offset += direction * Math.min(time - lastTime, 64) * .024;paint(); }
    lastTime = time;frame = window.requestAnimationFrame(tick);
  }
  function schedule() {
    window.cancelAnimationFrame(frame);lastTime = undefined;
    const running = cycle > 0 && canMove() && !paused && inView && onPage && !document.hidden;
    viewport.dataset.moving = String(running);
    viewport.dataset.motionState = running ? 'moving' : !canMove() ? 'preference-or-reader' : paused ? 'paused' : !inView ? 'out-of-view' : !onPage ? 'page-hidden' : document.hidden ? 'document-hidden' : 'single';
    if (running) frame = window.requestAnimationFrame(tick);
  }
  function measure() {
    const progress = stride ? offset / stride : 0;
    list.replaceChildren(...originals);
    stride = records.length > 1 ? originals[1].offsetLeft - originals[0].offsetLeft : 0;
    cycle = stride * records.length;
    // Start a whole card within the fade, with a half-card stagger below.
    anchor = Math.min(180, viewport.clientWidth * .1) - (direction < 0 ? stride / 2 : 0);
    if (cycle > 0) {
      const copies = Math.ceil(viewport.clientWidth / cycle) + 2, items = [];
      for (let group = 0; group < copies; group++) items.push(...(group === 1 ? originals : records.map((record, index) => card(record, index, true, records.length))));
      list.replaceChildren(...items);
    }
    onMeasure?.(list.children);
    viewport.tabIndex = records.length > 1 || originals.some(item => item.dataset.readable === 'true') ? 0 : -1;
    offset = progress * stride;paint();schedule();
  }
  function refreshDates() {
    for (const time of list.querySelectorAll('time')) time.textContent = refreshDate(time.dateTime);
  }
  function step(direction) {
    if (records.length < 2) return;
    paused = true;offset = -wrap(page + direction, records.length) * stride;paint(true);schedule();
  }
  viewport.addEventListener('click', event => { readFrom?.(event.target, viewport); });
  viewport.addEventListener('keydown', event => {
    if (event.key === 'Enter' && read?.(originals[page], viewport)) { event.preventDefault();return; }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault();step(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === ' ' && records.length > 1) { event.preventDefault();paused = !paused;manuallyPaused = paused;schedule();announce(paused ? 'Message row paused.' : 'Message row resumed.'); }
  });
  // Keyboard users can stop to browse. Pointer focus alone never stalls the row.
  viewport.addEventListener('focusin', event => { if (!viewport.contains(event.relatedTarget) && viewport.matches(':focus-visible')) { paused = true;schedule(); } });
  viewport.addEventListener('focusout', event => { if (!viewport.contains(event.relatedTarget)) { paused = manuallyPaused;schedule(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDates();schedule(); });
  window.addEventListener('pagehide', () => { onPage = false;schedule(); });
  window.addEventListener('pageshow', () => { onPage = true;refreshDates();measure(); });
  window.addEventListener('resize', measure);
  document.fonts?.ready.then(measure);
  if ('ResizeObserver' in window) new window.ResizeObserver(measure).observe(viewport);
  if ('IntersectionObserver' in window) new window.IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting === true && entries[0].intersectionRatio >= .25;schedule();
  }, { threshold: .25 }).observe(viewport);
  return {
    schedule,
    previewMotionChanged() { paused = false;manuallyPaused = false;schedule(); },
    resumeAfterReading() {
      // Native dialog focus restoration must not turn reading into a permanent pause.
      paused = manuallyPaused;schedule();
    },
    render(next) {
      records = next;originals = records.map((record, index) => card(record, index, false, records.length));
      viewport.hidden = !records.length;viewport.dataset.single = String(records.length < 2);viewport.tabIndex = records.length > 1 ? 0 : -1;
      offset = 0;measure();
    },
  };
}
