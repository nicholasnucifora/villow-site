/** Native render functions copied mechanically; no production bootstrap executes.
 * content SHA256 bf03abc03ab32e7d6049ccd838ec29ef4dcdf5421556edc1facb8650a197ffac; dom SHA256 567b937c9dd49771c7a32fae08b6b79be61d6d3848e8372596267fd3ec11de53.
 * Adapter replaces only worker writes, host lookup, preview callbacks and Watch now.
 */
export function createNativeControls(document, adapter) {
  const window = document.defaultView;
  const requestAnimationFrame = window.requestAnimationFrame?.bind(window);
  const setTimeout = window.setTimeout.bind(window), clearTimeout = window.clearTimeout.bind(window);
  const panelSizeAmounts = [];
  let ringPreview = null;
  const wireSettingClick = () => {}, wireRingTip = () => {}, updateWatchBar = () => {}, clearStaleCapNotices = () => {};
  const stopsFor = adapter.stopsFor, nearestStop = adapter.nearestStop;
  const updateRings = () => adapter.preview(ringPreview && {key: ringPreview.key, value: ringPreview.limit / (ringPreview.key === 'time' || ringPreview.key === 'saveDuration' ? 60 : 1)});
  const sendToWorker = (message, done) => done({ok: true, value: adapter.commit(message.key, message.value)});
  const thumbFor = tile => tile.querySelector('.villow-demo__thumbnail');
  const paintWatch = () => {};
  const U = { thumbnailFor: adapter.thumbnail };
  const Q = { title: info => info?.title || '', seconds: info => info?.durationSeconds || 0,
    duration: adapter.duration, lengthMinutes: adapter.leftMinutes, leftMinutes: adapter.leftMinutes, shortsReservation: () => false };
  const startedAlready = () => false, watchingIds = new Set();
  const undoSave = videoId => adapter.remove(videoId);
  const quotaView = adapter.quota, activeSaveLimits = adapter.limits;
  const RING_RADIUS = 10;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const SAVE_CIRCLE = 'M22 12a10 10 0 1 1-20 0a10 10 0 1 1 20 0';
const SAVE_RACETRACK = 'M26 2H40a10 10 0 0 1 0 20H12a10 10 0 0 1 0-20H26Z';
const VILLOW_HOME_PATH = 'M3 10.25L12 3l9 7.25V20a1 1 0 01-1 1h-5.5v-6h-5v6H4a1 1 0 01-1-1v-9.75z';
const SVG_NS = 'http://www.w3.org/2000/svg';
const RING_ICONS = {
    // Hands only. The ring around them is the clock face, which is what makes
    // two plain strokes read as a clock at this size.
    time: [{ d: 'M12 12V8.2' }, { d: 'M12 12h3.3' }],
    // An eye: almond outline, filled pupil.
    seen: [
      { d: 'M6.9 12s2.1-3.2 5.1-3.2S17.1 12 17.1 12s-2.1 3.2-5.1 3.2S6.9 12 6.9 12z' },
      { circle: [12, 12, 1.55] }
    ],
    // A plus: something being added to the queue.
    saves: [{ d: 'M12 8.3v7.4' }, { d: 'M8.3 12h7.4' }],
    /* A cog: a hub and eight teeth. Drawn from strokes rather than as one
     * outlined gear path, so it carries the same weight as the other four at
     * this size instead of reading as a heavier, more detailed thing. */
    settings: [
      { ring: [12, 12, 3.4] },
      { d: 'M12 4.4v2.2' }, { d: 'M12 17.4v2.2' },
      { d: 'M4.4 12h2.2' }, { d: 'M17.4 12h2.2' },
      { d: 'M6.63 6.63l1.56 1.56' }, { d: 'M15.81 15.81l1.56 1.56' },
      { d: 'M6.63 17.37l1.56-1.56' }, { d: 'M15.81 8.19l1.56-1.56' }
    ],
    // A play triangle: something being watched here instead.
    watched: [{ fill: 'M10.1 8.15 16.3 12 10.1 15.85 Z' }]
  };
  function svgNode(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const name in attrs) node.setAttribute(name, String(attrs[name]));
    return node;
  }

