const clock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>';
const home = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 10 8-6 8 6v10h-6v-6h-4v6H4Z"/></svg>';
const saved = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4Z"/></svg>';
const friends = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/></svg>';
const settings = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="var(--rd-ui-paper,#fffef8)"/><circle cx="15" cy="12" r="2" fill="var(--rd-ui-paper,#fffef8)"/><circle cx="8" cy="18" r="2" fill="var(--rd-ui-paper,#fffef8)"/></svg>';
const video = '<div class="rd-ui-video"><img src="assets/i-cinema-cat-clip.webp" width="1254" height="1254" alt="" loading="lazy"><span aria-hidden="true">▶</span></div>';

// These small UI illustrations explain placement; they are not navigation controls.
export const usageComparison = `<section class="xl-compare-row xl-reveal" data-xl-reveal data-xc-selected="villow" data-xl-topic="usage" aria-labelledby="xl-topic-usage">
  <h3 class="xl-pair-topic" id="xl-topic-usage">Usage and controls</h3>
  <div class="xl-pair">
    <article id="xc-usage-pattern" data-xc-face="pattern" tabindex="-1" class="xl-compare-cell xl-cell-pattern" aria-labelledby="xl-pattern-column xl-topic-usage">
      <div class="xc-side-marker" id="xc-usage-pattern-label">Common pattern on other apps</div>
      <div class="xl-compare-art"><div class="rd-usage-pattern" role="img" aria-label="A settings menu, with usage and limit controls inside it."><div class="rd-settings-heading">${settings}<span>Settings</span></div><div class="rd-settings-item"><span>Account</span><span aria-hidden="true">›</span></div><div class="rd-settings-item"><span>Notifications</span><span aria-hidden="true">›</span></div><div class="rd-settings-item rd-settings-usage"><span>${clock}Usage &amp; limits</span><span aria-hidden="true">›</span></div></div></div>
      <p>On some apps, usage controls sit inside settings, away from the watching experience.</p>
    </article>
    <article id="xc-usage-villow" data-xc-face="villow" tabindex="-1" class="xl-compare-cell xl-cell-villow" aria-labelledby="xl-villow-column xl-topic-usage">
      <div class="xc-side-marker" id="xc-usage-villow-label">Villow’s approach</div>
      <div class="xl-compare-art"><div class="rd-usage-villow" role="img" aria-label="Time Usage in the desktop sidebar and at the centre of five mobile navigation items.">
        <div class="rd-ui-desktop" aria-hidden="true"><div class="rd-ui-side"><div class="rd-ui-brand">Villow</div><div class="rd-ui-menu">${home}<span>Home</span></div><div class="rd-ui-menu">${saved}<span>Watch Later</span></div><div class="rd-ui-menu rd-ui-highlight">${clock}<span>Time Usage</span></div></div><div class="rd-ui-desktop-content">${video}<div class="rd-ui-lines"><i></i><i></i></div></div></div>
        <div class="rd-ui-mobile" aria-hidden="true"><div class="rd-ui-mobile-top">Villow</div>${video}<div class="rd-ui-lines"><i></i><i></i></div><div class="rd-ui-bottom"><span>${home}</span><span>${saved}</span><span class="rd-ui-highlight">${clock}<small>Time usage</small></span><span>${friends}</span><span>${settings}</span></div></div>
      </div></div>
      <p>Check usage and adjust limits from the main navigation—centre on mobile, sidebar on desktop. Tailor your feed, reminders and appearance to suit you.</p>
    </article>
  </div>
</section>`;
