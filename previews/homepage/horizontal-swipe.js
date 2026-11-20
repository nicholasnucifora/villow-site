// One horizontal gesture at a time. Match the app's 8px direction lock while
// leaving vertical scrolling and pinch zoom to the browser (CSS uses pan-y).
export function horizontalSwipe(surface, {begin, move, end}) {
  let gesture = null;
  let suppressClick = false;
  let clickUntil = 0;

  function finish(cancelled, event) {
    if (!gesture || (event && event.pointerId !== gesture.pointer)) return;
    const current = gesture;
    gesture = null;
    suppressClick = current.moved;
    clickUntil = performance.now() + 500;
    try {
      if (current.capture.hasPointerCapture(current.pointer)) current.capture.releasePointerCapture(current.pointer);
    } catch {}
    end(current.detail, {dx:current.dx, dy:current.dy, horizontal:current.horizontal, cancelled});
  }

  surface.addEventListener('pointerdown', event => {
    if (gesture || !event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    const detail = begin(event);
    if (!detail) return;
    const capture = detail.capture || surface;
    gesture = {detail, capture, pointer:event.pointerId, x:event.clientX, y:event.clientY,
      dx:0, dy:0, horizontal:false, moved:false};
    try { capture.setPointerCapture(event.pointerId); } catch {}
  });
  // A second finger anywhere cancels the gesture, including outside the card.
  surface.ownerDocument.addEventListener('pointerdown', event => {
    if (gesture && event.pointerId !== gesture.pointer && event.pointerType !== 'mouse') finish(true);
  }, true);
  surface.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.pointer) return;
    gesture.dx = event.clientX - gesture.x;
    gesture.dy = event.clientY - gesture.y;
    const x = Math.abs(gesture.dx), y = Math.abs(gesture.dy);
    gesture.moved ||= Math.hypot(x, y) > 8;
    if (!gesture.horizontal) {
      // Once a gesture becomes scrolling, later sideways drift cannot dismiss.
      if (y > 8 && y > x * 1.15) { finish(true); return; }
      if (x <= 8 || x < y * .65) return;
      gesture.horizontal = true;
    }
    if (event.cancelable) event.preventDefault();
    move(gesture.detail, {dx:gesture.dx, dy:gesture.dy});
  });
  surface.addEventListener('pointerup', event => finish(false, event));
  surface.addEventListener('pointercancel', event => finish(true, event));
  surface.addEventListener('lostpointercapture', event => finish(true, event));
  surface.addEventListener('click', event => {
    if (event.detail > 0 && suppressClick && performance.now() < clickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  return {cancel:() => finish(true)};
}

// App useCardSwipe: direct tracking until 72px, then gentle resistance. There
// is no velocity-only commit; a quick tap/flick cannot remove a card by itself.
export function cardSwipeOffset(distance, maximum) {
  const absolute = Math.abs(distance);
  return Math.sign(distance) * Math.min(maximum, absolute <= 72 ? absolute : 72 + (absolute - 72) * .86);
}
