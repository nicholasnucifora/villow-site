import {readFile,copyFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// Refresh after the app runs `npm run screenshots:build`.
// This is a self-contained, fictional, network-isolated scene from the real app.
const source = process.argv[2] ? pathToFileURL(resolve(process.argv[2])) : new URL('../../../disconnect/artifacts/screenshot-studio.html', import.meta.url);
const target = new URL('./assets/villow-home-scene.html', import.meta.url);
const html = await readFile(source, 'utf8');
if (!html.includes('screenshot-extension-story') || !html.includes("connect-src 'none'") || !html.includes('villow:extension-story:selection')) {
 throw new Error('Rebuild the current isolated app screenshot scene before syncing.');
}
await copyFile(source,target);
console.log(`Synced isolated Villow Home scene (${(await stat(target)).size} bytes).`);
