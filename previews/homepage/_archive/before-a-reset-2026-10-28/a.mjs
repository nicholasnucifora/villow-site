export function renderA(c, h) {
  return `
  <section class="a-hero" aria-labelledby="hero-title">
    <div class="a-hero-grid wrap">
      <div class="a-hero-copy">
        <p class="eyebrow">${c.eyebrow}</p>
        <h1 id="hero-title">${c.title.replace('\n', '<br><span>')}</span></h1>
        <p class="hero-lead">${c.lead}</p>
        ${h.actions()}
        <p class="hero-note"><span class="open-source-icon" aria-hidden="true">↗</span> ${c.note}</p>
      </div>
      <figure class="a-product">
        <div class="a-product-label"><span>Meet your home feed</span><span class="label-line"></span><span>Villow / 01</span></div>
        <button class="product-shot a-home-shot" type="button" data-image="home-light" aria-label="Enlarge Villow home feed">
          <img src="assets/home-light.webp" width="2541" height="1358" alt="Villow’s light home feed with subscription videos, chosen video suggestions, and a time remaining indicator" fetchpriority="high">
          <span class="enlarge-hint">View full screen ${h.expand}</span>
        </button>
        <figcaption><span>${c.feedCaption}</span><span>Actual app · sample content</span></figcaption>
      </figure>
    </div>
    <div class="a-hero-bottom wrap"><span>A calmer way to watch.</span><a href="#your-controls">A little more say ${h.down}</a></div>
  </section>
  <section class="a-controls" id="your-controls" aria-labelledby="controls-title">
    <div class="wrap">
      <div class="a-section-heading"><div><p class="eyebrow">${c.sectionEyebrow}</p><h2 id="controls-title">${c.sectionTitle.replace('\n', ' ')}</h2></div><p>${c.sectionLead}</p></div>
      <div class="a-controls-grid">
        <figure class="a-usage">
          <button class="product-shot" type="button" data-image="usage-light" aria-label="Enlarge Villow Time Usage">
            <img src="assets/usage-light.webp" width="2541" height="1362" alt="Villow Time Usage in light mode showing daily viewing history and daily limits" loading="lazy">
            <span class="enlarge-hint">View full screen ${h.expand}</span>
          </button>
          <figcaption><span>${c.usageCaption}</span><span>Sample data</span></figcaption>
        </figure>
        <ol class="a-control-list">${c.controls.map(item => `<li><span class="control-number">${item.number}</span><div><h3>${item.title}</h3><p>${item.body}</p></div></li>`).join('')}</ol>
      </div>
    </div>
  </section>`;
}
