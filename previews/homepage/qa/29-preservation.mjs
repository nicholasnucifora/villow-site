import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const hash=value=>createHash('sha256').update(value).digest('hex');
const main=html=>html.slice(html.indexOf('<main'));
const source=await readFile(new URL('28.html',root),'utf8');
const current={
 main:hash(main(source)),
 stylesheet:hash(await readFile(new URL('28-calm-mobile.css',root))),
 renderer:hash(await readFile(new URL('render-28.mjs',root)))
};
const baselineURL=new URL('29-28-preservation-baseline.json',import.meta.url);
if(process.argv.includes('--capture')){
 await writeFile(baselineURL,JSON.stringify(current,null,2)+'\n',{flag:'wx'});
 console.log('Captured preset 28 baseline.');
}else{
 assert.deepEqual(current,JSON.parse(await readFile(baselineURL,'utf8')));
 const page=await readFile(new URL('29.html',root),'utf8');
 assert.equal(main(page).replaceAll('Villow · Homepage 29','Villow · Homepage 28'),main(source));
 console.log('Preset 28 main content, stylesheet and renderer unchanged; 29 retains all main content.');
}
