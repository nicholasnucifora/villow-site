import sharp from 'sharp';
import {mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const out=new URL('../assets/30-landscape/',import.meta.url);
await mkdir(out,{recursive:true});
for(const [name,source] of [
 ['foreground','C:/Users/Nebula PC/.codex/generated_images/01a1bbf5-0840-7600-a1af-48b492fe1751/exec-a118f686-7ee2-415b-a9f0-5fd3af9cbb52.png'],
 ['trees','C:/Users/Nebula PC/.codex/generated_images/01a1bbf5-0840-7600-a1af-48b492fe1751/exec-b0c7dd6c-31de-4f08-943f-9e3ad91afd15.png']
]){
 await copyFile(source,new URL(`${name}-source.png`,out));
 await sharp(source).webp({quality:98,alphaQuality:100}).toFile(fileURLToPath(new URL(`${name}.webp`,out)));
}
console.log('Copied generated sources and encoded alpha-preserving WebPs for 30 only.');
