import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {adminDestination} from '../hosting-admin-url.js';

assert.equal(adminDestination('https://my-villow.vercel.app/anything?invite=private#section'), 'https://my-villow.vercel.app/admin');
assert.equal(adminDestination(' https://watch.example.org/ '), 'https://watch.example.org/admin');
for (const url of ['javascript:alert(1)', 'data:text/html,bad', 'http://example.org', '//example.org', 'https://user:password@example.org', '', 'not a url']) {
 assert.throws(() => adminDestination(url), undefined, url);
}
const baseline = JSON.parse(await readFile(new URL('hosting-c-baseline.json', import.meta.url)));
for (const [file, hash] of Object.entries(baseline)) {
 let content = await readFile(new URL(`../${file}`, import.meta.url));
 if (file.endsWith('.html')) content = content.toString().match(/<main[\s\S]*?<\/main>/)[0];
 assert.equal(createHash('sha256').update(content).digest('hex'), hash, `${file}: preset B is preserved`);
}
const html = await readFile(new URL('../setup-hosting-c.html', import.meta.url), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length, new Set(ids).size, 'No duplicate IDs');
for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(hash), `Working anchor #${hash}`);
assert.ok(!/<details[^>]*\sopen(?:\s|=|>)/.test(html), 'Disclosures begin closed');
assert.match(html, /id="wont-open"[\s\S]*?<img[^>]+vercel-paused-dark/);
console.log('Hosting C: safe Admin destinations, all local anchors, collapsed defaults and unchanged B passed.');
