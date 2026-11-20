import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../assets/supplied-landscape/',import.meta.url);
const decode=async name=>sharp(await readFile(new URL(name,root))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const [hill,original]=await Promise.all([decode('foreground-source.png'),decode('original-source.png')]);
const trees=await decode('trees-source.png');
const pixel=(image,x,y)=>[...image.data.subarray((y*image.info.width+x)*4,(y*image.info.width+x)*4+4)];
const samples=[];
for(const x of [0,300,700,1300,1800,3000,5000,7000,8500,9049]){
 let y=hill.info.height-1;
 while(y>=0&&pixel(hill,x,y)[3]>=250)y--;
 const edge=y+1;
 samples.push({x,edge,profile:[-30,-20,-10,-5,0,5,10,20,30,60].map(dy=>({dy,hill:pixel(hill,x,edge+dy),original:pixel(original,x,edge+dy)}))});
}
console.log(JSON.stringify({hill:hill.info,original:original.info,samples}));
console.log(JSON.stringify({treeBases:[0,300,700,1300,1500,1700,1800,8500,8800,9049].map(x=>{
 let y=trees.info.height-1;
 while(y>=0&&pixel(trees,x,y)[3]<250)y--;
 return {x,base:y,profile:[-40,-20,-5,0].map(dy=>({dy,rgb:pixel(trees,x,y+dy)}))};
})}));
await writeFile(new URL('31-edge-analysis.json',import.meta.url),JSON.stringify(samples,null,2));
