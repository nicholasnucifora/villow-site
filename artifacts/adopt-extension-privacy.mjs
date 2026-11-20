// Local-only import of the reviewed extension-agent handoff. Never publishes.
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const sourcePath = resolve('src/content/policies/extension-privacy.html');
const handoffPath = resolve('../villow_extension/artifacts/extension-privacy-proposed-2026-11-14.html');
const original = await readFile(sourcePath, 'utf8');
const handoff = await readFile(handoffPath, 'utf8');
if ((handoff.match(/<h1>/g) || []).length !== 1 || /<(?:script|iframe|main)\b/i.test(handoff)
    || !handoff.includes('support@villow.app') || !handoff.includes('2026-11-14')) {
  throw new Error('Unexpected extension policy artifact; review before importing.');
}
const body = handoff.replace(/^<!--[\s\S]*?-->\s*/, '').trim()
  .replaceAll('href="https://villow.app/', 'href="/')
  .replace('</h1>', '</h1>\n<p><strong>Local review revision — unpublished.</strong> This revision describes the extension changes being checked locally. It has not replaced the published policy or store disclosures.</p>');
const result = original.replace(/<main>[\s\S]*?<\/main>/, `<main>\n<p><a href="/privacy">← All Villow privacy policies</a></p>\n${body}\n</main>`);
if (result === original) throw new Error('No policy change to import.');
await writeFile(sourcePath, result);
const hash = createHash('sha256').update(result).digest('hex');
const checkerPath = resolve('scripts/check-build.mjs');
const checker = await readFile(checkerPath, 'utf8');
await writeFile(checkerPath, checker.replace(/const PRIVACY_SHA256 = "[a-f0-9]{64}";/, `const PRIVACY_SHA256 = "${hash}";`));
console.log(JSON.stringify({sourcePath, handoffSha256:createHash('sha256').update(handoff).digest('hex'), websiteSha256:hash}));
