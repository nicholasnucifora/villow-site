(() => {
  const plot = document.querySelector('.m-interactive-plot');
  const data = document.querySelector('#m-chart-data');
  if (plot && data) {
    const points = JSON.parse(data.textContent);
    const svg = plot.querySelector('svg');
    const marker = plot.querySelector('.m-chart-point');
    const detail = plot.querySelector('.m-plot-detail');
    let index = 0;
    const show = (next, pointer) => {
      index = Math.max(0, Math.min(points.length - 1, next));
      const point = points[index];
      marker.style.left = `calc(37px + (100% - 37px) * ${point.x / 240})`;
      marker.style.top = `${point.y / 86 * 100}%`;
      marker.removeAttribute('hidden');
      detail.hidden = false;
      detail.querySelector('[data-m-chart-value]').textContent = document.body.classList.contains('version-n-story') ? `${point.percent}%` : `${point.percent}% worthwhile`;
      detail.querySelector('[data-m-chart-date]').textContent = point.date;
      const bounds = plot.getBoundingClientRect();
      const x = pointer ? pointer.clientX - bounds.left : 37 + (bounds.width - 37) * point.x / 240;
      const y = pointer ? pointer.clientY - bounds.top : bounds.height * point.y / 86;
      const width = detail.offsetWidth, height = detail.offsetHeight;
      const left = x + 12 + width <= bounds.width ? x + 12 : x - width - 12;
      const top = y - height - 10 >= 0 ? y - height - 10 : y + 12;
      detail.style.left = `${Math.max(0, Math.min(bounds.width - width, left))}px`;
      detail.style.top = `${Math.max(0, Math.min(bounds.height - height, top))}px`;
      plot.setAttribute('aria-valuenow', String(index + 1));
      plot.setAttribute('aria-valuetext', `${point.date}: ${point.percent} percent of the last 30 worth-it and not-worth-it ratings`);
    };
    const hide = () => { marker.setAttribute('hidden', ''); detail.hidden = true; };
    const fromPointer = event => {
      const bounds = svg.getBoundingClientRect();
      const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      show(Math.round(position * (points.length - 1)), event);
    };
    plot.addEventListener('pointermove', fromPointer);
    plot.addEventListener('pointerdown', fromPointer);
    plot.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch' && document.activeElement !== plot) hide(); });
    plot.addEventListener('focus', () => show(index));
    plot.addEventListener('blur', hide);
    plot.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? index - 1
        : event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : null;
      if (next !== null) { event.preventDefault(); show(next); }
      if (event.key === 'Escape') hide();
    });
    document.addEventListener('pointerdown', event => { if (!plot.contains(event.target)) hide(); });
  }
  const suggestion = document.querySelector('.version-m-insight .it-suggestion');
  const complete = document.querySelector('.version-m-insight .m-suggestion-complete');
  if (!suggestion || !complete) return;
  suggestion.querySelectorAll('[data-m-suggestion-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (suggestion.classList.contains('m-leaving')) return;
      if (document.body.classList.contains('version-n-story')) {
        const panel = suggestion.closest('.it-l-suggest');
        if (panel) panel.style.minHeight = `${panel.getBoundingClientRect().height}px`;
      }
      suggestion.querySelectorAll('button').forEach(action => { action.disabled = true; });
      suggestion.classList.add('m-leaving');
      const finish = () => {
        suggestion.hidden = true;
        complete.hidden = false;
        complete.setAttribute('tabindex', '-1');
        complete.focus({ preventScroll: true });
      };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
      else setTimeout(finish, 220);
    });
  });
})();
