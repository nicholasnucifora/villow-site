// Illustrative people and choices, not testimonials or universal defaults.
export const watchingStories = [
  {
    key:'gardener', title:'The channel gardener', context:'With the Villow app',
    description:'Builds a little collection of channels worth coming back to.',
    choices:['Choose which channels grow in their feed.', 'Tune video lengths, channel by channel.'],
    alt:'A person pruning one small plant with video cards growing like flowers.',
  },
  {
    key:'shorts', title:'The Shorts fan', context:'With the Villow extension',
    description:'A little scrolling, then something longer. There’s room for both.',
    choices:['Choose 20 minutes of Shorts for today.', 'Keep a separate limit for total YouTube time.'],
    alt:'A person on a cushion swiping upward on a phone.',
  },
  {
    key:'browser', title:'The curious browser', context:'With the Villow extension',
    description:'Likes following YouTube’s recommendations to see what turns up.',
    choices:['See up to 40 recommendations a day in this browser.', 'Keep time on YouTube to 30 minutes a day.'],
    alt:'A person with a laptop choosing from a small fan of video cards.',
  },
  {
    key:'evenings', title:'The evening planner', context:'With the Villow app',
    description:'Makes room for videos, and for whatever comes after.',
    choices:['Choose different limits for workdays and weekends.', 'Schedule time away and a reminder for bed.'],
    alt:'A person reading in an armchair, with their phone set aside beneath a crescent moon.',
  },
];

export const watchingStoriesSection = `<section class="v-watching" id="your-control" aria-labelledby="v-watching-title">
  <header class="v-watching-header">
    <h2 id="v-watching-title">Your watching. Your choice.</h2>
    <p>Keep what you enjoy. Choose the boundaries that suit you.<br class="v-desktop-break"> There’s more than one way to make Villow yours.</p>
  </header>
  <div class="v-watching-carousel" role="region" aria-roledescription="carousel" aria-label="Ways to make Villow yours">
    <div class="v-watching-stage" aria-live="off">
      ${watchingStories.map((story,i)=>`<article class="v-watching-story${i===0?' is-current':''}" id="v-watching-story-${story.key}" data-watching-story="${story.key}" role="group" aria-roledescription="slide" aria-label="${i+1} of ${watchingStories.length}: ${story.title}">
        <figure class="v-watching-art"><img src="assets/v-watcher-${story.key}-v2.webp" alt="${story.alt}" width="1536" height="1024" decoding="async" ${i===0?'loading="lazy"':'loading="eager"'}></figure>
        <div class="v-watching-copy">
          <p class="v-watching-context">${story.context}</p>
          <h3>${story.title}</h3>
          <p class="v-watching-description">${story.description}</p>
          <ul class="v-watching-choices">${story.choices.map(choice=>`<li><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M4 10L8 14L16 6"/></svg><span>${choice}</span></li>`).join('')}</ul>
        </div>
      </article>`).join('')}
    </div>
    <div class="v-watching-controls" hidden>
      <div class="v-watching-markers" role="group" aria-label="Choose a story">${watchingStories.map((story,i)=>`<button class="v-watching-marker" type="button" data-watching-select="${story.key}" aria-controls="v-watching-story-${story.key}" aria-label="Show ${story.title.toLowerCase()}" title="${story.title}" aria-pressed="${i===0}"><span aria-hidden="true"></span></button>`).join('')}</div>
      <button class="v-watching-pause" type="button" aria-label="Pause stories" title="Pause stories"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path class="v-pause-shape" d="M7 5V15M13 5V15"/><path class="v-play-shape" d="M7 4L15 10L7 16Z"/></svg></button>
    </div>
    <span class="v-watching-announcement" role="status" aria-live="polite"></span>
  </div>
</section>`;
