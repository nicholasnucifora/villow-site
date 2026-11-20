for (const comparison of document.querySelectorAll('.version-e [data-xc-comparison]')) {
  const items = [...comparison.querySelectorAll('[data-xl-topic]')].map(row => ({button: row.querySelector('.rd-topic-button'), panel: row.querySelector('[data-rd-panel]')}));
  if (items.some(item => !item.button || !item.panel)) continue;
  function setOpen(item, open) {
    if (!open && item.panel.contains(document.activeElement)) item.button.focus({preventScroll: true});
    item.button.setAttribute('aria-expanded', String(open));
    item.panel.inert = !open;
    item.panel.setAttribute('aria-hidden', String(!open));
    item.panel.classList.toggle('is-open', open);
  }
  for (const item of items) {
    setOpen(item, false);
    item.button.addEventListener('click', () => {
      const opening = item.button.getAttribute('aria-expanded') !== 'true';
      for (const candidate of items) setOpen(candidate, candidate === item && opening);
    });
  }
  comparison.classList.add('rd-accordion-ready');
}
