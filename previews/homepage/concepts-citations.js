// Source links work without JavaScript. Enhanced citations open a small,
// non-modal summary on hover/focus/tap, with the full paper one click away.
let activeCitation;
for (const citation of document.querySelectorAll('.cb-citation')) {
 const trigger = citation.querySelector('[data-citation-trigger]');
 const popup = citation.querySelector('.cb-citation-popover');
 const closeButton = popup.querySelector('.cb-citation-close');
 let closeTimer, pinned = false, restoringFocus = false;
 trigger.setAttribute('role', 'button');
 trigger.setAttribute('aria-haspopup', 'dialog');
 trigger.setAttribute('aria-expanded', 'false');
 trigger.setAttribute('aria-controls', popup.id);

 const position = () => {
  const anchor = trigger.getBoundingClientRect();
  const box = popup.getBoundingClientRect();
  const gutter = 12, gap = 8;
  const left = Math.max(gutter, Math.min(anchor.left, innerWidth - box.width - gutter));
  const below = anchor.bottom + gap;
  const above = anchor.top - box.height - gap;
  const top = below + box.height <= innerHeight - gutter ? below : above >= gutter ? above : Math.max(gutter, innerHeight - box.height - gutter);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
 };
 const close = (restoreFocus = false) => {
  clearTimeout(closeTimer);
  if (popup.hidden) return;
  if (popup.hidePopover && popup.matches(':popover-open')) popup.hidePopover();
  popup.hidden = true;
  pinned = false;
  trigger.setAttribute('aria-expanded', 'false');
  if (activeCitation === controller) activeCitation = null;
  if (restoreFocus) {
   restoringFocus = true;
   trigger.focus({preventScroll:true});
   restoringFocus = false;
  }
 };
 const show = () => {
  clearTimeout(closeTimer);
  if (activeCitation !== controller) activeCitation?.close();
  activeCitation = controller;
  if (popup.hidden) {
   popup.hidden = false;
   popup.showPopover?.();
   trigger.setAttribute('aria-expanded', 'true');
  }
  position();
 };
 const scheduleClose = () => {
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
   if (!pinned && !citation.contains(document.activeElement) && !trigger.matches(':hover') && !popup.matches(':hover')) close();
  }, 180);
 };
 const togglePinned = () => {
  if (pinned) close();
  else {show(); pinned = true;}
 };
 const controller = {close, position, citation};
 trigger.addEventListener('pointerenter', event => {if (event.pointerType !== 'touch') show();});
 trigger.addEventListener('pointerleave', scheduleClose);
 popup.addEventListener('pointerenter', () => clearTimeout(closeTimer));
 popup.addEventListener('pointerleave', scheduleClose);
 trigger.addEventListener('focus', () => {if (!restoringFocus) show();});
 citation.addEventListener('focusout', event => {
  if (!citation.contains(event.relatedTarget)) {pinned = false; scheduleClose();}
 });
 trigger.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  togglePinned();
 });
 trigger.addEventListener('keydown', event => {
  if (event.key === ' ') {event.preventDefault(); togglePinned();}
 });
 closeButton.addEventListener('click', () => close(true));
}
document.addEventListener('keydown', event => {
 if (event.key === 'Escape' && activeCitation) {
  event.preventDefault();
  activeCitation.close(true);
 }
});
document.addEventListener('pointerdown', event => {
 if (activeCitation && !activeCitation.citation.contains(event.target)) activeCitation.close();
});
window.addEventListener('resize', () => activeCitation?.position());
window.addEventListener('scroll', () => activeCitation?.position(), {passive:true,capture:true});
