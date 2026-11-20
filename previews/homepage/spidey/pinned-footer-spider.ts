import { createAnimations } from "./core/animation";
import { config } from "./core/config";
import { neutralFace } from "./core/face";
import { createSpider } from "./core/spider";
import { blankLook } from "./core/wardrobe";
import type { AnchorFrame } from "./core/anchor";
import type { Rope } from "./core/rope";

export interface PinnedFooterSpider {
  setActive(active: boolean): void;
  dispose(): void;
}

const mounts = new WeakMap<HTMLElement, PinnedFooterSpider>();
const ART_WIDTH = 596;
const ART_HEIGHT = 401;
/** One 44px drawing within the footer's 48px slot, with room for its outline. */
const DRAWING_FRACTION = 44 / 48;

/** Browser-only, base spider. The containing anchor retains all link behavior. */
export function mountPinnedFooterSpider(slot: HTMLElement): PinnedFooterSpider {
  const existing = mounts.get(slot);
  if (existing) return existing;

  const fallback = slot.querySelector<HTMLImageElement>(".footer-spidey-fallback");
  const fallbackVisibility = fallback?.style.visibility ?? "";
  const events = new AbortController();
  const canvas = document.createElement("canvas");
  canvas.className = "footer-spidey-canvas";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", visibility: "hidden",
  });

  let disposed = false;
  let requestedActive = true;
  let inView = true;
  let raf: number | null = null;
  let lastTime: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let intersectionObserver: IntersectionObserver | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let runtime: ReturnType<typeof createRuntime> | null = null;
  let frameCount = 0;
  slot.setAttribute("data-ready", "false");
  slot.setAttribute("data-spidey-status", "starting");
  slot.setAttribute("data-spidey-error", "");

  const active = () => !disposed && requestedActive && inView && !document.hidden;

  function stopFrame() {
    if (raf !== null) window.cancelAnimationFrame(raf);
    raf = null;
    lastTime = null;
    if (!disposed) slot.setAttribute("data-spidey-status", "paused");
  }

  function disposeRuntime() {
    runtime?.spider.dispose();
    runtime?.animations.dispose();
    runtime = null;
  }

  function createRuntime() {
    // This is a stationary position carrier for the existing renderer/face
    // signatures, NOT a rope: there is no solver, integration, string or velocity.
    const point = { x: 0, y: 0, px: 0, py: 0 };
    const position = { points: [point], tail: point, length: 0, at: () => point } as unknown as Rope;
    const animations = createAnimations(position, () => false, { listen: false, pinned: true });
    try {
      // The user's quieter footer profile uses the base face and resting state.
      // No mood instance or animation scheduler advances: only pupils respond.
      const spider = createSpider(slot, position, animations.state, neutralFace(), blankLook(), {
        cursor: true, fixedLegs: true, pinned: true, ambientMotion: false,
        showFavicon: false, isActive: active,
      });
      return { point, animations, spider };
    } catch (error) {
      animations.dispose();
      throw error;
    }
  }

  function paint(dt: number): boolean {
    if (!context || !runtime || !active()) return false;
    const rect = slot.getBoundingClientRect();
    if (!(rect.width > 0 && rect.height > 0)) return false;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const deviceWidth = Math.max(1, Math.round(rect.width * dpr));
    const deviceHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== deviceWidth) canvas.width = deviceWidth;
    if (canvas.height !== deviceHeight) canvas.height = deviceHeight;
    const scaleX = deviceWidth / rect.width;
    const scaleY = deviceHeight / rect.height;
    const originX = rect.left + window.scrollX;
    const originY = rect.top + window.scrollY;
    const width = Math.min(rect.width, rect.height) * DRAWING_FRACTION;
    const height = width * ART_HEIGHT / ART_WIDTH;
    const point = runtime.point;
    // Source attachment coordinates are retained. Both Verlet positions are
    // identical even when the slot scrolls or resizes: artificial velocity is 0.
    point.x = point.px = originX + rect.width / 2 + (config.look.attachX - 0.5) * width;
    point.y = point.py = originY + rect.height / 2 + (config.look.attachY - 0.5) * height;
    const frame: AnchorFrame = { x: point.x, y: point.y, unit: width / config.look.width };
    // Real dt preserves the source's gradual cursor attention. The neutral
    // face, resting animation state and body remain unchanged in either preference.
    runtime.spider.update(frame, dt, 0, 1, scaleX);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, deviceWidth, deviceHeight);
    context.setTransform(scaleX, 0, 0, scaleY, -originX * scaleX, -originY * scaleY);
    runtime.spider.draw(context);
    // Read-only development evidence from the actual update/draw path. These
    // attributes observe pupil rendering; they do not trigger an animation.
    slot.setAttribute("data-ready", "true");
    slot.setAttribute("data-spidey-status", "live");
    slot.setAttribute("data-spidey-frame", String(++frameCount));
    slot.setAttribute("data-spidey-blink", "0.0000");
    slot.setAttribute("data-spidey-blink-count", "0");
    // An intact SVG stays visible if initialization or this first draw throws.
    canvas.style.visibility = "visible";
    if (fallback) {
      fallback.style.visibility = "hidden";
      fallback.hidden = true;
    }
    return true;
  }

  function tick(time: number) {
    raf = null;
    if (!active()) { lastTime = null; return; }
    // Paused wall-clock time never enters the pupil interpolation.
    const dt = lastTime === null ? 0 : Math.max(0, Math.min((time - lastTime) / 1000, 1 / 30));
    lastTime = time;
    try {
      if (paint(dt) && active()) raf = window.requestAnimationFrame(tick);
      else lastTime = null;
    } catch (error) {
      fail(error, "Frame failed");
    }
  }

  function reconcile() {
    if (!active()) { stopFrame(); return; }
    if (raf !== null) return;
    try {
      if (!runtime) runtime = createRuntime();
      if (!paint(0)) { lastTime = null; return; }
      raf = window.requestAnimationFrame(tick);
    } catch (error) {
      fail(error, "Initialization failed");
    }
  }

  function fail(error: unknown, stage: string) {
    console.error(`[Villow footer Spidey] ${stage}`, error);
    handle.dispose();
    slot.setAttribute("data-spidey-status", "error");
    slot.setAttribute("data-spidey-error", error instanceof Error ? error.message : String(error));
  }

  const handle: PinnedFooterSpider = {
    setActive(value) {
      if (disposed) return;
      requestedActive = Boolean(value);
      reconcile();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stopFrame();
      events.abort();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      disposeRuntime();
      canvas.remove();
      if (fallback) {
        fallback.hidden = false;
        fallback.style.visibility = fallbackVisibility;
      }
      if (mounts.get(slot) === handle) mounts.delete(slot);
      slot.setAttribute("data-ready", "false");
      slot.setAttribute("data-spidey-status", "disposed");
    },
  };
  mounts.set(slot, handle);

  try {
    context = canvas.getContext("2d");
    if (!context) { fail(new Error("Canvas 2D context is unavailable"), "Initialization failed"); return handle; }
    slot.append(canvas);
    document.addEventListener("visibilitychange", reconcile, { signal: events.signal });
    window.addEventListener("resize", reconcile, { passive: true, signal: events.signal });
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(reconcile);
      resizeObserver.observe(slot);
    }
    if (typeof IntersectionObserver !== "undefined") {
      const rect = slot.getBoundingClientRect();
      inView = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        reconcile();
      });
      intersectionObserver.observe(slot);
    }
    reconcile();
  } catch (error) {
    fail(error, "Initialization failed");
  }
  return handle;
}
