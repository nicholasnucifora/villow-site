// The fresh A baseline is the accepted Cloud cinema/Sage homepage.
// Legacy study queries and artwork hashes never select an older design.
const fixedView = 'cinema-cloud-cat';
const fixedArt = 'i15';
const hero = document.querySelector('[data-ip-view]');

for (const element of document.querySelectorAll('[data-i-stack-hero], [data-i-stack-library]')) element.hidden = true;
for (const element of document.querySelectorAll('[data-i-feed-save]')) element.hidden = false;
if (hero) {
  hero.hidden = false;
  hero.dataset.ipView = fixedView;
  hero.dataset.icActive = fixedView;
  for (const panel of hero.querySelectorAll('[data-ip-view-panel]')) panel.hidden = panel.dataset.ipViewPanel !== fixedView;
}
document.body.dataset.iDefaultView = fixedView;
document.body.dataset.iView = fixedView;
for (const artwork of document.querySelectorAll('[data-i-artwork]')) {
  artwork.dataset.activeArt = fixedArt;
  for (const picture of artwork.querySelectorAll('[data-i-art-picture]')) picture.hidden = picture.dataset.iArtPicture !== fixedArt;
}

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelector('.i-header-link')?.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = document.querySelector('#your-choices');
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
});
document.querySelector('.skip-link')?.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const main = document.querySelector('#main');
  if (!main) return;
  event.preventDefault();
  main.tabIndex = -1;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ behavior: 'instant', block: 'start' });
});
