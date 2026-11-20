import {readFile, writeFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {applyComparisonOption, comparisonOptions} from '../comparison-variants.mjs';
import {studies} from '../study-navigation.mjs';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('a-source.html', root), 'utf8');
const stripNavigation = value => value.replace(/<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/, '<!-- navigation -->');
const retainedB = await readFile(new URL('b.html', root), 'utf8');
const previousB = await readFile(new URL('_archive/retired-reveal-cards-2026-10-28/b.html', root), 'utf8');
const preservedPages = new Map(await Promise.all(['b', 'c'].map(async key => [key, await readFile(new URL(`_archive/before-balanced-story-2026-10-28/${key}.html`, root), 'utf8')])));
if (stripNavigation(retainedB) !== stripNavigation(previousB)) throw new Error('Selected B changed outside preview navigation');
if (await readFile(new URL('index.html', root), 'utf8') !== retainedB) throw new Error('Root preview does not load B');
if (comparisonOptions.length !== 1 || comparisonOptions[0][0] !== 'b') throw new Error('Unexpected compact comparison options');
if (JSON.stringify(studies) !== JSON.stringify([['b', 'Shared switch'], ['c', 'Focused story'], ['d', 'Balanced story'], ['e', 'Everyday balance'], ['f', 'Room for your day'], ['g', 'Connected watching'], ['h', 'Viewing story'], ['i', 'Calmer insight'], ['j', 'Open spread'], ['k', 'Rating first'], ['l', 'Two outcomes'], ['m', 'Clearer insight'], ['n', 'Compact story']])) throw new Error('Expected the B/C/D/E/F/G/H/I/J/K/L/M/N whole-page comparison series');

