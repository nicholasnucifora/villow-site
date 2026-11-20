import {readFile, mkdir, copyFile, cp} from 'node:fs/promises';

// The app owns this isolated teaching UI, grounded in the extension's renderer.
// Copy it verbatim rather than maintaining another implementation on the site.
const source = new URL('../../../disconnect/public/extension-story-demo/', import.meta.url);
const target = new URL('./assets/extension-story-demo/', import.meta.url);
const script = await readFile(new URL('extension-story-demo.js', source), 'utf8');
if (!script.includes('mountExtensionStoryDemo')) throw new Error('The shared demo has not been built yet.');
// Keep canonical style modules, bundled fonts and their licences beside the
// controller. This public directory is the app's self-contained demo export.
await cp(source, target, {recursive: true});
// Same fixture images/paths as the app's shared feed. The Home scene bundles
// its own copies, so no remote requests are made from its sandbox.
const images = new URL('../../../disconnect/public/images/extension-story/', import.meta.url);
const imageTarget = new URL('./images/extension-story/', import.meta.url);
await mkdir(imageTarget, {recursive: true});
for (const file of ['calm-hills.webp', 'demo-sea.webp', 'demo-cup.webp', 'demo-river.webp']) {
 await copyFile(new URL(file, images), new URL(file, imageTarget));
}
console.log('Synced the app’s interactive extension story demo.');
