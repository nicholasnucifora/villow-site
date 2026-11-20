const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const lines = (value) => value.split('\n').map((line) => `<span>${escape(line)}</span>`).join('');

export function renderB(c, h) {
  return `
    <section class="b-hero" aria-labelledby="hero-title">
      <div class="b-hero-copy">
        <p class="eyebrow b-eyebrow">${escape(c.eyebrow)}</p>
        <h1 id="hero-title">${lines(c.title)}</h1>
        <p class="b-lead">${escape(c.lead)}</p>
        ${h.actions()}
        <p class="b-note">${escape(c.note)}</p>
      </div>
      <figure class="b-feed">
        <div class="b-image-label"><span>Home Feed</span><span>Dark mode</span></div>
        <button type="button" class="product-shot b-feed-shot" data-image="home-dark" aria-label="Enlarge Villow home feed in dark mode">
          <img src="assets/home-dark.webp" width="2543" height="1349" alt="Villow home feed in dark mode showing channel videos and a time remaining indicator" fetchpriority="high" />
          <span class="enlarge-hint">View full screen ${h.expand}</span>
        </button>
        <figcaption><span>${escape(c.feedCaption)}</span><span class="b-image-hint">Actual app · sample content</span></figcaption>
      </figure>
    </section>
    <section class="b-controls" id="your-controls" aria-labelledby="controls-title">
      <div class="b-controls-inner">
        <div class="b-section-header">
          <div>
            <p class="eyebrow b-eyebrow">${escape(c.sectionEyebrow)}</p>
            <h2 id="controls-title">${lines(c.sectionTitle)}</h2>
          </div>
          <p class="b-section-lead">${escape(c.sectionLead)}</p>
        </div>
        <div class="b-controls-content">
          <figure class="b-usage">
            <button type="button" class="product-shot b-usage-shot" data-image="usage-dark" aria-label="Enlarge Villow Time Usage in dark mode">
              <img src="assets/usage-dark.webp" width="2535" height="1356" alt="Villow Time Usage in dark mode showing daily viewing time, a daily limits chart and viewing patterns" loading="lazy" />
              <span class="enlarge-hint">View full screen ${h.expand}</span>
            </button>
            <figcaption><span>${escape(c.usageCaption)}</span><span>Sample data</span></figcaption>
          </figure>
          <ol class="b-control-list">
            ${c.controls.map((item) => `<li><span class="b-control-number">${escape(item.number)}</span><div><h3>${escape(item.title)}</h3><p>${escape(item.body)}</p></div></li>`).join('')}
          </ol>
        </div>
      </div>
    </section>`;
}
