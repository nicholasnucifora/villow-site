import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {parse} from 'yaml';
import {designAliases, designPages, siteLink, renderDesignPage} from '../src/lib/site-design.mjs';
import {collectDesignAssets} from './site-design-integration.mjs';

const dist = new URL('../dist/', import.meta.url);

test('active pages retain presets, keep navigation local and use existing community destinations', async () => {
  const {links} = parse(await readFile(new URL('../site.config.yaml', import.meta.url), 'utf8'));
  for (const page of designPages) {
    const html = renderDesignPage(page.slug);
    assert.match(html, /<html data-villow-site/);
    assert.match(html, /class="preview-rail study-navigation"/);
    for (const href of ['/faq','/privacy',links.reddit,links.discord]) assert.ok(html.includes(`href="${href}"`), `${page.path}: ${href}`);
    assert.doesNotMatch(html, /href="http:\/\/127\.0\.0\.1:4411\//);
    assert.ok(!links.terms || html.includes(`href="${links.terms}"`));
  }
  assert.equal(siteLink('/download#costs'), '/running-villow#free-limits');
  assert.equal(siteLink('/download#inviting-friends'), '/running-villow#friends-cant-join');
  assert.equal(siteLink('/running-villow#leaving'), '/hosting-details#leaving');
  assert.match(renderDesignPage('get-involved'), /help-notes-compact/);
  assert.match(renderDesignPage('get-involved'), /href="\/partners">Partner with Villow/);
  assert.match(renderDesignPage('partners'), /href="\/contact#contact">Get in touch/);
  assert.match(renderDesignPage('get-involved'), /aria-label="Version C: Compact cards" aria-current="page"/);
  assert.equal(siteLink('/previews/support-compact#supporter-notes'), '/get-involved#supporter-notes');
  assert.equal(siteLink('/previews/support-words#supporter-notes'), '/get-involved#supporter-notes');
  assert.match(renderDesignPage('design-concepts'), /concepts-ai-g/);
  assert.match(renderDesignPage('index'), /class="rd-concepts-link" href="\/design-concepts"/);
  const home=renderDesignPage('index');
  assert.match(home, /class="n-devices" id="across-devices"/);
  assert.match(home, /Consider unsubscribing from this channel/);
  assert.match(home, /Rory, Somehow/);
  assert.doesNotMatch(home, /data-rating-presets|viewing-review-example\.js/);
  assert.match(home, /class="n-device-set-laptop"/);
  assert.match(home, /class="n-device-set-tablet"/);
  assert.match(home, /class="n-device-set-phone"/);
  assert.doesNotMatch(home, /device-landscape-art|device-feed-art|device-iteration-art/);
  for (const path of ['/previews/home-cross-device','/previews/home-laptop-to-phone','/previews/home-device-coverage','/previews/home-device-landscapes','/previews/home-device-feed','/previews/home-device-view','/previews/home-device-outlines','/previews/home-device-cards','/previews/home-device-silhouettes','/previews/home-device-outline','/previews/home-device-set','/previews/home-phone-shorter','/previews/home-phone-smaller','/previews/home-phone-squarer','/previews/home-phone-slimmer','/previews/home-phone-true','/previews/home-phone-clear']) {
    assert.equal(designAliases[path], '/');
    assert.equal(siteLink(path + '#across-devices'), '/#across-devices');
    const aliasPage = await readFile(new URL(path.slice(1) + '.html', dist), 'utf8');
    assert.match(aliasPage, /class="n-device-set-laptop"/);
  }
  assert.match(home, /shared-video-stair-cat\.webp/);
  assert.match(home, /watch-together-wide-eyed-cat\.webp/);
  assert.match(home, /she’s crawling out of the depths/);
  assert.doesNotMatch(home, /class="r-watch-(?:state|runtime)"/);
  assert.equal(siteLink('/concepts-g.html#ai'), '/design-concepts#ai');
  assert.equal(siteLink('/previews/concepts-g#ai'), '/design-concepts#ai');
  assert.deepEqual(designPages.filter(page => page.file.startsWith('concepts-')).map(page => page.file), ['concepts-g.html']);
  for (const preset of ['a','b','c','d','e','f','h']) {
    const path = `/previews/concepts-${preset}`;
    assert.equal(siteLink(`/concepts-${preset}.html#ai`), '/design-concepts#ai');
    assert.equal(siteLink(`${path}#ai`), '/design-concepts#ai');
  }
  assert.deepEqual(designPages.filter(page => /^help-/.test(page.file)).map(page => page.file), ['help-c.html','help-d.html','help-e.html','help-f.html']);
});

test('only active browser dependencies are packaged, including the shared touch module', async () => {
  const assets = await collectDesignAssets();
  assert(!assets.has('help-support-showcase.js'));
  assert(!assets.has('help-support-experiments.css'));
  assert.ok(assets.has('horizontal-swipe.js'));
  assert.ok(assets.has('assets/navigation-fonts/Nunito-VariableFont_wght.ttf') || [...assets].some(name => /nunito/i.test(name)));
  for (const name of assets) {
    assert.doesNotMatch(name, /(?:^|\/)(?:_archive|qa|\.)|\.(?:mjs|ts|md)$/);
    assert.ok((await stat(new URL('_design/' + name, dist))).isFile(), name);
  }
});

test('rendered page resources all resolve inside the local build', async () => {
  for (const page of [...designPages, ...['privacy','faq','app-privacy','site-privacy','extension-privacy'].map(slug=>({slug,path:'/'+slug}))]) {
    const html = await readFile(new URL(page.slug + '.html', dist), 'utf8');
    for (const tag of html.matchAll(/<(?:script|link|img|image|use|video|audio|source)\b[^>]*>/g)) {
      if (/rel="canonical"/.test(tag[0])) continue;
      for (const match of tag[0].matchAll(/\s(?:src|href|poster)="([^"]+)"/g)) {
        if (/^(?:data:|#)/.test(match[1])) continue;
        const url = new URL(match[1], 'https://local.test' + page.path);
        assert.equal(url.hostname, 'local.test', `${page.path}: external asset ${match[1]}`);
        assert.ok((await stat(new URL(url.pathname.slice(1), dist))).isFile(), `${page.path}: ${url.pathname}`);
      }
    }
  }
});

test('normal public builds stop without explicit release approval', () => {
  const env = {...process.env};
  delete env.VILLOW_PUBLIC_RELEASE_APPROVED;
  const result = spawnSync(process.execPath, ['scripts/release-guard.mjs'], {env,encoding:'utf8'});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Public release is disabled/);
});
