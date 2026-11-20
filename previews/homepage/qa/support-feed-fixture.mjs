// Small DOM/event fixture with a controllable animation clock and card geometry.
export function feedFixture(t, { reducedMotion = false, origin = 'https://villow.app' } = {}) {
  let cardStride = 446, clock = 0, frameId = 0;
  const frames = new Map(), capture = new Set(), attributeObservers = new Map();
  function target() {
    const events = new Map();
    return { addEventListener(name, fn) { if (!events.has(name)) events.set(name, []);events.get(name).push(fn); },
      emit(name, event = {}) { for (const fn of events.get(name) || []) fn(event); } };
  }
  function element(tagName = 'div') {
    const attributes = new Map();
    return { ...target(), tagName, children: [], dataset: {}, hidden: false, textContent: '', className: '', clientWidth: 1280, clientHeight:24, scrollHeight:24,
      focus() { const previous = doc.activeElement;doc.activeElement = this;this.emit('focusin',{relatedTarget:previous}); },
      showModal() { this.open = true;doc.activeElement = this; }, close() { this.open = false;this.emit('close'); },
      closest(tag) { return this.tagName === tag ? this : this.parent?.closest(tag); },
      matches(selector) { return selector === ':focus-visible' && this.focusVisible === true; },
      getBoundingClientRect() { return { left:0,top:0,right:300,bottom:200 }; },
      style: { transform: '', setProperty(name, value) { this[name] = value; } },
      get offsetLeft() { return (this.parent?.children.indexOf(this) || 0) * cardStride; },
      setPointerCapture(id) { capture.add(id); }, hasPointerCapture(id) { return capture.has(id); }, releasePointerCapture(id) { capture.delete(id); },
      setAttribute(key, value) { attributes.set(key, value);attributeObservers.get(this)?.(); }, removeAttribute(key) { attributes.delete(key);attributeObservers.get(this)?.(); },
      getAttribute(key) { return attributes.get(key); },
      hasAttribute(key) { return attributes.has(key); },
      toggleAttribute(key) { if (attributes.has(key)) this.removeAttribute(key);else this.setAttribute(key, ''); },
      replaceChildren(...items) { this.children = [];this.append(...items); }, append(...items) { this.children.push(...items);for (const item of items) item.parent = this; },
      contains(item) { return item === this || this.children.some(child => child.contains(item)); },
      querySelector(tag) { for (const child of this.children) { if (child.tagName === tag) return child;const found = child.querySelector(tag);if (found) return found; }return null; },
      querySelectorAll(tag) { return this.children.flatMap(child => [...(child.tagName === tag ? [child] : []), ...child.querySelectorAll(tag)]); },
    };
  }
  const previous = { document: globalThis.document, window: globalThis.window };
  const motion = { ...target(), matches: reducedMotion };
  const doc = { ...target(), createElement: element, hidden: false, body: element('body'), documentElement: { clientWidth: 1280 } };
  const observers = new Map();
  const win = { ...target(), location: { origin }, matchMedia: () => motion,
    requestAnimationFrame(callback) { frames.set(++frameId, callback);return frameId; }, cancelAnimationFrame(id) { frames.delete(id); },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; } observe(target) { observers.set(target, this.callback); } },
    MutationObserver: class { constructor(callback) { this.callback = callback; } observe(target) { attributeObservers.set(target, this.callback); } },
  };
  globalThis.document = doc;globalThis.window = win;
  t.after(() => {
    win.emit('pagehide');
    for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete globalThis[key];else globalThis[key] = value; }
  });
  const elements = new Map();
  const root = { querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element());return elements.get(selector); } };
  return { root, doc, win, motion, get: selector => root.querySelector(selector),
    advance(ms) { for (let remaining = ms; remaining > 0;) { const step = Math.min(16, remaining);remaining -= step;clock += step;const pending = [...frames.values()];frames.clear();pending.forEach(callback => callback(clock)); } },
    resize(width, nextStride = cardStride) { doc.documentElement.clientWidth = width;for (const target of observers.keys()) target.clientWidth = width;cardStride = nextStride;win.emit('resize'); },
    inView(value, suffix) { for (const [target, callback] of observers) if (suffix === undefined || target === root.querySelector(`[data-message-viewport${suffix}]`)) callback([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]); } };
}
