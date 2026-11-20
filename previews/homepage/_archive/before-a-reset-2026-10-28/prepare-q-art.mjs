import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {copyFile} from 'node:fs/promises';
const source='C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-dca8a188-df69-472e-b200-8b6a4672cd11.png';
await copyFile(source,new URL('./assets/q-shared-friends.png',import.meta.url));
await sharp(source).webp({lossless:true}).toFile(fileURLToPath(new URL('./assets/q-shared-friends.webp',import.meta.url)));
console.log('Saved Q illustration PNG source and lossless WebP; no resize or pixel edits.');

