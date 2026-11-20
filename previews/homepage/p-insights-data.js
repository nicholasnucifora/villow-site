const daily=[20,16,18,28,7,4,14,30,44,52,58,13,12,34,8,6,8,10,3,2,6,46,30,34,32,13,10,42,41,19];
const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const totals=Array(7).fill(0),counts=Array(7).fill(0);
daily.forEach((value,index)=>{const d=(index+1)%7;totals[d]+=value;counts[d]++;});
const means=totals.map((total,i)=>total/counts[i]);
const weights=[.05,.02,0,0,0,.02,.1,.2,.35,.65,.8,.5,.7,.6,.55,.7,1,1.5,2.4,3,2.5,1.6,.7,.2];
const average=daily.reduce((s,n)=>s+n,0)/daily.length,weightTotal=weights.reduce((s,n)=>s+n,0);
const hours=weights.map(w=>w/weightTotal*average/60*100);
const decisive=[24,26,23,19,16,18,22,20,14,10,13,17,22,25,24,20,17,13,15,21,25,27,24,19,16,18,22,26,24,26];
const timeLabel=i=>i===24?'12am (next day)':i===0?'12am':i<12?`${i}am`:i===12?'12pm':`${i-12}pm`;
export const pViews=[
 {key:'day',label:'Time of day',measure:'Chance of watching',max:10,ticks:['10%','5%','0%'],xLabels:['12am','6am','12pm','6pm','12am'],values:[...hours,hours[0]],labels:Array.from({length:25},(_,i)=>`${timeLabel(i)}–${timeLabel(i+1>24?1:i+1)}`),unit:'%',caption:'Average share of each hour spent watching.',description:'Sample hourly watching pattern with a small morning rise and a stronger evening peak. Percentages represent average time spent watching within each hour.'},
 {key:'week',label:'Day of week',measure:'Average daily app time',max:40,ticks:['40 min','20 min','0'],xLabels:days,values:means,labels:days,unit:'min',bars:true,caption:'Average app time for each day of the week.',description:'Sample average daily app time by weekday, with quieter weekends.'},
 {key:'time',label:'Time spent',measure:'Daily app time',max:60,ticks:['60 min','30 min','0'],xLabels:['Day 1','Day 15','Day 30'],values:daily,labels:daily.map((_,i)=>`Day ${i+1}`),unit:'min',caption:'A sample month, including quieter and busier stretches.',description:'Sample app time across thirty days, ranging from two to fifty-eight minutes.'},
 {key:'worth',label:'Worthwhile',measure:'Videos rated worth watching',max:100,ticks:['100%','50%','0%'],xLabels:['Earlier','More recently'],values:decisive.map(n=>n/30*100),labels:decisive.map(n=>`${n} worth it · ${30-n} not worth it`),unit:'%',caption:'Optional ratings · “Not sure” and unrated videos are excluded.',description:'Illustrative worthwhile-rating snapshots. Every point is Worth it ratings out of thirty Worth it or Not worth it ratings; Not sure and unrated videos are excluded.'}
];
export const pRound=n=>Math.round(n*100)/100;
export function pPath(values,max){
 const points=values.map((v,i)=>({x:i*600/(values.length-1),y:210-v/max*200}));
 const slopes=points.slice(1).map((p,i)=>(p.y-points[i].y)/(p.x-points[i].x));
 const tangents=points.map((p,i)=>i===0?slopes[0]:i===points.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
 return points.map((p,i)=>{if(!i)return `M${pRound(p.x)} ${pRound(p.y)}`;const prev=points[i-1],third=(p.x-prev.x)/3;return `C${pRound(prev.x+third)} ${pRound(prev.y+tangents[i-1]*third)} ${pRound(p.x-third)} ${pRound(p.y-tangents[i]*third)} ${pRound(p.x)} ${pRound(p.y)}`;}).join(' ');
}
export function pValue(view,index){const v=view.values[index];return view.unit==='%'?`${Math.round(v*10)/10}%`:`${Math.round(v*10)/10} min`;}

