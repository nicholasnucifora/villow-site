import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const source='C:/Users/Nebula PC/.codex/generated_images/01a16282-9002-7403-9596-5820d6fa455a/exec-58529d54-b4e7-4792-b8ec-f8f8e36f5213.png';
const destination=new URL('../assets/a-connected-devices.webp',import.meta.url);
const info=await sharp(source).webp({quality:90,alphaQuality:100}).toFile(fileURLToPath(destination));
console.log(JSON.stringify(info));
