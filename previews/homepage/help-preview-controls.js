import { supportScenarios, previewLocation } from './help-preview-scenarios.js';

export function mountSupportStates() {
  const rail = document.querySelector('[data-study-page="help"]');
  if (!rail || window.parent !== window) return;
  const row = rail.querySelector('.study-navigation-row');
  const tools = document.createElement('div'); tools.className = 'help-state-tools';
  tools.innerHTML = '<button type="button" class="help-state-toggle" aria-expanded="false" aria-controls="help-state-drawer">Preview states</button><button type="button" class="help-state-exit" hidden>Exit preview</button>';
  row.insertBefore(tools, row.querySelector('.preview-rail-status'));
  const toggle = tools.querySelector('.help-state-toggle');
  const exit = tools.querySelector('.help-state-exit');
  const drawer = document.createElement('aside');
  drawer.id = 'help-state-drawer'; drawer.className = 'help-state-drawer'; drawer.hidden = true;
  drawer.setAttribute('aria-label', 'Support preview states');
  drawer.innerHTML = `<header><div><h2>Preview states</h2><p>Visual only. No real activity.</p></div><button type="button" class="help-state-close" aria-label="Close preview states">×</button></header>
    <label class="help-state-search"><span class="sr-only">Find a preview state</span><input type="search" placeholder="Find a state…" autocomplete="off"></label>
    <div class="help-state-list"></div><p class="help-state-no-results" hidden>No matching states.</p>
    <footer><div class="help-state-current" role="status"></div><div class="help-state-step"><button type="button" data-state-previous>Previous</button><button type="button" data-state-next>Next</button></div></footer>`;
  document.body.append(drawer);
  const list = drawer.querySelector('.help-state-list');
  const search = drawer.querySelector('input');
  const previous = drawer.querySelector('[data-state-previous]');
  const next = drawer.querySelector('[data-state-next]');
  let active = null; let frame = null; let stage = null;
  let coveredContent = [];
  for (const name of [...new Set(supportScenarios.map(s => s.group))]) {
    const section = document.createElement('section');
    const heading = document.createElement('h3'); heading.textContent = name; section.append(heading);
    for (const state of supportScenarios.filter(s => s.group === name)) {
      const button = document.createElement('button'); button.type = 'button';
      button.dataset.previewState = state.id; button.textContent = state.label;
      button.addEventListener('click', () => {
        select(state.id);
        if (matchMedia('(max-width:700px)').matches) setOpen(false);
      }); section.append(button);
    }
    list.append(section);
  }
  function filtered() {
    const query = search.value.trim().toLocaleLowerCase();
    return supportScenarios.filter(s => `${s.group} ${s.label}`.toLocaleLowerCase().includes(query));
  }
  function update() {
    const visible = filtered();
    for (const button of list.querySelectorAll('button')) {
      button.hidden = !visible.some(s => s.id === button.dataset.previewState);
      if (active?.id === button.dataset.previewState) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
    for (const section of list.children) section.hidden = !section.querySelector('button:not([hidden])');
    drawer.querySelector('.help-state-no-results').hidden = visible.length > 0;
    const index = visible.findIndex(s => s.id === active?.id);
    previous.disabled = index <= 0; next.disabled = !visible.length || index === visible.length - 1;
    drawer.querySelector('.help-state-current').textContent = active ? `${supportScenarios.indexOf(active) + 1} / ${supportScenarios.length} · ${active.label}` : 'Choose a state to preview';
    toggle.classList.toggle('is-previewing', !!active); exit.hidden = !active;
  }
  function setOpen(open) {
    drawer.hidden = !open; toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('help-state-drawer-open', open);
    if (open) { search.focus(); list.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' }); }
    else toggle.focus();
  }
  function select(id, { writeURL = true } = {}) {
    active = supportScenarios.find(s => s.id === id) || supportScenarios[0];
    if (!stage) {
      stage = document.createElement('div'); stage.className = 'help-state-stage';
      stage.innerHTML = '<p class="help-state-loading" role="status">Loading preview…</p>';
      frame = document.createElement('iframe'); frame.className = 'help-state-frame';
      frame.title = 'Support state preview';
      // Forms need submit events to render the real UI; the fixture's CSP blocks
      // form navigation and network requests, and all API calls use fake data.
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
      frame.addEventListener('load', () => { if (stage) stage.querySelector('.help-state-loading').hidden = true; });
      stage.append(frame); document.body.append(stage);
      coveredContent = [...document.body.children].filter(element => ![rail, drawer, stage].includes(element))
        .map(element => ({ element, inert: element.inert }));
      coveredContent.forEach(({ element }) => { element.inert = true; });
      document.body.classList.add('help-state-active');
    }
    stage.querySelector('.help-state-loading').hidden = false;
    frame.src = previewLocation(active.id, location.href).href;
    if (writeURL) {
      const url = new URL(location.href); url.searchParams.set('preview-state', active.id);
      history.replaceState(null, '', url);
    }
    update();
  }
  function leave() {
    active = null; stage?.remove(); stage = null; frame = null;
    coveredContent.forEach(({ element, inert }) => { element.inert = inert; }); coveredContent = [];
    document.body.classList.remove('help-state-active');
    const url = new URL(location.href); url.searchParams.delete('preview-state'); history.replaceState(null, '', url);
    setOpen(false); update();
  }
  toggle.addEventListener('click', () => {
    if (drawer.hidden) { if (!active) select(supportScenarios[0].id); setOpen(true); }
    else setOpen(false);
  });
  exit.addEventListener('click', leave);
  drawer.querySelector('.help-state-close').addEventListener('click', () => setOpen(false));
  search.addEventListener('input', update);
  const step = direction => {
    const visible = filtered(); const index = visible.findIndex(s => s.id === active?.id);
    const state = visible[index < 0 ? 0 : index + direction];
    if (state) { select(state.id); list.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' }); }
  };
  previous.addEventListener('click', () => step(-1)); next.addEventListener('click', () => step(1));
  drawer.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.target.matches('[data-preview-state]') && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); step(event.key === 'ArrowDown' ? 1 : -1); list.querySelector('[aria-current]')?.focus();
    }
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== 'help-preview-select') return;
    if (supportScenarios.some(s => s.id === event.data.state)) select(event.data.state);
  });
  const initial = new URLSearchParams(location.search).get('preview-state');
  if (initial) { select(initial, { writeURL: false }); setOpen(true); }
  update();
}
