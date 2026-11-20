import {sViews, sInspect, sGeometry} from './s-insights-data.js';

// One optional reflection example, using the same grounded data as version B.
for (const visual of document.querySelectorAll('[data-fs-worth]')) {
  const view = sViews.find(view => view.key === 'worth');
  const plot = visual.querySelector('[data-fs-plot]');
  const drawing = plot.querySelector('.si-drawing');
  const guide = plot.querySelector('[data-si-guide]');
  const dot = plot.querySelector('[data-si-dot]');
  const tooltip = plot.querySelector('[data-fs-tooltip]');
  const status = visual.querySelector('[data-fs-status]');
  let selected = null;
  let mode = 'pointer';

  function hide() {
    selected = null;
    tooltip.hidden = guide.hidden = dot.hidden = true;
  }
  function show(fraction, announce = false) {
    const detail = sInspect(view, fraction);
    selected = detail.fraction;
    const y = (sGeometry.bottom - detail.value / view.max * (sGeometry.bottom - sGeometry.top)) / sGeometry.height;
    guide.style.left = dot.style.left = `${selected * 100}%`;
    guide.style.top = dot.style.top = `${y * 100}%`;
    tooltip.hidden = guide.hidden = dot.hidden = false;
    visual.querySelector('[data-fs-label]').textContent = detail.label;
    visual.querySelector('[data-fs-value]').textContent = detail.display;
    const bounds = drawing.getBoundingClientRect();
    const root = plot.getBoundingClientRect();
    const x = bounds.left - root.left + selected * bounds.width;
    const left = Math.max(3, Math.min(root.width - tooltip.offsetWidth - 3, x - tooltip.offsetWidth / 2));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${bounds.top - root.top + y * bounds.height - tooltip.offsetHeight - 10}px`;
    tooltip.style.setProperty('--si-caret-x', `${x - left}px`);
    if (announce) status.textContent = `${detail.label}: ${detail.display} worth watching.`;
  }
  function point(event) {
    const bounds = drawing.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      if (mode === 'pointer') hide();
      return;
    }
    show((event.clientX - bounds.left) / bounds.width);
  }
  plot.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') { mode = 'pointer'; point(event); } });
  plot.addEventListener('pointerdown', event => { mode = event.pointerType === 'mouse' ? 'pointer' : 'touch'; point(event); });
  plot.addEventListener('pointerleave', () => { if (mode === 'pointer') hide(); });
  plot.addEventListener('focus', () => { if (selected === null) { mode = 'keyboard'; show(.5, true); } });
  plot.addEventListener('blur', hide);
  plot.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); hide(); return; }
    const step = event.shiftKey ? 1 / 60 : 1 / 600;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : event.key === 'ArrowLeft' ? (selected ?? 1) - step : event.key === 'ArrowRight' ? (selected ?? 0) + step : null;
    if (next === null) return;
    event.preventDefault(); mode = 'keyboard'; show(next, true);
  });
  window.addEventListener('resize', () => { if (selected !== null) show(selected); });
}
