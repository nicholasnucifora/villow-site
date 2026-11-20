import {initialiseExtensionStory} from './setup-interactive-story-b.js';
import {initialiseExtensionStores} from './extension-store-links.js';

export function initialiseExtensionGuides(root = document) {
 initialiseExtensionStores(root);
 // The connected and standalone routes share the same device choice.
 // Switching setup paths should not make someone repeat those selections.
 let device = 'computer';
 const updates = [];
 const updateAll = () => updates.forEach(update => update());
 root.querySelectorAll('[data-extension-guide]').forEach(guide => {
  const controls = guide.querySelector('.sg-controls');
  const devices = [...guide.querySelectorAll('[data-device]')];
  const panels = [...guide.querySelectorAll('[data-install-panel]')];
  const story = guide.closest('.sg-connected-layout')?.querySelector('.sg-story');
  const updateStory = story ? initialiseExtensionStory(story) : null;
  const update = () => {
   devices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.device === device)));
   panels.forEach(panel => { panel.hidden = panel.dataset.installPanel !== device; });
   if (story) {
    updateStory(device);
   }
  };
  updates.push(update);
  devices.forEach(button => button.addEventListener('click', () => { device = button.dataset.device; updateAll(); }));
  controls.hidden = false;
  update();
 });
}