function buildIcon(key) {
    const group = svgNode('g', { 'class': 'villow-ring__icon' });
    const shapes = RING_ICONS[key] || [];
    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i].circle) {
        const c = shapes[i].circle;
        group.appendChild(svgNode('circle', {
          'class': 'villow-ring__solid', cx: c[0], cy: c[1], r: c[2]
        }));
      } else if (shapes[i].ring) {
        const r = shapes[i].ring;
        group.appendChild(svgNode('circle', { cx: r[0], cy: r[1], r: r[2] }));
      } else if (shapes[i].fill) {
        group.appendChild(svgNode('path', {
          'class': 'villow-ring__solid', d: shapes[i].fill
        }));
      } else {
        group.appendChild(svgNode('path', { d: shapes[i].d }));
      }
    }
    return group;
  }

function buildRingArc(className, saves) {
    // Normalising the path preserves the existing progress arithmetic in both shapes.
    return svgNode(saves ? 'path' : 'circle', Object.assign({ 'class': className },
      saves ? { d: SAVE_CIRCLE, pathLength: RING_LENGTH }
        : { cx: 12, cy: 12, r: RING_RADIUS }));
  }

function paintSaveGlyph(svg, limits, quota) {
    const both = Boolean(limits.count && limits.duration);
    svg.classList.toggle('villow-ring--combined', both);
    svg.classList.toggle('villow-ring--unlimited', !limits.count && !limits.duration);
    const viewBox = both ? '0 0 52 24' : '0 0 24 24';
    if (svg.getAttribute('viewBox') !== viewBox) svg.setAttribute('viewBox', viewBox);
    const shape = both ? SAVE_RACETRACK : SAVE_CIRCLE;
    ['.villow-ring__track', '.villow-ring__fill'].forEach(function (selector) {
      const arc = svg.querySelector(selector);
      if (arc && arc.getAttribute('d') !== shape) arc.setAttribute('d', shape);
    });
    const old = svg.querySelector('.villow-ring__icon');
    if (old) old.remove();
    if (!both) { svg.appendChild(buildIcon(limits.duration ? 'watched' : 'saves')); return; }
    const group = svgNode('g', { 'class': 'villow-ring__icon' });
    const left = Math.max(0, limits.count - quota.count);
    const number = svgNode('text', { 'class': 'villow-ring__number' + (left > 99 ? ' villow-ring__number--large' : ''),
      x: 17, y: 12.5, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    number.textContent = left > 99 ? '99+' : String(left);
    group.appendChild(number);
    group.appendChild(svgNode('path', {
      'class': 'villow-ring__home', d: VILLOW_HOME_PATH,
      transform: 'translate(28 4.5) scale(0.62)', 'stroke-width': 2
    }));
    svg.appendChild(group);
  }

function buildRingButton(key) {
    const btn = document.createElement('button');
    btn.className = 'villow-ring-btn';
    btn.type = 'button';
    btn.setAttribute('data-villow-setting', key);

    const svg = svgNode('svg', { 'class': 'villow-ring', viewBox: '0 0 24 24' });
    svg.setAttribute('aria-hidden', 'true');

    const track = buildRingArc('villow-ring__track', key === 'saves');
    const fill = buildRingArc('villow-ring__fill', key === 'saves');
    fill.setAttribute('stroke-dasharray', String(RING_LENGTH));
    fill.setAttribute('stroke-dashoffset', '0');

    svg.appendChild(track);
    svg.appendChild(fill);
    svg.appendChild(buildIcon(key));

    const tip = document.createElement('span');
    tip.className = 'villow-tip';

    btn.appendChild(svg);
    btn.appendChild(tip);
    wireSettingClick(btn, key);
    wireRingTip(btn, tip);

    return { btn: btn, fill: fill, tip: tip, offset: null, text: '' };
  }

function buildTimeText() {
    const btn = document.createElement('button');
    btn.className = 'villow-ring-btn villow-ring-btn--text';
    btn.type = 'button';
    btn.setAttribute('data-villow-setting', 'time');

    const value = document.createElement('span');
    value.className = 'villow-rings__value';

    const tip = document.createElement('span');
    tip.className = 'villow-tip';

    btn.appendChild(value);
    btn.appendChild(tip);
    wireSettingClick(btn, 'time');
    wireRingTip(btn, tip);

    return { btn: btn, value: value, tip: tip, text: '' };
  }

function buildLimitRow(key, spec, valueHost) {
    const stops = stopsFor(key);

    const row = document.createElement('div');
    row.className = 'villow-panel__row';

    /* The figure and its unit, centred over the bar as one pair. Which means
     * the box has to be exactly as wide as what it holds — anything wider and
     * "30" drifts off centre with "min" pushed out beside it. */
    const value = document.createElement('div');
    value.className = 'villow-panel__value';

    /* A text box rather than a number one: it has to be able to show ∞, which
     * is not a number, and the spinner arrows on a number box are a second,
     * worse way of doing what the bar is there for. Anything that is not a
     * digit is dropped as it is typed, so "invalid input" never gets as far as
     * being a state anything has to handle. */
    const amount = document.createElement('input');
    amount.className = 'villow-panel__amount';
    amount.type = 'text';
    amount.inputMode = 'numeric';
    amount.setAttribute('aria-label', spec.title);

    const unit = document.createElement('span');
    unit.className = 'villow-panel__unit';
    unit.textContent = spec.unit;

    /* The box is sized from a copy of its own text rather than in `ch`, which
     * is the width of a digit and nothing else — ∞ is wider than a digit, and
     * measuring it that way is what used to cut it in half. Hidden from
     * everything: it is a ruler, not content. */
    const gauge = document.createElement('span');
    gauge.className = 'villow-panel__gauge';
    gauge.setAttribute('aria-hidden', 'true');

    value.appendChild(amount);
    value.appendChild(unit);
    value.appendChild(gauge);

    const slider = document.createElement('input');
    slider.className = 'villow-panel__slider';
    slider.type = 'range';
    slider.min = '0';
    slider.max = String(stops.length - 1);
    slider.step = '1';
    slider.setAttribute('aria-label', spec.title);

    let current = spec.value();   // what the controls are showing
    let saved = current;          // what the worker last confirmed
    let failTimer = null;

    function clearFailed() {
      if (failTimer) { clearTimeout(failTimer); failTimer = null; }
      amount.classList.remove('villow-panel__amount--failed');
      amount.setAttribute('title', '');
    }

    /* Put a figure on both controls. Typing does not come through here — it
     * would fight the caret — so this is only for values the code decides on:
     * the opening one, a drag, and whatever the worker confirms. */
    function show(v) {
      clearFailed();
      current = v;
      amount.value = v === 0 ? '∞' : String(v);
      // ∞ says unlimited on its own; "∞ min" would be saying it twice.
      unit.style.display = (v === 0 || !spec.unit) ? 'none' : '';
      sizeAmount();
      slider.value = String(nearestStop(stops, v));
    }

    /* Measured, not guessed. Runs again once the panel is in the document,
     * because an element that is not on the page yet measures nothing.
     *
     * Rounded UP from a sub-pixel width rather than read off offsetWidth,
     * which rounds to the nearest whole pixel: half a pixel short is a glyph
     * with its edge shaved off, and ∞ is the one value in this box wide
     * enough for that to show. The horizontal padding on the input is the
     * other half of the same fix — it gives ink that overhangs its own advance
     * width somewhere to go. */
    function sizeAmount() {
      gauge.textContent = String(amount.value) || '0';
      const width = measuredWidth(gauge);
      if (width) amount.style.width = width + 'px';
    }
    panelSizeAmounts.push(sizeAmount);

    function fail() {
      show(saved);
      clearPreview();
      amount.classList.add('villow-panel__amount--failed');
      amount.setAttribute('title', 'That limit could not be saved.');
      failTimer = setTimeout(clearFailed, 2400);
    }

    /* Saving happens on its own, so it has to be cheap to do nothing: a drag
     * that lands back where it started, or a box left alone, must not send
     * anything at all. */
    function commit() {
      // An empty box is an edit that was walked away from, not a request for
      // zero — zero has to be typed to count.
      const saveControl = key === 'saves' || key === 'saveDuration';
      const wanted = String(amount.value) === '' ? saved : (saveControl ? Math.max(1, current) : current);
      if (wanted === saved) { show(saved); preview(saved); return; }

      show(wanted);
      sendToWorker({ type: 'VILLOW_SET_LIMIT', key: key, value: wanted }, function (res) {
        if (!res || !res.ok) { fail(); return; }
        // The worker clamps what it was sent, so its figure wins where it
        // gives one.
        saved = typeof res.value === 'number' ? wholeStep(res.value) : wanted;
        show(saved);
        // Whatever it clamped to is what the ring should be holding now.
        preview(saved);
      });
    }

    /* A figure the panel is showing but has not saved yet.
     *
     * The ring the panel hangs off follows it, so the arc grows and shrinks
     * under the handle and the user can see the setting they are about to make
     * before they make it.
     *
     * The refusals on tiles follow it too, but only in the direction that
     * takes them away. Dragging the save cap up past what you have saved is
     * the moment the "Save limit reached" on a thumbnail stops being true, and
     * waiting for the handle to be let go left it sitting there through the
     * whole drag — contradicting the number under the user's own thumb. */
    function preview(v) {
      if (key === 'saves' || key === 'saveDuration') v = Math.max(1, v);
      // The ring reads seconds where the bar reads minutes.
      ringPreview = { key: key, limit: key === 'time' || key === 'saveDuration' ? v * 60 : v };
      if (key === 'saves' || key === 'saveDuration' || key === 'watched') clearStaleCapNotices(v);
      updateRings();
      updateWatchBar();
    }

    function clearPreview() {
      if (!ringPreview || ringPreview.key !== key) return;
      ringPreview = null;
      updateRings();
      updateWatchBar();
    }

    // Dragging moves the figure; letting go is what saves it.
    slider.addEventListener('input', function () {
      const v = stops[Number(slider.value)] || 0;
      show(v);
      preview(v);
    });
    slider.addEventListener('change', commit);

    /* Typing an exact figure the scale does not offer is still allowed — the
     * handle simply parks at the nearest stop rather than fighting the
     * number. */
    amount.addEventListener('input', function () {
      const digits = String(amount.value).replace(/[^0-9]/g, '');
      if (digits !== amount.value) amount.value = digits;
      sizeAmount();
      clearFailed();
      if (digits === '') return;              // mid-edit; nothing to move to yet
      current = wholeStep(digits);
      slider.value = String(nearestStop(stops, current));
      preview(current);
    });
    // The box opens showing ∞ or a figure that is about to be replaced, so the
    // first keystroke should replace it rather than land beside it.
    amount.addEventListener('focus', function () {
      if (typeof amount.select === 'function') amount.select();
    });
    amount.addEventListener('blur', commit);
    amount.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      commit();
      if (typeof amount.blur === 'function') amount.blur();
    });

    show(current);

    (valueHost || row).appendChild(value);
    row.appendChild(slider);
    return row;
  }

