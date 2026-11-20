import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const app = resolve(here, '../../../../disconnect');
const requireApp = createRequire(resolve(app, 'package.json'));
const { build } = createRequire(requireApp.resolve('vite/package.json'))('esbuild');
const postcss = requireApp('postcss');
const tailwind = requireApp('@tailwindcss/postcss');
const pasta = await readFile(resolve(here, '../assets/c-thumb-pasta.webp'));
const fixture = (await readFile(resolve(here, 'native-capture.tsx'), 'utf8')).replaceAll('__CAPTURE_PASTA_DATA_URI__', `data:image/webp;base64,${pasta.toString('base64')}`);

const compiled = await build({
  stdin: { contents: fixture, resolveDir: app, loader: 'tsx' },
  bundle: true, write: false, format: 'iife', platform: 'browser',
  outfile: 'native-capture.js', jsx: 'automatic',
  define: { 'import.meta.env': '{}', 'process.env.NODE_ENV': '"production"' },
});
const cssSource = await readFile(resolve(app, 'src/index.css'), 'utf8');
const generatedCss = await postcss([tailwind({ optimize: true })]).process(cssSource, { from: resolve(app, 'src/index.css') });
let css = generatedCss.css + '\n' + compiled.outputFiles.filter(file => file.path.endsWith('.css')).map(file => file.text).join('\n');
css = css.replace(/@font-face\s*\{[^}]*\}/g, '');
for (const [family, filename, weight] of [
  ['Inter Variable', 'inter-v20-latin-opsz-normal.woff2', '100 900'],
  ['Varela Round', 'varela-round-v21-latin-400.woff2', '400'],
]) {
  const font = await readFile(resolve(app, 'public/fonts', filename));
  css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2')}`;
}
css += `
html,body{margin:0;background:var(--app-page-background,#f5fbf8);color:var(--app-text,#102e3a);font-family:'Inter Variable',system-ui,sans-serif;font-size:16px}
body{padding:32px 24px 80px}main{width:min(100%,1040px);margin:auto}.capture-intro{padding:0 0 32px}.capture-intro h1{font-size:22px;font-weight:650;line-height:1.4}.capture-intro p,.capture-note{font-size:13px;line-height:1.6;color:var(--app-muted-text);margin-top:8px}.capture-intro a{color:var(--app-primary);text-decoration:underline}.capture-block{margin-bottom:56px}.capture-label{font-size:13px;font-weight:600;margin:0 0 12px;color:var(--app-muted-text)}.capture-frame{padding:20px;border-radius:20px;background:var(--app-surface)}.capture-frame>h2{font-size:16px;font-weight:650;line-height:1.5;margin:0 0 20px}.capture-limits{width:330px;max-width:100%;padding:20px;border-radius:20px;background:var(--app-surface)}.capture-reflection{padding:20px;border-radius:20px;background:var(--app-surface)}
.capture-verdict{width:min(100%,768px);height:720px;border-radius:24px;overflow:hidden;background:var(--app-page-background)}
.capture-verdict-compact{width:min(100%,368px)}
@media(max-width:480px){body{padding:20px 12px 60px}.capture-frame{padding:12px}.capture-limits{padding:16px}}
`;
const bootstrap = `class MemoryStorage{constructor(){this.items=new Map}getItem(k){return this.items.get(String(k))??null}setItem(k,v){this.items.set(String(k),String(v))}removeItem(k){this.items.delete(String(k))}clear(){this.items.clear()}key(i){return[...this.items.keys()][i]??null}get length(){return this.items.size}};for(const name of['localStorage','sessionStorage'])Object.defineProperty(window,name,{value:new MemoryStorage});window.fetch=()=>Promise.reject(Error('Native component capture has no network access'));`;
const js = compiled.outputFiles.filter(file => file.path.endsWith('.js')).map(file => file.text).join('\n').replace(/<\/script/gi, '<\\/script');
const csp = "default-src 'none';script-src 'unsafe-inline';style-src 'unsafe-inline';img-src data:;font-src data:;connect-src 'none';frame-src 'none';object-src 'none';base-uri 'none';form-action 'none'";
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="${csp}"><title>Villow · Native component captures</title><style>${css}</style></head><body><div id="root"></div><script>${bootstrap}</script><script>${js}</script></body></html>`;
await mkdir(here, { recursive: true });
await writeFile(resolve(here, 'native-capture.html'), html);
console.log(`Built offline actual-component capture: ${resolve(here, 'native-capture.html')} (${Buffer.byteLength(html)} bytes)`);
