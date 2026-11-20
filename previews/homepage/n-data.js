import {videos as original,feedIds,initialSaved,icons,esc} from './i-data.js';
export {feedIds,initialSaved,icons,esc};
const titles={garden:'A small herb garden',mountain:'A walk in the mountains',pasta:'An easy pasta dinner',shelf:'A shelf made by hand',rain:'Rain at the cabin',rest:'The art of doing nothing'};
export const videos=Object.fromEntries(Object.entries(original).map(([id,video])=>[id,{...video,title:titles[id]||video.title}]));
