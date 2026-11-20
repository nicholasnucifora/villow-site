// Match the homepage's explicit motion opt-in in the private design rail.
// Ordinary motion preferences animate immediately; no product playback controls.
export function mountSupportPreviewMotion() {
  const status = document.querySelector('.preview-rail-status');
  if (!status) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'villow-support-preview-motion';
  try { if (sessionStorage.getItem(key) === 'true') document.body.setAttribute('data-r-preview-motion', ''); } catch {}
  const button = document.createElement('button');
  button.type = 'button';button.className = 'r-motion-preview';
  const update = () => {
    const enabled = document.body.hasAttribute('data-r-preview-motion');
    button.hidden = !preference.matches;
    button.textContent = enabled ? 'Motion on' : 'Preview motion';
    button.setAttribute('aria-pressed', String(enabled));
  };
  button.addEventListener('click', () => {
    document.body.toggleAttribute('data-r-preview-motion');
    try { sessionStorage.setItem(key, String(document.body.hasAttribute('data-r-preview-motion'))); } catch {}
    update();
  });
  preference.addEventListener('change', update);
  const tools = document.querySelector('.help-state-tools');
  if (tools) { tools.append(button);status.remove(); }
  else status.replaceWith(button);
  update();
}