const articles = value => [...value.matchAll(/<article[^>]*class="xl-compare-cell[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
const originalArticles = articles(source);
const cleanArticle = article => article.replace(/ id="xc-[^"]+" data-xc-face="[^"]+" tabindex="-1"/, '').replace(/<div class="xc-side-marker"[^>]*>[\s\S]*?<\/div>/, '');
const visibleWordCount = page => page.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;

// Follow local HTML, stylesheet and module references without executing archived renderers.
async function checkAssets(pageName) {
  const visited = new Set();
  const pending = [new URL(pageName, root)];
  while (pending.length) {
    const file = pending.pop();
    if (visited.has(file.href)) continue;
    visited.add(file.href);
    if (!fileURLToPath(file).startsWith(fileURLToPath(root))) throw new Error(`Asset escapes preview directory: ${file.href}`);
    if (!(await stat(file)).isFile()) throw new Error(`Missing preview asset: ${file.href}`);
    if (!/\.(?:html|css|js|mjs)$/.test(file.pathname)) continue;
    const content = await readFile(file, 'utf8');
    const references = [];
    if (file.pathname.endsWith('.html')) {
      references.push(...[...content.matchAll(/\s(?:href|src)="([^"#]+)"/g)].map(match => match[1]));
      references.push(...[...content.matchAll(/\ssrcset="([^"]+)"/g)].flatMap(match => match[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0])));
    }
    if (file.pathname.endsWith('.css')) references.push(...[...content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map(match => match[1]));
    if (/\.(?:js|mjs)$/.test(file.pathname)) references.push(...[...content.matchAll(/\bfrom\s+["'](\.[^"']+)["']/g)].map(match => match[1]));
    for (const reference of references) {
      if (/^(?:[a-z]+:|#|\/)/i.test(reference)) continue;
      const target = new URL(reference, file);
      target.hash = ''; target.search = '';
      pending.push(target);
    }
  }
  return visited.size;
}

const results = [];
for (const [key, label] of studies) {
  const page = await readFile(new URL(`${key}.html`, root), 'utf8');
  // Whitespace before id avoids collecting data-ifs-id attributes.
  const idList = [...page.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const ids = new Set(idList);
  const refs = [...page.matchAll(/\saria-(?:controls|labelledby|describedby)="([^"]+)"/g)].flatMap(match => match[1].split(/\s+/));
  const item = {
    key, label,
    correctTitle: page.includes(`<title>Villow · Homepage ${key.toUpperCase()}</title>`),
    ownHomeLink: page.includes(`href="${key}.html" aria-label="Villow home"`),
    wholePageChoices: (page.match(/aria-label="Version [A-Z]:/g) || []).length === studies.length + 3 && studies.every(([choice]) => page.includes(`aria-label="Version ${choice.toUpperCase()}:`)) && page.includes('href="http://127.0.0.1:4408/o.html" aria-label="Version O: Shared moments"') && page.includes('href="http://127.0.0.1:4409/p.html" aria-label="Version P: Steady rhythm"') && page.includes('href="http://127.0.0.1:4410/q.html" aria-label="Version Q: Calmer details"'),
    oneActiveChoice: (page.match(/aria-current="page"/g) || []).length === 1 && page.includes(`Version ${key.toUpperCase()}: ${label}" aria-current="page"`),
    uniqueIds: ids.size === idList.length,
    allAriaReferencesResolve: refs.every(id => ids.has(id)),
    sharedAssets: page.includes('href="compact-comparisons.css"') && page.includes('src="compact-comparisons.js"'),
    correctCompactControls: (page.match(/data-xc-select=/g) || []).length === 2,
    staticFallback: page.includes('<noscript>') && page.includes('.xl-comparisons .xc-side-marker{display:block}'),
    localFilesChecked: await checkAssets(`${key}.html`),
  };
  if (preservedPages.has(key)) item.preRefinementPagePreserved = stripNavigation(page) === stripNavigation(preservedPages.get(key));
  if (key === 'b') {
    const transformed = applyComparisonOption(source, key);
    Object.assign(item, {
      allSixArticlesPreserved: originalArticles.length === 6 && JSON.stringify(articles(transformed).map(cleanArticle)) === JSON.stringify(originalArticles),
      prefixUnchanged: transformed.slice(0, transformed.indexOf('<section class="x-life"')) === source.slice(0, source.indexOf('<section class="x-life"')),
      suffixUnchanged: transformed.slice(transformed.indexOf('<div class="xl-concepts ')) === source.slice(source.indexOf('<div class="xl-concepts ')),
      threeDefaultVillowFaces: (page.match(/data-xc-selected="villow"/g) || []).length === 3,
      acceptedPagePreserved: stripNavigation(page) === stripNavigation(previousB),
    });
  } else if (key === 'c') {
    Object.assign(item, {
      youtubePromiseFirst: page.includes('YouTube, with<br><span>a stopping point.</span>'),
      feedAndCinemaRetained: (page.match(/data-ifs-card=/g) || []).length === 5 && page.includes('data-wf-complete hidden') && page.includes('data-ig-cinema="cinema-cloud-cat"'),
      oneWorthwhileExample: (page.match(/data-si-panel=/g) || []).length === 1 && page.includes('data-si-panel="worth"') && !page.includes('data-si-view='),
      oneAllowanceWithoutTour: (page.match(/class="sl-daily"/g) || []).length === 1 && !page.includes('data-sl-carousel'),
      onePreservedStreakPair: (page.match(/data-xc-selected="villow"/g) || []).length === 1 && JSON.stringify(articles(page).map(cleanArticle)) === JSON.stringify(originalArticles.slice(0, 2)),
      optionalPersonalConnection: page.includes('This made me laugh.') && page.includes('if you’d like.') && !ids.has('watch-together'),
      optionalReflection: page.includes('Reflect when a video ends, if you choose.'),
      practicalAnswersPresent: ids.has('fs-practical-title') && page.includes('official player') && page.includes('hosting and database setup'),
      visitorLedClosing: page.includes('Make watching<br><span>work for you.</span>') && page.indexOf('class="fs-mission"') > page.indexOf('id="hc-title"'),
      conceptsRemainInactive: /<a[^>]*role="link"[^>]*aria-disabled="true"[^>]*>Explore the design concepts/.test(page),
      substantiallyShorter: visibleWordCount(page) < visibleWordCount(retainedB) * .8,
    });
  } else {
    const comparisonTopics = [...page.matchAll(/data-xl-topic="([^"]+)"/g)].map(match => match[1]);
    const conceptsLink = [...page.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]).find(anchor => anchor.includes('Explore the design concepts')) || '';
    const socialBand = page.slice(page.indexOf(key === 'n' ? '<section class="n-social"' : '<div class="r-social-band'), page.indexOf('<section class="x-life"'));
    const closing = page.slice(page.indexOf('id="help-shape-web"'));
    const closingHeading = closing.match(/<h2[^>]*id="hc-title"[^>]*>([\s\S]*?)<\/h2>/)?.[1] || '';
    Object.assign(item, {
      youtubePromiseFirst: page.includes('YouTube, with<br><span>a stopping point.</span>'),
      feedAndCinemaRetained: (page.match(/data-ifs-card=/g) || []).length === 5 && page.includes('data-wf-complete hidden') && page.includes('data-ig-cinema="cinema-cloud-cat"'),
      oneWorthwhileExample: ['m', 'n'].includes(key) ? page.includes('Percentage of videos you found worthwhile') && page.includes('You often watch videos in this range and skip videos outside it.') : key === 'l' ? page.includes('Videos rated worthwhile') && page.includes('50%') && !page.includes('Worth-it share of worth-it and not-worth-it ratings.') && page.includes('9 of 10 videos you watched were this length.') : ['j', 'k'].includes(key) ? page.includes('Videos rated worthwhile') && page.includes('Worth-it share of worth-it and not-worth-it ratings.') && page.includes('9 of 10 videos you watched were this length.') : key === 'i' ? page.includes('see what you found worthwhile over time') && !page.includes('class="vh-chart"') : key === 'h' ? page.includes('Videos rated worthwhile') && page.includes('Worth-it share of worth-it and not-worth-it ratings.') : key === 'g' ? page.includes('Videos you found worthwhile') && page.includes('Of videos rated worth it or not worth it.') : key === 'f' ? page.includes('Percentage rated worth watching') && page.includes('Among videos rated worth watching or not worth watching.') : key === 'e' ? page.includes('class="eb-interface eb-reflect"') : (page.match(/data-si-panel=/g) || []).length === 1 && page.includes('data-si-panel="worth"') && !page.includes('data-si-view='),
      oneAllowanceWithoutTour: ['j', 'k', 'l', 'm', 'n'].includes(key) ? page.includes('Choose a daily viewing limit that works for you.') && !page.includes('gw-limit-visual') : key === 'i' ? page.includes('Choose a daily viewing limit that works for you.') && !page.includes('gw-limit-visual') : key === 'h' ? page.includes('Choose a daily viewing limit that works for you.') && !page.includes('gw-limit-visual') : key === 'g' ? page.includes('Daily viewing limit') && page.includes('flexibility for different days') : key === 'f' ? page.includes('Custom days') && page.includes('Daily viewing limit') && !page.includes('data-eb-add-day') : key === 'e' ? page.includes('class="eb-interface eb-limit"') : (page.match(/class="rd-allowance"/g) || []).length === 1 && !page.includes('class="sl-daily"') && !page.includes('data-sl-carousel'),
      illustratedDevicesRestored: ids.has('across-devices') && page.includes(key === 'n' ? 'class="n-device-visual"' : 'assets/a-connected-devices.webp'),
      watchTogetherDemoRestored: key === 'n' ? ids.has('watch-together') && page.includes('n-together-visual') && page.includes('Watching in sync') && page.includes('Shared queue') : ids.has('watch-together') && page.includes('data-rt-scene') && page.includes('src="r-together.js"') && page.includes(['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'].includes(key) ? 'assets/e-shared-friends-looking-at-video.webp' : 'assets/r-shared-friends.webp'),
      sharedSocialBand: socialBand.includes('id="good-company"') && socialBand.includes('id="watch-together"'),
      fourComparisonTopics: JSON.stringify(comparisonTopics) === JSON.stringify(['streaks', 'sidebar', 'usage', 'social']) && articles(page).length === 8,
      usageControlsIntegrated: ids.has('xl-topic-usage') && ids.has('xc-usage-pattern') && ids.has('xc-usage-villow') && /Time [Uu]sage/.test(page) && (['m', 'n'].includes(key) ? page.includes('Usage and limits are part of the experience') : /(?:customi[sz]|tailor)/i.test(page)),
      optionalSidebarAndSharing: (page.includes('An optional to-do sidebar') || page.includes('like an optional to-do list')) && /(?:Choose to let friends|choose what|optional|Opt-in)/i.test(page),
      personalNoteRetained: page.includes('This made me laugh.'),
      optionalReflection: ['m', 'n'].includes(key) ? page.includes('After a video, you can say whether it was worth your time, if you like.') && page.includes('latest 30 worth-it and not-worth-it ratings') : ['j', 'k', 'l'].includes(key) ? /optional rating/i.test(page) && page.includes('among videos rated worth it or not worth it') : key === 'i' ? page.includes('Rate videos if you like') && page.includes('You choose what to do.') : key === 'h' ? page.includes('optional ratings') && page.includes('You decide what, if anything, to change.') : key === 'g' ? page.includes('If you choose to rate videos') && page.includes('What you do is up to you.') : key === 'f' ? page.includes('if you like, reflect on a video afterwards') && page.includes('rf-suggestion-facts') : key === 'e' ? page.includes('Reflect, if you choose') : page.includes('Rate a video when it ends, if you choose.'),
      noSetupFAQ: !ids.has('fs-practical-title') && !page.includes('hosting and database setup') && !page.includes('How do I get started?'),
      independentYouTubeAttribution: page.includes('official player') && /(?:not affiliated|isn’t affiliated)/.test(page),
      concreteClosing: closingHeading.length > 0 && !closingHeading.includes('Make watching') && closing.includes('href="https://villow.app/download"') && closing.indexOf('class="fs-mission"') > closing.indexOf('id="hc-title"'),
      redundantCaptionsRemoved: !/class="(?:wf-note|fs-integrated|fs-social-note|w-browser-note|rt-kicker|rd-optional)"/.test(page) && !page.includes('<figcaption>Look back at what felt worthwhile over time.</figcaption>'),
      redundantAllowanceLabelsRemoved: !page.includes('30 minutes used') && !page.includes('of a 60-minute allowance'),
      conceptsLink: ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'].includes(key) ? conceptsLink.includes('href="https://villow.app/roadmap#ideas"') : /role="link"/.test(conceptsLink) && /aria-disabled="true"/.test(conceptsLink) && !/\shref=/.test(conceptsLink),
      conceptsHaveHeading: /(?:Beyond what|What if the platforms|Ideas for the platforms themselves|Ideas beyond Villow)/.test(page),
    });
  }
  if (Object.values(item).includes(false)) throw new Error(`Verification failed: ${JSON.stringify(item)}`);
  results.push(item);
}
for (const name of ['a.html', 'comparison-options.css']) {
  try { await stat(new URL(name, root)); throw new Error(`Retired option still present: ${name}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await writeFile(new URL('qa/compact-comparison-scope.json', root), JSON.stringify({selectedVisualsFirstBaselinePreserved: true, options: results}, null, 2));
console.log(JSON.stringify(results, null, 2));

