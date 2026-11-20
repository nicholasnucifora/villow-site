// Illustrative Villow-only playback across the same 30 completed calendar days.
// Weighted daily time: (22 + 28 + 18 + 28) * 7 + 24 * 2 = 720 minutes.
// Decisive reflection: 24 Worth it / (24 Worth it + 6 Not worth it) = 80%.
const periods=[['1–7',22],['8–14',28],['15–21',18],['22–28',28],['29–30',24]];
const hours=[['12–4am',0],['4–8am',1],['8am–12pm',4],['12–4pm',3],['4–8pm',10],['8pm–12am',6]];
const trendPoints=periods.map(([,minutes],index)=>[60+index*120,180-minutes*6]);
const trendLine=trendPoints.map(([x,y],index)=>`${index?'L':'M'}${x} ${y}`).join(' ');
const grid=()=>[0,90,180].map(y=>`<line class="mo-chart-grid" x1="0" x2="600" y1="${y}" y2="${y}" stroke="#d8e3d4" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');

function overTime(){
 return `<div class="mo-chart-view" id="mo-chart-over-time" data-mo-chart-panel="over-time">
  <div class="mo-chart-y-labels" aria-hidden="true"><span>30 min</span><span>15 min</span><span>0</span></div>
  <svg class="mo-chart-canvas" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-labelledby="mo-over-time-title">
   <title id="mo-over-time-title">Sample average daily app time, 1–30 September. 1–7 September: 22 minutes a day; 8–14: 28 minutes; 15–21: 18 minutes; 22–28: 28 minutes; 29–30: 24 minutes. Across all 30 days: 24 minutes a day.</title>
   ${grid()}
   <path class="mo-trend-area" d="${trendLine} L540 180 L60 180 Z" fill="#deead8"/>
   <path class="mo-trend-line" d="${trendLine}" fill="none" stroke="#397c65" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="100" vector-effect="non-scaling-stroke"/>
   ${trendPoints.map(([cx,cy])=>`<circle class="mo-trend-point" cx="${cx}" cy="${cy}" r="4" fill="#397c65"/>`).join('')}
  </svg>
  <div class="mo-chart-x-labels" aria-hidden="true">${periods.map(([label])=>`<span>${label}</span>`).join('')}</div>
 </div>`;
}

function timeOfDay(){
 return `<div class="mo-chart-view" id="mo-chart-time-of-day" data-mo-chart-panel="time-of-day" hidden>
  <div class="mo-chart-y-labels" aria-hidden="true"><span>10 min</span><span>5 min</span><span>0</span></div>
  <svg class="mo-chart-canvas" viewBox="0 0 600 180" preserveAspectRatio="none" role="img" aria-labelledby="mo-time-of-day-title">
   <title id="mo-time-of-day-title">Sample average minutes in each time-of-day range, 1–30 September. Midnight–4am: 0; 4–8am: 1; 8am–noon: 4; noon–4pm: 3; 4–8pm: 10; 8pm–midnight: 6. Total: 24 minutes per calendar day.</title>
   ${grid()}
   ${hours.map(([,minutes],index)=>`<rect class="mo-insight-bar" x="${index*100+26}" y="${180-minutes*18}" width="48" height="${minutes*18}" rx="4" fill="${index===4?'#397c65':'#9bc1a0'}" style="--mo-order:${index}"/>`).join('')}
  </svg>
  <div class="mo-chart-x-labels mo-chart-hour-labels" aria-hidden="true">${hours.map(([label])=>`<span>${label}</span>`).join('')}</div>
 </div>`;
}

export function renderMInsights(){
 return `<div class="mo-insight-visual" data-mo-visual>
  <p class="mo-sample-period">Sample · 1–30 September</p>
  <dl class="mo-insight-summaries">
   <div class="mo-insight-stat">
    <dt>Average daily app time</dt>
    <dd><span class="mo-stat-value"><strong>24</strong><span>min</span></span><span class="mo-stat-detail">Across all 30 days</span></dd>
   </div>
   <div class="mo-insight-stat">
    <dt>Worthwhile</dt>
    <dd><span class="mo-stat-value"><strong>80</strong><span>%</span></span><span class="mo-stat-detail">of Worth it / Not worth it ratings <span class="mo-stat-count">(24 of 30)</span></span></dd>
   </div>
  </dl>
  <figure class="mo-insight-chart" aria-labelledby="mo-chart-measure">
   <div class="mo-chart-heading">
    <p class="mo-chart-measure" id="mo-chart-measure" data-mo-chart-measure>Average daily app time</p>
    <div class="mo-chart-switch" role="group" aria-label="Viewing chart" data-mo-chart-switch hidden>
     <button class="mo-chart-choice" type="button" data-mo-chart-view="over-time" aria-pressed="true" aria-controls="mo-chart-over-time">Over time</button>
     <button class="mo-chart-choice" type="button" data-mo-chart-view="time-of-day" aria-pressed="false" aria-controls="mo-chart-time-of-day">Time of day</button>
    </div>
   </div>
   <div class="mo-insight-chart-space">${overTime()}${timeOfDay()}</div>
   <figcaption class="mo-chart-caption" data-mo-chart-caption aria-live="polite" aria-atomic="true">September · average minutes per day in each date range.</figcaption>
  </figure>
  <p class="mo-insight-note">Reflection is optional. “Not sure” and unrated videos are left out of the percentage.</p>
 </div>`;
}
