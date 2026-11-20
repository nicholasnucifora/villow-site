// HeroLandscape: independent, editable SVG layers; no image asset or tracing.
// The hills may stretch horizontally. The sun and trees retain their proportions.
export function renderLandscape({id='hero-landscape'}={}) {
  return `<div class="i-landscape" aria-hidden="true">
  <svg class="i-landscape-sun" data-landscape-element="sun" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="31" fill="var(--landscape-sun,#f4e7ba)"/></svg>
  <svg class="i-landscape-hills" data-landscape-element="hills" viewBox="0 0 1600 240" preserveAspectRatio="none" fill="none">
    <defs><linearGradient id="${id}-foreground" x1="0" y1="158" x2="0" y2="240" gradientUnits="userSpaceOnUse"><stop stop-color="var(--landscape-near-top,#badac9)"/><stop offset="1" stop-color="var(--landscape-near-bottom,#a9d0bc)"/></linearGradient></defs>
    <g data-landscape-layer="background-hills" fill="var(--landscape-far-top,#e1efe8)"><path d="M-20 141C125 101 257 98 388 119C527 141 616 164 760 152C938 136 1085 144 1213 117C1376 83 1490 80 1620 101V240H-20Z"/></g>
    <g data-landscape-layer="middle-hill" fill="var(--landscape-mid-top,#cce4d7)"><path d="M-20 184C134 147 272 152 421 175C597 202 714 219 868 202C1056 181 1199 141 1342 147C1477 153 1547 146 1620 129V240H-20Z"/></g>
    <g data-landscape-layer="foreground-hill" fill="url(#${id}-foreground)"><path d="M-20 221C152 199 312 213 487 231C717 255 914 234 1092 202C1284 167 1452 167 1620 153V240H-20Z"/></g>
  </svg>
  <svg class="i-landscape-trees" data-landscape-element="evergreens" viewBox="0 0 240 170" fill="none">
    <g class="i-landscape-tree i-landscape-tree-distant" data-tree="distant" transform="translate(20 57) scale(.64)">
      <path d="M32 109L30 142" stroke="var(--landscape-trunk-far,#8ba995)" stroke-width="4" stroke-linecap="round"/>
      <path d="M32 5C26 15 28 23 22 33C16 41 19 49 14 58C9 67 12 74 8 84C3 97 10 111 20 117C28 121 43 122 52 117C62 111 64 101 60 91C57 83 58 73 52 65C47 59 49 52 45 44C39 35 42 29 37 19C35 14 35 10 32 5Z" fill="var(--landscape-tree-far,#8fbba6)"/>
    </g>
    <g class="i-landscape-tree i-landscape-tree-middle" data-tree="middle" transform="translate(76 31) scale(.86)">
      <path d="M34 115L32 143" stroke="var(--landscape-trunk,#769b84)" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M34 5C29 14 29 24 24 32C20 39 21 45 16 54C10 63 14 71 9 80C3 93 7 105 18 114C28 121 44 123 55 117C65 111 67 100 62 90C57 80 61 74 54 64C49 57 51 49 46 42C41 35 43 28 38 20C35 14 37 10 34 5Z" fill="var(--landscape-tree-middle,#72a88e)"/>
    </g>
    <g class="i-landscape-tree i-landscape-tree-near" data-tree="near" transform="translate(145 4)">
      <path d="M34 122L35 158" stroke="var(--landscape-trunk,#769b84)" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M35 5C30 17 32 24 26 35C22 42 25 49 18 59C13 67 17 74 11 84C5 94 8 102 5 110C3 121 13 131 27 134C41 137 56 134 64 126C70 120 68 111 65 103C61 94 63 87 57 80C51 71 56 64 50 56C44 48 47 40 42 32C38 23 40 16 35 5Z" fill="var(--landscape-tree-near,#4d9176)"/>
    </g>
  </svg>
</div>`;
}
