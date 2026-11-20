import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),file=new URL('a-source.html',root);
let html=await readFile(file,'utf8');
const pieces=Array.from({length:18},(_,i)=>{const angle=i*2.399963,radius=112+(i%4)*15;const x=Math.round(Math.cos(angle)*radius),y=Math.round(Math.sin(angle)*radius);return `<i style="--piece-x:${x}px;--piece-y:${y}px;--piece-turn:${i*61-180}deg;--piece-delay:${i%5*28}ms;--piece-color:${['#83aa89','#d6ba77','#afcbb7','#5f9274'][i%4]}"></i>`;}).join('');
const ending=`<div class="ifs-complete wf-complete" data-wf-complete hidden><div class="wf-confetti" aria-hidden="true">${pieces}</div><span class="wf-finish-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m8 16 5 5 11-12"/></svg></span><h3 tabindex="-1">All caught up.</h3><p>Room for what’s next.</p></div>`;
html=html.replace(/<div class="ifs-complete wf-complete"[\s\S]*?<\/div>/,ending);
html=html.replace(/<p class="wf-feedback"[^>]*><\/p>/,'');
html=html.replace(/<p class="ifs-kicker">Interactive illustration · Sample videos<\/p>/,'');
html=html.replace(/<figcaption class="rt-caption">[\s\S]*?<\/figcaption>/,'');
html=html.replace(/<p class="sl-sample">[\s\S]*?<\/p>/,'');
html=html.replace('<span>Illustrative examples</span>','').replace('<small>Sample list</small>','');
html=html.replace('<span class="ics-message-label">Example recommendation</span>','');
html=html.replace('Local previews · Sample videos and settings','Local preview');
html=html.replace(/<figure class="w-device-art"[\s\S]*?<\/figure>/,'<figure class="w-device-art"><img src="assets/a-connected-devices.webp" width="1774" height="887" alt="An illustrated laptop, tablet and phone sharing a mint-green landscape" loading="lazy"></figure>');
// Accessible labels describe the controls directly, without repeating sample labels.
html=html.replaceAll('Cloud cinema — conceptual illustration with sample videos','Cloud cinema')
 .replaceAll('Optional sample reflection','Optional reflection').replaceAll('Your optional sample reflection','Your optional reflection')
 .replaceAll('Save to Watch Later:','Save to Watch Later:').replaceAll('Remove from the example feed:','Remove from your feed:')
 .replaceAll('Preview right and left swipes without changing the sample feed','See right and left swipe gestures without changing the feed')
 .replaceAll('Illustrative viewing patterns','Viewing patterns').replaceAll('Illustrative daily limit:','Daily limit:')
 .replaceAll('Illustrative weekday allowances:','Weekday allowances:').replaceAll('Illustrative break reminder','Break reminder')
 .replaceAll('Illustrative bedtime reminder','Bedtime reminder').replaceAll('Illustrative watch-free time:','Watch-free time:')
 .replaceAll('Illustrative sample data. ','').replaceAll('Sample hourly watching pattern','Hourly watching pattern')
 .replaceAll('Sample average daily viewing','Average daily viewing').replaceAll('Sample: eight days','Eight days')
 .replaceAll('Play the shared cat sample','Play the shared video').replaceAll('Worth it — shared sample','Worth it — shared video')
 .replaceAll('Not worth it — shared sample','Not worth it — shared video').replaceAll('Everyone’s response in this sample room','Everyone’s response')
 .replaceAll('An illustrative shared room: you and Alex watch a short cat sample together, then can share whether it felt worth your time.','You and Alex watch a short video together, then can share whether it felt worth your time.')
 .replaceAll('An example recommendation: a friend shares a comedy video with the note ‘This made me laugh.’ You choose when to watch.','A friend shares a comedy video with the note ‘This made me laugh.’ You choose when to watch.');
if(/data-ifs-action="replay"|data-wf-feedback|rt-caption|Interactive illustration · Sample videos|Sample list/.test(html))throw new Error('Unwanted controls/labels remain');
if(!html.includes('data-wf-complete')||!html.includes('a-connected-devices.webp'))throw new Error('Missing polish markup');
await writeFile(file,html);
console.log('Updated A: terminal confetti, cleaner labels and illustrated devices.');
