import {watchingStories as originalStories} from './v-watching-stories.mjs';

// W shares V's story titles and product labels, with its own examples and art.
const storyDetails = {
  gardener:{
    description:'Builds his subscriptions feed around the videos he actually wants to watch.',
    choices:[
      'Chooses short or long videos, channel by channel.',
      'Uses title filters and playback speeds that suit each channel.',
    ],
    asset:'w-watcher-gardener-v1.webp',
    alt:'A bearded gardener pruning a plant with three video flowers, each joined to its own stem.',
  },
  shorts:{
    description:'Loves scrolling through Shorts and still wants time for longer videos.',
    choices:[
      'Limits Shorts scrolling to 15 minutes a day.',
      'Sets a 45-minute daily limit for all of YouTube.',
    ],
    asset:'w-watcher-shorts-v1.webp',
    alt:'A young man scrolling on a phone while sitting on a cushion; the screen faces him.',
  },
  browser:{
    description:'Likes discovering videos YouTube picks for him, without Shorts or an endless feed.',
    choices:[
      'His home feed ends once he’s seen 100 recommendations that day.',
      'Turns off Shorts on YouTube.',
    ],
    asset:'w-watcher-browser-v4.webp',
    alt:'A young man with short straight hair choosing a recommendation from a small fan of video cards above his laptop.',
  },
  evenings:{
    description:'Keeps weekdays light on YouTube, with more time to watch at the weekend.',
    choices:[
      'Chooses different limits for workdays and weekends.',
      'Schedules time away and a reminder for bed.',
    ],
    asset:'w-watcher-evenings-v1.webp',
    alt:'An older woman looking down at her book, with her phone set aside for the evening.',
  },
};
export const watchingStories = [
  ...['shorts','browser','gardener','evenings'].map(key=>({
    ...originalStories.find(story=>story.key===key),
    ...storyDetails[key],
  })),
  {
    key:'allrounder',title:'The all-rounder',context:'With the Villow app + extension',
    description:'Moves between YouTube and Villow depending on what she feels like watching.',
    choices:[
      'Keeps her viewing progress in sync across devices.',
      'Counts time in the extension and Villow app towards one daily limit.',
    ],
    asset:'w-watcher-allrounder-v6.webp',
    alt:'A woman holds her phone with its back toward us. A small timer rests on her wrist. A potted video plant sits to her left and a tray of suggested videos labelled “For you” sits to her right.',
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
        <figure class="v-watching-art"><img src="assets/${story.asset}" alt="${story.alt}" width="1536" height="1024" decoding="async" ${i===0?'loading="lazy"':'loading="eager"'}></figure>
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
