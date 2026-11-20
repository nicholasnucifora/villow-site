/** A local, illustrative recommendation. The personal note is an example. */
export function renderICompany() {
  return `
<section class="ics-company" id="good-company" aria-labelledby="i-company-title">
  <div class="ics-copy">
    <h2 id="i-company-title">Good videos.<br> Good company.</h2>
    <p>Pass along a video with a personal note. Watch something a friend thought you’d enjoy, in your own time.</p>
  </div>
  <figure class="ics-scene" aria-label="An example recommendation: a friend shares a comedy video with the note ‘This made me laugh.’ You choose when to watch.">
    <div class="ics-connection" aria-hidden="true">
      <svg class="ics-arrow ics-arrow-first" viewBox="0 0 36 18" fill="none"><path d="M1 9h32M27 3l6 6-6 6"/></svg>
      <svg class="ics-arrow ics-arrow-last" viewBox="0 0 36 18" fill="none"><path d="M1 9h32M27 3l6 6-6 6"/></svg>
    </div>
    <div class="ics-person ics-friend">
      <span class="ics-portrait" aria-hidden="true"><span class="ics-head"></span><span class="ics-body"></span></span>
      <span class="ics-person-label">A friend</span>
    </div>
    <div class="ics-postcard">
      <div class="ics-video">
        <img src="assets/i-thumb-rest.webp" width="800" height="450" alt="A simple illustration of someone relaxing on a sofa" loading="lazy">
        <span class="ics-play" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="m8 5 7 5-7 5V5Z" fill="currentColor"/></svg></span>
      </div>
      <div class="ics-video-copy">
        <p class="ics-video-title">The very serious business of doing nothing</p>
        <p class="ics-channel">A Little Absurd</p>
      </div>
      <div class="ics-message">
        <span class="ics-message-label">Example recommendation</span>
        <p>“This made me laugh.”</p>
      </div>
    </div>
    <div class="ics-person ics-you">
      <span class="ics-portrait" aria-hidden="true"><span class="ics-head"></span><span class="ics-body"></span></span>
      <span class="ics-person-label">You</span>
      <span class="ics-your-pace">At your pace.</span>
    </div>
  </figure>
</section>`;
}
