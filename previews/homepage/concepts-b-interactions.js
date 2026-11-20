import './concepts-citations.js';

const trigger = document.querySelector('[data-correction-open]');
const dialog = document.querySelector('.cb-correction-dialog');
trigger?.addEventListener('click', () => dialog?.showModal());
dialog?.querySelector('[data-correction-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelectorAll('.cb-note-rating').forEach(rating => {
 rating.addEventListener('change', event => {
  const selected = event.target;
  if (!(selected instanceof HTMLInputElement)) return;
  document.querySelectorAll('.cb-note-rating input').forEach(input => {
   input.checked = input.value === selected.value;
  });
 });
});
const addAction = document.querySelector('[data-add-action]');
addAction?.addEventListener('click', event => {
 const button = event.currentTarget;
 const added = button.getAttribute('aria-pressed') !== 'true';
 button.setAttribute('aria-pressed', String(added));
 button.textContent = added ? 'Added to your list' : 'Add to your list';
});

const tablist = document.querySelector('.cb-ai-tabs');
if (tablist) {
 const reader = tablist.parentElement;
 const tabs = [...tablist.querySelectorAll('[role="tab"]')];
 const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
 const surface = reader.closest('.concepts-ai-g') ? reader.querySelector('.cb-ai-panels') : null;
 if (surface && typeof matchMedia === 'function') import('./setup-motion.js');
 let activePanel;

 function sizeSurface() {
  if (surface && activePanel) {
   surface.style.setProperty('--cb-ai-surface-height', `${activePanel.getBoundingClientRect().height}px`);
  }
 }
 const resizeSurface = surface && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sizeSurface) : null;
 if (surface && !resizeSurface) window.addEventListener('resize', sizeSurface);

 function showIdea(index) {
  for (const [i, tab] of tabs.entries()) {
   const selected = i === index;
   tab.setAttribute('aria-selected', String(selected));
   tab.tabIndex = selected ? 0 : -1;
   panels[i].hidden = !selected;
   panels[i].inert = !selected;
  }
  if (surface && activePanel !== panels[index]) {
   resizeSurface?.disconnect();
   activePanel = panels[index];
   sizeSurface();
   resizeSurface?.observe(activePanel);
  }
  reader.dispatchEvent(new Event('ai-idea-change', {bubbles: true}));
 }

 for (const [i, tab] of tabs.entries()) {
  const panel = panels[i];
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.tabIndex = 0;
  tab.addEventListener('click', () => showIdea(i));
  tab.addEventListener('keydown', event => {
   let next;
   if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
   else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
   else if (event.key === 'Home') next = 0;
   else if (event.key === 'End') next = tabs.length - 1;
   else return;
   event.preventDefault();
   showIdea(next);
   tabs[next].focus({preventScroll: true});
  });
 }

 const ideaIndex = hash => panels.findIndex(panel => `#${panel.id}` === hash);
 window.addEventListener('hashchange', () => {
  const index = ideaIndex(location.hash);
  if (index !== -1) showIdea(index);
 });
 reader.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href^="#ai-"]');
  const index = ideaIndex(link?.hash);
  if (index === -1) return;
  showIdea(index);
  panels[index].focus({preventScroll: true});
 });

 tablist.hidden = false;
 showIdea(Math.max(0, ideaIndex(location.hash)));
}
