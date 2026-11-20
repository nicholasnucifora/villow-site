import {pViews} from './p-insights-data.js';
export const rGeometry={width:600,height:286,top:66,bottom:276};
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
export const rRound=n=>Math.round(n*1000)/1000;
export function rCurve(values){
 const slopes=values.slice(1).map((v,i)=>v-values[i]);
 const tangents=values.map((_,i)=>i===0?slopes[0]:i===values.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
 return {values,tangents};
}
export function rSample(curve,fraction){
 const {values,tangents}=curve,position=clamp(fraction)*(values.length-1),i=Math.min(values.length-2,Math.floor(position)),t=position-i;
 const t2=t*t,t3=t2*t;
 return (2*t3-3*t2+1)*values[i]+(t3-2*t2+t)*tangents[i]+(-2*t3+3*t2)*values[i+1]+(t3-t2)*tangents[i+1];
}
// 119 illustrative calendar days: 29 establish a full window before the 90-day plot.
// Each plotted value follows rollingUsageHistory.ts: rounded seconds / covered calendar days.
export const rDailyMinutes=Array.from({length:119},(_,i)=>{
 const base=i<29?38:i<54?12:i<89?54:24;
 return Math.max(0,Math.round(base+5*Math.sin(i*1.19)+3*Math.cos(i*.57)));
});
export const rRollingMinutes=rDailyMinutes.map((_,i)=>{
 const window=rDailyMinutes.slice(Math.max(0,i-29),i+1);
 return Math.round(window.reduce((total,min)=>total+min*60,0)/window.length)/60;
}).slice(29);
// Recent 30 decisive ratings, with partial oldest-day sampling as in worthWatchingTrend.ts.
export const rRatingDays=Array.from({length:104},(_,i)=>{
 const period=i<26?2:i<49?0:i<77?3:2;
 const yes=Math.max(0,Math.min(3,period+(i%7===0?1:0)-(i%5===0?1:0)));
 return {yes,no:3-yes};
});
function rollingWorth(days){
 return days.map((_,i)=>{
  let remaining=30,yes=0,total=0;
  for(let j=i;j>=0&&remaining>0;j--){
   const count=days[j].yes+days[j].no,take=Math.min(remaining,count);
   yes+=days[j].yes*(take/count);total+=take;remaining-=take;
  }
  return Math.round(yes/total*1000)/10;
 }).slice(-90);
}
export const rViews=pViews.map(view=>{
 const data=view.key==='time'?{...view,measure:'Average daily app time',values:rRollingMinutes,ticks:['60 min','30 min','0'],xLabels:['Earlier','More recently'],caption:'Average daily app time over the previous 30 calendar days.',description:'Illustrative ninety-day trend of average daily app time. Each point averages the previous thirty calendar days, including zero-use days. App time includes watching and browsing.'}:view.key==='worth'?{...view,values:rollingWorth(rRatingDays),description:'Illustrative ninety-day trend of worthwhile feedback based on the most recent thirty Worth it and Not worth it ratings. Not sure and unrated videos are excluded. Reflection is optional.'}:{...view};
 return {...data,curve:rCurve(data.values)};
});
export function rPath(view){
 const {width,top,bottom}=rGeometry,amp=bottom-top,values=view.values,tangents=view.curve.tangents,dx=width/(values.length-1);
 const y=v=>bottom-v/view.max*amp;
 return values.map((v,i)=>!i?`M0 ${rRound(y(v))}`:`C${rRound((i-1+1/3)*dx)} ${rRound(y(values[i-1]+tangents[i-1]/3))} ${rRound((i-1/3)*dx)} ${rRound(y(v-tangents[i]/3))} ${rRound(i*dx)} ${rRound(y(v))}`).join(' ');
}
export function rTime(fraction){
 const minute=Math.round(clamp(fraction)*1440);
 if(minute===1440)return '12:00am (next day)';
 const h=Math.floor(minute/60),m=minute%60;
 return `${h%12||12}:${String(m).padStart(2,'0')}${h<12?'am':'pm'}`;
}
export function rInspect(view,fraction){
 fraction=clamp(fraction);
 let value,label,unit;
 if(view.bars){const i=Math.min(view.values.length-1,Math.floor(fraction*view.values.length));fraction=(i+.5)/view.values.length;value=view.values[i];label=view.labels[i];unit='min/day';}
 else{
  value=rSample(view.curve,fraction);
  if(view.key==='day'){label=rTime(fraction);unit='chance of watching';}
  else if(view.key==='time'){label='30-day average';unit='min/day';}
  else{label='Recent 30 ratings';unit='worth watching';}
 }
 const display=view.unit==='%'?`${Math.round(value)}%`:String(Math.round(value));
 return {fraction,value,label,display,unit};
}
