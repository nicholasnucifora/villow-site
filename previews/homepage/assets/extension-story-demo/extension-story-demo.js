/**
 * Local teaching adapter for the connected Villow extension.
 * Artwork, quota semantics, stops and panel copy verified against
 * villow_extension/src/content/villow-content.js and src/quota.js, 2026-11-02.
 * No account services, storage, extension APIs, network calls or autoplay.
 */
import { createNativeControls } from './extension-story-native.js';
import { STYLE_TEXT } from './extension-story-style.js';

const loadedFonts = new WeakMap();
const fontSources = [new URL('./roboto-400.ttf', import.meta.url), new URL('./roboto-500.ttf', import.meta.url), new URL('./roboto-600.ttf', import.meta.url)];
function loadFonts(doc) {
  if (!doc.defaultView.FontFace || !doc.fonts) return Promise.resolve();
  if (!loadedFonts.has(doc)) loadedFonts.set(doc, Promise.all(fontSources.map((url, index) => {
    const face = new doc.defaultView.FontFace('Roboto', `url("${url.href}")`, { weight: String(400 + index * 100), style: 'normal', display: 'swap' });
    doc.fonts.add(face);
    return face.load();
  })).catch(() => {}));
  return loadedFonts.get(doc);
}
export const DEMO_VERSION = 2;
export const DEMO_VIDEOS = Object.freeze([
  Object.freeze({ id: 'hills', title: 'A little room to breathe', channel: 'The slow outdoors', durationSeconds: 768, thumbnail: 'calm-hills.webp' }),
  Object.freeze({ id: 'sea', title: 'A slower kind of morning', channel: 'Along the coast', durationSeconds: 612, thumbnail: 'demo-sea.webp' }),
  Object.freeze({ id: 'cup', title: 'A quiet moment', channel: 'Small rituals', durationSeconds: 405, thumbnail: 'demo-cup.webp' }),
  Object.freeze({ id: 'river', title: 'Following the river', channel: 'Outside, slowly', durationSeconds: 905, thumbnail: 'demo-river.webp' }),
]);
export const RING_LENGTH = 2 * Math.PI * 10;
export const SAVE_CIRCLE = 'M22 12a10 10 0 1 1-20 0a10 10 0 1 1 20 0';
export const SAVE_RACETRACK = 'M26 2H40a10 10 0 0 1 0 20H12a10 10 0 0 1 0-20H26Z';
export const HOME_PATH = 'M3 10.25L12 3l9 7.25V20a1 1 0 01-1 1h-5.5v-6h-5v6H4a1 1 0 01-1-1v-9.75z';
export const PLAY_PATH = 'M10.1 8.15 16.3 12 10.1 15.85 Z';
export const LIMIT_STOPS = Object.freeze({
  time: Object.freeze([5, 10, 15, 20, 25, 30, 0]),
  seen: Object.freeze([10, 25, 50, 75, 100, 150, 200, 0]),
  saves: Object.freeze(Array.from({ length: 15 }, (_, i) => i + 1)),
  saveDuration: Object.freeze([15, 30, 45, 60, 90, 120]),
});
const FIELDS = { time: 'timeLimitMinutes', seen: 'videoLimit', saves: 'saveLimit', saveDuration: 'saveDurationLimitMinutes' };
const TITLES = { time: 'Daily time limit', seen: 'Daily limit on recommendations seen', saves: 'Daily saves' };
let nextInstance = 0;
const whole = value => Math.max(0, Math.min(2147483647, Math.floor(Number(value) || 0)));
const minutes = value => Math.floor(whole(value) / 60) + 'm';
const leftMinutes = value => Math.ceil(whole(value) / 60) + 'm';
const duration = value => { const n = whole(value); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
const readableDuration = value => { const n = whole(value), h = Math.floor(n / 3600), m = Math.floor(n % 3600 / 60), s = n % 60; return (h ? `${h}h ` : '') + (m || h ? `${m}m` : '') + (s ? `${m || h ? ' ' : ''}${s}s` : (!n ? '0m' : '')); };
const freeze = object => { Object.values(object).forEach(value => { if (value && typeof value === 'object') freeze(value); }); return Object.freeze(object); };

export function createExampleState() {
  return {
    config: { timeLimitMinutes: 30, videoLimit: 100, saveLimit: 6, saveLimitMode: 'count', saveDurationLimitMinutes: 60 },
    usage: { activeSeconds: 300, recommendationsSeen: 50, saves: 0, savedDurationSeconds: 0 },
    videos: DEMO_VIDEOS.map(video => ({ ...video, saved: false, status: 'idle' })),
    selectionOrder: [],
    example: { saved: false, status: 'idle', durationSeconds: 768 },
  };
}

export function saveLimits(config) {
  const mode = ['count', 'duration', 'both', 'none'].includes(config.saveLimitMode) ? config.saveLimitMode : 'count';
  return {
    count: mode === 'count' || mode === 'both' ? whole(config.saveLimit) : 0,
    duration: mode === 'duration' || mode === 'both' ? whole(config.saveDurationLimitMinutes) * 60 : 0,
  };
}

export function toggleSaveLimit(state, key, enabled) {
  const active = saveLimits(state.config);
  const config = { ...state.config };
  let count = Boolean(active.count), time = Boolean(active.duration);
  if (key === 'saves') { count = enabled; if (enabled && !config.saveLimit) config.saveLimit = 6; }
  else { time = enabled; if (enabled && !config.saveDurationLimitMinutes) config.saveDurationLimitMinutes = 60; }
  config.saveLimitMode = count ? (time ? 'both' : 'count') : (time ? 'duration' : 'none');
  return { ...state, config };
}

export function changeExampleLimit(state, key, value) {
  if (!Object.prototype.hasOwnProperty.call(FIELDS, key)) return state;
  const amount = key === 'saves' || key === 'saveDuration' ? Math.max(1, whole(value)) : whole(value);
  return { ...state, config: { ...state.config, [FIELDS[key]]: amount } };
}

export function exampleSaveRefusal(state, videoId = 'hills') {
  const video = state.videos.find(video => video.id === videoId);
  if (!video) return 'unknown';
  if (video.saved) return null;
  const limits = saveLimits(state.config);
  if (limits.count && state.usage.saves >= limits.count) return 'count';
  if (limits.duration && !whole(video.durationSeconds)) return 'unknown';
  if (limits.duration && state.usage.savedDurationSeconds + video.durationSeconds > limits.duration) return 'duration';
  return null;
}

export function addExampleSave(state, videoId = 'hills') {
  const video = state.videos.find(video => video.id === videoId);
  if (!video || video.saved || exampleSaveRefusal(state, videoId)) return state;
  return { ...state, usage: { ...state.usage, saves: state.usage.saves + 1, savedDurationSeconds: state.usage.savedDurationSeconds + video.durationSeconds },
    selectionOrder: [videoId, ...state.selectionOrder],
    videos: state.videos.map(item => item.id === videoId ? { ...item, saved: true, status: 'pending' } : item),
    example: videoId === 'hills' ? { ...state.example, saved: true, status: 'saving' } : state.example };
}

export function removeExampleSave(state, videoId = 'hills') {
  const video = state.videos.find(video => video.id === videoId);
  if (!video?.saved) return state;
  return { ...state, usage: { ...state.usage, saves: state.usage.saves - 1, savedDurationSeconds: state.usage.savedDurationSeconds - video.durationSeconds },
    selectionOrder: state.selectionOrder.filter(id => id !== videoId),
    videos: state.videos.map(item => item.id === videoId ? { ...item, saved: false, status: 'idle' } : item),
    example: videoId === 'hills' ? { ...state.example, saved: false, status: 'idle' } : state.example };
}

function metric(used, limit, tooltip) {
  const remainingFraction = limit === 0 ? 1 : Math.max(0, 1 - used / limit);
  return { used, limit, remainingFraction, dashOffset: Math.round(RING_LENGTH * (1 - remainingFraction) * 10) / 10, spent: Boolean(limit && used >= limit), tooltip };
}

export function exampleMetrics(state) {
  const { config, usage } = state, limits = saveLimits(config);
  const slots = Math.max(0, limits.count - usage.saves);
  const timeLeft = leftMinutes(Math.max(0, limits.duration - usage.savedDurationSeconds));
  let tip;
  if (limits.count && limits.duration) {
    tip = !slots && usage.savedDurationSeconds >= limits.duration ? 'Both daily save limits reached'
      : !slots ? `Daily video count reached · ${timeLeft} of video time unused`
        : usage.savedDurationSeconds >= limits.duration ? `Daily video length reached · ${slots} video slots unused`
          : `${slots} video slot${slots === 1 ? '' : 's'} · ${timeLeft} of video left today`;
  } else if (limits.duration) tip = `${timeLeft} left to add to Villow today`;
  else tip = `${usage.saves}${limits.count ? ` of ${limits.count}` : ''} saved to Villow today${limits.count ? '' : ' · unlimited'}`;
  const saves = metric(limits.duration ? usage.savedDurationSeconds : usage.saves, limits.duration || limits.count, tip);
  saves.mode = limits.count ? (limits.duration ? 'both' : 'count') : (limits.duration ? 'duration' : 'none');
  saves.remainingSlots = limits.count ? slots : null;
  saves.spent = Boolean((limits.count && usage.saves >= limits.count) || (limits.duration && usage.savedDurationSeconds >= limits.duration));
  return {
    time: metric(usage.activeSeconds, config.timeLimitMinutes * 60, `${minutes(usage.activeSeconds)}${config.timeLimitMinutes ? ` of ${config.timeLimitMinutes}m` : ''} on YouTube today${config.timeLimitMinutes ? '' : ' · unlimited'}`),
    seen: metric(usage.recommendationsSeen, config.videoLimit, `${usage.recommendationsSeen}${config.videoLimit ? ` of ${config.videoLimit}` : ''} recommendations seen today${config.videoLimit ? '' : ' · unlimited'}`),
    saves,
  };
}

export function nearestStop(stops, value) {
  if (!value && stops.at(-1) === 0) return stops.length - 1;
  let best = 0;
  stops.forEach((stop, i) => { if (stop && Math.abs(stop - value) < Math.abs(stops[best] - value)) best = i; });
  return best;
}

/** Mount once; device updates retain only choices available on that device. */
export function mountExtensionStoryDemo(host, options = {}) {
  const doc = host.ownerDocument, win = doc.defaultView;
  const id = 'extension-story-demo-' + (++nextInstance);
  let appearance = { device: 'desktop', theme: 'light', youtubeLogoUrl: '/brand-youtube/youtube-full-color-black.png', thumbnailUrl: '/images/extension-story/calm-hills.webp', ...options };
  let state = createExampleState(), openKey = null, panel = null, tip = null, destroyed = false, preview = null;
  const cleanups = [], ringParts = {}, cards = new Map(), timers = new Map(), requests = new Map();
  const home = new Map(), capped = new Set();
  let swap = null, swapPending = null, swapReturnFocus = null, swapSignature = '', swapAddBlocked = false;
  let selectionSequence = 0;
  const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
  const portalHost = node('div', 'villow-demo-portal');
  const portal = portalHost.attachShadow({ mode: 'open' });
  const root = node('div', 'villow-demo');
  root.dataset.story = String(Boolean(options.includeStory));
  shadow.replaceChildren(node('style', '', STYLE_TEXT), root);
  portal.append(node('style', '', STYLE_TEXT));
  doc.body.append(portalHost);
  const native = createNativeControls(doc, {
    stopsFor: key => LIMIT_STOPS[key],
    nearestStop,
    thumbnail: videoId => thumbnail(DEMO_VIDEOS.find(video => video.id === videoId)),
    duration: readableDuration, leftMinutes, remove: videoId => { capped.clear(); removeVideo(videoId); },
    quota: () => ({ count: state.usage.saves, seconds: state.usage.savedDurationSeconds }),
    limits: () => saveLimits(state.config),
    preview(next) { if (!destroyed) { preview = next; render(); emit(); } },
    commit(key, value) {
      if (!destroyed) state = changeExampleLimit(state, key, value);
      return state.config[FIELDS[key]];
    },
  });
  loadFonts(doc).then(() => { if (!destroyed) native.remeasureAmount(); });
  function node(tag, className, text) { const el = doc.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
  function listen(target, type, callback, opts) { target.addEventListener(type, callback, opts); cleanups.push(() => target.removeEventListener(type, callback, opts)); }
  function effective() { return preview ? changeExampleLimit(state, preview.key, preview.value) : state; }
  function getState() {
    const active = effective(), ordered = active.selectionOrder.map(id => active.videos.find(video => video.id === id));
    const arrivedIds = [...home].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    return freeze({ version: DEMO_VERSION, ...active, selectionOrder: [...active.selectionOrder], config: { ...active.config }, usage: { ...active.usage }, example: { ...active.example }, videos: active.videos.map(video => ({ ...video })), pendingIds: ordered.filter(video => !home.has(video.id)).map(video => video.id), arrivedIds, pendingRemovalIds: arrivedIds.filter(id => !active.selectionOrder.includes(id)), openPanel: openKey, metrics: exampleMetrics(active) });
  }
  function emit() { if (destroyed) return; const snapshot = getState(); options.onStateChange?.(snapshot); host.dispatchEvent(new win.CustomEvent('extension-story-demo-change', { detail: snapshot, bubbles: true })); }

  const shell = node('div', 'villow-demo__youtube');
  const masthead = node('div', 'villow-demo__masthead');
  const logo = node('a', 'villow-demo__youtube-link');
  logo.href = 'https://www.youtube.com/'; logo.target = '_blank'; logo.rel = 'noopener noreferrer'; logo.setAttribute('aria-label', 'Open YouTube in a new tab'); logo.title = 'Open YouTube in a new tab';
  const logoImage = node('img'); logoImage.src = appearance.youtubeLogoUrl; logoImage.alt = 'YouTube'; logoImage.width = 1705; logoImage.height = 573; logo.append(logoImage);
  const rings = node('div', 'villow-rings'); rings.setAttribute('role', 'group'); rings.setAttribute('aria-label', 'Try the extension’s example daily limits');
  masthead.append(logo);
  if (options.includeStory) masthead.append(node('span', 'villow-demo__teaching-pill', 'Choose videos'));
  masthead.append(rings); shell.append(masthead);

  function wireRing(part, key) {
    const button = part.btn;
    button.dataset.setting = key;
    // The popup has a separate shadow root: an aria-controls IDREF cannot cross it.
    button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-expanded', 'false');
    listen(button, 'click', () => { if (openKey === key) closePanel(); else openPanel(key); });
    listen(button, 'mouseenter', () => showTip(key)); listen(button, 'mouseleave', hideTip);
    listen(button, 'focus', () => { if (button.matches(':focus-visible')) showTip(key); }); listen(button, 'blur', hideTip);
    listen(button, 'keydown', event => { if (event.key === 'Tab' && !event.shiftKey && openKey === key && panel) { event.preventDefault(); panel.querySelector('input,button,a')?.focus(); } });
    return part;
  }
  ['time', 'seen', 'saves'].forEach(key => {
    const regular = wireRing(native.buildRingButton(key), key);
    ringParts[key] = { regular, current: regular };
    if (key === 'time') ringParts[key].text = wireRing(native.buildTimeText(), key);
    rings.append(regular.btn);
  });
  const anchorFor = key => ringParts[key].current.btn;
  function thumbnail(video) { return (appearance.thumbnailBaseUrl || appearance.thumbnailUrl.slice(0, appearance.thumbnailUrl.lastIndexOf('/') + 1)) + video.thumbnail; }
  const stages = node('div', 'villow-demo__feed');
  const grid = node('div', 'villow-demo__grid');
  DEMO_VIDEOS.forEach(video => {
    const card = node('div', 'villow-demo__card'); card.dataset.videoId = video.id;
    const picture = node('div', 'villow-demo__thumbnail');
    const media = node('div', 'villow-demo__media');
    const image = node('img'); image.src = thumbnail(video); image.alt = ''; image.width = 1672; image.height = 941;
    media.append(image, node('span', 'villow-demo__duration', duration(video.durationSeconds)));
    picture.append(media);
    card.append(picture, node('strong', 'villow-demo__video-title', video.title), node('span', 'villow-demo__channel', video.channel));
    function choose(event) {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest?.('.villow-overlay__link')) {
        if (event.type === 'click') { event.preventDefault(); event.stopPropagation(); openSwap(video.id); }
        return;
      }
      if (event.type === 'keydown') event.preventDefault();
      if (capped.has(video.id)) { capped.delete(video.id); render(); return; }
      const focused = doc.activeElement === host ? shadow.activeElement : null;
      const heldFocus = focused === picture || (focused && focused === picture.querySelector('.villow-overlay'));
      state.videos.find(item => item.id === video.id).saved ? removeVideo(video.id) : saveVideo(video.id);
      if (heldFocus) (picture.querySelector('.villow-overlay__link') || picture.querySelector('.villow-overlay') || picture).focus({ preventScroll: true });
    }
    listen(picture, 'click', choose); listen(picture, 'keydown', choose);
    cards.set(video.id, card); grid.append(card);
  });
  stages.append(grid);
  if (options.includeStory) {
    const body = node('div', 'villow-demo__body'), sidebar = node('div', 'villow-demo__sidebar');
    sidebar.setAttribute('aria-hidden', 'true');
    for (const [label, path] of [
      ['Home', 'M3 10.5 12 3l9 7.5V21h-6v-7H9v7H3Z'],
      ['Shorts', 'm16.5 3-10 5.8a3 3 0 0 0 0 5.2l2 1.1-2 1.2a3 3 0 0 0 3 5.2l10-5.8a3 3 0 0 0 0-5.2l-2-1.1 2-1.2a3 3 0 0 0-3-5.2ZM10 9l5 3-5 3Z'],
      ['Subscriptions', 'M7 3h10M5 6h14M3 9h18v12H3ZM10 12l5 3-5 3Z'],
    ]) {
      const item = node('div', 'villow-demo__nav-item');
      const icon = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('fill', 'none'); icon.setAttribute('stroke', 'currentColor'); icon.setAttribute('stroke-width', '1.5'); icon.setAttribute('stroke-linejoin', 'round');
      const shape = doc.createElementNS(icon.namespaceURI, 'path'); shape.setAttribute('d', path); icon.append(shape);
      item.append(icon, node('span', '', label)); sidebar.append(item);
    }
    body.append(sidebar, stages); shell.append(body);
  }
  root.append(shell);
  const status = node('p', 'villow-demo__status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); root.append(status);

  function render() {
    const active = effective(), metrics = exampleMetrics(active);
    for (const el of [host, portalHost, root]) { el.dataset.device = appearance.device; el.dataset.theme = appearance.theme; }
    logoImage.src = appearance.youtubeLogoUrl;
    rings.classList.toggle('villow-rings--panel-open', Boolean(openKey));
    ['time', 'seen', 'saves'].forEach(key => {
      const data = metrics[key], parts = ringParts[key];
      const textTime = key === 'time' && !data.limit && preview?.key !== 'time';
      const next = textTime ? parts.text : parts.regular;
      if (parts.current !== next) { parts.current.btn.replaceWith(next.btn); parts.current = next; }
      const button = next.btn;
      button.classList.toggle('villow-ring-btn--spent', data.spent);
      button.classList.toggle('villow-ring-btn--selected', openKey === key);
      button.setAttribute('aria-label', textTime ? minutes(active.usage.activeSeconds) + ' on YouTube today' : data.tooltip);
      button.setAttribute('aria-expanded', String(openKey === key));
      next.tip.textContent = textTime ? button.getAttribute('aria-label') : data.tooltip;
      button.style.order = key === 'time' ? (textTime ? '3' : '0') : key === 'seen' ? '1' : '2';
      if (textTime) next.value.textContent = minutes(active.usage.activeSeconds);
      else {
        next.fill.setAttribute('stroke-dashoffset', String(data.dashOffset));
        if (key === 'saves') native.paintSaveGlyph(button.querySelector('svg'), saveLimits(active.config), { count: active.usage.saves });
      }
    });
    state.videos.forEach(video => {
      const card = cards.get(video.id), picture = card.querySelector('.villow-demo__thumbnail');
      picture.querySelector('img').src = thumbnail(video);
      if (capped.has(video.id) && (!availableVideo(video.id) || !exampleSaveRefusal(active, video.id))) capped.delete(video.id);
      if (video.saved) {
        native.clearCapped(card);
        picture.removeAttribute('role'); picture.removeAttribute('tabindex'); picture.removeAttribute('aria-label');
        native.markTile(card, video.id, video.status === 'pending' ? 'pending' : 'saved');
        const overlay = picture.querySelector('.villow-overlay');
        overlay.setAttribute('aria-label', video.title + ' — ' + overlay.getAttribute('aria-label'));
      } else if (capped.has(video.id)) {
        picture.removeAttribute('role'); picture.removeAttribute('tabindex'); picture.removeAttribute('aria-label');
        const reason = exampleSaveRefusal(active, video.id);
        const words = { label: reason === 'duration' ? 'Not enough time left today' : reason === 'unknown' ? 'This video’s length is unavailable' : 'Save limit reached', link: 'Click here to see what you saved' };
        const existing = picture.querySelector('[data-villow-action="cap"]');
        if (existing) existing.querySelector('.villow-overlay__label').textContent = words.label;
        else native.markCapped(card, video.id, words);
      } else {
        native.clearCapped(card);
        card.classList.remove('villow-marked'); picture.classList.remove('villow-thumb');
        picture.querySelector('.villow-overlay')?.remove();
        picture.setAttribute('role', 'button'); picture.tabIndex = 0; picture.setAttribute('aria-label', 'Add ' + video.title + ' to Villow');
      }
    });
    // A refusal on the deliberately cropped next row must expose its link.
    // Grow only for that notice, without introducing an internal scroll area.
    stages.toggleAttribute('data-reveal-cap', state.videos.some((video, index) => capped.has(video.id) && index >= (appearance.device === 'mobile' ? 1 : 2)));
    if (panel) { paintPanelSummary(); positionPanel(); }
    if (swap) paintSwap();
    if (tip) { tip.textContent = ringParts[tip.dataset.setting].current.tip.textContent; positionTip(); }
  }

  function cancelHomeUpdate(videoId) {
    win.clearTimeout(timers.get(videoId)?.handle); timers.delete(videoId);
  }
  function cancelRequest(videoId) {
    win.clearTimeout(requests.get(videoId)?.handle); requests.delete(videoId);
  }
  function scheduleRequest(videoId, sequence) {
    cancelRequest(videoId); cancelHomeUpdate(videoId);
    const operation = { handle: null };
    // Deliberate teaching pace, not a production request latency guarantee.
    operation.handle = win.setTimeout(() => {
      if (destroyed || requests.get(videoId) !== operation) return;
      requests.delete(videoId);
      state = { ...state, videos: state.videos.map(video => video.id === videoId ? { ...video, status: 'saved' } : video),
        example: videoId === 'hills' ? { ...state.example, status: 'saved' } : state.example };
      status.textContent = 'Added to Villow. Updating Home…';
      scheduleHomeUpdate(videoId, true, sequence); render(); emit();
    }, 1000);
    requests.set(videoId, operation);
  }
  function scheduleHomeUpdate(videoId, saved, sequence = 0) {
    cancelHomeUpdate(videoId);
    const operation = { handle: null };
    operation.handle = win.setTimeout(() => {
      if (destroyed || timers.get(videoId) !== operation) return;
      timers.delete(videoId);
      if (saved) {
        home.set(videoId, sequence);
        state = { ...state, videos: state.videos.map(video => video.id === videoId ? { ...video, status: 'arrived' } : video),
          example: videoId === 'hills' ? { ...state.example, status: 'saved' } : state.example };
      } else home.delete(videoId);
      status.textContent = state.videos.find(video => video.id === videoId).title + (saved ? ' is now in Villow Home.' : ' was removed from Villow Home.');
      render(); emit();
    }, 1500);
    timers.set(videoId, operation);
  }
  function saveVideo(videoId) {
    if (destroyed || !availableVideo(videoId) || !state.videos.some(video => video.id === videoId && !video.saved)) return false;
    const refusal = exampleSaveRefusal(state, videoId);
    if (refusal) { capped.add(videoId); render(); return false; }
    capped.delete(videoId);
    state = addExampleSave(state, videoId);
    delete status.dataset.visible; status.textContent = 'Saving to Villow…';
    scheduleRequest(videoId, ++selectionSequence); render(); emit(); return true;
  }
  function removeVideo(videoId) {
    if (destroyed || !state.videos.some(video => video.id === videoId && video.saved)) return false;
    cancelRequest(videoId); cancelHomeUpdate(videoId); state = removeExampleSave(state, videoId);
    if (home.has(videoId)) scheduleHomeUpdate(videoId, false);
    delete status.dataset.visible; status.textContent = 'Video removed from this example.'; render(); emit(); return true;
  }
  const saveExample = () => saveVideo('hills'), removeExample = () => removeVideo('hills');
  function clearTimers() { for (const pending of [timers, requests]) { pending.forEach(timer => win.clearTimeout(timer.handle)); pending.clear(); } }
  function reset() { if (destroyed) return; clearTimers(); home.clear(); capped.clear(); closeSwap(false); selectionSequence = 0; closePanel(false); state = createExampleState(); delete status.dataset.visible; status.textContent = ''; render(); emit(); }
  function availableVideo(videoId) { return appearance.device !== 'mobile' || DEMO_VIDEOS.slice(0, 2).some(video => video.id === videoId); }
  function updateAppearance(next = {}) {
    if (destroyed) return;
    if (next.device && next.device !== appearance.device) closeSwap(false);
    appearance = { ...appearance, ...next };
    let changed = false;
    // Switching advice changes the available teaching choices immediately. Do
    // not retain invisible saves, spend their quota, or let an old timer revive
    // them. Still-visible choices keep their exact request/retrieval deadlines.
    state.videos.filter(video => !availableVideo(video.id)).forEach(video => {
      if (video.saved || home.has(video.id)) changed = true;
      cancelRequest(video.id); cancelHomeUpdate(video.id);
      state = removeExampleSave(state, video.id); home.delete(video.id);
    });
    if (changed) { delete status.dataset.visible; status.textContent = ''; }
    render();
    if (changed) emit();
  }

  function closeSwap(restore = true) {
    if (!swap) return;
    swap.remove(); swap = null; swapPending = null; swapSignature = ''; swapAddBlocked = false;
    if (restore && swapReturnFocus?.isConnected) swapReturnFocus.focus({ preventScroll: true });
    else if (restore) anchorFor('saves').focus({ preventScroll: true });
    swapReturnFocus = null;
  }
  function openSwap(videoId) {
    if (destroyed || !availableVideo(videoId)) return;
    closePanel(false); closeSwap(false); hideTip();
    swapPending = videoId;
    swapReturnFocus = cards.get(videoId).querySelector('.villow-overlay__link');
    swap = node('div', 'villow-swap-back');
    swap.addEventListener('click', event => { if (event.target === swap) closeSwap(); });
    const box = node('div', 'villow-swap');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', id + '-swap-title');
    const head = node('div', 'villow-swap__head'), title = node('span', 'villow-swap__title', 'Today’s videos');
    title.id = id + '-swap-title';
    const close = node('button', 'villow-swap__close', '✕'); close.type = 'button'; close.setAttribute('aria-label', 'Close'); close.addEventListener('click', () => closeSwap());
    head.append(title, node('span', 'villow-swap__count'), close);
    box.append(head, node('div', 'villow-swap__list')); swap.append(box); portal.append(swap);
    paintSwap(); close.focus({ preventScroll: true });
  }
  function paintSwap() {
    if (!swap) return;
    const signature = state.selectionOrder.join(',') + '|' + JSON.stringify(state.config) + '|' + swapPending + '|' + appearance.thumbnailBaseUrl + '|' + appearance.thumbnailUrl;
    if (signature === swapSignature) return;
    swapSignature = signature;
    swap.querySelector('.villow-swap__count').textContent = native.savedQuotaCount();
    const list = swap.querySelector('.villow-swap__list'); list.replaceChildren();
    const entries = [...state.selectionOrder].reverse().map(id => state.videos.find(video => video.id === id));
    if (entries.length) list.append(node('div', 'villow-swap__group-title', 'In your queue (' + entries.length + ')'));
    for (const entry of entries) {
      const row = native.buildSavedRow(entry.id, entry, () => {
        (swap?.querySelector('.villow-panel__remove--ready') || swap?.querySelector('.villow-panel__remove') || swap?.querySelector('.villow-swap__close'))?.focus({ preventScroll: true });
      });
      row.dataset.videoId = entry.id;
      row.querySelector('button').setAttribute('aria-label', 'Remove ' + entry.title);
      list.append(row);
    }
    const pending = state.videos.find(video => video.id === swapPending && !video.saved);
    if (pending) {
      const blocked = Boolean(exampleSaveRefusal(state, pending.id)), woke = !blocked && swapAddBlocked;
      swapAddBlocked = blocked;
      const row = native.buildSavedRow(pending.id, pending, null, {
        action: 'Add', disabled: blocked, woke,
        disabledTitle: 'Remove unwatched videos until this video fits within your daily save limits',
        onAction: () => { if (saveVideo(pending.id)) closeSwap(); },
      });
      row.dataset.videoId = pending.id; row.classList.add('villow-panel__item--pending'); list.append(row);
    }
    if (!entries.length && !pending) list.append(node('p', 'villow-panel__empty', 'Nothing saved to Villow today.'));
  }

  function hideTip() { tip?.remove(); tip = null; }
  function showTip(key) {
    hideTip();
    // With no panel the source's persistent nested tooltip handles hover/focus.
    if (!openKey || openKey === key || appearance.device === 'mobile') return;
    tip = node('span', 'villow-tip villow-tip--floating', ringParts[key].current.tip.textContent);
    tip.dataset.setting = key; tip.setAttribute('role', 'tooltip'); portal.append(tip); positionTip();
  }
  function positionTip() {
    if (!tip) return;
    const rect = anchorFor(tip.dataset.setting).getBoundingClientRect(), width = tip.getBoundingClientRect().width;
    tip.style.left = Math.round(Math.max(8 + width / 2, Math.min(rect.left + rect.width / 2, win.innerWidth - 8 - width / 2))) + 'px';
    tip.style.top = Math.round(rect.bottom + 6) + 'px';
  }
  let closing = false;
  function closePanel(notify = true) {
    if ((!panel && !openKey) || closing) return;
    closing = true;
    // The native field commits on blur; retain that before removing its root.
    const focused = doc.activeElement === portalHost ? portal.activeElement : null;
    if (focused?.matches('input[type="text"]')) focused.blur();
    panel?.remove(); panel = null; openKey = null; preview = null; native.clearPanel(); hideTip();
    closing = false;
    if (!destroyed) { render(); if (notify) emit(); }
  }
  function openPanel(key) {
    if (destroyed) return;
    closePanel(false); hideTip(); openKey = key; panel = node('div', 'villow-panel'); panel.id = id + '-panel'; panel.dataset.villowPanel = key;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', id + '-title');
    const head = node('div', 'villow-panel__head'), title = node('span', 'villow-panel__title', TITLES[key]);
    title.id = id + '-title';
    head.append(title, node('span', 'villow-panel__now')); panel.append(head);
    if (key === 'saves') {
      const view = node('a', 'villow-panel__view', 'View in Villow'); view.href = '#extension-story-home';
      view.addEventListener('click', event => { event.preventDefault(); closePanel(); host.dispatchEvent(new win.CustomEvent('extension-story-demo-home', { bubbles: true })); }); panel.append(view);
      panel.append(node('p', 'villow-panel__limit-note', 'Stop saving when either enabled limit is reached.'));
      panel.append(buildSaveLimitControl('saves', 'Video count', ''), buildSaveLimitControl('saveDuration', 'Total video length', 'min'));
      panel.append(node('div', 'villow-panel__list-title', 'Recently saved'), node('div', 'villow-panel__list'));
    } else panel.append(native.buildLimitRow(key, { title: TITLES[key], unit: key === 'time' ? 'min' : '', value: () => state.config[FIELDS[key]] }));
    portal.append(panel); native.remeasureAmount(); render(); emit();
  }
  function buildSaveLimitControl(key, name, unit) {
    const section = node('div', 'villow-panel__save-limit'), head = node('div', 'villow-switch');
    const label = node('label', 'villow-switch__name', name); label.htmlFor = id + '-' + key + '-toggle'; head.append(label);
    const on = Boolean(saveLimits(state.config)[key === 'saves' ? 'count' : 'duration']);
    const toggle = node('button', 'villow-toggle' + (on ? ' villow-toggle--on' : ''));
    toggle.type = 'button'; toggle.id = label.htmlFor; toggle.setAttribute('role', 'switch'); toggle.setAttribute('aria-label', name + ' limit');
    toggle.setAttribute('aria-checked', String(on)); toggle.dataset.villowSaveLimit = key; toggle.append(node('span', 'villow-toggle__knob'));
    section.append(head);
    const controls = native.buildLimitRow(key, { title: name + ' — daily limit', unit, value: () => state.config[FIELDS[key]] || (key === 'saves' ? 6 : 60) }, head);
    head.append(toggle); section.append(controls);
    head.querySelector('.villow-panel__value').hidden = !on; controls.hidden = !on;
    head.querySelector('input').disabled = !on; controls.querySelector('input').disabled = !on;
    toggle.addEventListener('click', () => {
      state = toggleSaveLimit(state, key, !on); openPanel('saves');
      panel.querySelector('[data-villow-save-limit="' + key + '"]').focus();
    });
    return section;
  }
  let listSignature = '';
  function paintPanelSummary() {
    if (!panel) return;
    const active = effective();
    panel.querySelector('.villow-panel__now').textContent = openKey === 'time' ? minutes(active.usage.activeSeconds) + ' spent today' : openKey === 'seen' ? active.usage.recommendationsSeen + ' seen today' : active.usage.saves + ' saved · ' + readableDuration(active.usage.savedDurationSeconds);
    const list = panel.querySelector('.villow-panel__list');
    if (list) {
      const signature = state.selectionOrder.join(',') + '|' + appearance.thumbnailBaseUrl + '|' + appearance.thumbnailUrl;
      if (list.childNodes.length && signature === listSignature) return;
      listSignature = signature; list.replaceChildren();
      const entries = [...state.selectionOrder].reverse().map(id => state.videos.find(video => video.id === id));
      if (!entries.length) list.append(node('div', 'villow-panel__empty', 'Nothing saved to Villow today.'));
      entries.forEach(entry => {
        const row = node('div', 'villow-panel__item'), shot = node('span', 'villow-panel__item-shot villow-shot');
        const image = node('img', 'villow-shot__img'); image.src = thumbnail(entry); image.alt = ''; image.loading = 'lazy';
        shot.append(image, node('span', 'villow-shot__length', readableDuration(entry.durationSeconds)));
        const copy = node('div', 'villow-panel__item-text');
        copy.append(node('span', 'villow-panel__item-title', entry.title), node('span', 'villow-panel__item-channel', entry.channel));
        const remove = node('button', 'villow-panel__remove', 'Remove'); remove.type = 'button'; remove.setAttribute('aria-label', 'Remove ' + entry.title + ' from this example');
        remove.addEventListener('click', () => { removeVideo(entry.id); anchorFor('saves').focus({ preventScroll: true }); });
        row.append(shot, copy, remove); list.append(row);
      });
    }
  }
  function positionPanel() {
    if (!panel || !openKey || closing) return;
    const anchor = anchorFor(openKey).getBoundingClientRect();
    if ((!anchor.width && !anchor.height) || anchor.bottom < 0 || anchor.top > win.innerHeight) { closePanel(); return; }
    const width = Math.min(380, win.innerWidth - 16);
    panel.style.left = Math.round(Math.max(8, Math.min(anchor.left + anchor.width / 2 - width / 2, win.innerWidth - width - 8))) + 'px';
    panel.style.top = Math.round(anchor.bottom + 10) + 'px';
  }
  function outside(event) {
    const path = event.composedPath();
    if (panel && !path.includes(panel) && !path.includes(anchorFor(openKey))) closePanel();
    if (tip && !path.includes(rings)) hideTip();
  }
  listen(doc, 'pointerdown', outside, true);
  listen(doc, 'mousedown', outside, true);
  listen(doc, 'touchstart', outside, true);
  listen(doc, 'keydown', event => {
    if (swap) {
      if (event.key === 'Escape') { event.preventDefault(); closeSwap(); }
      else if (event.key === 'Tab') {
        const buttons = [...swap.querySelectorAll('button:not(:disabled)')], at = buttons.indexOf(portal.activeElement);
        if (at < 0 || (!event.shiftKey && at === buttons.length - 1) || (event.shiftKey && at === 0)) {
          event.preventDefault(); buttons[event.shiftKey ? buttons.length - 1 : 0]?.focus();
        }
      }
      return;
    }
    if (event.key === 'Escape' && panel) { const anchor = anchorFor(openKey); closePanel(); anchor.focus({ preventScroll: true }); }
  });
  listen(win, 'resize', () => { positionPanel(); positionTip(); });
  listen(win, 'scroll', () => { positionPanel(); positionTip(); }, true);
  const observer = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(() => { positionPanel(); positionTip(); }) : null;
  observer?.observe(host);
  function destroy() {
    if (destroyed) return;
    clearTimers(); closeSwap(false); destroyed = true;
    native.clearPanel(); panel?.remove(); hideTip(); portalHost.remove(); observer?.disconnect(); cleanups.forEach(cleanup => cleanup());
    shadow.replaceChildren();
  }
  render();
  return { saveVideo, removeVideo, saveExample, removeExample, reset, getState, updateAppearance, destroy };
}
