// Deterministic matte repair only. Never invoke image generation here.
// Work from 29's decoded delivery pixels, preserving the original artwork.
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),out=new URL('assets/31-original-landscape/',root);
await mkdir(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const reports=[];
for(const name of ['foreground','trees']){
 const sourcePath=`assets/supplied-landscape/${name}.webp`;
 const source=await readFile(new URL(sourcePath,root));
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width,height}=info,edited=Buffer.from(data);
 const offset=(x,y)=>(y*width+x)*4;
 const alpha=(x,y)=>data[offset(x,y)+3];
 const bases=new Int32Array(width).fill(-1);
 let originalArtPixels=0,unchangedArtPixels=0,edgePixels=0,addedBasePixels=0;
 for(let x=0;x<width;x++){
  let edge=height-1;
  if(name==='foreground'){
   while(edge>=0&&alpha(x,edge)>=128)edge--;
   edge++;
   if(edge>=height)continue;
   // Remove isolated masking residue above the connected hill. Retain one
   // antialias row; correct only six delivery pixels just inside the cut edge.
   for(let y=0;y<edge-1;y++)edited.fill(0,offset(x,y),offset(x,y)+4);
   const anchor=[0,1,2].map(c=>Math.round([7,8,9,10].reduce((sum,dy)=>sum+data[offset(x,Math.min(height-1,edge+dy))+c],0)/4));
   for(let y=Math.max(0,edge-1);y<Math.min(height,edge+6);y++){
    const p=offset(x,y),weight=Math.max(0,1-(y-edge)/6);
    if(!data[p+3])continue;
    for(let c=0;c<3;c++)edited[p+c]=Math.round(data[p+c]+Math.min(0,anchor[c]-data[p+c])*weight);
    edgePixels++;
   }
   for(let y=edge+6;y<height;y++){
    originalArtPixels++;
    if(data.subarray(offset(x,y),offset(x,y)+4).equals(edited.subarray(offset(x,y),offset(x,y)+4)))unchangedArtPixels++;
   }
  }else{
   while(edge>=0&&alpha(x,edge)<128)edge--;
   if(edge<0)continue;
   bases[x]=edge;
   // A bottom matte can contain the lighter hill colour. Sample just inside
   // the actual tree, then continue that colour below the old cut, where the
   // foreground covers it. No tree top, branch or shrub outline is redrawn.
   let top=edge;
   while(top>0&&alpha(x,top-1)>=128)top--;
   const inset=Math.min(5,Math.max(1,Math.floor((edge-top)/2)));
   const sample=Math.max(top,edge-inset),pSample=offset(x,sample);
   for(let y=Math.max(top+1,edge-2);y<=edge;y++){
    const p=offset(x,y),blend=(y-(edge-3))/3;
    for(let c=0;c<3;c++)edited[p+c]=Math.round(data[p+c]*(1-blend)+data[pSample+c]*blend);
    // This cut is now inside the extended base: its old translucent edge
    // must be filled too, or sky leaks through it as a pale dotted line.
    edited[p+3]=Math.max(data[p+3],data[pSample+3]);
    edgePixels++;
   }
   for(let y=edge+1;y<Math.min(height,edge+81);y++){
    const p=offset(x,y);
    for(let c=0;c<3;c++)edited[p+c]=data[pSample+c];
    edited[p+3]=data[pSample+3];addedBasePixels++;
   }
   for(let y=0;y<Math.max(0,edge-2);y++)if(alpha(x,y)>=128){
    originalArtPixels++;
    if(data.subarray(offset(x,y),offset(x,y)+4).equals(edited.subarray(offset(x,y),offset(x,y)+4)))unchangedArtPixels++;
   }
  }
 }
 let closedMatteHoles=0;
 if(name==='trees'){
  // Close only tiny transparent pinholes near the lower cut. Raising a
  // cutout can otherwise expose a one-pixel slit between two small shrubs.
  // Opaque original tree pixels, outer silhouettes and larger gaps survive.
  const beforeClose=Buffer.from(edited);
  for(let x=1;x<width-1;x++){
   let base=bases[x];
   if(base<0){const a=bases[Math.max(0,x-3)],b=bases[Math.min(width-1,x+3)];if(a<0||b<0)continue;base=Math.round((a+b)/2);}
   for(let y=Math.max(0,base-15);y<Math.min(height,base+81);y++){
    const p=offset(x,y);if(beforeClose[p+3]>=128)continue;
    let left=x-1,right=x+1;
    while(left>=Math.max(0,x-4)&&beforeClose[offset(left,y)+3]<240)left--;
    while(right<=Math.min(width-1,x+4)&&beforeClose[offset(right,y)+3]<240)right++;
    if(left<Math.max(0,x-4)||right>Math.min(width-1,x+4))continue;
    const weight=(x-left)/(right-left);
    for(let c=0;c<3;c++)edited[p+c]=Math.round(beforeClose[offset(left,y)+c]*(1-weight)+beforeClose[offset(right,y)+c]*weight);
    edited[p+3]=255;closedMatteHoles++;
   }
  }
 }
 assert.equal(originalArtPixels,unchangedArtPixels,`${name} artwork outside the matte changed`);
 const delivery=await sharp(edited,{raw:{width,height,channels:4}}).webp({lossless:true,alphaQuality:100,effort:6}).toBuffer();
 await writeFile(new URL(`${name}.webp`,out),delivery);
 reports.push({name,source:sourcePath,sourceSHA256:hash(source),delivery:`assets/31-original-landscape/${name}.webp`,width,height,edgePixels,addedBasePixels,closedMatteHoles,originalArtPixels,unchangedArtPixels});
}
await writeFile(new URL('provenance.json',out),JSON.stringify({method:'Deterministic pixel-edge repair and hidden-base extension from preset 29 originals. No AI generation, repainting, colour grading, resizing or texture synthesis. Lossless WebP output.',reports},null,2)+'\n');
console.log(JSON.stringify(reports));
