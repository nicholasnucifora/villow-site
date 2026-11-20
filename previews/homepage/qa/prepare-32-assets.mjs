// Use the user's revised tree silhouette, with the trailing shrub removed.
// Preserve 32's approved colours and avoid any artificial foundation.
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),out=new URL('assets/32-grounded-bush/',root);
await mkdir(out,{recursive:true});
const sourcePath='assets/32-grounded-bush/trees2-source.png';
const source=await readFile(new URL(sourcePath,root));
const original=await sharp(source).resize(3840,1280).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const clean=await sharp(await readFile(new URL('assets/31-original-landscape/trees.webp',root))).ensureAlpha().raw().toBuffer();
const {width,height}=original.info;
let removedPixels=0;
for(let x=0;x<800;x++){
 let base=height-1;
 while(base>=0&&original.data[(base*width+x)*4+3]<128)base--;
 for(let y=0;y<height;y++){
  const p=(y*width+x)*4;
  const a=y<=base?original.data[p+3]:0;
  if(clean[p+3]&&!a)removedPixels++;
  clean[p+3]=a;
 }
}
await writeFile(new URL('trees-left.webp',out),await sharp(clean,{raw:{width,height,channels:4}}).webp({lossless:true,effort:6}).toBuffer());
await writeFile(new URL('provenance.json',out),JSON.stringify({method:'User-supplied trees2.png alpha silhouette, removing the trailing left-forest shrub; approved edge-cleaned RGB retained. No extended columns, stretching or image generation. CSS tucks the cut behind the hill.',width,height,removedPixels,source:sourcePath,sourceSHA256:createHash('sha256').update(source).digest('hex')},null,2)+'\n');
console.log({removedPixels});
