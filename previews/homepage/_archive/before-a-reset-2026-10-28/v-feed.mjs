import {renderNOverview} from './n-overview.mjs';
import {renderTSwipeCue} from './t-swipe-cue.mjs';
const chevron=direction=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction==='previous'?'m14 5-7 7 7 7':'m10 5 7 7-7 7'}"/></svg>`;
export function renderVFeed(){
 const overview=renderNOverview(),start=overview.indexOf('<section class="ifs-section'),end=overview.indexOf('</section>',start)+10;
 let feed=overview.slice(start,end).replace('class="ifs-section no-feed"','class="ifs-section no-feed vf-demo"').replace('data-ifs-demo','data-ifs-demo data-vf-demo');
 feed=feed.replace('Interactive example · Sample videos','Interactive illustration · Sample videos');
 feed=feed.replace('Find it now.<br>Watch it later.','A feed you<br>can finish.');
 feed=feed.replace('Channels you follow, saved YouTube videos and recommendations. Shape a finite selection, and keep a pick for later.','Channels you follow, videos you save and discoveries you choose. Watch from your feed. Save only if you want to.');
 feed=feed.replace('<span class="no-feed-count">5 sample videos</span>','<span class="no-feed-count" data-vf-total>5 sample videos</span>');
 feed=feed.replace('<div class="ifs-stack-space">','<div class="vf-finite" aria-label="This illustrative selection contains five videos and has an ending"><span class="vf-finite-dots" data-vf-dots aria-hidden="true"><i class="is-current"></i><i></i><i></i><i></i><i></i></span><span>End of selection</span></div><div class="ifs-stack-space">');
 feed=feed.replace(/<div class="ifs-complete"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div class="ifs-bridge"/,`<div class="ifs-complete" data-ifs-complete hidden><h4 tabindex="-1">No videos left<br>in this sample.</h4><p>You can try the selection again.</p><button type="button" data-ifs-action="replay" aria-label="Try the sample again" title="Try again">${chevron('previous')}</button></div></div></div><div class="ifs-bridge"`);
 const bridge=feed.indexOf('<div class="ifs-bridge"'),feedEnd=feed.lastIndexOf('</div>',bridge);
 const browse=`<div class="vf-browse" data-vf-browse aria-label="Browse the sample" aria-describedby="vf-browse-help"><span class="vf-browse-label">Browse the sample</span><div class="vf-browse-actions"><button type="button" data-vf-previous aria-label="Previous sample video" disabled>${chevron('previous')}</button><span data-vf-position>1 of 5</span><button type="button" data-vf-next aria-label="Next sample video">${chevron('next')}</button></div><p class="vf-end" data-vf-end aria-hidden="true">The end of this selection.</p><p class="sr-only" id="vf-browse-help">These arrows explore the illustration. Browsing does not watch, remove or save a video; you can go back to earlier samples.</p></div><!-- t-swipe-cue:start -->${renderTSwipeCue()}<!-- t-swipe-cue:end -->`;
 feed=feed.slice(0,feedEnd)+browse+feed.slice(feedEnd);
 feed=feed.replace('<h3>Watch Later</h3>','<h3>Watch Later</h3><span class="vf-optional">Optional</span>');
 feed=feed.replace('Your picks. In your own time.','A place for something you want to keep.');
 feed=feed.replace('A feed with an ending. You don’t have to watch everything.','Watch what interests you. The rest can wait.');
 if(!feed.includes('data-vf-next')||feed.includes('ifs-confetti'))throw new Error('V feed rendering failed.');
 return feed;
}
