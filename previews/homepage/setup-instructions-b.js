import {initialiseExtensionGuides} from './setup-extension-guide-b.js';
import {createSetupTransition} from './setup-transitions.js';
import './setup-motion.js';
import {previewPageURL} from './preview-pages.js';

const descriptions = {
 web: ['Set up or join a Villow.', 'Use your own installation, or join someone you trust.'],
 extension: ['Set up the extension.', 'Choose your device and browser to start watching on YouTube with your chosen limits.'],
 both: ['Set up or join a Villow.', 'Use your own installation, or join someone you trust.'],
};
const choices = [...document.querySelectorAll('[data-instructions-path]')];
const content = document.querySelector('[data-setup-content]');
const contentInner = document.querySelector('[data-setup-content-inner]');
const connection = document.querySelector('[data-instructions-section="connection"]');
const contentTransition = createSetupTransition(content);
const connectionTransition = createSetupTransition(document.querySelector('[data-connection-slot]'));
let displayedPath;
const pathFromURL = () => {
 const requested = new URLSearchParams(location.search).get('path');
 return Object.hasOwn(descriptions, requested) ? requested : 'both';
};

initialiseExtensionGuides();
function renderPath(path) {
 document.querySelector('[data-instructions-title]').textContent = descriptions[path][0];
 document.querySelector('[data-instructions-lead]').textContent = descriptions[path][1];
 document.querySelectorAll('[data-instructions-section]').forEach(section => {
  const part = section.dataset.instructionsSection;
  section.hidden = path === 'web' ? part !== 'web' : path === 'extension' ? part !== 'extension' : part === 'extension';
 });
 choices.forEach(choice => {
  if (choice.dataset.instructionsPath === path) choice.setAttribute('aria-current','page');
  else choice.removeAttribute('aria-current');
 });
 document.querySelectorAll('[data-hosting-link]').forEach(link => { link.href = `${previewPageURL('setup-hosting')}?path=${path}`; });
 document.querySelectorAll('.setup-instructions-back').forEach(link => {
  link.href = `${previewPageURL('setup')}?choice=${path === 'web' ? 'no' : 'yes'}`;
 });
 displayedPath = path;
}
function showPath(path, animate = false) {
 const keepsApp = displayedPath && displayedPath !== 'extension' && path !== 'extension';
 const transition = keepsApp ? connectionTransition : contentTransition;
 (keepsApp ? contentTransition : connectionTransition).cancel();
 transition.run(() => renderPath(path), {
  animate:animate && displayedPath !== path,
  outgoing:keepsApp ? (connection?.hidden ? null : connection) : contentInner,
  incoming:() => keepsApp ? (connection?.hidden ? null : connection) : contentInner,
 });
}
const finishTransitions = () => {contentTransition.finish(); connectionTransition.finish();};

choices.forEach(choice => choice.addEventListener('click', event => {
 if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
 event.preventDefault();
 const path = choice.dataset.instructionsPath;
 const url = new URL(location.href);
 url.searchParams.set('path', path);
 url.hash = '';
 if (pathFromURL() !== path) history.pushState(null, '', url);
 showPath(path, true);
}));
window.addEventListener('popstate', () => showPath(pathFromURL(), true));
window.addEventListener('resize', finishTransitions);
window.addEventListener('setup-motion-change', finishTransitions);
showPath(pathFromURL());

// An older in-page link may target another setup path. Switch the whole path
// rather than exposing an extra, conflicting extension guide underneath it.
document.addEventListener('click', event => {
 const link = event.target.closest('a[href^="#"]');
 if (!link) return;
 const target = document.getElementById(link.getAttribute('href').slice(1));
 const hiddenSection = target?.closest('[data-instructions-section][hidden]');
 if (!hiddenSection) return;
 const part = hiddenSection.dataset.instructionsSection;
 const path = part === 'connection' ? 'both' : part;
 const url = new URL(location.href);
 url.searchParams.set('path', path);
 url.hash = target.id;
 event.preventDefault();
 history.pushState(null, '', url);
 showPath(path);
 target.scrollIntoView({block:'start'});
});
