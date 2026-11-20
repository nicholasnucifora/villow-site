import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root='C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/';
const files={
  hills:'exec-92b44a59-f895-4fb1-98f5-ae03d7850512.png',
  willow:'exec-425d3be4-3141-485f-b65a-3fbd1ffda639.png',
  lake:'exec-842eb7a5-724f-4737-902d-47c80acf86d9.png',
  meadow:'exec-8d4184d0-d70f-4301-9eee-818c2d8d6141.png',
};
const output=new URL('./illustration-studies/i-minimal/',import.meta.url);
await mkdir(output,{recursive:true});
const manifest=[];
for(const [key,name] of Object.entries(files)){
  const source=root+name;
  const metadata=await sharp(source).metadata();
  const desktop=fileURLToPath(new URL(`${key}.webp`,output));
  const phone=fileURLToPath(new URL(`${key}-mobile.webp`,output));
  await sharp(source).webp({quality:92}).toFile(desktop);
  await sharp(source).extract({left:900,top:0,width:1272,height:724}).resize({width:1000}).webp({quality:92}).toFile(phone);
  manifest.push({key,source,width:metadata.width,height:metadata.height,desktop,phone,crop:{left:900,top:0,width:1272,height:724}});
}
await writeFile(new URL('assets.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared four minimal landscapes and their phone crops.');
