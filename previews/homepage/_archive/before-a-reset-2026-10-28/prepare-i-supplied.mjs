import sharp from 'sharp';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

// User-supplied artwork: encoding and responsive crops only. Source PNGs and
// every earlier illustration remain untouched. The two taller sources lose
// only empty sky at their top when normalized to the existing 3:1 art slot.
const sources = [
  {id:'i15', key:'sage-sunrise', title:'Sage sunrise', source:'Minimalist Pastel Sunrise Landscape.png', phoneLeft:900},
  {id:'i16', key:'soft-horizon', title:'Soft horizon', source:'Pastel Hills at Sunrise.png', phoneLeft:900},
  {id:'i17', key:'low-sun', title:'Low sun', source:'Minimalist Pastel Sunrise Hillscape.png', phoneLeft:900},
  {id:'i18', key:'morning-glow', title:'Morning glow', source:'Serene Pastel Rolling Hills at Sunrise.png', phoneLeft:0},
  {id:'i19', key:'open-countryside', title:'Open countryside', source:'Pastel Countryside Sunrise Landscape.png', phoneLeft:900},
  {id:'i20', key:'green-valley', title:'Green valley', source:'Minimalist Pastel Mountain Sunrise.png', phoneLeft:900},
];
const output = new URL('./illustration-studies/i-supplied/', import.meta.url);
await mkdir(output, {recursive:true});
const manifest = [];
for (const item of sources) {
  const source = 'C:/Users/Nebula PC/Downloads/' + item.source;
  const {width, height} = await sharp(source).metadata();
  const cropHeight = Math.round(width / 3);
  const desktopCrop = {left:0, top:height-cropHeight, width, height:cropHeight};
  const normalized = await sharp(source).extract(desktopCrop).resize(2172,724).toBuffer();
  const desktop = fileURLToPath(new URL(item.key+'.webp',output));
  const phone = fileURLToPath(new URL(item.key+'-mobile.webp',output));
  const phoneCrop = {left:item.phoneLeft, top:0, width:1272, height:724};
  await sharp(normalized).webp({quality:92}).toFile(desktop);
  await sharp(normalized).extract(phoneCrop).resize(1000,569).webp({quality:92}).toFile(phone);
  manifest.push({...item, source, sourceWidth:width, sourceHeight:height, desktopCrop, desktop, phone, phoneCrop});
}
await writeFile(new URL('assets.json',output),JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared six supplied illustrations, with desktop and phone crops.');
