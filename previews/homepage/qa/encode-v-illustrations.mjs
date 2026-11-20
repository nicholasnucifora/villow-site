import sharp from 'sharp';
import {readFile,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const sources=JSON.parse(await readFile(new URL('./v-illustration-sources.json',import.meta.url),'utf8'));
for(const {key,source,asset} of sources){
  await copyFile(source,new URL(`../assets/v-watcher-${key}-v1.png`,import.meta.url));
  const metadata=await sharp(source).metadata();
  if(!metadata.hasAlpha)throw new Error(`${key} must have a transparent background`);
  const result=await sharp(source).webp({quality:88,alphaQuality:100}).toFile(fileURLToPath(new URL(`../assets/${asset}`,import.meta.url)));
  console.log(`${asset}: ${result.width}x${result.height}, ${result.size} bytes; transparency retained`);
}
