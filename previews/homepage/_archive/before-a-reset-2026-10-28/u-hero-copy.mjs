export function renderUHeroCopy(primaryAction){
 if(!primaryAction?.startsWith('<a class="i-primary"'))throw new Error('Expected existing primary action.');
 return `<div class="i-hero-copy u-hero-copy"><p class="u-purpose">A blueprint you can use.</p><h1 id="i-title">Watch<br><span>intentionally.</span></h1><p class="i-lead">Villow is a working example of how YouTube could be designed around the person watching. It’s an app you can use, with a finite feed, boundaries you choose, viewing insights and optional reflection built into the experience.</p>${primaryAction}<p class="u-invitation">Try it, share your feedback, and help make the case for a better YouTube.</p></div>`;
}


