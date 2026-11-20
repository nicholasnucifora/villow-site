// Compare the actual raster alpha edges with observed browser geometry.
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const decode=async name=>sharp(await readFile(new URL(`assets/30-landscape/${name}.webp`,root))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const trees=await decode('trees'),hill=await decode('foreground');
function profile(image,continuous){
 const {data,info:{width,height,channels}}=image;
 return Array.from({length:width},(_,x)=>{
  let y=height-1;
  const opaque=()=>data[(y*width+x)*channels+3]>=128;
  if(continuous){while(y>=0&&opaque())y--;return y+1;}
  while(y>=0&&!opaque())y--;
  return y;
 });
}
const treeBase=profile(trees,false),hillCrest=profile(hill,true);
const layouts=JSON.parse(await readFile(new URL('30-responsive-checks.json',import.meta.url),'utf8'));
const measurements=layouts.map(({width,next:layout})=>{
 const gaps={width};
 for(const [side,vb] of [['left',[0,1780,1850,1237]],['right',[8310,2180,740,837]]]){
  const box=layout[side],fg=layout.foreground,scale=box.width/vb[2];
  let largest=-Infinity;
  for(let x=Math.max(0,Math.ceil(box.left));x<Math.min(layout.contentWidth,box.left+box.width);x++){
   const sourceX=vb[0]+(x-box.left)/scale;
   const treeIndex=Math.min(trees.info.width-1,Math.floor(sourceX/9050*trees.info.width));
   const baseY=treeBase[treeIndex]/trees.info.height*3017;
   if(baseY<vb[1]||baseY>vb[1]+vb[3])continue;
   const treeY=box.top+(baseY-vb[1])*scale;
   const hillIndex=Math.min(hill.info.width-1,Math.max(0,Math.floor((x-fg.left)/fg.width*hill.info.width)));
   const hillY=fg.top+hillCrest[hillIndex]/hill.info.height*fg.height;
   largest=Math.max(largest,hillY-treeY);
  }
  gaps[`${side}MaxGap`]=Math.round(largest*10)/10;
  assert.ok(largest<0,`${width}px ${side} tree edge floats ${largest}px above the foreground`);
 }
 assert.equal(layout.overflow,false);
 assert.equal(layout.artLoaded,true);

 return gaps;
});
await writeFile(new URL('30-forest-grounding.json',import.meta.url),JSON.stringify({method:'Tree cutout bottom alpha edge vs continuous foreground crest, sampled every CSS pixel. Negative values mean the base is behind the hill.',measurements},null,2)+'\n');
console.log(JSON.stringify(measurements));
