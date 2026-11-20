// A preview-only opt-in, matching the homepage rail. Product controls stay quiet.
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const key = 'villow-setup-preview-motion';
let enabled = false;
try {enabled = sessionStorage.getItem(key) === 'true';} catch {}
document.body.toggleAttribute('data-setup-preview-motion', enabled);
const status = document.querySelector('.preview-rail-status');
if (status) {
 const button = document.createElement('button');
 button.type = 'button';
 button.className = 'setup-motion-preview';
 const update = () => {
  button.hidden = !preference.matches;
  button.textContent = enabled ? 'Motion on' : 'Preview motion';
  button.setAttribute('aria-pressed', String(enabled));
 };
 button.addEventListener('click', () => {
  enabled = !enabled;
  document.body.toggleAttribute('data-setup-preview-motion', enabled);
  try {sessionStorage.setItem(key, String(enabled));} catch {}
  update();
  window.dispatchEvent(new Event('setup-motion-change'));
 });
 preference.addEventListener('change', update);
 status.replaceWith(button);
 update();
}
