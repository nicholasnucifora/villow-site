// Minimal browser geometry/canvas fixture for the actual source renderer.
// It records vector operations; it does not rasterize or replace browser QA.
export class Matrix {
  constructor(values) {
    const v = values instanceof Matrix ? values.values : values ?? [1, 0, 0, 1, 0, 0];
    [this.a, this.b, this.c, this.d, this.e, this.f] = v;
  }
  get values() { return [this.a, this.b, this.c, this.d, this.e, this.f]; }
  multiply(n) {
    const m = this;
    return new Matrix([
      m.a * n.a + m.c * n.b, m.b * n.a + m.d * n.b,
      m.a * n.c + m.c * n.d, m.b * n.c + m.d * n.d,
      m.a * n.e + m.c * n.f + m.e, m.b * n.e + m.d * n.f + m.f,
    ]);
  }
  translate(x = 0, y = 0) { return this.multiply(new Matrix([1, 0, 0, 1, x, y])); }
  scale(x = 1, y = x, z = 1, ox = 0, oy = 0) {
    return this.translate(ox, oy).multiply(new Matrix([x, 0, 0, y, 0, 0])).translate(-ox, -oy);
  }
  rotate(degrees = 0) {
    const angle = degrees * Math.PI / 180;
    const c = Math.cos(angle), s = Math.sin(angle);
    return this.multiply(new Matrix([c, s, -s, c, 0, 0]));
  }
  inverse() {
    const { a, b, c, d, e, f } = this;
    const det = a * d - b * c;
    if (!det) throw new Error('Singular matrix');
    return new Matrix([d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det]);
  }
  transformPoint({ x, y }) { return { x: this.a * x + this.c * y + this.e, y: this.b * x + this.d * y + this.f }; }
}

export class Point { constructor(x = 0, y = 0) { this.x = x; this.y = y; } }
export class Path { constructor(d = '') { this.d = d instanceof Path ? d.d : d; } }

