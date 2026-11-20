import { readdirSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '../..');
const baseline = resolve(root, 'artifacts/public-support-baseline-dist');
const release = resolve(root, 'artifacts/public-support-release/dist');
const sha = value => createHash('sha256').update(value).digest('hex');
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
// Keep every unaffected page/asset byte-for-byte as built before the patch.
// Retain the new shared stylesheet for the two changed pages alongside the old.
for (const source of files(baseline)) {
  const name = relative(baseline, source);
  if (['support.html', 'site-privacy.html'].includes(name)) continue;
  const destination = resolve(release, name);mkdirSync(dirname(destination), { recursive: true });copyFileSync(source, destination);
}
const report = [];
for (const file of files(baseline).filter(file => file.endsWith('.html'))) {
  const name = relative(baseline, file);
  if (['support.html', 'site-privacy.html', '404.html'].includes(name)) continue;
  const url = 'https://villow.app/' + (name === 'index.html' ? '' : name.replace(/\.html$/, ''));
  const response = await fetch(url);const live = Buffer.from(await response.arrayBuffer());
  const match = response.ok && sha(live) === sha(readFileSync(resolve(release, name)));
  report.push({ page: name, status: response.status, unchangedFromLive: match, sha256: sha(live) });
  if (!match) throw new Error('Unauthorised page drift: ' + name);
}
const support = readFileSync(resolve(release, 'support.html'), 'utf8');
if (!support.includes('data-checkout-return') || support.includes('Soft Nunito') || support.includes('/_design/') || support.includes('preset-rail')) throw new Error('Wrong support release');
writeFileSync(resolve(root, 'artifacts/public-message-release-check.json'), JSON.stringify(report, null, 2));
console.log(`Verified ${report.length} unchanged public pages against live. Only support.html and site-privacy.html replace existing pages. Private redesign absent.`);
