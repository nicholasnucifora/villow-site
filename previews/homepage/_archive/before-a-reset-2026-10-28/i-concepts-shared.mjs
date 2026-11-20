import {esc,icons} from './i-data.js';
export {esc};

const samples={
 comedy:{title:'The very serious business of doing nothing',short:'A little comedy',channel:'A Little Absurd',image:'assets/i-thumb-rest.webp'},
 curiosity:{title:'Making a simple shelf with hand tools',short:'How does that work?',channel:'Made by Hand',image:'assets/h-thumb-shelf.webp'},
 music:{title:'Rain at the cabin — an evening piano session',short:'An evening piano session',channel:'Quiet Evenings',image:'assets/i-thumb-rain.webp'},
 garden:{title:'A small herb garden for a sunny windowsill',short:'A windowsill garden',channel:'Small Garden',image:'assets/c-thumb-garden.webp'},
 cooking:{title:'The pasta I make when the fridge is almost empty',short:'Something good for dinner',channel:'The Weeknight Table',image:'assets/c-thumb-pasta.webp'},
};

export function symbol(name){
 if(icons[name])return icons[name];
 const shapes={
  play:'<path d="m9 6 10 6-10 6Z" fill="currentColor" stroke="none"/>',
  pause:'<path d="M8 6v12M16 6v12" stroke-width="3"/>',
  leaf:'<path d="M5 19C4 9 10 4 20 4c0 10-5 15-15 15Zm0 0L16 8"/>',
  bookmark:'<path d="M7 4h10v17l-5-4-5 4Z"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
 };
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||shapes.play}</svg>`;
}

export function paperVideo(kind='comedy',{size='normal',caption=true,label=''}={}){
 const v=samples[kind]||samples.comedy;
 return `<div class="ic-paper-video ic-paper-video--${esc(size)}" data-ic-video="${esc(kind)}"><div class="ic-video-image"><img src="${v.image}" alt="" width="536" height="300" draggable="false"><span class="ic-play" aria-hidden="true">${symbol('play')}</span></div>${caption?`<div class="ic-video-caption"><strong>${esc(label||v.short)}</strong><small>${esc(v.channel)}</small></div>`:''}</div>`;
}
export const smallNote=text=>`<span class="ic-soft-note">${esc(text)}</span>`;
