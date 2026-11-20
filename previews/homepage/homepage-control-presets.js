// The homepage device illustration is settled: 34 carries it directly, so there
// is no device-art preset in the rail. Add one here when there is a real
// alternative to compare.
export const deviceArtStudies = [];

// Reviewed and rejected, newest first. Their saved pages are in
// _archive/device-art-2026-11-20/ and these routes resolve to the homepage.
export const retiredDeviceArtStudies = [
  ['47', '/previews/home-phone-shorter'],
  ['49', '/previews/home-phone-squarer'],
  ['50', '/previews/home-phone-slimmer'],
  ['51', '/previews/home-phone-true'],
  ['52', '/previews/home-phone-clear'],
  ['48', '/previews/home-phone-smaller'],
  ['44', '/previews/home-device-silhouettes'],
  ['45', '/previews/home-device-outline'],
  ['46', '/previews/home-device-set'],
  ['42', '/previews/home-device-landscapes'],
  ['43', '/previews/home-device-feed'],
  [null, '/previews/home-device-view'],
  [null, '/previews/home-device-outlines'],
  [null, '/previews/home-device-cards'],
];

export const controlStudies = [
  ['34', 'Soft Nunito'],
  ...deviceArtStudies.map(([key, label]) => [key, label]),
];

export function addControlStudyLinks(nav) {
  for (const [key, label] of controlStudies) {
    if (nav.querySelector(`a[aria-label="Version ${key.toUpperCase()}: ${label}"]`)) continue;
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:4411/${key}.html`;
    link.setAttribute('aria-label', `Version ${key.toUpperCase()}: ${label}`);
    const letter = document.createElement('span');
    letter.className = 'study-letter';
    letter.textContent = key.toUpperCase();
    const name = document.createElement('span');
    name.className = 'preview-tab-name';
    name.textContent = ` \u00b7 ${label}`;
    link.append(letter, name);
    nav.append(link);
  }
}
