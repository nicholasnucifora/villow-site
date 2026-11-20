// Illustrative daily time only; hourly shares use the same sample total.
const dailyMinutes=[20,16,18,28,7,4,14,30,44,52,58,13,12,34,8,6,8,10,3,2,6,46,30,34,32,13,10,42,41,19];
const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const totals=Array(7).fill(0),counts=Array(7).fill(0);
dailyMinutes.forEach((minutes,index)=>{const day=(index+1)%7;totals[day]+=minutes;counts[day]++;});
const dayAverages=totals.map((total,index)=>total/counts[index]);
const dailyAverage=dailyMinutes.reduce((sum,minutes)=>sum+minutes,0)/dailyMinutes.length;
const hourWeights=[.05,.02,0,0,0,.02,.1,.2,.35,.65,.8,.5,.7,.6,.55,.7,1,1.5,2.4,3,2.5,1.6,.7,.2];
const hourWeightTotal=hourWeights.reduce((sum,n)=>sum+n,0);
const hourlyPercentage=hourWeights.map(weight=>(weight/hourWeightTotal*dailyAverage)/60*100);
const worthwhileCounts=[24,26,23,19,16,18,22,20,14,10,13,17,22,25,24,20,17,13,15,21,25,27,24,19,16,18,22,26,24,26];
const worthwhile=worthwhileCounts.map(count=>count/30*100);
const round=n=>Math.round(n*100)/100;

