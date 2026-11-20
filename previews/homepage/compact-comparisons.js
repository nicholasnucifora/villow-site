const compact = matchMedia('(max-width:600px)');

for (const comparison of document.querySelectorAll('[data-xc-comparison]')) {
  const rows = [...comparison.querySelectorAll('[data-xl-topic]')];
  const buttons = [...comparison.querySelectorAll('[data-xc-select]')];
  const announcement = comparison.querySelector('[data-xc-announcement]');
  const shared = comparison.dataset.xcMode === 'switch';

  function updateAccess() {
    const focusedControl = !compact.matches && document.activeElement?.closest('[data-xc-toggle],[data-xc-select]');
    for (const row of rows) {
      for (const face of row.querySelectorAll('[data-xc-face]')) {
        const side = face.dataset.xcFace;
        const inactive = compact.matches && side !== row.dataset.xcSelected;
        if (inactive && face.contains(document.activeElement)) {
          const control = shared
            ? buttons.find(button => button.dataset.xcSelect === row.dataset.xcSelected)
            : row.querySelector('[data-xc-toggle]');
          control?.focus({preventScroll:true});
        }
        face.inert = inactive;
        if (compact.matches) {
          face.setAttribute('aria-hidden', String(inactive));
          face.setAttribute('aria-labelledby', `xc-${row.dataset.xlTopic}-${side}-label xl-topic-${row.dataset.xlTopic}`);
        } else {
          face.removeAttribute('aria-hidden');
          face.setAttribute('aria-labelledby', `xl-${side}-column xl-topic-${row.dataset.xlTopic}`);
        }
      }
    }
    if (focusedControl && comparison.contains(focusedControl)) {
      const row = focusedControl.closest('[data-xl-topic]') || rows[0];
      const openRow = rows.find(candidate => candidate.querySelector('[data-rd-panel].is-open'));
      const target = openRow || (comparison.classList.contains('l-topics-ready') ? rows.find(candidate => !candidate.hidden) : row) || row;
      const face = target.querySelector(`[data-xc-face="${target.dataset.xcSelected}"]`);
      (target.querySelector('[data-rd-panel]')?.inert ? target.querySelector('.rd-topic-button') : face)?.focus({preventScroll:true});
    }
  }

  function show(row, side) {
    row.dataset.xcSelected = side;
    const toggle = row.querySelector('[data-xc-toggle]');
    if (toggle) {
      const pattern = side === 'pattern';
      const action = pattern ? 'See Villow’s approach' : 'Compare the common pattern';
      toggle.setAttribute('aria-label', `${row.querySelector('.xl-pair-topic').textContent}: ${action}`);
      toggle.querySelector('[data-xc-toggle-label]').textContent = action;
    }
  }

  for (const row of rows) {
    row.querySelector('[data-xc-toggle]')?.addEventListener('click', () => {
      const side = row.dataset.xcSelected === 'villow' ? 'pattern' : 'villow';
      show(row, side);
      updateAccess();
      announcement.textContent = `${row.querySelector('.xl-pair-topic').textContent}: ${side === 'villow' ? 'Villow’s approach' : 'common pattern on other apps'}.`;
    });
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const side = button.dataset.xcSelect;
      for (const row of rows) show(row, side);
      for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice === button));
      updateAccess();
      const count = {3: 'three', 4: 'four'}[rows.length] || rows.length;
      announcement.textContent = `Showing ${side === 'villow' ? 'Villow’s approach' : 'common patterns on other apps'} for ${rows.length === 1 ? 'this comparison' : `all ${count} comparisons`}.`;
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons.at(-1) : buttons.find(choice => choice !== button);
      next.focus({preventScroll:true});
      next.click();
    });
  }

  compact.addEventListener('change', updateAccess);
  updateAccess();
}
