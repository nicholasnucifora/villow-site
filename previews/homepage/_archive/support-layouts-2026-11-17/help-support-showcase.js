// Reading-led alternatives share the public feed, not a second source of notes.
export const noteReadingTime = message => Math.max(9000, Math.min(22000,
  4500 + (message || '').trim().split(/\s+/).filter(Boolean).length * 280));

export function mountSupporterShowcase(notes, { layout, card, canMove, announce }) {
  const make = (tag, className, text) => {
    const node = document.createElement(tag);node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const host = make('div', `help-voice-showcase help-voice-${layout}`);
  const stage = make('div', 'help-voice-stage');
  stage.tabIndex = 0;stage.setAttribute('role', 'group');stage.setAttribute('aria-label', 'Featured supporter message');
  stage.setAttribute('aria-describedby', 'help-voice-instructions');
  const instructions = make('p', 'sr-only', 'Choose a name or use the left and right arrow keys to browse. Swipe to turn the page. Tap the message or press Space to pause or resume. Hovering pauses.');
  instructions.id = 'help-voice-instructions';
  const pages = make('ol', 'help-voice-pages');pages.setAttribute('aria-live', 'off');
  stage.append(pages);
  const people = make('nav', 'help-voice-people');people.setAttribute('aria-label', 'Choose a supporter message');
  const foot = make('div', 'help-voice-foot');
  const count = make('span', 'help-voice-count');
  const next = make('button', 'help-voice-next', layout === 'letters' ? 'Open the next letter' : 'Another voice');next.type = 'button';
  foot.append(count, next);host.append(instructions, stage, people, foot);notes.append(host);
  let records = [], items = [], buttons = [], index = 0, elapsed = 0, lastTime, frame;
  let paused = false, hover = false, focused = false, dragging = null, dragged = false;
  let inView = !('IntersectionObserver' in window), onPage = true;

  function paint(manual = false) {
    items.forEach((item, i) => {
      const current = i === index;item.dataset.active = String(current);item.inert = !current;
      item.setAttribute('aria-hidden', String(!current));
    });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      // The garden grows six stems at a time; advancing visits the entire feed.
      button.hidden = layout === 'garden' && Math.floor(i / 6) !== Math.floor(index / 6);
    });
    count.textContent = `${index + 1} of ${records.length} notes`;
    if (manual) announce(`Message ${index + 1} of ${records.length}, from ${records[index]?.displayName || 'Anonymous'}.`);
  }
  function select(nextIndex, manual = false) {
    if (!records.length) return;
    index = ((nextIndex % records.length) + records.length) % records.length;
    elapsed = 0;
    if (manual) paused = true;
    paint(manual);schedule();
  }
  function tick(time) {
    if (lastTime !== undefined) elapsed += Math.min(time - lastTime, 100);
    lastTime = time;
    if (elapsed >= noteReadingTime(records[index]?.message)) {
      index = (index + 1) % records.length;elapsed = 0;paint();
    }
    frame = window.requestAnimationFrame(tick);
  }
  function schedule() {
    window.cancelAnimationFrame(frame);lastTime = undefined;
    const running = records.length > 1 && canMove() && !paused && !hover && !focused && !dragging && inView && onPage && !document.hidden;
    host.dataset.moving = String(running);
    if (running) frame = window.requestAnimationFrame(tick);
  }
  function togglePause() {
    if (records.length < 2) return;
    paused = !paused;schedule();announce(paused ? 'Message paused.' : 'Messages will continue when you leave the reading area.');
  }
  next.addEventListener('click', () => select(index + 1, true));
  stage.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();select(index + (event.key === 'ArrowRight' ? 1 : -1), true);
    } else if (event.key === ' ') { event.preventDefault();togglePause(); }
  });
  stage.addEventListener('click', () => { if (dragged) { dragged = false;return; }togglePause(); });
  host.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hover = true;schedule(); } });
  host.addEventListener('pointerleave', () => { hover = false;schedule(); });
  host.addEventListener('focusin', () => { focused = true;schedule(); });
  host.addEventListener('focusout', event => { if (!host.contains(event.relatedTarget)) { focused = false;schedule(); } });
  stage.addEventListener('pointerdown', event => {
    if (records.length < 2 || event.isPrimary === false || event.button !== 0) return;
    dragging = { id:event.pointerId, x:event.clientX, y:event.clientY, dx:0, captured:false };dragged = false;schedule();
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
    if (!dragging.captured && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { dragging = null;schedule();return; }
    if (!dragging.captured && Math.abs(dx) > 8) { stage.setPointerCapture(event.pointerId);dragging.captured = true; }
    dragging.dx = dx;
    if (dragging.captured) stage.style.setProperty('--voice-drag', `${Math.max(-70, Math.min(70, dx))}px`);
  });
  function finish(event) {
    if (!dragging || event.pointerId !== dragging.id) return;
    const { dx, captured } = dragging;dragging = null;dragged = captured;
    stage.style.setProperty('--voice-drag', '0px');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (event.type === 'pointerup' && captured && Math.abs(dx) > 35) select(index + (dx < 0 ? 1 : -1), true);
    else schedule();
  }
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(event, finish);
  window.addEventListener('pointerup', finish);
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('pagehide', () => { onPage = false;schedule(); });
  window.addEventListener('pageshow', () => { onPage = true;schedule(); });
  if ('IntersectionObserver' in window) new window.IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting === true;schedule();
  }, { threshold:0 }).observe(host);

  return {
    schedule,
    previewMotionChanged() { paused = false;schedule(); },
    render(nextRecords) {
      const previous = records[index];records = nextRecords;
      index = Math.max(0, records.findIndex(record => record.displayName === previous?.displayName && record.message === previous?.message));
      host.hidden = !records.length;stage.tabIndex = records.length > 1 ? 0 : -1;
      people.hidden = next.hidden = records.length < 2;
      items = records.map((record, i) => card(record, i, false, records.length));
      items.forEach((item, i) => { item.dataset.long = String((records[i].message || '').length > 150); });
      pages.replaceChildren(...items);
      buttons = records.map((record, i) => {
        const button = make('button', 'help-voice-person');button.type = 'button';
        button.setAttribute('aria-label', `Read message ${i + 1} from ${record.displayName || 'Anonymous'}`);
        const seed = make('span', 'help-voice-seed', (record.displayName || 'Anonymous').slice(0, 1));seed.setAttribute('aria-hidden', 'true');
        const name = make('span', 'help-voice-name', record.displayName || 'Anonymous');
        button.append(seed, name);button.addEventListener('click', () => select(i, true));return button;
      });
      people.replaceChildren(...buttons);elapsed = 0;paint();schedule();
    },
  };
}
