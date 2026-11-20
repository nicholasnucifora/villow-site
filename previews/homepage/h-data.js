export const icons = {
clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>',
check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m9 5-5 5 5 5M4 10h9a7 7 0 0 1 7 7"/></svg>'
};
export const videos = {
garden:{id:'garden',title:'A small herb garden for a sunny windowsill',channel:'Small Garden',image:'assets/c-thumb-garden.webp'},
mountain:{id:'mountain',title:'A slow walk through the mountains',channel:'Long Way Home',image:'assets/c-thumb-mountain.webp'},
pasta:{id:'pasta',title:'The pasta I make when the fridge is almost empty',channel:'The Weeknight Table',image:'assets/c-thumb-pasta.webp'},
shelf:{id:'shelf',title:'Making a simple shelf with hand tools',channel:'Made by Hand',image:'assets/h-thumb-shelf.webp'}
};
export const feedIds=['garden','mountain','pasta'];
export const initialSaved=['shelf'];
export const esc = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function feedCard(id){
const v=videos[id];
return `<article class="feed-card" data-feed-id="${id}" aria-label="${esc(v.title)}">
<div class="feed-thumbnail"><img src="${v.image}" alt="" width="536" height="300" draggable="false">
<div class="thumbnail-actions"><button type="button" data-action="save" data-id="${id}" aria-label="Add to Watch Later: ${esc(v.title)}">${icons.clock}<span class="action-tooltip">Add to Watch Later</span></button><button type="button" data-action="skip" data-id="${id}" aria-label="Remove: ${esc(v.title)}">${icons.trash}<span class="action-tooltip">Remove</span></button></div>
<span class="swipe-feedback" aria-hidden="true"></span></div>
<div class="feed-card-copy"><h3>${v.title}</h3><p>${v.channel}</p></div></article>`;
}
export function savedCard(id){
const v=videos[id];
return `<article class="saved-card" data-saved-id="${id}"><div class="saved-thumbnail"><img src="${v.image}" alt="" width="536" height="300" draggable="false"><button type="button" data-action="remove-saved" data-id="${id}" aria-label="Remove from Watch Later: ${esc(v.title)}">${icons.trash}<span class="action-tooltip">Remove from Watch Later</span></button>${feedIds.includes(id)?'<span class="saved-origin">Saved by you</span>':''}</div><div class="saved-card-copy"><h3>${v.title}</h3><p>${v.channel}</p></div></article>`;
}