// Monotone Hermite curves preserve genuine dips and rises without overshoot.
function smoothPath(values,width,height,max){
 const points=values.map((value,index)=>({x:index*width/(values.length-1),y:height-value/max*height}));
 const slopes=points.slice(1).map((point,index)=>(point.y-points[index].y)/(point.x-points[index].x));
 const tangents=points.map((point,index)=>index===0?slopes[0]:index===points.length-1?slopes.at(-1):slopes[index-1]*slopes[index]<=0?0:2/(1/slopes[index-1]+1/slopes[index]));
 return points.map((point,index)=>{
  if(!index)return `M${round(point.x)} ${round(point.y)}`;
  const previous=points[index-1],third=(point.x-previous.x)/3;
  return `C${round(previous.x+third)} ${round(previous.y+tangents[index-1]*third)} ${round(point.x-third)} ${round(point.y-tangents[index]*third)} ${round(point.x)} ${round(point.y)}`;
 }).join(' ');
}
const grid=(height=180,kind='no-chart-grid')=>[0,height/2,height].map(y=>`<line class="${kind}" x1="0" x2="600" y1="${y}" y2="${y}" stroke="#dce5d6" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');

function dayOfWeek(){
 return `<div class="no-chart-view" id="no-chart-day-of-week" data-no-chart-panel="day-of-week">
  <div class="no-chart-y-labels" aria-hidden="true"><span>40 min</span><span>20 min</span><span>0</span></div>
  <svg class="no-chart-canvas" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-labelledby="no-day-title">
   <title id="no-day-title">Illustrative average daily app time by weekday: ${days.map((day,index)=>`${day} ${round(dayAverages[index])} minutes`).join('; ')}.</title>
   ${grid()}
   ${dayAverages.map((minutes,index)=>`<rect class="no-day-bar" x="${round(index*600/7+22)}" y="${round(180-minutes/40*180)}" width="${round(600/7-44)}" height="${round(minutes/40*180)}" rx="4" fill="${index===4?'#458267':'#719a7b'}" style="--no-order:${index}"/>`).join('')}
  </svg>
  <div class="no-chart-x-labels no-day-labels" aria-hidden="true">${days.map(day=>`<span>${day}</span>`).join('')}</div>
 </div>`;
}

function timeOfDay(){
 const values=[...hourlyPercentage,hourlyPercentage[0]],path=smoothPath(values,600,180,10);
 return `<div class="no-chart-view" id="no-chart-time-of-day" data-no-chart-panel="time-of-day" hidden>
  <div class="no-chart-y-labels" aria-hidden="true"><span>10%</span><span>5%</span><span>0%</span></div>
  <svg class="no-chart-canvas" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-labelledby="no-time-title">
   <title id="no-time-title">Illustrative likelihood of watching across a day. Percentages are the average share of each clock-hour spent watching, not the percentage of days with any activity. Little overnight use, a small morning rise, and the strongest viewing around 7pm at ${round(Math.max(...hourlyPercentage))}%.</title>
   ${grid()}
   <path class="no-time-area" d="${path} L600 180 L0 180 Z" fill="#e1ebd9"/>
   <path class="no-time-line" d="${path}" fill="none" stroke="#458267" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="100" vector-effect="non-scaling-stroke"/>
  </svg>
  <div class="no-chart-x-labels no-time-labels" aria-hidden="true"><span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span></div>
 </div>`;
}

function historyTrend({kind,title,values,max,ticks,description}){
 const path=smoothPath(values,600,130,max);
 return `<figure class="no-history-trend no-history-trend-${kind}" aria-labelledby="no-history-${kind}-heading">
  <h3 class="no-history-title" id="no-history-${kind}-heading">${title}</h3>
  <div class="no-history-plot">
   <div class="no-history-y-labels" aria-hidden="true">${ticks.map(label=>`<span>${label}</span>`).join('')}</div>
   <svg class="no-history-canvas" viewBox="0 0 600 130" preserveAspectRatio="none" role="img" aria-labelledby="no-history-${kind}-title">
    <title id="no-history-${kind}-title">${description}</title>
    ${grid(130,'no-history-grid')}
    <path class="no-history-line" d="${path}" fill="none" stroke="${kind==='time'?'#659578':'#73935f'}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" pathLength="100" vector-effect="non-scaling-stroke"/>
   </svg>
  </div>
  <figcaption class="no-history-time">Time →</figcaption>
 </figure>`;
}

export function renderNInsights(){
 return `<div class="no-insights" data-no-visual>
  <figure class="no-main-chart" aria-labelledby="no-chart-measure">
   <div class="no-chart-heading"><p class="no-chart-measure" id="no-chart-measure" data-no-chart-measure>Average minutes per day</p><div class="no-chart-switch" role="group" aria-label="Viewing chart" data-no-chart-switch hidden><button class="no-chart-choice" type="button" data-no-chart-view="day-of-week" aria-pressed="true" aria-controls="no-chart-day-of-week">Day of week</button><button class="no-chart-choice" type="button" data-no-chart-view="time-of-day" aria-pressed="false" aria-controls="no-chart-time-of-day">Time of day</button></div></div>
   <div class="no-chart-space">${dayOfWeek()}${timeOfDay()}</div>
   <figcaption class="no-chart-caption" data-no-chart-caption aria-live="polite" aria-atomic="true">Daily app-time averages by weekday.</figcaption>
  </figure>
 </div>`;
}

export function renderNTrends(){
 return `<div class="no-history" id="n-trends" data-no-visual>
  <div class="no-history-charts">
   ${historyTrend({kind:'time',title:'Daily app time',values:dailyMinutes,max:60,ticks:['60 min','30 min','0'],description:`Illustrative daily app-time trend with pronounced rises and dips. Values range from ${Math.min(...dailyMinutes)} to ${Math.max(...dailyMinutes)} minutes, with quieter periods and busier periods. No cause is assigned to those changes.`})}
   ${historyTrend({kind:'worthwhile',title:'Videos worth watching',values:worthwhile,max:100,ticks:['100%','50%','0%'],description:'Illustrative worthwhile-rating trend, moving between 33% and 90% with several declines and recoveries. Each point is an illustrative snapshot of Worth it ratings out of 30 Worth it or Not worth it ratings. Unrated and Not sure videos are excluded.'})}
  </div>
  <p class="no-history-note">Illustrative trends · Reflection is optional. “Not sure” and unrated videos are excluded from the worthwhile trend.</p>
 </div>`;
}
