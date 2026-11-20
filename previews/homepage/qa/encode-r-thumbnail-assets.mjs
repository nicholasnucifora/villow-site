import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const items = [
 ['C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-af5222db-f06f-45a5-a667-aa03ef8a6d03.png', 'r-video-dog-v1.webp'],
 ['C:/Users/Nebula PC/.codex/generated_images/01a18ae9-baf0-7d82-a388-104dce4005c6/exec-e3212eaa-0ae8-4253-84db-1c898c5ed011.png', 'r-video-mischief-v1.webp'],
];
for (const [source,name] of items) {
 const destination = new URL(`../assets/${name}`, import.meta.url);
 const result = await sharp(source).webp({quality:88}).toFile(fileURLToPath(destination));
 console.log(name, JSON.stringify(result));
}
