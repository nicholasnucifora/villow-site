import { money } from './help-currency.js';
import { mountSupporterRow } from './help-support-marquee.js';
import { mountSupporterReader } from './help-support-reader.js';

export function recentWindow(records, page = 0) {
  const recent = records.slice(0, 50);
  const pages = Math.max(1, recent.length);
  const index = ((page % pages) + pages) % pages;
  return { records: recent.slice(index, index + 1), page: index, total: recent.length, start: index, pages };
}

export function relativeSupportDate(value, now = Date.now()) {
  if (!value) return '';
  const date = new Date(value), current = new Date(now);
  if (Number.isNaN(date.valueOf()) || Number.isNaN(current.valueOf())) return '';
  // The API deliberately provides a UTC date, not a payment timestamp.
  const day = d => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const days = Math.max(0, Math.floor((day(current) - day(date)) / 86400000));
  if (!days) return 'Today';
  const [count, unit] = days < 7 ? [days, 'day'] : days < 30 ? [Math.floor(days / 7), 'week']
    : days < 365 ? [Math.floor(days / 30), 'month'] : [Math.floor(days / 365), 'year'];
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
}

export function publicAmountLabel(record) {
  // Amounts are an optional, consent-gated API field. Never infer them from a tier.
  if (!Number.isSafeInteger(record.amount) || record.amount < 0 || !/^[a-z]{3}$/i.test(record.currency || '')) return '';
  try { return `${money(record.amount / 100, record.currency.toUpperCase())}${record.kind === 'monthly' ? ' / month' : ''}`; }
  catch { return ''; }
}

export function withPreviewSamples(records, samples, origin) {
  const real = records.slice(0, 50);
  // Samples exist only in the owner's loopback design preview, never in the
  // public feed or database. Six genuine notes remove every filler across both rows.
  if (!['http://127.0.0.1:4411', 'http://localhost:4411'].includes(origin) || real.length >= 6) return real;
  const names = new Set(real.map(record => (record.displayName || '').toLowerCase()));
  const fill = samples.filter(record => !names.has((record.displayName || '').toLowerCase())).slice(0, 6 - real.length);
  return [...real, ...fill.map(record => ({ ...record, previewSample: true }))];
}

export function mountSupporterFeed(root, { request, examples, previewSamples = () => [], readable = false }) {
  const get = selector => root.querySelector(selector), notes = get('[data-support-notes]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let records = [], loadId = 0, loaded = false;
  let reader;
  const canMove = () => (!motion.matches || document.body.hasAttribute('data-r-preview-motion')) && !reader?.isOpen();
  const announce = text => { get('[data-message-announcement]').textContent = text; };
  function card(supporter, index, duplicate, total) {
    const item = document.createElement('li');
    item.dataset.noteTone = String(index % 3);
    if (duplicate) { item.setAttribute('aria-hidden', 'true');item.inert = true; }
    else item.setAttribute('aria-label', `Message ${index + 1} of ${total}`);
    const meta = document.createElement('div');meta.className = 'help-supporter-meta';
    const name = document.createElement('strong');name.textContent = supporter.displayName || 'Anonymous';meta.append(name);
    if (supporter.previewSample) { const label = document.createElement('span');label.className = 'help-supporter-sample';label.textContent = 'Sample';meta.append(label); }
    const amount = publicAmountLabel(supporter);
    if (amount) { const value = document.createElement('span');value.className = 'help-supporter-amount';value.textContent = amount;meta.append(value); }
    const relative = relativeSupportDate(supporter.date);
    if (relative) {
      const time = document.createElement('time');time.dateTime = supporter.date;time.textContent = relative;meta.append(time);
    }
    item.append(meta);
    if (supporter.message) { const message = document.createElement('p');message.textContent = supporter.message;item.append(message); }
    reader?.decorate(item, supporter, duplicate);
    return item;
  }
  if (readable) {
    reader = mountSupporterReader(notes, { amountLabel:publicAmountLabel, dateLabel:relativeSupportDate,
      onChange:open => rows.forEach(row => open ? row.schedule() : row.resumeAfterReading()) });
    get('#help-message-instructions').textContent = 'Click any note to read it. Use the left and right arrow keys to browse, Enter to open a note, and Space to pause or resume the row.';
  }
  const rows = ['', '-secondary'].map((suffix, index) => mountSupporterRow(
    get(`[data-message-viewport${suffix}]`), get(`[data-supporters${suffix}]`),
    { direction: index ? -1 : 1, canMove, card, announce, refreshDate: relativeSupportDate,
      onMeasure:items => reader?.measure(items), read:reader?.open, readFrom:reader?.openFrom },
  ));
  motion.addEventListener('change', () => rows.forEach(row => row.schedule()));
  new window.MutationObserver(() => rows.forEach(row => row.previewMotionChanged())).observe(document.body, { attributes: true, attributeFilter: ['data-r-preview-motion'] });
  function render() {
    reader?.close();
    const exampleRecords = examples();
    const shown = exampleRecords ? exampleRecords.slice(0, 50).map(record => ({ ...record, previewSample: true }))
      : withPreviewSamples(records, loaded ? previewSamples() : [], window.location?.origin);
    notes.hidden = !shown.length;
    if (shown.length > 1) notes.setAttribute('aria-roledescription', 'carousel');else notes.removeAttribute('aria-roledescription');
    announce('');
    // Disjoint sets: the second row never repeats the first row's messages.
    const split = shown.length >= 4;
    rows[0].render(split ? shown.filter((_, index) => index % 2 === 0) : shown);
    rows[1].render(split ? shown.filter((_, index) => index % 2 === 1) : []);
  }
  return {
    async load() {
      const id = ++loadId;let next = [], success = false;
      try { const result = await request('supporters?recent=50');success = Array.isArray(result.supporters);next = success ? result.supporters.slice(0, 50) : []; }
      catch { /* Failed feeds stay quiet; they never become a sample feed. */ }
      if (id !== loadId) return;
      records = next;loaded = success;render();
    },
  };
}
