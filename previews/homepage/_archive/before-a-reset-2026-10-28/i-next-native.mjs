import {paperVideo} from './i-concepts-shared.mjs';

function nativeJourney(){
 return `<div class="in24-scene" role="img" aria-label="Real Villow video-length controls above a sample video, followed by Villow’s optional worth-your-time reflection.">
  <div class="in24-filter"><img src="assets/i-product-duration.webp" width="480" height="155" alt="Video lengths: an example range of 2 to 20 minutes"></div>
  <div class="in24-video">${paperVideo('comedy',{caption:false})}</div>
  <div class="in24-reflect"><img src="assets/i-product-reflection.webp" width="592" height="224" alt="Was it worth your time? Not worth it, Not sure, or Worth it."></div>
 </div>`;
}

export const nextNative=[
 {key:'flow-native',render:nativeJourney},
 {key:'flow-open',render:()=>'<div class="in25-open" aria-hidden="true"></div>'},
];
