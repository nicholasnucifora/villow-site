import sharp from 'sharp';
import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url), out=new URL('assets/supplied-landscape/',root);
await mkdir(new URL('previous/',out),{recursive:true});
const sources=[['w-background-original Updated.png','original'],['front hill.png','foreground'],['tree_forest.png','trees']];
for(const [name,key] of sources){
 const source='C:/Users/Nebula PC/OneDrive/Desktop/'+name;
 await copyFile(source,new URL(key+'-source.png',out));
 await sharp(source).resize({width:3840}).webp({quality:94,alphaQuality:100}).toFile(fileURLToPath(new URL(key+'.webp',out)));
}
const old=['illustration-studies/i-supplied/sage-sunrise.webp','illustration-studies/i-supplied/sage-sunrise-mobile.webp','assets/y-landscape/tablet.webp','assets/y-landscape/phone.webp'];
for(const path of old)await copyFile(new URL(path,root),new URL(path.includes('y-landscape')?'previous/y-'+path.split('/').pop():'previous/'+path.split('/').pop(),out),constants.COPYFILE_EXCL).catch(error=>{if(error.code!=='EEXIST')throw error;});
const original=new URL('original-source.png',out);
const wide=await sharp(fileURLToPath(original)).resize(2172,724).toBuffer();
await sharp(wide).webp({quality:94}).toFile(fileURLToPath(new URL(old[0],root)));
await sharp(wide).extract({left:900,top:0,width:1272,height:724}).resize(1000,569).webp({quality:94}).toFile(fileURLToPath(new URL(old[1],root)));
// Keep Y's established source dimensions/layout, now using crops of the
// user's updated original instead of the earlier generated variants.
await sharp(fileURLToPath(original)).extract({left:3016,top:0,width:6034,height:3017}).resize(1774,887).webp({quality:94}).toFile(fileURLToPath(new URL(old[2],root)));
await sharp(fileURLToPath(original)).extract({left:4118,top:0,width:4525,height:3017}).resize(1536,1024).webp({quality:94}).toFile(fileURLToPath(new URL(old[3],root)));
const hash=b=>createHash('sha256').update(b).digest('hex');
await writeFile(new URL('qa/27-z-preservation-baseline.json',root),JSON.stringify({main:hash((await readFile(new URL('z.html',root),'utf8')).split('<main')[1]),stylesheet:hash(await readFile(new URL('z-layered-landscape.css',root)))},null,2));
console.log('Saved supplied originals and web assets; updated full-scene presets and backed up earlier image files.');
