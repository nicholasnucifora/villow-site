import {defaultFilterTerm,sampleChannel,sampleUploads,normalizeFilterTerm,isUploadInFeed} from './k-filter-data.js';

const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const check='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const minus='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 12h12" stroke-linecap="round"/></svg>';

function highlightedTitle(title,phrase){
 const term=normalizeFilterTerm(phrase);
 if(!term)return esc(title);
 const lower=title.toLowerCase(),needle=term.toLowerCase();
 let cursor=0,result='',index;
 while((index=lower.indexOf(needle,cursor))!==-1){
  result+=esc(title.slice(cursor,index))+`<mark>${esc(title.slice(index,index+term.length))}</mark>`;
  cursor=index+term.length;
 }
 return result+esc(title.slice(cursor));
}

export function renderKFiltering(){
 const count=sampleUploads.filter(video=>isUploadInFeed(video.title,defaultFilterTerm)).length;
 return `<section class="kf-section" id="i-controls" aria-labelledby="kf-heading">
  <div class="kf-heading">
   <span class="kf-kicker">A LITTLE MORE SAY</span>
   <h2 id="kf-heading">Love a channel,<br>but not every upload?</h2>
   <p>Keep following the channel. Filter out uploads whose titles contain a phrase you choose.</p>
  </div>
  <div class="kf-demo" data-kf-demo>
   <p class="kf-demo-label">Interactive demo <span aria-hidden="true">·</span> Sample channel and videos</p>
   <div class="kf-toolbar">
    <div class="kf-channel">
     <span class="kf-avatar" aria-hidden="true">Ss</span>
     <div><h3>${esc(sampleChannel)}</h3><span class="kf-following">${check} Following</span></div>
    </div>
    <div class="kf-filter">
     <label for="kf-term">Title filter <span aria-hidden="true">·</span> <strong>Must exclude</strong></label>
     <div class="kf-input-row"><input id="kf-term" type="text" data-kf-term value="${esc(defaultFilterTerm)}" placeholder="e.g. live" maxlength="80" autocomplete="off" spellcheck="false" aria-describedby="kf-filter-help"><button type="button" data-kf-reset>Reset example</button></div>
     <p id="kf-filter-help">Any title containing this phrase is left out.</p>
    </div>
   </div>
   <div class="kf-result-heading">
    <p><strong data-kf-count>${count} of ${sampleUploads.length}</strong> uploads reach your feed</p>
    <p class="kf-reason" data-kf-reason>Titles containing “${esc(defaultFilterTerm)}” are left out.</p>
   </div>
   <ul class="kf-uploads" aria-label="Sample uploads from ${esc(sampleChannel)}">
    ${sampleUploads.map(video=>{const included=isUploadInFeed(video.title,defaultFilterTerm);return `<li class="kf-card" data-kf-upload="${video.id}" data-kf-in-feed="${included}">
     <div class="kf-thumbnail"><img src="${video.image}" alt="" width="536" height="300" loading="lazy" draggable="false"></div>
     <div class="kf-card-copy"><h3 data-kf-title>${highlightedTitle(video.title,defaultFilterTerm)}</h3><p class="kf-decision"><span class="kf-decision-icon kf-kept-icon">${check}</span><span class="kf-decision-icon kf-left-icon">${minus}</span><span data-kf-decision>${included?'Reaches your feed':'Left out of your feed'}</span></p></div>
    </li>`;}).join('')}
   </ul>
   <span class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-kf-announcement></span>
  </div>
 </section>`;
}
