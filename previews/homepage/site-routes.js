// The saved studies and the Astro site share one set of page destinations.
import {deviceArtStudies} from './homepage-control-presets.js';

export const selectedConceptPreset = 'g';
export const conceptStudies = [[selectedConceptPreset, 'Content-fit box']];
export const retiredConceptPresets = ['a', 'b', 'c', 'd', 'e', 'f', 'h'];

export const siteRoutes = {
  '34.html': '/',
  ...Object.fromEntries(deviceArtStudies.map(([key, , path]) => [`${key}.html`, path])),
  'setup-b.html': '/download',
  'setup-instructions-b.html': '/setup-instructions',
  'setup-hosting-b.html': '/previews/hosting-b',
  'setup-hosting-c.html': '/previews/hosting-c',
  'setup-hosting-d.html': '/running-villow',
  [`concepts-${selectedConceptPreset}.html`]: '/design-concepts',
  'help-c.html': '/get-involved',
  'help-d.html': '/previews/support-quotes',
  'help-e.html': '/previews/support-paper',
  'help-f.html': '/previews/support-bubbles',
  'contact-a.html': '/contact',
  'partners-a.html': '/partners',
};

export function mainSiteURL(file) {
  if (typeof document === 'undefined' || !document.documentElement.hasAttribute('data-villow-site')) return null;
  return new URL(siteRoutes[file] || file, location.origin).href;
}
