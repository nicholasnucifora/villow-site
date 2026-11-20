import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {resolve,relative,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const inside=file=>file.startsWith(root+sep);
const textExt=new Set(['.html','.css','.js']);
const assetExt=new Set(['.webp','.png','.jpg','.jpeg','.gif','.avif','.svg','.ttf','.woff','.woff2','.mp4','.webm','.ico']);
const kept=new Set(),missing=new Set(),queue=['a-source.html','b.html','index.html'].map(file=>resolve(root,file));
function enqueue(value,parent){
 if(!value||/^(?:https?:|data:|blob:|mailto:|tel:|#|\/\/)/i.test(value))return;
 const clean=value.split(/[?#]/)[0].trim();if(!clean)return;
 const file=resolve(dirname(parent),clean);if(!inside(file))throw new Error('Dependency escaped preview root: '+value);
 if(textExt.has(extname(file))||assetExt.has(extname(file)))queue.push(file);
}
while(queue.length){
 const file=queue.shift();if(kept.has(file))continue;
 try{await stat(file);}catch{missing.add(relative(root,file));continue;}
 kept.add(file);if(!textExt.has(extname(file)))continue;
 const text=await readFile(file,'utf8');
 if(extname(file)==='.html'){
  for(const m of text.matchAll(/\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi))enqueue(m[1],file);
  for(const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi))for(const part of m[1].split(','))enqueue(part.trim().split(/\s+/)[0],file);
 }
 if(extname(file)==='.css')for(const m of text.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/gi))enqueue(m[1],file);
 if(extname(file)==='.js'){
  for(const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g))enqueue(m[1],file);
  for(const m of text.matchAll(/["'`]((?:\.\.?\/|assets\/|illustration-studies\/)[^"'`\s]+\.(?:webp|png|jpe?g|svg|ttf|woff2?|mp4|webm))["'`]/g))enqueue(m[1],file);
 }
}
const all=[];
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){if(item.name==='_archive')continue;const path=resolve(dir,item.name);if(!inside(path))throw new Error('Escaped root');if(item.isSymbolicLink())throw new Error('Review symbolic link: '+path);if(item.isDirectory())await walk(path);else all.push(path);}}
await walk(root);
const candidates=all.filter(file=>!relative(root,file).startsWith('qa'+sep+'a-')&&!kept.has(file)&&(assetExt.has(extname(file))||(['.js','.css'].includes(extname(file))&&relative(root,file).split(sep)[0]!=='qa')));
const rows=[];for(const file of candidates)rows.push({path:file,relative:relative(root,file).replaceAll(sep,'/'),bytes:(await stat(file)).size});
const output={root,missing:[...missing],kept:[...kept].map(file=>relative(root,file).replaceAll(sep,'/')).sort(),deleteFiles:rows,totalBytes:rows.reduce((n,row)=>n+row.bytes,0)};
if(missing.size)throw new Error('Missing dependencies: '+[...missing].join(', '));
await writeFile(new URL('./a-asset-cleanup-manifest.json',import.meta.url),JSON.stringify(output,null,2));
console.log(JSON.stringify({keptFiles:kept.size,keptAssets:output.kept.filter(file=>assetExt.has(extname(file))),removeFiles:rows.length,removeMiB:(output.totalBytes/1048576).toFixed(2),removeCssJs:rows.filter(row=>['.css','.js'].includes(extname(row.path))).map(row=>row.relative)},null,2));

