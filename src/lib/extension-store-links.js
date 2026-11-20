export const extensionStores = [
  { key: 'chrome', name: 'Chrome', url: 'https://chromewebstore.google.com/detail/villow/cfgmdkobjfkacdamdfmbnifadbancelc', file: 'chrome-web-store.png', alt: 'Available in the Chrome Web Store', width: 206 },
  { key: 'firefox', name: 'Firefox', url: 'https://addons.mozilla.org/en-US/firefox/addon/villow/', file: 'firefox-add-ons.png', alt: 'Get the add-on — Firefox Add-ons', width: 172 },
  { key: 'edge', name: 'Edge', url: 'https://microsoftedge.microsoft.com/addons/detail/villow/knbdnoleancmiifdopoplpkmfgkfpmmm', file: 'edge-add-ons.png', alt: 'Get it from Microsoft Edge', width: 226 },
];

// Installation advice only: never default an unknown browser to Chrome.
export function detectExtensionStore(nav = {}, desktopOnly = false) {
  const ua = nav.userAgent || '';
  const ios = /iPhone|iPad|iPod/i.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  if (ios || (desktopOnly && android)) return null;
  if (/Firefox\//i.test(ua)) return 'firefox';
  if (android) return null;
  if (/Edg\//i.test(ua)) return 'edge';
  if (/Chrome\/|Chromium\//i.test(ua)) return 'chrome';
  return null;
}

export function extensionStoreMarkup(assetBase = '/store-badges/', desktopOnly = false) {
  return `<div class="extension-store-options" data-extension-stores data-badge-base="${assetBase}"${desktopOnly ? ' data-desktop-only' : ''}>
    <a class="extension-store-badge" data-store-badge hidden target="_blank" rel="noopener noreferrer"><img alt=""></a>
    <div class="extension-store-alternatives"><span data-store-intro>Available for</span><ul aria-label="Extension browser listings">${extensionStores.map(store => `<li data-store-alternative="${store.key}"><a href="${store.url}" target="_blank" rel="noopener noreferrer" aria-label="Villow for ${store.name}">${store.name}</a></li>`).join('')}</ul></div>
  </div>`;
}

export function initialiseExtensionStores(root = document, nav = navigator) {
  for (const group of root.querySelectorAll('[data-extension-stores]')) {
    const selected = extensionStores.find(store => store.key === detectExtensionStore(nav, group.hasAttribute('data-desktop-only')));
    const badge = group.querySelector('[data-store-badge]');
    badge.hidden = !selected;
    if (selected) {
      badge.href = selected.url;
      badge.setAttribute('aria-label', `Get Villow for ${selected.name}`);
      const image = badge.querySelector('img');
      image.src = group.dataset.badgeBase + selected.file;
      image.alt = selected.alt;
      image.width = selected.width;
    } else {
      badge.removeAttribute('href');
      badge.querySelector('img').removeAttribute('src');
    }
    group.querySelector('[data-store-intro]').textContent = selected ? 'Also available for' : 'Available for';
    for (const item of group.querySelectorAll('[data-store-alternative]')) item.hidden = item.dataset.storeAlternative === selected?.key;
  }
}
