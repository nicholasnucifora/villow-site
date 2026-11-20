import {readFileSync} from 'node:fs';
import {resolve, sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {retiredConceptPresets, selectedConceptPreset, siteRoutes} from '../../previews/homepage/site-routes.js';
import {retiredDeviceArtStudies} from '../../previews/homepage/homepage-control-presets.js';
import {applyPreviewHeader} from '../../previews/homepage/preview-header.mjs';
import {studyNavigation} from '../../previews/homepage/study-navigation.mjs';

export const designFileRoutes = {...siteRoutes,
  ...Object.fromEntries(['38','39','40','41'].map(preset => [`${preset}.html`, '/'])),
  ...Object.fromEntries(retiredConceptPresets.map(preset => [`concepts-${preset}.html`, '/design-concepts']))};
export const designRoot = pathToFileURL(resolve('previews/homepage') + sep);
export const designPages = Object.entries(siteRoutes).map(([file, path]) => ({file, path, slug: path === '/' ? 'index' : path.slice(1)}));
export const designAliases = {'/support':'/get-involved', '/previews/support-compact':'/get-involved', '/about':'/get-involved', '/youtube-could-do-this':'/design-concepts',
  '/previews/home-cross-device':'/', '/previews/home-laptop-to-phone':'/', '/previews/home-device-coverage':'/',
  ...Object.fromEntries(retiredDeviceArtStudies.map(([, path]) => [path, '/'])),
  ...Object.fromEntries([...retiredConceptPresets, selectedConceptPreset].map(preset => [`/previews/concepts-${preset}`, '/design-concepts'])),
  ...Object.fromEntries(['original','wide','still','words','spotlight','letters','garden'].map(name => [`/previews/support-${name}`, '/get-involved']))};
const legacySections = {'/download#costs':'/running-villow#free-limits','/download#inviting-friends':'/running-villow#friends-cant-join','/running-villow#leaving':'/hosting-details#leaving'};
const affiliation = 'not affiliated with, endorsed by, or sponsored by YouTube or Google';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function siteLink(value) {
  const decoded = value.replaceAll('&amp;', '&');
  if (/^(?:#|mailto:|tel:|data:)/.test(decoded)) return value;
  const url = new URL(decoded, 'http://127.0.0.1:4411/');
  if (url.hostname === '127.0.0.1' && url.port === '5173' && url.pathname === '/demo') {
    url.searchParams.set('returnTo', 'http://127.0.0.1:4411/');
    return escape(url.href);
  }
  const local = ['127.0.0.1', 'localhost', 'villow.app'].includes(url.hostname);
  if (!local) return value;
  if (legacySections[url.pathname + url.hash]) return escape(legacySections[url.pathname + url.hash]);
  const file = url.pathname.slice(1);
  const path = designFileRoutes[file] || designAliases[url.pathname];
  return path ? escape(path + url.search + url.hash) : value;
}

export function designMarkup(html) {
  return html.replace(/(<a\b[^>]*\bhref=")([^"]+)(")/g, (_, before, href, after) => before + siteLink(href) + after)
    .replace(/(<(?:script|link|img|image|use|source|video|audio|iframe)\b[^>]*\b(?:src|href|poster)=")([^"#]+)(")/g, (_, before, value, after) => {
      if (/^(?:\/|[a-z][a-z\d+.-]*:)/i.test(value)) return before + value + after;
      return before + '/_design/' + value.replace(/^\.\//, '') + after;
    })
    .replaceAll('not affiliated with YouTube or Google', affiliation);
}

export function designRail(currentPath = '/') {
  const rail = studyNavigation('34').replace('aria-label="Homepage design previews"', 'aria-label="Site design previews"');
  return designMarkup(rail).replace('<span class="preview-rail-status">Local preview</span>', `<span class="preview-rail-status">${currentPath === '/' ? 'Local preview' : 'Local development'}</span>`);
}

export function renderDesignPage(slug) {
  const page = designPages.find(page => page.slug === slug);
  if (!page) return null;
  let html = readFileSync(new URL(page.file, designRoot), 'utf8');
  html = applyPreviewHeader(html, {home: html.includes('data-study-page="home"')});
  html = html.replace('<html ', '<html data-villow-site ');
  html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2A9086"><link rel="manifest" href="/site.webmanifest">');
  html = html.replace('</head>', `<link rel="canonical" href="https://villow.app${page.path}"></head>`);
  return designMarkup(html);
}
