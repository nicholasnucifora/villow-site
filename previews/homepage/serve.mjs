import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {secondaryStudyRoutes} from './study-navigation.mjs';
import {homeStudies,retiredHomeStudies,previewPageURL} from './preview-pages.js';
import {retiredConceptPresets} from './site-routes.js';
const root=fileURLToPath(new URL('./',import.meta.url));
const port=Number(process.env.VILLOW_PREVIEW_PORT||4399);
const activePages=new Set(['index.html','assets/villow-home-scene.html',...secondaryStudyRoutes,...homeStudies.map(([key])=>`${key}.html`)]);
const defaultPage=new URL(previewPageURL('home')).pathname.slice(1);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'};
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path.split('/').some(part=>part.startsWith('_')||part.startsWith('.'))){res.writeHead(404);res.end('Not found');return;}
  // Stripe return and email-management links use /support. Keep their query/hash intact.
  const name=path==='/'?'index.html':path==='/support'?'help-a.html':path.slice(1);
  if(name==='about-a.html'){res.writeHead(302,{'Location':'/help-a.html'+new URL(req.url,'http://localhost').search,'Cache-Control':'no-store'});res.end();return;}
  // Old homepage bookmarks return directly to 34; browsers retain fragments.
  if(retiredHomeStudies.some(key=>name===`${key}.html`)){res.writeHead(302,{'Location':'/'+defaultPage+new URL(req.url,'http://localhost').search,'Cache-Control':'no-store'});res.end();return;}
  // Old help links now open the matching inline answer. Browsers retain the fragment.
  if(name==='setup-hosting-troubleshooting-d.html'){res.writeHead(302,{'Location':'/setup-hosting-d.html'+new URL(req.url,'http://localhost').search,'Cache-Control':'no-store'});res.end();return;}
  if(name==='setup-a.html'){res.writeHead(302,{'Location':'/setup-b.html','Cache-Control':'no-store'});res.end();return;}
  if(retiredConceptPresets.some(preset=>name===`concepts-${preset}.html`)){res.writeHead(302,{'Location':new URL(previewPageURL('concepts')).pathname+new URL(req.url,'http://localhost').search,'Cache-Control':'no-store'});res.end();return;}
  // Serve saved homepage alternatives and actual secondary-page drafts only.
  if(extname(name)==='.html'&&!activePages.has(name)){res.writeHead(302,{'Location':'/'+defaultPage,'Cache-Control':'no-store'});res.end();return;}
  const file=resolve(root,name);
  if(!file.startsWith(root.endsWith(sep)?root:root+sep)||!types[extname(file)]||!(await stat(file)).isFile()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[extname(file)],'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});res.end(await readFile(file));
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Villow homepage 34 · Soft Nunito: http://127.0.0.1:${port}/${defaultPage}`));
