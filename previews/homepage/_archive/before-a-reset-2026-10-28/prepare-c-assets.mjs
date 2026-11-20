import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const asset = name => fileURLToPath(new URL(`./assets/${name}`, import.meta.url));
await mkdir(new URL('./assets/', import.meta.url), { recursive: true });
const artSource = 'C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-f5792e94-c5e7-45f6-932b-7354e22ebcdc.png';
await sharp(artSource).webp({ quality: 92 }).toFile(asset('c-landscape.webp'));
// These are unchanged details from the real supplied app, not generated product UI.
const home = new URL('./assets/home-light.webp', import.meta.url);
const crops = [
  ['c-thumb-garden.webp', {left:281, top:190, width:535, height:292}],
  ['c-thumb-pasta.webp', {left:850, top:190, width:536, height:292}],
  ['c-thumb-mountain.webp', {left:850, top:720, width:536, height:300}],
];
for (const [name, crop] of crops) await sharp(fileURLToPath(home)).extract(crop).webp({quality:94}).toFile(asset(name));
await sharp(fileURLToPath(new URL('./assets/usage-light.webp', import.meta.url))).extract({left:300, top:475, width:1745, height:610}).webp({quality:94}).toFile(asset('c-usage-chart.webp'));
console.log('Prepared C illustration and real product details.');
