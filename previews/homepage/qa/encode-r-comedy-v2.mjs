import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const source = 'C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-4a8ff9fd-4a05-4484-8e45-1decb76b5252.png';
const result = await sharp(source).webp({quality:88}).toFile(fileURLToPath(new URL('../assets/r-video-comedy-v2.webp',import.meta.url)));
console.log(JSON.stringify(result));
