import {cinemaGalleryConfig} from './i-cinema-gallery.mjs';
import {conceptCatalog} from './i-concepts-catalog.mjs';
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

export function renderCinemaComparison(){
 const original=`<a href="i.html?view=agency-cinema#i15" data-i-compare-choice="agency-cinema"><div class="study-art-compare-image"><img src="assets/i-cinema-person-v1.webp" width="1774" height="887" alt="" loading="lazy"></div><span>26 · Original cinema</span></a>`;
 const cards=Object.entries(cinemaGalleryConfig).map(([key,config])=>{
  const [,number,title]=conceptCatalog.find(([name])=>name===key);
  const b=config.screen;
  return `<a href="i.html?view=${key}#i15" data-i-compare-choice="${key}"><div class="study-art-compare-image"><img src="${config.watchingImage||config.image}" width="1774" height="887" alt="" loading="lazy"><span class="study-art-compare-screen" style="left:${b.left}%;top:${b.top}%;width:${b.width}%;height:${b.height}%"><img src="assets/i-cinema-cat-clip.webp" width="1254" height="1254" alt="" loading="lazy"></span></div><span>${number} · ${esc(title)}</span></a>`;
 }).join('');
 return `<details class="study-art-compare" data-i-art-comparison><summary>Compare illustrations</summary><div class="study-art-compare-sheet"><div class="study-art-compare-heading"><span>Original 26 + six cloud scenes</span><button type="button" data-i-compare-close>Close</button></div><div class="study-art-compare-grid">${original}${cards}</div></div></details>`;
}
