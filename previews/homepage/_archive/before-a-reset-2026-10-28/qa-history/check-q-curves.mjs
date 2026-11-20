import assert from 'node:assert/strict';
import {qViews,qPath,qSample,qGeometry} from '../q-insights-data.js';
let checked=0,maxError=0;
for(const view of qViews.filter(v=>!v.bars)){
 const d=qPath(view),initial=Number(/^M0 ([\d.-]+)/.exec(d)[1]);
 const segments=[...d.matchAll(/C([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+) ([\d.-]+)/g)].map(m=>m.slice(1).map(Number));
 let y0=initial;
 for(let i=0;i<segments.length;i++){
  const [,y1,,y2,,y3]=segments[i];
  for(let step=0;step<=100;step++){
   const t=step/100,u=1-t,fraction=(i+t)/segments.length;
   const drawnY=u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3;
   const value=qSample(view.curve,fraction);
   const markerY=qGeometry.bottom-value/view.max*(qGeometry.bottom-qGeometry.top);
   const error=Math.abs(drawnY-markerY);maxError=Math.max(maxError,error);
   assert(error<.002,`${view.key}: marker off drawn curve`);
   assert(value>=Math.min(view.values[i],view.values[i+1])-1e-8&&value<=Math.max(view.values[i],view.values[i+1])+1e-8,`${view.key}: overshoot`);
   checked++;
  }
  y0=y3;
 }
}
console.log(JSON.stringify({checked,maxSvgUnitError:maxError,passed:true}));