function measuredWidth(node) {
    if (node.getBoundingClientRect) {
      const rect = node.getBoundingClientRect();
      if (rect && rect.width) return Math.ceil(rect.width);
    }
    return node.offsetWidth;
  }

function remeasureAmount() {
    if (!panelSizeAmounts.length) return;
    panelSizeAmounts.forEach(function (size) { size(); });

    const again = function () { panelSizeAmounts.forEach(function (size) { size(); }); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(again);
    try {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(again);
    } catch (err) { /* no font loading API here; the first two will do */ }
  }

function wholeStep(raw) {
    const n = Math.floor(Number(raw) || 0);
    return n > 0 ? n : 0;
  }

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

function closeButton(className, label, onClick) {
    const btn = el('button', className, '✕');
    btn.type = 'button';
    btn.setAttribute('aria-label', label);
    btn.addEventListener('click', onClick);
    return btn;
  }

function savedShot(videoId, info, className) {
    const frame = el('span', className + ' villow-shot');
    const img = document.createElement('img');
    img.className = 'villow-shot__img';
    img.src = U.thumbnailFor(videoId);
    img.alt = '';
    img.loading = 'lazy';
    frame.appendChild(img);
    const seconds = Q.seconds(info);
    const length = info ? (Q.shortsReservation(info) ? 'Up to 3m' :
      (className === 'villow-panel__item-shot' && seconds ? Q.duration(seconds) : Q.lengthMinutes(seconds))) : '';
    if (length) frame.appendChild(el('span', 'villow-shot__length', length));
    return frame;
  }

function addedAtWords(value) {
    if (value == null) return '';
    const ms = typeof value === 'number' ? value : Date.parse(value);
    if (!ms) return '';

    const when = new Date(ms);
    const time = when.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (when.toDateString() === new Date().toDateString()) return 'Added ' + time;
    return 'Added ' + when.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
           ', ' + time;
  }

function buildSavedRow(videoId, info, onRemoved, alt) {
    const readOnly = Boolean(alt && alt.readOnly);

    /* A row on the watched list is a way back to its video, so it is a link.
     *
     * The day's slot was spent when the video first opened and opening it
     * again spends nothing — the cap counts videos rather than clicks — so
     * there is no reason for a record of what you watched to be a dead end.
     * Halfway through and interrupted is the ordinary way a video ends.
     *
     * The queue's rows are deliberately not links, and that is not an
     * oversight to be fixed later. A saved video is one being deliberately not
     * watched here; a way to the watch page would undo the point of having put
     * it aside, and connected that page has no player on it anyway. */
    const row = document.createElement(readOnly ? 'a' : 'div');
    row.className = 'villow-panel__item' + (readOnly ? ' villow-panel__item--open' : '');
    if (readOnly) {
      row.href = U.watchUrl(videoId);
      /* Whichever of the two surfaces this row is in. Both float over the page
       * rather than sitting in it, so a navigation underneath would otherwise
       * leave the card standing over the video it had just opened. Both calls
       * are no-ops where that surface is not the one open. */
      row.addEventListener('click', function () {
        closeWatchedDialog();
        closePanel();
      });
    }

    /* The thumbnail carries the identification, and it is the one thing that
     * is always available: the URL is derived from the video id rather than
     * scraped, so it is right even for a save made before this list existed
     * and for one whose title never made it off a tile. */
    const shot = savedShot(videoId, readOnly ? null : info, 'villow-panel__item-shot');

    const text = document.createElement('span');
    text.className = 'villow-panel__item-text';

    const title = document.createElement('span');
    title.className = 'villow-panel__item-title';
    // Never the raw id. It identifies nothing to the person reading it, and
    // the thumbnail beside it is already doing that job better.
    title.textContent = Q.title(info) || (readOnly ? 'Video' : 'Saved video');

    /* When it was added, on hover.
     *
     * A list that covers a day should be able to say which part of the day a
     * row came from — the question "did I save this at midnight or is the list
     * wrong" has no other answer from in here. The native tooltip rather than
     * a line in the row: this is a thing to go looking for, not a thing to
     * read past on every row. */
    const added = addedAtWords(info.at);
    if (added) title.title = added;

    text.appendChild(title);

    /* Only when there is something to put there. A watched video whose name
     * never arrived still has its thumbnail, which identifies it perfectly
     * well — and a line underneath explaining the absence would be louder than
     * the absence is. */
    if (info.channel || info.client || !readOnly) {
      const channel = document.createElement('span');
      channel.className = 'villow-panel__item-channel';

      /* Where it was saved, when it was not saved here.
       *
       * Only ever on somebody else's row — saying "on this browser" under
       * every one of your own would be noise, and `client` is left null for
       * those. A row saved before the extension began attributing them has no
       * client either, and says nothing rather than guessing.
       *
       * It shares the channel's line rather than taking one of its own,
       * because a queue with two lines per row on a phone is a queue you
       * scroll instead of read. */
      const base = info.channel || (info.client ? '' : 'Saved before titles were kept');
      channel.textContent = info.client
        ? (base ? base + ' · saved on ' + info.client : 'Saved on ' + info.client)
        : base;
      text.appendChild(channel);
    }

    /* No button on this row, and nothing missing either. The watched list is
     * a record rather than a set of choices — nothing on it can be given back
     * — so a control here would only ever be a greyed-out one, and the row
     * itself is already the thing worth pressing. */
    if (readOnly) {
      row.appendChild(shot);
      row.appendChild(text);
      row.setAttribute('aria-label',
        title.textContent + ' — watch it again on YouTube');
      return row;
    }

    const remove = document.createElement('button');
    remove.type = 'button';
    if (alt) {
      remove.className = 'villow-panel__remove villow-panel__remove--add';
      remove.textContent = alt.action;
      /* Offered but not yet pressable. The button is greyed rather than the
       * row withheld, so what the Add is waiting on is legible: it is sitting
       * in the list next to the removals that will free it. */
      if (alt.disabled) {
        remove.disabled = true;
        remove.title = alt.disabledTitle || '';
      } else {
        /* Filled, where every other button in the dialog is outlined. It is
         * the only thing here that finishes what the user came to do — the
         * Removes are all steps towards it — so it is the one that gets
         * weight. Only once it can actually be pressed: coloured in while
         * disabled would be a button advertising itself and then refusing. */
        remove.className += ' villow-panel__remove--ready';
        remove.title = 'Put this on your Villow queue';
        remove.addEventListener('click', function () {
          remove.disabled = true;
          alt.onAction();
        });
      }
      /* The moment it goes live, and only that moment. The row is at the
       * bottom of a list the user is busy reading the top of, so it says so
       * once and then stops — a permanent tint on the row was the last version
       * of this and it read as an alert that never went away. */
      if (alt.woke) {
        row.className += ' villow-panel__item--woke';
        remove.className += ' villow-panel__remove--woke';
      }
    } else if (info.via === 'youtube') {
      /* Not in Villow at all, so there is nothing here to remove.
       *
       * Drawn as a lock rather than a greyed Remove for the same reason a
       * watched row is: a disabled button reads as something that will come
       * back, and this will not. But the two are not the same fact and must
       * not wear the same word — one means you started watching it, the other
       * means it is on a shelf Villow cannot reach — so the label names the
       * place it went and the tooltip says what would undo it. */
      remove.className = 'villow-panel__remove villow-panel__remove--locked';
      remove.disabled = true;
      remove.textContent = 'On YouTube';
      remove.title = info.list
        ? 'Saved to “' + info.list + '” on YouTube. Take it out there to free the slot.'
        : 'Saved to a YouTube playlist. Take it out there to free the slot.';
      remove.setAttribute('aria-label', 'Saved on YouTube, not in Villow');
      row.className += ' villow-panel__item--locked';
    } else if (startedAlready(videoId, info)) {
      /* Spent, and nothing to offer.
       *
       * A disabled Remove would be the wrong shape: it reads as something
       * temporarily out of reach, and this is permanent for the rest of the
       * day. The lock is its own thing, says so in a word, and explains itself
       * on hover — which is where the reason belongs, because the reason is
       * only ever asked for once.
       *
       * The video can still be deleted inside Villow. The queue is the user's;
       * what the extension will not do is call it a free slot afterwards. */
      remove.className = 'villow-panel__remove villow-panel__remove--locked';
      remove.disabled = true;
      remove.textContent = 'Watched';
      const where = watchingIds.has(videoId) ? 'on YouTube' : 'in Villow';
      remove.title = 'You’ve started watching this ' + where;
      remove.setAttribute('aria-label', 'Watched ' + where);
      row.className += ' villow-panel__item--locked';
    } else {
      remove.className = 'villow-panel__remove';
      remove.textContent = 'Remove';
      remove.title = 'Remove from queue';
      remove.addEventListener('click', function () {
        remove.disabled = true;
        // Reuses the same path a click on a saved tile takes, so a removal
        // from here restores the thumbnail and frees the day's slot exactly as
        // one from the page would.
        undoSave(videoId, null);
        row.remove();
        if (onRemoved) onRemoved(videoId);
      });
    }

    row.appendChild(shot);
    row.appendChild(text);
    row.appendChild(remove);
    return row;
  }

function savedQuotaCount() {
    const quota = quotaView();
    const limits = activeSaveLimits();
    if (limits.count && limits.duration) return Math.max(0, limits.count - quota.count) + ' slots · ' +
      Q.leftMinutes(Math.max(0, limits.duration - quota.seconds)) + ' left';
    if (limits.duration) return Q.leftMinutes(Math.max(0, limits.duration - quota.seconds)) + ' left';
    return quota.count + (limits.count ? ' of ' + limits.count : '');
  }
  const SAVE_STATES = {
    pending: {
      label: 'Saving to Villow…',
      aria: 'Saving to Villow — click to remove',
      hint: 'Click to remove',
      modifier: 'villow-overlay--pending',
      watch: true
    },
    'pending-started': {
      label: 'Saving to Villow…',
      aria: 'Saving to Villow — already started, so it stays on your queue',
      hint: 'Already started',
      modifier: 'villow-overlay--pending',
      watch: true
    },
    saved: {
      label: 'Added to Villow',
      aria: 'Added to Villow — click to remove',
      hint: 'Click to remove',
      modifier: '',
      watch: true
    },
    /* No "Click to remove", because there is no removing it. The hint says
     * why instead, so a click that does nothing is not a surprise. */
    started: {
      label: 'Added to Villow',
      aria: 'Added to Villow — already started, so it stays on your queue',
      hint: 'Already started',
      modifier: '',
      watch: true
    }
  };

const SAVE_MODIFIERS = ['villow-overlay--pending'];

function saveWords(state) {
    return SAVE_STATES[state] || SAVE_STATES.saved;
  }

function overlayOn(thumb) {
    const kids = (thumb && thumb.children) || [];
    for (let i = 0; i < kids.length; i++) {
      if (String(kids[i].className).split(' ').indexOf('villow-overlay') !== -1) {
        return kids[i];
      }
    }
    return null;
  }

function paintSaveState(overlay, state) {
    const words = saveWords(state);
    const name = SAVE_STATES[state] ? state : 'saved';

    if (overlay.getAttribute('data-villow-state') !== name) {
      overlay.setAttribute('data-villow-state', name);
    }
    if (overlay.getAttribute('aria-label') !== words.aria) {
      overlay.setAttribute('aria-label', words.aria);
    }
    for (let i = 0; i < SAVE_MODIFIERS.length; i++) {
      const want = SAVE_MODIFIERS[i] === words.modifier;
      const has = overlay.classList.contains(SAVE_MODIFIERS[i]);
      if (want && !has) overlay.classList.add(SAVE_MODIFIERS[i]);
      else if (!want && has) overlay.classList.remove(SAVE_MODIFIERS[i]);
    }

    const label = overlay.querySelector('.villow-overlay__label');
    if (label && label.textContent !== words.label) label.textContent = words.label;
    const hint = overlay.querySelector('.villow-overlay__hint');
    if (hint && hint.textContent !== words.hint) hint.textContent = words.hint;
  }

function markTile(tile, videoId, state) {
    if (!tile) return;
    // Guarded, like every write below it: the sweep calls this for every
    // marked tile now, and re-adding a class that is already there still
    // rewrites the attribute.
    if (!tile.classList.contains('villow-marked')) tile.classList.add('villow-marked');

    const thumb = thumbFor(tile);
    if (!thumb.classList.contains('villow-thumb')) thumb.classList.add('villow-thumb');

    /* Idempotent: re-applying after YouTube recycles a node must not stack
     * overlays, and must not thrash the DOM into a mutation loop. The sweep
     * now comes through here for every marked tile — that is what lets the
     * label follow the delivery — so every write below is guarded on the value
     * actually changing, and a tile in the state it is already in costs a
     * handful of reads and no mutations at all. */
    let overlay = overlayOn(thumb);
    if (overlay) {
      if (overlay.getAttribute('data-villow-id') !== videoId) {
        overlay.setAttribute('data-villow-id', videoId);
      }
      paintSaveState(overlay, state);
      paintWatch(thumb, videoId, state);
      return;
    }

    const words = saveWords(state);

    overlay = document.createElement('div');
    overlay.className = 'villow-overlay' + (words.modifier ? ' ' + words.modifier : '');
    overlay.setAttribute('data-villow-id', videoId);
    overlay.setAttribute('data-villow-state', SAVE_STATES[state] ? state : 'saved');

    // The whole overlay is the control, so it carries the button semantics
    // itself. Without this a keyboard user would have no way to undo a save —
    // the hover hint is invisible to them, and there is no longer a button to
    // tab to. The label goes into the accessible name too: a screen reader
    // that only ever heard "Remove from Villow" could not tell a stored video
    // from one still being saved.
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('tabindex', '0');
    overlay.setAttribute('aria-label', words.aria);

    const label = document.createElement('div');
    label.className = 'villow-overlay__label';
    label.textContent = words.label;

    // Shown on hover and on focus. Saying what a click will do is the whole
    // job; it is a hint rather than a control, so it is hidden from screen
    // readers, which get the label on the overlay instead. A started video
    // explains why it cannot be removed, including while it is still saving.
    const hint = document.createElement('div');
    hint.className = 'villow-overlay__hint';
    hint.textContent = words.hint;
    hint.setAttribute('aria-hidden', 'true');

    overlay.appendChild(label);
    overlay.appendChild(hint);
    thumb.appendChild(overlay);
    paintWatch(thumb, videoId, state);
  }

function markCapped(tile, videoId, words) {
    if (!tile) return null;
    clearCapped(tile);

    tile.classList.add('villow-capped');
    const thumb = thumbFor(tile);
    thumb.classList.add('villow-thumb');

    const overlay = document.createElement('div');
    overlay.className = 'villow-overlay';
    overlay.setAttribute('data-villow-action', 'cap');
    if (videoId) overlay.setAttribute('data-villow-id', videoId);
    // Announced, not a control: the control is the link inside it.
    overlay.setAttribute('role', 'status');

    const label = document.createElement('div');
    label.className = 'villow-overlay__label';
    label.textContent = (words && words.label) || 'Save limit reached';

    /* A named target rather than the whole tile.
     *
     * "Click to remove" can take the whole thumbnail because removing is the
     * obvious thing to do to a video you just saved — the gesture is its own
     * undo. Opening a list is not obvious in the same way, so it says where to
     * click and only that spot does it. Everywhere else on the tile dismisses,
     * which is what someone reaching for "go away" will try first. */
    const link = document.createElement('button');
    link.className = 'villow-overlay__link';
    link.type = 'button';
    link.textContent = (words && words.link) || 'Click here to see what you saved';

    overlay.appendChild(label);
    overlay.appendChild(link);
    thumb.appendChild(overlay);
    return overlay;
  }

function clearCapped(tile) {
    if (!tile) return;
    tile.classList.remove('villow-capped');

    const thumbs = tile.querySelectorAll ? tile.querySelectorAll('.villow-thumb') : [];
    const scopes = [];
    for (let i = 0; i < thumbs.length; i++) scopes.push(thumbs[i]);
    scopes.push(tile);

    for (let i = 0; i < scopes.length; i++) {
      const scope = scopes[i];
      const overlays = scope.querySelectorAll ? scope.querySelectorAll('.villow-overlay') : [];
      for (let j = 0; j < overlays.length; j++) {
        if (overlays[j].getAttribute('data-villow-action') === 'cap') overlays[j].remove();
      }
      // Only un-dim what is not also a saved tile, which keeps its own mark.
      if (!tile.classList.contains('villow-marked') && scope.classList) {
        scope.classList.remove('villow-thumb');
      }
    }
  }
  return {buildRingButton, buildTimeText, paintSaveGlyph, buildLimitRow, remeasureAmount, markTile, markCapped, clearCapped, buildSavedRow, savedQuotaCount,
    clearPanel() { panelSizeAmounts.length = 0; ringPreview = null; }};
}
