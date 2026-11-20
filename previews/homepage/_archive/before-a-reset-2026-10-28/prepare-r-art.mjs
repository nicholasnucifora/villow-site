import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
import {copyFile} from 'node:fs/promises';
const source='C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-7dbe6e26-5661-487a-a031-087d7942b0ef.png';
await copyFile(source,new URL('./assets/r-shared-friends.png',import.meta.url));
await sharp(source).webp({lossless:true}).toFile(fileURLToPath(new URL('./assets/r-shared-friends.webp',import.meta.url)));
console.log('Saved revised R friends with original alpha; lossless encoding only.');
