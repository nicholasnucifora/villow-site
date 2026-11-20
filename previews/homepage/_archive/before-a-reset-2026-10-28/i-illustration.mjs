import {artChoices} from './i-art-data.js';
// Art-only variants share the exact same layout, typography, cards and section.
// Every scene has a deliberate phone crop and the same intrinsic dimensions.
export function renderIllustration() {
  return `<div class="i-illustration" data-i-artwork data-active-art="i15" aria-hidden="true">${artChoices.filter(art=>!art.archived).map((art,index)=>`<picture data-i-art-picture="${art.id}"${index?' hidden':''}>
  <source media="(max-width:700px)" srcset="${art.phone}" width="1000" height="569">
  <img src="${art.desktop}" width="2172" height="724" alt="" fetchpriority="${index?'low':'high'}" decoding="async" draggable="false">
  </picture>`).join('')}</div>`;
}
