import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const hash=value=>createHash('sha256').update(value).digest('hex');
const main=html=>html.slice(html.indexOf('<main'));
const source=await readFile(new URL('29.html',root),'utf8');
const current={
 main:hash(main(source)),
 stylesheet:hash(await readFile(new URL('29-raised-landscape.css',root))),
 renderer:hash(await readFile(new URL('render-29.mjs',root)))
};
const baselineURL=new URL('30-29-preservation-baseline.json',import.meta.url);
if(process.argv.includes('--capture')){
 await writeFile(baselineURL,JSON.stringify(current,null,2)+'\n',{flag:'wx'});
 console.log('Captured preset 29 baseline.');
}else{
 assert.deepEqual(current,JSON.parse(await readFile(baselineURL,'utf8')));
 const page=await readFile(new URL('30.html',root),'utf8');
 assert.equal(main(page).replaceAll('Villow · Homepage 30','Villow · Homepage 29').replaceAll('assets/30-landscape/','assets/supplied-landscape/').replace('0 1780 1850 1237','0 1780 1850 900').replace('8310 2180 740 837','8310 2180 740 500'),main(source));
 console.log('Preset 29 main content, stylesheet and renderer unchanged; 30 retains all non-scenery main content.');
}
