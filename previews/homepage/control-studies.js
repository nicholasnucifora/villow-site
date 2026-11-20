// Manual examples only: nothing changes while someone is reading.
for (const section of document.querySelectorAll('[data-control-tabs]')) {
  const tablist = section.querySelector('[data-control-tablist]');
  const tabs = [...section.querySelectorAll('[data-control-tab]')];
  const panels = [...section.querySelectorAll('[data-control-panel]')];
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
      panels[i].inert = !selected;
    });
    if (focus) tabs[index].focus();
  }
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', section.classList.contains('cs-day') ? 'Explore an example day' : 'Explore ways to use Villow');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    panels[i].tabIndex = 0;
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight:(i+1)%tabs.length, ArrowLeft:(i-1+tabs.length)%tabs.length, Home:0, End:tabs.length-1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  select(0);
  section.classList.add('cs-ready');
  tablist.hidden = false;
}