export class TrackedTarget extends EventTarget {
  listeners = new Map();
  addEventListener(type, fn, options) {
    super.addEventListener(type, fn, options);
    if (!fn || options?.signal?.aborted) return;
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
    options?.signal?.addEventListener('abort', () => this.removeEventListener(type, fn, options), { once: true });
  }
  removeEventListener(type, fn, options) {
    super.removeEventListener(type, fn, options);
    this.listeners.get(type)?.delete(fn);
    if (this.listeners.get(type)?.size === 0) this.listeners.delete(type);
  }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

export class FakeContext {
  operations = [];
  matrix = new Matrix();
  stack = [];
  globalAlpha = 1;
  fillStyle = '#000';
  strokeStyle = '#000';
  lineWidth = 1;
  save() { this.stack.push({ matrix: new Matrix(this.matrix), globalAlpha: this.globalAlpha, fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth }); }
  restore() { Object.assign(this, this.stack.pop()); }
  transform(a, b, c, d, e, f) { this.matrix = this.matrix.multiply(new Matrix([a, b, c, d, e, f])); }
  setTransform(...args) { this.matrix = args[0] instanceof Matrix ? new Matrix(args[0]) : new Matrix(args); }
  resetTransform() { this.matrix = new Matrix(); }
  translate(x, y) { this.matrix = this.matrix.translate(x, y); }
  scale(x, y) { this.matrix = this.matrix.scale(x, y); }
  rotate(radians) { this.matrix = this.matrix.rotate(radians * 180 / Math.PI); }
  record(kind, path) { this.operations.push({ kind, path, matrix: new Matrix(this.matrix), alpha: this.globalAlpha, fill: this.fillStyle, stroke: this.strokeStyle, width: this.lineWidth }); }
  fill(path) { this.record('fill', path); }
  stroke(path) { this.record('stroke', path); }
  clip(path) { this.record('clip', path); }
  clearRect() { this.operations = []; }
  beginPath() { this.currentPath = []; }
  closePath() { this.currentPath?.push(['Z']); }
  moveTo(...p) { this.currentPath?.push(['M', ...p]); }
  lineTo(...p) { this.currentPath?.push(['L', ...p]); }
  quadraticCurveTo(...p) { this.currentPath?.push(['Q', ...p]); }
  bezierCurveTo(...p) { this.currentPath?.push(['C', ...p]); }
  arc(...p) { this.currentPath?.push(['A', ...p]); }
  ellipse(...p) { this.currentPath?.push(['E', ...p]); }
  rect(...p) { this.currentPath?.push(['R', ...p]); }
  roundRect(...p) { this.currentPath?.push(['RR', ...p]); }
  drawImage() { this.record('image'); }
  getImageData() { return { data: new Uint8ClampedArray([27, 30, 41, 255]) }; }
}

const matches = (node, selector) => {
  if (selector.startsWith('.')) return node.className.split(/\s+/).includes(selector.slice(1));
  const attributes = [...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];
  if (attributes.length) return attributes.every(([, key, value]) => node.attrs.has(key) && (value === undefined || node.attrs.get(key) === value));
  return node.tagName.toLowerCase() === selector.toLowerCase();
};

export class FakeElement extends TrackedTarget {
  constructor(tagName = 'div', attrs = {}) {
    super(); this.tagName = tagName; this.attrs = new Map(Object.entries(attrs));
    this.children = []; this.parentNode = null; this.hidden = false; this.isConnected = true;
    this.style = { setProperty(name, value) { this[name] = value; }, removeProperty(name) { delete this[name]; } };
    this.dataset = {}; this.rect = { left: 0, top: 0, width: 48, height: 48, right: 48, bottom: 48 };
    this.classList = { add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); }, remove: (...names) => { this.className = this.className.split(/\s+/).filter((name) => !names.includes(name)).join(' '); }, contains: (name) => this.className.split(/\s+/).includes(name), toggle: (name, force) => { const present = force ?? !this.className.split(/\s+/).includes(name); present ? this.classList.add(name) : this.classList.remove(name); return present; } };
  }
  get className() { return this.attrs.get('class') ?? ''; }
  set className(value) { this.attrs.set('class', value); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  toggleAttribute(name, force) { const present = force ?? !this.attrs.has(name); present ? this.attrs.set(name, '') : this.attrs.delete(name); return present; }
  append(...children) { for (const child of children) { child.parentNode = this; child.isConnected = this.isConnected; this.children.push(child); } }
  appendChild(child) { this.append(child); return child; }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this); this.parentNode = null; this.isConnected = false; }
  getBoundingClientRect() { return { ...this.rect }; }
  get clientWidth() { return this.rect.width; }
  get clientHeight() { return this.rect.height; }
  querySelectorAll(selector) { return this.children.flatMap((child) => [...(matches(child, selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  closest(selector) { return matches(this, selector) ? this : this.parentNode?.closest(selector) ?? null; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
}

export class FakeCanvas extends FakeElement {
  constructor() { super('canvas'); this.width = 48; this.height = 48; this.context = new FakeContext(); }
  getContext(kind) { return kind === '2d' ? this.context : null; }
}

class Parser {
  parseFromString(svg) {
    const stack = [], all = [];
    for (const match of svg.matchAll(/<\/?[a-zA-Z][^>]*>/g)) {
      const token = match[0];
      if (token.startsWith('</')) { stack.pop(); continue; }
      const tag = /^<([^\s/>]+)/.exec(token)[1];
      const attrs = Object.fromEntries([...token.matchAll(/([^\s=]+)="([^"]*)"/g)].map(([, name, value]) => [name, value]));
      const element = new FakeElement(tag, attrs); all.push(element);
      stack.at(-1)?.append(element);
      if (!token.endsWith('/>')) stack.push(element);
    }
    return { documentElement: all[0], querySelector: (selector) => all[0].querySelector(selector) };
  }
}

export function installFakeBrowser({ reducedMotion = false, dark = false } = {}) {
  const original = new Map();
  const put = (name, value) => { original.set(name, Object.getOwnPropertyDescriptor(globalThis, name)); Object.defineProperty(globalThis, name, { configurable: true, writable: true, value }); };
  const window = new TrackedTarget();
  Object.assign(window, { scrollX: 0, scrollY: 0, innerWidth: 1200, innerHeight: 900, devicePixelRatio: 1 });
  const document = new TrackedTarget();
  Object.assign(document, { hidden: false, documentElement: new FakeElement('html'), createElement: (tag) => tag === 'canvas' ? new FakeCanvas() : new FakeElement(tag) });
  const media = new Map();
  const matchMedia = (query) => {
    if (!media.has(query)) {
      const target = new TrackedTarget();
      Object.assign(target, { media: query, matches: query.includes('reduced-motion') ? reducedMotion : dark, addListener(fn) { this.addEventListener('change', fn); }, removeListener(fn) { this.removeEventListener('change', fn); } });
      media.set(query, target);
    }
    return media.get(query);
  };
  const frames = new Map(); let nextFrame = 1;
  const requestAnimationFrame = (fn) => { const id = nextFrame++; frames.set(id, fn); return id; };
  const cancelAnimationFrame = (id) => frames.delete(id);
  const resizeObservers = [], intersectionObservers = [];
  class ResizeObserver { constructor(callback) { this.callback = callback; this.targets = new Set(); resizeObservers.push(this); } observe(target) { this.targets.add(target); } disconnect() { this.targets.clear(); } emit() { this.callback([...this.targets].map((target) => ({ target, contentRect: target.getBoundingClientRect() }))); } }
  class IntersectionObserver { constructor(callback) { this.callback = callback; this.targets = new Set(); intersectionObservers.push(this); } observe(target) { this.targets.add(target); } disconnect() { this.targets.clear(); } emit(isIntersecting = true) { this.callback([...this.targets].map((target) => ({ target, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }))); } }
  Object.assign(window, { matchMedia, requestAnimationFrame, cancelAnimationFrame });
  for (const [name, value] of Object.entries({ window, document, Element: FakeElement, HTMLElement: FakeElement, HTMLCanvasElement: FakeCanvas, DOMMatrix: Matrix, DOMPoint: Point, Path2D: Path, DOMParser: Parser, matchMedia, requestAnimationFrame, cancelAnimationFrame, ResizeObserver, IntersectionObserver, Image: class { constructor() { throw new Error('Pinned spider must never create a favicon Image'); } }, getComputedStyle: () => ({ color: '#1b1e29' }) })) put(name, value);
  return {
    window, document, media, matchMedia, frames, resizeObservers, intersectionObservers,
    canvasContext: FakeContext,
    pointer(x, y) { const event = new Event('pointermove'); Object.assign(event, { clientX: x, clientY: y }); window.dispatchEvent(event); },
    setReducedMotion(value) { const query = matchMedia('(prefers-reduced-motion: reduce)'); query.matches = value; query.dispatchEvent(new Event('change')); },
    flushFrame(time = 0) { const batch = [...frames.values()]; frames.clear(); for (const callback of batch) callback(time); },
    restore() { for (const [name, descriptor] of original) descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]; },
  };
}
