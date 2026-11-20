import sharp from 'sharp';
import {readFile,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const sources=JSON.parse(await readFile(new URL('./w-illustration-sources.json',import.meta.url),'utf8'));
const selected=process.argv.find(arg=>arg.startsWith('--key='))?.slice(6);
for(const {key,source,asset} of sources){
  if(selected&&key!==selected)continue;
  await copyFile(source,new URL(`../assets/${asset.replace(/\.webp$/,'.png')}`,import.meta.url));
  const metadata=await sharp(source).metadata();
  if(!metadata.hasAlpha)throw new Error(`${key} requires transparency`);
  const pipeline=sharp(source);
  if(key==='hero-feet')pipeline.resize(1774,887,{fit:'fill'});
  else pipeline.resize(1536,1024,{fit:'contain',background:'#00000000'});
  const result=await pipeline.webp({quality:90,alphaQuality:100}).toFile(fileURLToPath(new URL(`../assets/${asset}`,import.meta.url)));
  console.log(`${asset}: ${result.width}x${result.height}, ${result.size} bytes, alpha preserved`);
}
