// Editable vector geometry: one scene, one coordinate system, no raster patches.
// The existing cinema controller drives the optional reflection/arm pose.
export const cinemaScene = `<svg class="xh-cinema-drawing" xmlns="http://www.w3.org/2000/svg" width="620" height="360" viewBox="0 0 620 360" aria-hidden="true">
 <path d="M24 308C24 289 48 280 75 283C91 266 133 266 154 280C185 268 217 274 230 289C268 275 305 277 329 290C360 275 397 281 411 292C447 278 486 279 508 290C553 281 596 291 600 309C601 330 493 339 317 337C143 338 24 332 24 308Z" fill="#e2eddf"/>
 <path d="M39 308C84 304 112 310 145 305C191 300 205 313 247 307C311 297 335 316 388 309C447 303 487 315 569 307" fill="none" stroke="#f4f5e8" stroke-width="14" stroke-linecap="round"/>
 <path d="M250 250L281 94V275Z" fill="#f7e9b4"/>
 <!-- Screen and stand share the same geometry as the HTML player. -->
 <path d="M291 284L284 315M580 284L588 315" stroke="#648c7d" stroke-width="7" stroke-linecap="round"/>
 <rect x="270" y="82" width="334" height="206" rx="13" fill="#779b88"/>
 <rect x="276" y="88" width="322" height="194" rx="8" fill="#c5d6bc"/>
 <rect x="282" y="94" width="310" height="182" rx="4" fill="#f0f1dc"/>
 <!-- A rounded chair, with the figure's two legs drawn as distinct shapes. -->
 <g transform="translate(-15 40) scale(.86)">
 <path d="M66 283L61 307M156 287L162 307" stroke="#789b87" stroke-width="7" stroke-linecap="round"/>
 <path d="M53 217C45 184 56 161 77 162C100 162 113 185 116 218L148 234C169 247 178 272 161 288C148 300 89 296 68 283Z" fill="#a9cbb7"/>
 <path d="M79 219C96 208 129 209 149 222L177 249C189 265 176 282 160 285H91Z" fill="#c3ddc5"/>
 <path d="M125 213C151 200 172 206 181 223L194 268L177 276L154 240L119 239Z" fill="#356460"/>
 <path d="M145 210C168 205 185 209 196 226L221 257L207 271L176 244L139 237Z" fill="#244f4f"/>
 <path d="M177 271L193 267L199 280L213 286C217 289 215 294 210 294H185C179 294 175 290 175 285Z" fill="#e8c7a7"/>
 <path d="M208 263L220 256L231 267L245 269C251 270 252 276 246 279L225 285C221 286 216 283 214 279Z" fill="#ebcbae"/>
 <path d="M111 153C127 143 144 144 153 158L166 210C155 223 127 226 109 216L100 183Z" fill="#fff6df"/>
 <path d="M110 162C103 173 96 193 99 205C104 214 118 216 130 217" fill="none" stroke="#ead0b0" stroke-width="13" stroke-linecap="round"/>
 <path d="M115 161C110 168 108 173 106 181" fill="none" stroke="#fff6df" stroke-width="18" stroke-linecap="round"/>
 <path d="M133 139V154C139 160 149 156 149 149V134Z" fill="#e5bc98"/>
 <!-- Hair is a single clean silhouette, with no small generated strands. -->
 <path d="M116 148C97 148 92 134 101 125C93 110 103 96 116 91C122 75 151 74 163 89C172 100 170 116 158 125L139 146Z" fill="#214e4c"/>
 <path d="M130 96C141 97 152 91 156 90C159 98 158 105 164 109L168 115L160 119C159 130 151 141 140 141C127 140 120 131 121 116Z" fill="#efd0ae"/>
 <path d="M127 114C115 103 110 118 120 123" fill="#efd0ae"/>
 <circle cx="153" cy="109" r="2" fill="#244f4f"/>
 <path d="M152 126Q156 128 159 125" fill="none" stroke="#b77e62" stroke-width="1.5" stroke-linecap="round"/>
 <g class="xh-arm-rest"><path d="M148 170L158 199L180 215" fill="none" stroke="#edcdab" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="M145 161L154 176" fill="none" stroke="#fff6df" stroke-width="19" stroke-linecap="round"/></g>
 <g class="xh-arm-think"><path d="M147 171L172 191L159 146" fill="none" stroke="#edcdab" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M145 161L155 175" fill="none" stroke="#fff6df" stroke-width="19" stroke-linecap="round"/><path d="M159 147L157 137" fill="none" stroke="#edcdab" stroke-width="9" stroke-linecap="round"/></g>
 <path d="M49 225C51 210 74 210 86 223C99 238 102 273 99 290C73 292 56 283 52 266Z" fill="#91b9a5"/>
 <path d="M55 227C60 219 72 219 80 227" fill="none" stroke="#b3d0b9" stroke-width="5" stroke-linecap="round"/>
 </g>
 <!-- Projector: two reels, one body and a small lens. -->
 <path d="M219 285V297M247 285V297" stroke="#426f67" stroke-width="5" stroke-linecap="round"/>
 <circle cx="220" cy="247" r="14" fill="#547e72"/><circle cx="244" cy="247" r="12" fill="#547e72"/>
 <circle cx="220" cy="247" r="5" fill="#bed2bb"/><circle cx="244" cy="247" r="4" fill="#bed2bb"/>
 <rect x="207" y="257" width="46" height="31" rx="8" fill="#315e58"/>
 <path d="M252 264L263 259V280L252 275Z" fill="#7fa58e"/>
 <path d="M218 268H237M218 275H232" stroke="#72998a" stroke-width="3" stroke-linecap="round"/>
</svg>`;

export const heroHorizon = `<div class="xh-horizon" aria-hidden="true"><svg width="1600" height="120" viewBox="0 0 1600 120" preserveAspectRatio="none"><path d="M0 48C360 13 700 76 1040 52S1410 35 1600 46V120H0Z" fill="#e6eee0"/><path d="M0 77C430 106 760 57 1110 79S1430 105 1600 84V120H0Z" fill="#fbfaf3"/></svg></div>`;
