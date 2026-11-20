// Start with the primary input, then follow actual pointer events so a tablet
// with a mouse or a touch-screen laptop can use both actions and swipes.
export function setupThumbnailFeed(demo) {
  const stack = demo.querySelector('[data-ifs-stack]');
  const coarse = matchMedia('(hover: none) and (pointer: coarse)');
  const syncInput = () => { demo.dataset.wfInput = coarse.matches ? 'touch' : 'pointer'; };
  syncInput();
  coarse.addEventListener('change', syncInput);
  demo.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse') demo.dataset.wfInput = 'pointer';
  });

  // A native click can follow a drag, even one that returned to its origin.
  let press = null;
  let moved = false;
  demo.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    demo.dataset.wfInput = event.pointerType === 'mouse' ? 'pointer' : 'touch';
    moved = false;
    press = {id: event.pointerId, x: event.clientX, y: event.clientY};
  });
  function track(event) {
    if (press?.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) moved = true;
  }
  demo.addEventListener('pointermove', track);
  demo.addEventListener('pointerup', event => {
    track(event);
    if (press?.id === event.pointerId) press = null;
  });
  demo.addEventListener('pointercancel', () => { press = null; moved = true; });

  function tappedCard(event) {
    const card = event.target.closest('.ifs-front');
    if (!card || event.target.closest('[data-ifs-action]') ||
      stack.getAttribute('aria-busy') === 'true') return null;
    return card;
  }

  // As in the app's swipe lesson, handle a stationary finger on release.
  // Some browsers omit the synthetic click after a drag. Cancelling touchend
  // here also prevents browsers that do send it from drawing a second ripple.
  stack.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) moved = true;
  }, {passive: true});
  stack.addEventListener('touchend', event => {
    if (moved || !event.cancelable || event.touches.length || !event.changedTouches.length) return;
    const card = tappedCard(event);
    if (!card) return;
    event.preventDefault();
    showRipple(card, event.changedTouches[0]);
  }, {passive: false});

  stack.addEventListener('click', event => {
    if (event.detail > 0 && moved) return;
    const card = tappedCard(event);
    if (card) showRipple(card, event.detail > 0 ? event : null);
  });
}

function showRipple(card, point) {
  const thumbnail = card.querySelector('.ifs-card-image');
  const width = thumbnail.clientWidth;
  const height = thumbnail.clientHeight;
  let x = width / 2;
  let y = height / 2;
  if (point) {
    // The demo's front card is tilted. Undo its rotation around the image
    // centre to put the ripple exactly under the pointer, even at the corners.
    const rect = thumbnail.getBoundingClientRect();
    const dx = point.clientX - (rect.left + rect.width / 2);
    const dy = point.clientY - (rect.top + rect.height / 2);
    const matrix = new DOMMatrixReadOnly(getComputedStyle(card).transform);
    x = Math.max(0, Math.min(width, x + matrix.a * dx + matrix.b * dy));
    y = Math.max(0, Math.min(height, y + matrix.c * dx + matrix.d * dy));
  }
  const diameter = Math.max(48, 2 * Math.hypot(Math.max(x, width - x), Math.max(y, height - y)));
  const ripple = document.createElement('span');
  ripple.className = 'wf-tap-ripple';
  ripple.setAttribute('aria-hidden', 'true');
  Object.assign(ripple.style, {left: `${x}px`, top: `${y}px`, width: `${diameter}px`, height: `${diameter}px`});
  ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
  ripple.addEventListener('animationcancel', () => ripple.remove(), {once: true});
  thumbnail.append(ripple);
}
