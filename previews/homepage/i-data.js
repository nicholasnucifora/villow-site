import {icons,esc,videos as existingVideos} from './h-data.js';
export {icons,esc};
export const videos={...existingVideos,
rain:{id:'rain',title:'Rain at the cabin - an evening piano session',channel:'Quiet Evenings',image:'assets/i-thumb-rain.webp'},
rest:{id:'rest',title:'The very serious business of doing nothing',channel:'A Little Absurd',image:'assets/i-thumb-rest.webp'}
};
export const feedIds=['garden','mountain','pasta','shelf','rain'];
export const initialSaved=['rest'];
export function stackMarkup(ids){
// Back cards have the same contents and dimensions as the active card. Their
// actual nodes are promoted in place; a choice never rebuilds the remaining pile.
return [...ids].reverse().map(id=>{const v=videos[id],depth=ids.indexOf(id),front=depth===0;return `<article class="i-stack-card ${front?'i-stack-front':'i-stack-back'}" data-stack-card="${id}" ${front?`data-stack-front="${id}"`:`data-stack-back="${id}" aria-hidden="true" inert`} aria-label="${esc(v.title)}" style="--depth:${depth};--back-angle:${feedIds.indexOf(id)%2?4:-5}deg;--front-angle:-2deg">
<div class="i-stack-thumbnail"><img src="${v.image}" width="536" height="300" alt="" draggable="false"><span class="i-swipe-feedback" aria-hidden="true"></span></div>
<div class="i-video-copy"><h3>${v.title}</h3><p>${v.channel}</p></div>
<div class="i-card-actions"><button type="button" class="i-remove" data-i-action="skip" data-id="${v.id}" tabindex="${front?0:-1}" aria-label="Remove: ${esc(v.title)}">${icons.trash}<span>Remove</span></button><button type="button" class="i-save" data-i-action="save" data-id="${v.id}" tabindex="${front?0:-1}" aria-label="Add to Watch Later: ${esc(v.title)}">${icons.clock}<span>Watch Later</span></button></div>
</article>`;}).join('');
}
export function savedMarkup(id){
const v=videos[id];
return `<article class="i-saved-card" data-i-saved-id="${id}"><div class="i-saved-thumbnail"><img src="${v.image}" alt="" width="536" height="300" draggable="false"><button type="button" data-i-action="remove-saved" data-id="${id}" aria-label="Remove from Watch Later: ${esc(v.title)}">${icons.trash}</button>${feedIds.includes(id)?'<span class="i-your-pick">Your pick</span>':''}</div><h3>${v.title}</h3><p>${v.channel}</p></article>`;
}

