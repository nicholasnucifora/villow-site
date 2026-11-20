import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {studies} from './study-navigation.mjs';
const root=fileURLToPath(new URL('./',import.meta.url));
const port=Number(process.env.VILLOW_PREVIEW_PORT||4399);
const activePages=new Set(['index.html',...studies.map(([key])=>`${key}.html`)]);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path.split('/').some(part=>part.startsWith('_')||part.startsWith('.'))){res.writeHead(404);res.end('Not found');return;}
  const name=path==='/'?'index.html':path.slice(1);
  // Only the active new series is served; retired previews redirect to A.
  if(extname(name)==='.html'&&!activePages.has(name)){res.writeHead(302,{'Location':'/a.html','Cache-Control':'no-store'});res.end();return;}
  const file=resolve(root,name);
  if(!file.startsWith(root.endsWith(sep)?root:root+sep)||!types[extname(file)]||!(await stat(file)).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[extname(file)],'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});res.end(await readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Villow homepage A: http://127.0.0.1:${port}/a.html`));
