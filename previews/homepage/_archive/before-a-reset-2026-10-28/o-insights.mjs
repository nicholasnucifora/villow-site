const daily=[20,16,18,28,7,4,14,30,44,52,58,13,12,34,8,6,8,10,3,2,6,46,30,34,32,13,10,42,41,19];
const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const totals=Array(7).fill(0),counts=Array(7).fill(0);
daily.forEach((value,index)=>{const day=(index+1)%7;totals[day]+=value;counts[day]++;});
const means=totals.map((total,index)=>total/counts[index]);
const average=daily.reduce((sum,n)=>sum+n,0)/daily.length;
const weights=[.05,.02,0,0,0,.02,.1,.2,.35,.65,.8,.5,.7,.6,.55,.7,1,1.5,2.4,3,2.5,1.6,.7,.2];
const hourly=weights.map(w=>w/weights.reduce((s,n)=>s+n,0)*average/60*100);
const worth=[24,26,23,19,16,18,22,20,14,10,13,17,22,25,24,20,17,13,15,21,25,27,24,19,16,18,22,26,24,26].map(n=>n/30*100);
const round=n=>Math.round(n*100)/100;
function path(values,max){
 const points=values.map((v,i)=>({x:10+i*580/(values.length-1),y:176-v/max*156}));
 const slopes=points.slice(1).map((p,i)=>(p.y-points[i].y)/(p.x-points[i].x));
 const tangents=points.map((p,i)=>i===0?slopes[0]:i===points.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
 return points.map((p,i)=>{if(!i)return `M${round(p.x)} ${round(p.y)}`;const previous=points[i-1],third=(p.x-previous.x)/3;return `C${round(previous.x+third)} ${round(previous.y+tangents[i-1]*third)} ${round(p.x-third)} ${round(p.y-tangents[i]*third)} ${round(p.x)} ${round(p.y)}`;}).join(' ');
}
const grid='<line class="oi-grid" x1="10" x2="590" y1="98" y2="98"/><line class="oi-baseline" x1="10" x2="590" y1="176" y2="176"/>';
function curve(view){const d=path(view.values,view.max);return `<svg class="oi-canvas" viewBox="0 0 600 190" preserveAspectRatio="none" role="img" aria-labelledby="oi-${view.key}-title"><title id="oi-${view.key}-title">${view.description}</title>${grid}<path class="oi-area" d="${d} L590 176 L10 176 Z"/><path class="oi-line" d="${d}" pathLength="100"/></svg>`;}
function weekday(){return `<svg class="oi-canvas" viewBox="0 0 600 190" preserveAspectRatio="none" role="img" aria-labelledby="oi-week-title"><title id="oi-week-title">Illustrative daily app time by weekday. Friday is highest, with quieter weekends. Average daily minutes: ${days.map((d,i)=>`${d} ${round(means[i])}`).join('; ')}.</title>${grid}${means.map((v,i)=>`<rect class="oi-bar" x="${23+i*84}" y="${round(176-v/40*156)}" width="46" height="${round(v/40*156)}" rx="5" style="--oi-order:${i}"/>`).join('')}</svg><div class="oi-weekdays" aria-hidden="true">${days.map(d=>`<span>${d}</span>`).join('')}</div>`;}
const views=[
 {key:'day',label:'Across the day',caption:'An evening habit becomes easy to spot.',description:'Illustrative chance of watching throughout a day. The curve shows the average percentage of each hour spent watching, with little overnight activity and a clear evening peak.',values:[...hourly,hourly[0]],max:8},
 {key:'week',label:'Day of week',caption:'Some days leave more room for watching than others.'},
 {key:'time',label:'Time spent',caption:'Notice the quieter stretches and the busier ones.',description:'Illustrative app-time trend across successive days, with distinct rises, dips and a sustained quiet period. This is sample data, with no cause assigned to any change.',values:daily,max:60},
 {key:'worth',label:'Worthwhile',caption:'Reflect if you want to. See what felt worth your time.',description:'Illustrative worthwhile-rating trend, with several declines and recoveries. Each point shows Worth it ratings out of thirty Worth it or Not worth it ratings. Not sure and unrated videos are excluded.',values:worth,max:100},
];
export function renderOInsights(){return `<div class="oi-insights" data-oo-visual><figure class="oi-figure" aria-label="Explore illustrative viewing patterns"><div class="oi-figure-top"><span class="oi-measure" data-oi-measure>Chance of watching</span><span class="oi-example">Illustrative patterns</span></div><div class="oi-chart-space">${views.map((view,i)=>`<div class="oi-view" id="oi-view-${view.key}" data-oi-panel="${view.key}"${i?' hidden':''}>${view.key==='week'?weekday():curve(view)}</div>`).join('')}</div><div class="oi-axis" aria-hidden="true"><span data-oi-axis>Across the day</span><span>→</span></div><div class="oi-switch" role="group" aria-label="Choose a viewing pattern" data-oi-switch hidden>${views.map((view,i)=>`<button type="button" data-oi-view="${view.key}" aria-pressed="${!i}" aria-controls="oi-view-${view.key}">${view.label}</button>`).join('')}</div><figcaption class="oi-caption" data-oi-caption aria-live="polite" aria-atomic="true">${views[0].caption}</figcaption><p class="oi-rating-note" data-oi-rating-note hidden>Optional ratings · “Not sure” and unrated videos are excluded.</p></figure></div>`;}

