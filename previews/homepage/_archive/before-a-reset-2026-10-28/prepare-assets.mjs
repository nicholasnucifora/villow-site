import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const output = new URL('./assets/', import.meta.url);
await mkdir(output, { recursive: true });
// Crops only: preserve the supplied app UI, colours, labels and demo data.
const sourceHome = 'C:/Users/Nebula PC/Downloads/home page screenshot light & dark.png';
const sourceUsage = 'C:/Users/Nebula PC/Downloads/time usage page screenshot light & dark & when you watch sub options.png';
const crops = [
  ['home-light', sourceHome, { left: 0, top: 0, width: 2541, height: 1358 }],
  ['home-dark', sourceHome, { left: 2636, top: 0, width: 2543, height: 1349 }],
  ['usage-light', sourceUsage, { left: 0, top: 0, width: 2541, height: 1362 }],
  ['usage-dark', sourceUsage, { left: 2579, top: 5, width: 2535, height: 1356 }],
];
for (const [name, source, region] of crops) {
  await sharp(source).extract(region).webp({ quality: 94 }).toFile(fileURLToPath(new URL(`${name}.webp`, output)));
  console.log(`${name}: ${region.width} × ${region.height}`);
}
for (const file of ['villow-mark-small-on-light.svg', 'villow-mark-small-on-dark.svg']) {
  await copyFile(new URL(`../../public/brand/${file}`, import.meta.url), new URL(file, output));
}
await copyFile(new URL('../../public/fonts/VarelaRound-Regular.ttf', import.meta.url), new URL('VarelaRound-Regular.ttf', output));
