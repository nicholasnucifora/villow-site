import {conceptsPageBody} from './concepts-page-a.mjs';
import {researchCitation} from './concepts-citations.mjs';
import {aiConceptIcons} from './concepts-ai-icons.mjs';

// B presents the concepts as open chapters and can add examples of its own.
const chapters = [
 {id:'corrections',label:'Community notes',short:'Community notes',color:'#edf2e5'},
 {id:'creator-actions',label:'A real-world next step',short:'Next steps',color:'#f6edda'},
 {id:'recommendations',label:'Recommendations from people',short:'Discovery',color:'#f3e8dd'},
 {id:'designing-for-kids',label:'Designing for kids',short:'Designing for kids',color:'#f7f4e9'},
 {id:'ai',label:'Exploring technology',short:'AI ideas',color:'#eaf0e3'},
 {id:'trust',label:'Comments, bots and trust',short:'Comments &amp; trust',color:'#eee7d9'},
];
const footerColor = '#e5ebdc';
// Explicit, off-centre crest/trough points give each boundary a flowing swish.
// The second curve mirrors the first; both keep horizontal tangents at the edges.
const curves = [
 'M0 66 C150 66 220 16 410 16 C650 16 730 108 970 108 C1180 108 1280 52 1440 52 L1440 128 L0 128 Z',
 'M0 52 C160 52 260 108 470 108 C710 108 790 16 1030 16 C1220 16 1290 66 1440 66 L1440 128 L0 128 Z',
];
const wave = (color,index) => `<svg class="cb-wave" viewBox="0 0 1440 128" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path fill="${color}" d="${curves[index%curves.length]}"/></svg>`;

const aiIdeas = [
  {
    id:'chapters', icon:'chapters', tabLabel:'Video chapters', title:'Generate chapters for a video',
    benefit:'Chapters can make it easier to find a specific part of a video. Viewers could request chapters on a video that has none. The creator would see how many people asked and could write the chapters or use AI for a draft.',
    caution:'YouTube already allows automatic chapters by default on new uploads. <a class="cb-inline-link" href="https://support.google.com/youtube/answer/9884579?hl=en" target="_blank" rel="noopener">Creators can turn them off in YouTube Studio</a>. Some viewers find that generic headings and poorly placed timestamps make it harder to find what they came for. <a class="cb-inline-link" href="https://www.reddit.com/r/youtube/comments/1wnppn8/theres_aigenerated_chapters_now_ewwwwww/" target="_blank" rel="noopener">Read the viewer discussion on Reddit</a>.',
    stance:'AI drafting should be off by default. The channel creator should decide when to generate a draft, be able to edit the titles and timestamps, and approve what goes live. A note below the chapter list would tell viewers when AI helped draft it.',
  },
  {
    id:'video-conversations', icon:'chat', tabLabel:'Talk with AI', title:'Talk with AI about a video',
    benefit:'Ask questions, unpack an argument or explore sources with an AI that can refer to the video and its transcript. If a conversation raises a potentially misleading claim, it could prompt the viewer to <a class="cb-inline-link" href="#ai-community-notes">consider a community note</a>.',
    caution:'AI can sound confident while missing context or getting things wrong. A chat could also draw attention away from the video and discussion with other people.',
    stance:'Keep it optional, link answers to the video and sources, and make it easy to return to watching. A concern raised in chat should lead to checking the evidence before proposing a note.',
  },
  {
    id:'community-notes', icon:'notes', tabLabel:'AI for community notes', title:'AI for community notes',
    benefitLabel:'Why assistance matters.',
    benefit:'It isn’t realistic to expect viewers to research every video they watch. Finding sources, checking claims and writing a clear note takes time, and the work is voluntary. Notes also need reviewers with different perspectives to weigh in. That is a lot to ask without help.',
    requestedCheck:'AI could find relevant sources, help check claims against them and draft a sourced note. A video’s More menu could offer “Request AI fact-check,” focusing the work on videos viewers want checked.',
    caution:'AI can misread a claim or cite a source that does not support it. Requests would prioritise a check, not prove a video wrong.',
    stance:'Reduce the research burden while keeping people in charge of checking sources and deciding whether a note is helpful. Review from different perspectives would still be essential. <a class="cb-inline-link" href="https://communitynotes.x.com/guide/en/api/overview" target="_blank" rel="noopener">X already accepts AI-written notes for human review</a>.',
  },
];

