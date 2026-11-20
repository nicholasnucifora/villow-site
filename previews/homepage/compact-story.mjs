import {applyClearerInsight} from './clearer-insight.mjs';

export function applyCompactStory(source) {
  let page = applyClearerInsight(source)
    .replace('class="version-m-insight ', 'class="version-n-story version-m-insight ')
    .replace('</head>', '<link rel="stylesheet" href="n-compact-story.css"><script src="n-navigation.js" defer></script></head>');

  const finishArt = /<span class="rd-finish-art" aria-hidden="true">[\s\S]*?<\/svg><\/span>/;
  if (!finishArt.test(page)) throw new Error('Missing feed completion artwork');
  page = page.replace(finishArt, `<span class="rd-finish-art n-sunset-finish" aria-hidden="true"><svg viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="42" fill="#fff3da"/><circle cx="48" cy="49" r="17" fill="#f2c766"/><path d="M23 58c9-4 17-4 25 0 8-4 17-4 25 0v15H23Z" fill="#fff3da"/><path d="M23 58c9-4 17-4 25 0 8-4 17-4 25 0" stroke="#d7a548" stroke-width="2.5" stroke-linecap="round"/><path d="M48 19v6M25 31l4 4M71 31l-4 4M19 47h6M71 47h6" stroke="#e2b455" stroke-width="2.5" stroke-linecap="round"/></svg></span>`);

  const oldHeader = page.match(/<a class="i-header-link"[\s\S]*?<\/a>/)?.[0];
  if (!oldHeader) throw new Error('Missing homepage header link');
  page = page.replace(oldHeader, `<nav class="n-header-nav" aria-label="Main navigation"><a href="#feed-to-watch-later">How it works</a><a href="#beyond-watching">Our approach</a><a class="n-header-cta" href="https://villow.app/download" target="_blank" rel="noopener">Get started</a></nav>`);

  const originalHeader = page.match(/<header class="i-header i-width">[\s\S]*?<\/header>/)?.[0];
  if (!originalHeader) throw new Error('Missing homepage header');
  page = page.replace(originalHeader, `<div class="n-header-slot">${originalHeader}</div>`);

  const usageStart = page.indexOf('<div class="m-settings-path"');
  const usageEnd = page.indexOf('\n      <p>On some apps, usage and limits', usageStart);
  if (usageStart < 0 || usageEnd < 0) throw new Error('Missing usage illustration');
  const usage = `<div class="n-settings-path n-detour" role="img" aria-label="From an app, open the profile menu and choose Settings. Then open Account and Digital wellbeing to find usage information and limits."><div class="n-detour-app" aria-hidden="true"><div class="n-detour-appbar"><span>App</span><span class="n-detour-profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20v-1a6.5 6.5 0 0 1 13 0v1"/></svg></span></div><div class="n-detour-video"></div><i></i><i></i><svg class="n-detour-cursor" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2v12l3.5-3.2 2.3 5 2.5-1.1-2.3-5L15 9Z"/></svg></div><span class="n-detour-arrow" aria-hidden="true">→</span><div class="n-detour-menu" aria-hidden="true"><strong>Profile menu</strong><span>Profile</span><b>Settings</b><span>Help</span></div><span class="n-detour-arrow" aria-hidden="true">→</span><div class="n-detour-settings" aria-hidden="true"><strong>Settings</strong><div class="n-settings-trail"><span>Account</span><b>Digital wellbeing</b></div></div></div></div>`;
  page = page.slice(0, usageStart) + usage + page.slice(usageEnd);
  page = page.replace('On some apps, usage and limits are tucked away inside settings.', 'Usage and limits are buried in settings—or missing altogether.');

  const socialPattern = page.indexOf('id="xc-social-pattern"');
  const artStart = page.indexOf('<div class="xl-compare-art">', socialPattern);
  const description = page.indexOf('<p>Likes and follower counts', artStart);
  if (socialPattern < 0 || artStart < 0 || description < 0) throw new Error('Missing social comparison');
  const art = `<div class="xl-compare-art"><div class="n-popularity" role="img" aria-label="A social post showing its public like and follower counts."><div class="n-popularity-profile"><span class="n-popularity-avatar" aria-hidden="true"></span><div><strong>Your profile</strong><small>Visible to everyone</small></div></div><div class="n-popularity-counts" aria-hidden="true"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 4.9a5.4 5.4 0 0 0-7.6 0L12 5.7l-.8-.8a5.4 5.4 0 0 0-7.6 7.6L12 21l8.4-8.5a5.4 5.4 0 0 0 0-7.6Z"/></svg><b>2.4k</b> likes</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 20v-1a6.5 6.5 0 0 1 13 0v1"/></svg><b>860</b> followers</span></div></div></div>`;
  page = page.slice(0, artStart) + art + page.slice(description);
  page = page.replace('Likes and follower counts turn attention into status. Paid boosts make extra visibility something to buy.', 'Public likes and follower counts put popularity on display, encouraging people to post and return to grow their status.');

  page = page.replace('Your streak counts days without raising your limits. Keep or lower them, and it grows—even on days away.', 'Your streak grows each day you keep the limits you chose, even when you take a break. Extend a limit, and it starts over.');

  const socialTime = '<div class="m-shared-axis" role="img" aria-label="Time progresses from earlier on the left to later on the right"><svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M100 8H4"/><path class="n-axis-head" d="M2 8 9 4 9 12Z" fill="currentColor" stroke="none"/></svg><span>Time</span><svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8h96"/><path class="n-axis-head" d="M98 8 91 4 91 12Z" fill="currentColor" stroke="none"/></svg></div>';
  if (!page.includes('<div class="m-shared-axis">Over time</div>')) throw new Error('Missing shared usage time axis');
  page = page.replace('<div class="m-shared-axis">Over time</div>', socialTime);

  page = page.replace('<div class="it-l-label">FROM YOUR OPTIONAL RATINGS</div>', '');
  page = page.replace('<div class="it-l-label">A SUGGESTION FROM YOUR VIEWING</div>', '')
    .replace('<strong>Alex’s Studio</strong>', '<strong>Suggestion · Alex’s Studio</strong>');
  const shortAxis = '<div class="it-time" role="img" aria-label="Time progresses from earlier on the left to later on the right"><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M21 8H3m6-5L3 8l6 5"/></svg><span>Time</span><svg viewBox="0 0 24 16" aria-hidden="true"><path d="M3 8h18m-6-5 6 5-6 5"/></svg></div>';
  const wideAxis = '<div class="it-time" role="img" aria-label="Time progresses from earlier on the left to later on the right"><svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M100 8H4"/><path class="n-axis-head" d="M2 8 9 4 9 12Z" fill="currentColor" stroke="none"/></svg><span>Time</span><svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8h96"/><path class="n-axis-head" d="M98 8 91 4 91 12Z" fill="currentColor" stroke="none"/></svg></div>';
  if (!page.includes(shortAxis)) throw new Error('Missing chart time axis');
  page = page.replace(shortAxis, wideAxis);
  const interactivePlot = /<div class="it-plot m-interactive-plot"[^>]*>/;
  if (!interactivePlot.test(page)) throw new Error('Missing chart plot');
  page = page.replace(interactivePlot, '<div class="it-plot n-static-plot" role="img" aria-label="Illustrative share of videos rated worthwhile over time, using the latest 30 worth-it and not-worth-it ratings.">')
    .replace(/<div class="m-chart-point"[^>]*><\/div><div class="m-plot-detail"[^>]*>[\s\S]*?<\/div>/, '')
    .replace(/<p class="sr-only" id="m-chart-instructions">[\s\S]*?<\/p><script type="application\/json" id="m-chart-data">[\s\S]*?<\/script>/, '');

  const devicesStart = page.indexOf('<section class="w-devices"');
  const devicesEnd = page.indexOf('</section>', devicesStart);
  if (devicesStart < 0 || devicesEnd < 0) throw new Error('Missing original devices section');
  page = page.slice(0, devicesStart) + page.slice(devicesEnd + '</section>'.length);

  const socialStart = page.indexOf('<div class="r-social-band rd-together-band">');
  const socialEnd = page.indexOf('<section class="x-life"', socialStart);
  if (socialStart < 0 || socialEnd < 0) throw new Error('Missing social band');
  const social = `<section class="n-social" aria-labelledby="n-social-heading"><div class="i-width n-social-inner"><header class="n-social-header"><h2 id="n-social-heading">Good videos, good company.</h2><p>Recommendations from people, not engagement metrics. Share with a note, or watch together even when you’re apart.</p></header><div class="n-social-cards"><article class="n-social-card" id="good-company"><div class="n-social-visual n-share-visual" role="img" aria-label="Alex recommends a video with a message: This made me laugh."><div class="n-video-card"><img src="assets/i-thumb-rest.webp" alt="" loading="lazy"><div class="n-share-detail"><strong>The very serious business of doing nothing</strong><div class="n-share-meta"><span>Recommended by Alex</span><span class="n-note">“This made me laugh.”</span></div></div></div></div><h3>A good video, from someone you know.</h3><p>Pass along a video with a personal note, and watch a friend’s pick in your own time.</p></article><article class="n-social-card" id="watch-together"><div class="n-social-visual n-together-visual" role="img" aria-label="You and Alex watching in sync with three videos in the shared queue."><div class="n-together-left"><div class="n-together-people" aria-hidden="true"><span class="n-person n-person-you"></span><span class="n-person n-person-alex"></span></div><div class="n-together-copy"><strong>You and Alex</strong><span>Watching in sync</span></div></div><div class="n-shared-queue"><span>Shared queue · 3</span></div></div><h3>Watch together, even from afar.</h3><p>Invite friends, add videos to a shared queue and watch in sync.</p></article></div><section class="n-devices" id="across-devices" aria-labelledby="n-devices-heading"><div class="n-device-visual" role="img" aria-label="A laptop, tablet and phone"><div class="n-mini-laptop"><span class="n-mini-screen"></span><span class="n-mini-base"></span></div><div class="n-mini-tablet"><span class="n-mini-screen"></span></div><div class="n-mini-phone"><span class="n-mini-screen"></span></div></div><div><h3 id="n-devices-heading">One experience, across your devices.</h3><p>Open Villow on your phone, tablet or computer. Your saved videos, settings and viewing activity stay together.</p></div></section></div></section>`;
  page = page.slice(0, socialStart) + social + page.slice(socialEnd);

  page = page.replace('<h2 id="hc-title">Try Villow.</h2>', '<h2 id="hc-title">Watch what you meant to.<br><span>Then close the tab.</span></h2>')
    .replace('Watch YouTube with a feed that ends and limits you choose.', 'Choose your channels and a daily limit, then watch in your own time.');
  const closing = page.indexOf('id="help-shape-web"');
  if (closing < 0) throw new Error('Missing closing section');
  page = page.slice(0, closing) + page.slice(closing).replace('>Get started <span><svg', '>Set up your feed <span><svg');
  const closingSection = page.lastIndexOf('<section class="hc-closing', closing);
  const footerEnd = page.indexOf('</footer>', closingSection);
  if (closingSection < 0 || footerEnd < 0) throw new Error('Missing closing and footer');
  const afterFooter = footerEnd + '</footer>'.length;
  page = page.slice(0, closingSection) + '<div class="n-closing-stack">' + page.slice(closingSection, afterFooter) + '</div>' + page.slice(afterFooter);
  const previewFooter = /<footer class="i-preview-note i-width">[\s\S]*?<\/footer>/;
  if (!previewFooter.test(page)) throw new Error('Missing preview footer');
  page = page.replace(previewFooter, `<footer class="n-footer" aria-label="Footer"><div class="n-footer-inner i-width"><div class="n-footer-project"><a class="n-footer-brand" href="https://fixtheweb.org"><img src="assets/fixtheweb-spider.svg" alt="" width="40" height="40"><span>A Fix the Web project</span></a><p>Villow is an app for YouTube, made by Fix the Web to show what better looks like.</p></div><nav class="n-footer-nav" aria-label="Footer navigation"><div><h2>Villow</h2><ul><li><span>Get started</span></li><li><span>Running your Villow</span></li><li><span>About</span></li></ul></div><div><h2>Help</h2><ul><li><span>FAQ</span></li><li><span>Privacy</span></li><li><span>Terms</span></li><li><a href="mailto:support@villow.app">Contact</a></li></ul></div><div><h2>Community</h2><ul><li><span>Discord</span></li><li><span>Reddit</span></li><li><span>How to help</span></li></ul></div><div><h2>Project</h2><ul><li><span>GitHub</span></li><li><a href="https://fixtheweb.org">fixtheweb.org</a></li></ul></div></nav><div class="n-footer-bottom"><span>This site uses no analytics.</span><span>Villow · Homepage N &nbsp;·&nbsp; Local preview</span></div></div></footer>`);
  return page;
}
