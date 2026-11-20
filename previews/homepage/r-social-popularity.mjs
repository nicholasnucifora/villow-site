// A recognisable public profile, with its public counts given the visual weight
// of the neighbouring shared-usage example. No network-specific badges.
export function refineRSocialPopularity(page) {
  const start = page.indexOf('<div class="n-popularity"');
  const closing = '</div></div></div><p>Public likes';
  const end = page.indexOf(closing, start);
  if (start < 0 || end < 0) throw new Error('Missing R public-popularity example');
  const graphic = `<div class="n-popularity r-public-profile" role="img" aria-label="A public profile with 2.4 thousand likes and 860 followers, visible to everyone.">
    <div class="n-popularity-profile"><span class="n-popularity-avatar" aria-hidden="true"></span><div><strong>Your profile</strong><small>Visible to everyone</small></div></div>
    <div class="r-public-counts" aria-hidden="true">
      <div class="r-public-metric"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 4.9a5.4 5.4 0 0 0-7.6 0L12 5.7l-.8-.8a5.4 5.4 0 0 0-7.6 7.6L12 21l8.4-8.5a5.4 5.4 0 0 0 0-7.6Z"/></svg><div><b>2.4k</b><span>likes</span></div></div>
      <div class="r-public-metric"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20v-1a6.5 6.5 0 0 1 13 0v1"/></svg><div><b>860</b><span>followers</span></div></div>
    </div>
  </div>`;
  // Keep the outer .xl-compare-art closing element and its existing explanation.
  return page.slice(0, start) + graphic + page.slice(end + '</div></div>'.length);
}
