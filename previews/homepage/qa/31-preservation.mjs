import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),baselineURL=new URL('31-preservation-baseline.json',import.meta.url);
const hash=b=>createHash('sha256').update(b).digest('hex');
const main=html=>html.slice(html.indexOf('<main'));
const sources=['29.html','29-raised-landscape.css','render-29.mjs','30.html','30-blended-landscape.css','render-30.mjs','assets/supplied-landscape/foreground.webp','assets/supplied-landscape/trees.webp'];
const current={};
for(const path of sources){const bytes=await readFile(new URL(path,root));current[path]=hash(path.endsWith('.html')?main(bytes.toString()):bytes);}
if(process.argv.includes('--capture')){
 await writeFile(baselineURL,JSON.stringify(current,null,2)+'\n',{flag:'wx'});
 console.log('Captured 29/30 and original-art preservation baseline.');
}else{
 assert.deepEqual(current,JSON.parse(await readFile(baselineURL,'utf8')));
 const source=await readFile(new URL('30.html',root),'utf8'),page=await readFile(new URL('31.html',root),'utf8');
 assert.equal(main(page).replaceAll('Villow · Homepage 31','Villow · Homepage 30').replaceAll('assets/31-original-landscape/','assets/30-landscape/'),main(source));
 assert.ok(!page.includes('assets/30-landscape/'),'No generated 30 tree/hill assets in 31');
 const css31=(await readFile(new URL('31-original-landscape.css',root),'utf8')).replaceAll('version-31-original','version-30-blended');
 const css30=await readFile(new URL('30-blended-landscape.css',root),'utf8');
 assert.equal(css31.slice(css31.indexOf('/* Keep W')),css30.slice(css30.indexOf('/* Keep W')),'30 footer/mobile/centred copy retained exactly');
 console.log('29/30 and originals preserved. 31 retains 30 content/footer/mobile treatment with original-art derivatives only.');
}
