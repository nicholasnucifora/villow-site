// A full, selectable note outside the moving track. No donor text becomes HTML.
export function mountSupporterReader(notes, { amountLabel, dateLabel, onChange }) {
  const make = (tag, className) => { const node = document.createElement(tag);node.className = className;return node; };
  const dialog = make('dialog', 'help-note-reader');
  const heading = make('h2', 'help-note-reader-title');heading.id = 'help-note-reader-title';
  const meta = make('p', 'help-note-reader-meta');
  const quote = make('blockquote', 'help-note-reader-text');
  const close = make('button', 'help-note-reader-close');close.type = 'button';close.textContent = 'Close note';
  dialog.setAttribute('aria-labelledby', heading.id);
  dialog.append(heading, meta, quote, close);notes.append(dialog);
  const entries = new WeakMap();let returnFocus = null;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { returnFocus?.focus({ preventScroll:true });returnFocus = null;onChange(false); });
  function open(item, viewport) {
    const entry = entries.get(item);
    if (!entry || item.dataset.readable !== 'true') return false;
    const { record } = entry;
    heading.textContent = `A note from ${record.displayName || 'Anonymous'}`;
    meta.textContent = [record.previewSample ? 'Sample' : '', amountLabel(record), dateLabel(record.date)].filter(Boolean).join(' · ');
    meta.hidden = !meta.textContent;
    quote.textContent = record.message || '';
    returnFocus = viewport;
    if (!dialog.open) dialog.showModal();
    onChange(true);return true;
  }
  return {
    isOpen: () => dialog.open,
    close: () => { if (dialog.open) dialog.close(); },
    decorate(item, record, duplicate) {
      const paragraph = item.querySelector('p');if (!paragraph) return;
      // Looping copies are hidden from assistive technology but remain clickable.
      // Keyboard navigation belongs to the row, avoiding offscreen tab stops.
      if (duplicate) item.inert = false;
      const button = make('button', 'help-note-read');button.type = 'button';button.tabIndex = -1;
      // An invisible native button covers the card: no extra caption or tab stops.
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-label', `Read note from ${record.displayName || 'Anonymous'}`);
      item.dataset.readable = 'true';
      item.append(button);entries.set(item, { record, paragraph });
    },
    measure(items) {
      for (const item of items) {
        const entry = entries.get(item);if (!entry) continue;
        const clipped = entry.paragraph.scrollHeight > entry.paragraph.clientHeight + 1;
        item.dataset.truncated = String(clipped);
      }
    },
    open,
    openFrom(target, viewport) { return open(target?.closest?.('li'), viewport); },
  };
}