function aiChapter() {
  return `<div class="concepts-ai-intro cb-ai-intro">
    <h2>Generative AI</h2>
    <p>We think most uses of generative AI are likely to do more harm than good. We’re sceptical that YouTube is getting that balance right today.</p>
    <p>With Villow, we’re exploring how to keep what makes social media worthwhile and reduce the harm it can cause. We’re taking the same approach to generative AI. We’ve come up with three ways it could genuinely help, and each would be optional.</p>
  </div>
  <div class="cb-ai-reader">
    <div class="cb-ai-tabs" role="tablist" aria-label="Generative AI ideas" hidden>
      ${aiIdeas.map(idea => `<button type="button" class="cb-ai-tab" role="tab" id="ai-tab-${idea.id}" aria-controls="ai-${idea.id}">
        <span class="cb-ai-icon" aria-hidden="true">${aiConceptIcons[idea.icon]}</span>
        <span>${idea.tabLabel}</span>
      </button>`).join('')}
    </div>
    <div class="cb-ai-panels">
      ${aiIdeas.map(idea => `<article class="cb-ai-panel" id="ai-${idea.id}">
        <h3>${idea.title}</h3>
        <div class="cb-ai-discussion">
          <div class="cb-ai-benefit">
            <p class="cb-ai-point"><strong>${idea.benefitLabel || 'Benefit.'}</strong> <span>${idea.benefit}</span></p>
            ${idea.requestedCheck ? `<p class="cb-ai-point"><strong>How AI could help.</strong> <span>${idea.requestedCheck}</span></p>` : ''}
          </div>
          <p class="cb-ai-point cb-ai-concern"><strong>Concern.</strong> <span>${idea.caution}</span></p>
          <p class="cb-ai-point cb-ai-stance"><strong>Our take.</strong> <span>${idea.stance}</span></p>
        </div>
      </article>`).join('')}
    </div>
  </div>`;
}

