// The S composition changes only plotting headroom. R remains the factual data source.
export {rViews as sViews,rInspect as sInspect,rRound as sRound} from './r-insights-data.js';
import {rGeometry,rRound} from './r-insights-data.js';
export const sGeometry={...rGeometry,top:96};
export function sPath(view){
 const {width,top,bottom}=sGeometry,amp=bottom-top,values=view.values,tangents=view.curve.tangents,dx=width/(values.length-1);
 const y=v=>bottom-v/view.max*amp;
 return values.map((v,i)=>!i?`M0 ${rRound(y(v))}`:`C${rRound((i-1+1/3)*dx)} ${rRound(y(values[i-1]+tangents[i-1]/3))} ${rRound((i-1/3)*dx)} ${rRound(y(v-tangents[i]/3))} ${rRound(i*dx)} ${rRound(y(v))}`).join(' ');
}
