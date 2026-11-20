(() => {
  const header = document.querySelector('.version-n-story .i-header');
  const slot = document.querySelector('.version-n-story .n-header-slot');
  if (!header || !slot) return;
  let previous = window.scrollY;
  let floating = false;
  let ticking = false;
  let revealFrame = 0;
  const update = () => {
    const current = window.scrollY;
    const delta = current - previous;
    if (current <= 1) {
      floating = false;
      cancelAnimationFrame(revealFrame);
      header.classList.remove('n-header-floating', 'n-header-scrolled', 'n-header-hidden');
    } else if (delta < -3 && (floating || slot.getBoundingClientRect().bottom <= 0)) {
      if (!floating) {
        floating = true;
        header.classList.add('n-header-floating', 'n-header-scrolled', 'n-header-hidden');
        header.getBoundingClientRect();
        revealFrame = requestAnimationFrame(() => {
          if (floating) header.classList.remove('n-header-hidden');
        });
      } else {
        header.classList.remove('n-header-hidden');
      }
    } else if (floating && delta > 3 && !header.contains(document.activeElement) && !header.hasAttribute('data-directory-open')) {
      cancelAnimationFrame(revealFrame);
      header.classList.add('n-header-hidden');
    }
    if (Math.abs(delta) > 3) previous = current;
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
  header.addEventListener('focusin', () => header.classList.remove('n-header-hidden'));
})();
