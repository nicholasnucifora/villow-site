import { icons, feedIds, initialSaved, feedCard, savedCard } from './h-data.js';
export function renderH(){
return `<section class="h-opening" aria-labelledby="h-title">
<div class="h-intro h-width"><h1 id="h-title">YouTube,<br> <span>shaped by you.</span></h1><div class="h-intro-copy"><p>Villow gives you a finite YouTube feed and boundaries you choose. Sort what arrives, save what interests you, and see where your time goes.</p><a class="h-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started ${icons.arrow}</a></div></div>
<div class="feed-stage h-width">
<div class="feed-frame">
<div class="feed-toolbar"><div class="feed-heading"><span class="feed-dot" aria-hidden="true"></span><h2>Subscription Videos</h2><span class="sample-label">Interactive sample</span></div><a class="saved-indicator" href="#watch-later">${icons.clock}<span>Watch Later</span><span class="saved-count" data-saved-count>1</span></a></div>
<div class="feed-instructions"><p>Keep what interests you.<br class="mobile-break"> Remove what doesn’t.</p><div class="action-key" aria-label="Sample feed actions"><span>${icons.clock} Add to Watch Later</span><span>${icons.trash} Remove</span></div></div>
<div class="feed-deck" data-feed-deck><div class="feed-grid" data-feed-grid>${feedIds.map(feedCard).join('')}</div><div class="feed-complete" data-feed-complete hidden><span class="complete-icon">${icons.check}</span><h3>A little room for what’s next.</h3><p>You’ve sorted this sample feed.<br><span data-complete-copy>Your saved videos are waiting below.</span></p><a href="#watch-later">See your Watch Later ${icons.arrow}</a></div></div>
<div class="mobile-deck-navigation"><p data-deck-position>1 of 3 sample videos</p><button type="button" data-action="next">Next video ${icons.arrow}</button></div>
<div class="feed-end"><span>${icons.check} This feed has an end.</span><p>You choose its size in Villow.</p></div>
<div class="demo-feedback"><div class="feedback-message"><span data-feedback-icon>${icons.arrow}</span><p data-feedback-message>Try the clock or bin on a video.</p><button type="button" class="undo-button" data-action="undo" hidden>${icons.undo} Undo</button></div><button type="button" class="reset-demo" data-action="reset">Reset demo</button></div>
</div>
<p class="touch-hint">Swipe right to save. Left to remove. Buttons work too.</p>
</div>
</section>
<section class="h-later" id="watch-later" aria-labelledby="later-title">
<div class="h-width"><div class="later-intro"><div><span class="section-kicker">YOUR CHOICES CARRY THROUGH</span><h2 id="later-title">Watch Later.<br><span>On your terms.</span></h2></div><div class="later-copy"><p>Save it above. Find it here.</p><p>Keep videos for another time, with reminders to revisit older saved videos.</p></div></div>
<div class="library-heading"><p>${icons.clock}<span>Your Watch Later</span><span data-saved-count>1</span></p><div class="library-controls"><span class="library-sample-label">Starts with one sample video</span><button type="button" class="undo-button" data-action="undo" hidden>${icons.undo} Undo</button></div></div>
<div class="saved-grid" data-saved-grid>${initialSaved.map(savedCard).join('')}</div>
<div class="saved-empty" data-saved-empty hidden><p>Your Watch Later is clear.</p><span>Save a video in the sample feed above, or reset the demo.</span></div>
<div class="broader-promise"><h3>A little more say<br> in how you watch.</h3><p>Choose your channels, filter what arrives and set viewing limits. After watching, optional reflection helps you notice what felt worthwhile.</p><a href="https://villow.app/features" target="_blank" rel="noopener">Explore Villow ${icons.arrow}</a></div>
</div></section>
<p class="h-preview-note h-width">Interactive homepage study · Sample videos from the supplied Villow screenshots</p>
<div class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-announcement></div>`;
}

