import {readFileSync} from 'node:fs';

// Outline the supplied brand mark without changing its two component shapes.
const mark = readFileSync(new URL('./assets/villow-mark-small-on-light.svg',import.meta.url),'utf8');
const markPaths = [...mark.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(([,d])=>`<path d="${d}"/>`).join('');
// Intrinsic dimensions keep these small even before CSS is ready on history restores.
const app = `<svg width="32" height="32" viewBox="-40 -40 792 878" fill="none" stroke="currentColor" stroke-width="72" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${markPaths}</svg>`;

// Villow's canonical outline: NavIcons.tsx → phosphor/puzzle-piece in
// navIconArt.ts. Mirror as NavIconArtwork does for the extension navigation item.
// Phosphor Icons 2.1.1 Bold, MIT licence: assets/phosphor-icons-LICENSE.txt.
const extension = `<svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><g transform="translate(256 0) scale(-1 1)"><path d="M222.41,155.16a12,12,0,0,0-11.56-.69A16,16,0,0,1,188,139,16.2,16.2,0,0,1,202.8,124a15.83,15.83,0,0,1,8,1.5A12,12,0,0,0,228,114.7V72a20,20,0,0,0-20-20H176a40.15,40.15,0,0,0-12.62-29.16,39.67,39.67,0,0,0-29.94-10.76,40.08,40.08,0,0,0-37.34,37C96,50.07,96,51,96,52H64A20,20,0,0,0,44,72v28a40.15,40.15,0,0,0-29.16,12.62A40,40,0,0,0,41.1,179.9a28.3,28.3,0,0,0,2.9.1v28a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V165.31A12,12,0,0,0,222.41,155.16ZM204,204H68V165.31a12,12,0,0,0-17.15-10.84A15.9,15.9,0,0,1,42.8,156,16.2,16.2,0,0,1,28,141.06a16,16,0,0,1,22.82-15.52A12,12,0,0,0,68,114.7V76h42.7a12,12,0,0,0,10.83-17.15A15.9,15.9,0,0,1,120,50.8,16.19,16.19,0,0,1,134.94,36a16,16,0,0,1,15.53,22.81A12,12,0,0,0,161.31,76H204v24c-1,0-1.93,0-2.9.11A40,40,0,0,0,204,180h0Z"/></g></svg>`;
const plus = '<svg class="setup-compare-plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>';

export const setupChoiceIcons = {web:app,extension,both:`${app}${plus}${extension}`};