// These three B-only illustrations are demonstrations of proposals, not live features.
const correctionNote = `At 5:47, the video claims this eclipse is happening today. The footage is from 21 August 2017. <a href="https://science.nasa.gov/science-research/heliophysics/2017-total-solar-eclipse-news/" target="_blank" rel="noopener">NASA: the 2017 eclipse</a>`;
const noteRating = name => `<fieldset class="cb-note-rating"><legend>Was this note helpful?</legend><label><input type="radio" name="${name}" value="yes"> Yes</label><label><input type="radio" name="${name}" value="somewhat"> Somewhat</label><label><input type="radio" name="${name}" value="no"> No</label></fieldset>`;
const notesCopyB = `<div class="concepts-copy"><h2>Community notes.</h2><p><a class="cb-inline-link" href="https://support.google.com/youtube/answer/14925346?hl=en" target="_blank" rel="noopener">YouTube already offers notes on videos</a>, but writing them is currently limited to eligible US-based users. We want to see the program expand: research on X suggests notes can reduce the spread of misleading posts.${researchCitation(1)}</p><p>Notes can arrive after a claim has already spread.${researchCitation(2)} When a new note appears, notify people who watched the video in the past two weeks so they can see the correction.</p></div>`;
const designingForKids = `<div class="concepts-expanded-grid">
  <div class="concepts-copy">
    <h2>How could YouTube work better for kids?</h2>
    <p>Building a video app for kids brings extra legal and privacy responsibilities, including how children’s data is handled. It also takes people and funding to review videos and respond to safety concerns over time. That work is beyond what our team can take on, so a kids’ version is outside Villow’s scope.</p>
    <p>We think relying on parental monitoring and controls puts too much of the responsibility on families. The platform itself should help kids find something worthwhile to watch and give them a say in when it’s time to stop.</p>
  </div>
  <div class="cb-clockwise-card">
    <h3>ClockwiseTV</h3>
    <p>ClockwiseTV is trying a different approach for kids aged 8–12. It describes a human-reviewed video library and sessions that kids and parents set together, with a clear stopping point built into the app.</p>
    <p>We haven’t tried it ourselves. We think some of ClockwiseTV’s ideas could work alongside Villow’s, and we’re curious which combination would actually work for kids and families.</p>
    <a class="sp-link" href="https://www.clockwisetv.com/" target="_blank" rel="noopener">Explore ClockwiseTV&nbsp;<span aria-hidden="true">↗</span></a>
  </div>
</div>`;
const firstChapters = {
 'designing-for-kids': designingForKids,
 corrections: `<div class="concepts-expanded-grid">${notesCopyB}<div class="concepts-context-scene" aria-label="Illustration of a video with a community note"><div class="concepts-video-context"><div class="concepts-video"><img src="assets/cb-eclipse.svg" alt="Illustration of an eclipse over mountains" width="536" height="300"><span>Total Solar Eclipse Caught on Camera Today!</span></div><aside class="concepts-note" aria-label="Community note example"><div class="cb-note-heading"><span class="concepts-note-symbol" aria-hidden="true"><svg viewBox="0 0 256 256" fill="currentColor"><path d="M228.75,100.05c-3.52-3.67-7.15-7.46-8.34-10.33-1.06-2.56-1.14-7.83-1.21-12.47-.15-10-.34-22.44-9.18-31.27s-21.27-9-31.27-9.18c-4.64-.07-9.91-.15-12.47-1.21-2.87-1.19-6.66-4.82-10.33-8.34C148.87,20.46,140.05,12,128,12s-20.87,8.46-27.95,15.25c-3.67,3.52-7.46,7.15-10.33,8.34-2.56,1.06-7.83,1.14-12.47,1.21C67.25,37,54.81,37.14,46,46S37,67.25,36.8,77.25c-.07,4.64-.15,9.91-1.21,12.47-1.19,2.87-4.82,6.66-8.34,10.33C20.46,107.13,12,116,12,128S20.46,148.87,27.25,156c3.52,3.67,7.15,7.46,8.34,10.33,1.06,2.56,1.14,7.83,1.21,12.47.15,10,.34,22.44,9.18,31.27s21.27,9,31.27,9.18c4.64.07,9.91.15,12.47,1.21,2.87,1.19,6.66,4.82,10.33,8.34C107.13,235.54,116,244,128,244s20.87-8.46,27.95-15.25c3.67-3.52,7.46-7.15,10.33-8.34,2.56-1.06,7.83-1.14,12.47-1.21,10-.15,22.44-.34,31.27-9.18s9-21.27,9.18-31.27c.07-4.64.15-9.91,1.21-12.47,1.19-2.87,4.82-6.66,8.34-10.33C235.54,148.87,244,140.05,244,128S235.54,107.13,228.75,100.05Zm-17.32,39.29c-4.82,5-10.28,10.72-13.19,17.76-2.82,6.8-2.93,14.16-3,21.29-.08,5.36-.19,12.71-2.15,14.66s-9.3,2.07-14.66,2.15c-7.13.11-14.49.22-21.29,3-7,2.91-12.73,8.37-17.76,13.19C135.78,214.84,130.4,220,128,220s-7.78-5.16-11.34-8.57c-5-4.82-10.72-10.28-17.76-13.19-6.8-2.82-14.16-2.93-21.29-3-5.36-.08-12.71-.19-14.66-2.15s-2.07-9.3-2.15-14.66c-.11-7.13-.22-14.49-3-21.29-2.91-7-8.37-12.73-13.19-17.76C41.16,135.78,36,130.4,36,128s5.16-7.78,8.57-11.34c4.82-5,10.28-10.72,13.19-17.76,2.82-6.8,2.93-14.16,3-21.29C60.88,72.25,61,64.9,63,63s9.3-2.07,14.66-2.15c7.13-.11,14.49-.22,21.29-3,7-2.91,12.73-8.37,17.76-13.19C120.22,41.16,125.6,36,128,36s7.78,5.16,11.34,8.57c5,4.82,10.72,10.28,17.76,13.19,6.8,2.82,14.16,2.93,21.29,3,5.36.08,12.71.19,14.66,2.15s2.07,9.3,2.15,14.66c.11,7.13.22,14.49,3,21.29,2.91,7,8.37,12.73,13.19,17.76,3.41,3.56,8.57,8.94,8.57,11.34S214.84,135.78,211.43,139.34ZM176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51Z"/></svg></span><h3>Community note</h3></div><p class="cb-note-example">${correctionNote}</p>${noteRating("cb-note-inline")}</aside></div><button class="concepts-notification cb-notice" type="button" data-correction-open><span class="cb-notice-dot" aria-hidden="true"></span><span><strong>New context for a video you watched</strong><small>View update</small></span></button></div></div><dialog class="cb-correction-dialog" aria-labelledby="cb-dialog-title"><div class="cb-dialog-head"><h2 id="cb-dialog-title">New context for a video you watched</h2><button type="button" class="cb-dialog-close" aria-label="Close update" data-correction-close><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div><div class="cb-dialog-video"><img src="assets/cb-eclipse.svg" alt="Illustration of an eclipse over mountains" width="536" height="300"><div><strong>Total Solar Eclipse Caught on Camera Today!</strong><p>You watched 8 of 10 minutes · 1 week ago</p></div></div><div class="cb-dialog-content"><h3>Community note</h3><p>${correctionNote}</p>${noteRating("cb-note-dialog")}</div></dialog>` ,
 'creator-actions': `<div class="concepts-expanded-grid"><div class="concepts-copy"><h2>Turn watching into doing.</h2><p>Creators could suggest a meaningful next step alongside their video—something to try, a place to go or a cause to support.</p><p>Viewers could save it for later. Creators could learn which suggestions people choose, helping them make videos that inspire action beyond the screen.</p></div><figure class="concepts-action-scene"><div class="concepts-action-layout"><div class="concepts-video"><img src="assets/cb-villow-video.svg" alt="An illustrated Villow video" width="536" height="300"><span>I made an app to help you watch YouTube</span></div><div class="concepts-action-panel"><div class="cb-note-heading"><span class="cb-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M17 7H10M17 7V14"/></svg></span><h3>Get involved</h3></div><p>Give Villow a try.</p><a class="cb-action-link" href="https://villow.app/" target="_blank" rel="noopener">Visit villow.app ↗</a><button type="button" class="cb-add-action" aria-pressed="false" data-add-action>Add to your list</button></div></div></figure></div>`,
 recommendations: `<div class="concepts-expanded-grid"><div class="concepts-copy"><h2>Let people recommend what’s worth watching.</h2><p>YouTube uses watch time alongside other signals to help recommend videos. What if people could also recommend the videos that really stayed with them?</p><p>A few recommendations each week could help meaningful videos find an audience, giving viewers’ judgement more weight and helping counter clickbait.</p><p><a class="cb-inline-link" href="https://support.google.com/youtube/answer/15334500?hl=en" target="_blank" rel="noopener">YouTube Hype</a> lets viewers boost recent videos from smaller creators. This proposal would extend that idea to all channels and videos, using viewers’ recommendations to help shape discovery across the platform.</p></div><figure class="cb-discovery-card" aria-label="Example of a video recommended by viewers"><div class="cb-discovery-thumbnail"><img src="assets/c-thumb-mountain.webp" width="536" height="300" alt="An illustrated mountain valley"></div><figcaption><h3>How we brought a river back to life</h3><p>The Valley Project</p><span class="cb-discovery-recommended"><span aria-hidden="true">★</span> Recommended by viewers</span></figcaption></figure></div>`,
 trust: `<div class="concepts-expanded-grid concepts-trust-grid"><div class="concepts-copy"><h2>Fight bots and fake comments.</h2><p>Comments should be a place for people to talk to people. Fake accounts and coordinated bots can make it hard to know whom to trust, hollowing out that human connection.</p><p><a class="cb-inline-link" href="https://support.google.com/youtube/answer/3399767?hl=en" target="_blank" rel="noopener">YouTube prohibits fake engagement</a>, but the wider problem needs more attention. Stopping abuse without wrongly labelling real people is difficult, and there must be ways to challenge mistakes.</p></div><aside class="concepts-trust-position"><h3>What Villow can do.</h3><p>Villow makes space for sharing with people you know, so you can discuss videos with people you already trust.</p><p>This helps make the best of the situation, but it does not solve botting in public conversations. That wider problem needs more attention if we want people to trust who they are talking to online.</p></aside></div>`
};

