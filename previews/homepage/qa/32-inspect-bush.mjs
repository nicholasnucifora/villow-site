import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const trees=await sharp(await readFile(new URL('assets/supplied-landscape/trees.webp',root))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const hill=await sharp(await readFile(new URL('assets/31-original-landscape/foreground.webp',root))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
function profile(image,continuous){
 const {data,info:{width,height}}=image;
 return Array.from({length:width},(_,x)=>{
  let y=height-1;
  const opaque=()=>data[(y*width+x)*4+3]>=128;
  if(continuous){while(y>=0&&opaque())y--;return y+1;}
  while(y>=0&&!opaque())y--;
  return y;
 });
}
const treeBase=profile(trees,false),hillCrest=profile(hill,true);
const layouts=JSON.parse(await readFile(new URL('31-responsive-checks.json',import.meta.url),'utf8'));
for(const {width,next:layout} of layouts){
 const box=layout.left,fg=layout.foreground,scale=box.width/1850;
 let largest=-Infinity,first=null,last=null;
 for(let x=Math.max(0,Math.ceil(box.left));x<Math.min(layout.contentWidth,box.left+box.width);x++){
  const sourceX=(x-box.left)/scale;
  if(sourceX<1320)continue;
  const treeIndex=Math.min(trees.info.width-1,Math.floor(sourceX/9050*trees.info.width));
  const baseY=treeBase[treeIndex]/trees.info.height*3017;
  if(baseY<1780||baseY>3017)continue;
  const treeY=box.top+(baseY-1780)*scale;
  const hillIndex=Math.min(hill.info.width-1,Math.max(0,Math.floor((x-fg.left)/fg.width*hill.info.width)));
  const hillY=fg.top+hillCrest[hillIndex]/hill.info.height*fg.height;
  const gap=hillY-treeY;
  largest=Math.max(largest,gap);first??=gap;last=gap;
 }
 console.log({width,forestWidth:box.width,maxExposedBase:largest,first,last});
}
