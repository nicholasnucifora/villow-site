import {icons,initialSaved,savedMarkup} from './i-data.js';

export function renderILibrary(){
  return `<div class="i-library" id="watch-later" aria-labelledby="i-later-title">
<div class="i-library-intro"><div><span class="i-section-label">WATCH LATER</span><h2 id="i-later-title">Kept for<br>another time.</h2></div><div><p>Your choices above carry through here.</p><span>Watch Later starts with one sample video. Add your own picks from the stack.</span></div></div>
<div class="i-library-bar"><p>${icons.clock} Your Watch Later <b data-i-saved-count>1</b></p></div>
<div class="i-saved-grid" data-i-saved-grid>${initialSaved.map(savedMarkup).join('')}</div>
<div class="i-saved-empty" data-i-empty hidden><h3 tabindex="-1">A little breathing room.</h3><p>Save something from the stack when you want to keep it.</p></div>
<p class="i-library-note">Choose a reminder to revisit older saved videos when you’re ready.</p>
</div>`;
}