export function conceptsPageBodyB() {
 const bodies = new Map(Array.from(conceptsPageBody().matchAll(/<details class="concepts-topic" id="([^"]+)">\s*<summary>[\s\S]*?<\/summary>\s*<div class="concepts-topic-content">([\s\S]*?)<\/div>\s*<\/details>/g),match=>[match[1],match[2]]));
 return `<header class="cb-hero"><div class="sp-width cb-hero-inner"><h1>Ideas beyond Villow.</h1><p class="cb-hero-lead">Ideas for a more thoughtful YouTube. Most would need YouTube itself to build and test them.</p></div>${wave(chapters[0].color,0)}</header>${chapters.map(({id,color},i)=>{
  const body=id==='ai'?aiChapter():firstChapters[id]??bodies.get(id);
  if (!body) throw new Error(`Missing content for concepts chapter: ${id}`);
  const labelledBody=body.replace('<h2>',`<h2 id="cb-title-${id}">`);
  return `<section class="cb-section cb-${id}" id="${id}" aria-labelledby="cb-title-${id}" style="--cb-band:${color}"><div class="sp-width cb-chapter"><div class="concepts-topic-content">${labelledBody}</div></div>${wave(chapters[i+1]?.color||footerColor,i+1)}</section>`;
 }).join('')}`;
}
