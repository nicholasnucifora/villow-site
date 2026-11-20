import {readFile, stat, mkdir, writeFile} from 'node:fs/promises';
import {resolve, dirname, extname, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {designRoot, designPages, designFileRoutes} from '../src/lib/site-design.mjs';

const root = fileURLToPath(designRoot);
const textTypes = new Set(['.html', '.css', '.js', '.svg']);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.avif':'image/avif','.ttf':'font/ttf','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon','.mp4':'video/mp4','.webm':'video/webm'};
const shellAssets = ['secondary-preview.css','study-navigation.css','preview-header.css','site-directory.css','preview-footer.css','navigation-studies.css','footer-spidey.css','site-directory.js','footer-spidey.js','study-page-navigation.js','study-navigation-scroll.js','assets/villow-mark-small-on-light.svg','spidey/base-spider.svg'];

// Only ship dependencies of active pages, never the private historical studies,
// renderers, source policies, screenshots, test files or project metadata.
export async function collectDesignAssets() {
  const assets = new Set(), scanned = new Set();
  const queue = [...designPages.map(page => page.file), ...shellAssets];
  function enqueue(value, parent, isImport = false) {
    if (!value || /^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(value)) return;
    const clean = value.split(/[?#]/)[0].trim();
    const candidate = resolve(root, dirname(parent), clean);
    const name = relative(root, candidate).split(sep).join('/');
    if (name.startsWith('../') || name.split('/').some(part => part.startsWith('.') || part === '_archive' || part === 'qa')) throw new Error(`Private design dependency: ${value}`);
    if (!types[extname(name)]) return;
    // Page links are handled by the main route map, not copied into assets.
    if (extname(name) === '.html' && !name.startsWith('assets/')) return;
    if (isImport && !['.js','.css'].includes(extname(name))) return;
    queue.push(name);
  }
  while (queue.length) {
    const name = queue.shift();
    if (scanned.has(name)) continue;
    scanned.add(name);
    const file = new URL(name, designRoot);
    if (!(await stat(file)).isFile()) throw new Error(`Missing design asset: ${name}`);
    if (!designPages.some(page => page.file === name)) assets.add(name);
    if (!textTypes.has(extname(name))) continue;
    const source = await readFile(file, 'utf8');
    if (['.html','.svg'].includes(extname(name))) {
      for (const match of source.matchAll(/\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/g)) enqueue(match[1], name);
      for (const match of source.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/g)) for (const part of match[1].split(',')) enqueue(part.trim().split(/\s+/)[0], name);
    }
    for (const match of source.matchAll(/url\(\s*["']?([^\s)"']+)["']?\s*\)/g)) enqueue(match[1], name);
    if (extname(name) === '.js') {
      for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g)) enqueue(match[1], name, true);
      for (const match of source.matchAll(/["'`]((?:\.\.?\/|assets\/|illustration-studies\/)[^"'`\s]+\.(?:html|webp|png|jpe?g|svg|ttf|woff2?|mp4|webm))["'`]/g)) enqueue(match[1], name);
    }
  }
  return assets;
}

async function assetContent(name) {
  const data = await readFile(new URL(name, designRoot));
  // DOM-created image paths resolve against the current page, not the JS file.
  if (extname(name) === '.js') return data.toString().replace(/(["'`])((?:assets|illustration-studies)\/)/g, '$1/_design/$2');
  return data;
}

export default function siteDesignIntegration() {
  let assetsPromise;
  const assets = () => assetsPromise ||= collectDesignAssets();
  return {name:'villow-current-design', hooks:{
    'astro:server:setup': ({server}) => {
      let moderationPreview;
      // Isolated fixture review on the existing local site. Never included in
      // the static build or connected to production records/credentials.
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url, 'http://localhost').pathname;
        if (!(path === '/admin/support' || path.startsWith('/admin/support/') || path.startsWith('/__support-review'))) return next();
        try {
          moderationPreview ||= import('../support/test/moderation-preview.mjs').then(module => module.createModerationPreview());
          await (await moderationPreview)(req, res);
        } catch (error) { next(error); }
      });
      server.watcher.add(root);
      server.watcher.on('all', (_event, file) => {
        if (!resolve(file).startsWith(root)) return;
        const name = relative(root, file).split(sep).join('/');
        if (name.startsWith('qa/') || name.startsWith('_archive/')) return;
        assetsPromise = undefined;
        // These buildless assets bypass Vite's module graph. Reload connected
        // desktop/USB browsers when their shared source changes.
        server.ws.send({type:'full-reload',path:'*'});
      });
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const alias = designFileRoutes[url.pathname.slice(1)];
          if (alias) {res.writeHead(302, {Location:alias + url.search, 'Cache-Control':'no-store'}); res.end(); return;}
          if (!url.pathname.startsWith('/_design/')) return next();
          const name = decodeURIComponent(url.pathname.slice('/_design/'.length));
          if (!(await assets()).has(name)) {res.writeHead(404); res.end('Not found'); return;}
          res.writeHead(200, {'Content-Type':types[extname(name)], 'Cache-Control':'no-store', 'X-Robots-Tag':'noindex, nofollow'});
          res.end(await assetContent(name));
        } catch (error) {next(error);}
      });
    },
    'astro:build:done': async ({dir}) => {
      for (const name of await collectDesignAssets()) {
        const destination = new URL('_design/' + name, dir);
        await mkdir(dirname(fileURLToPath(destination)), {recursive:true});
        await writeFile(destination, await assetContent(name));
      }
      const redirects = Object.entries(designFileRoutes).map(([file, path]) => `/${file} ${path} 302`).join('\n');
      await writeFile(new URL('_redirects', dir), redirects + '\n');
      await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex, nofollow\n');
    },
  }};
}
