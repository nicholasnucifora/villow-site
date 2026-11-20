import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {studyNavigation,pageStudyNavigation,previewPageURL,localizePreviewLinks,secondaryStudyRoutes} from '../study-navigation.mjs';
import {homeStudies,previewPages,latestPreviewURL,retiredHomeStudies} from '../preview-pages.js';
import {previewHeader,applyPreviewHeader} from '../preview-header.mjs';

assert.equal(previewPageURL('home'),'http://127.0.0.1:4411/34.html');
assert.throws(()=>previewPageURL('home','x'),/Unknown home preset/);
assert.deepEqual(homeStudies,[['34','Soft Nunito'],['42','Landscape screens'],['43','Same feed']]);
assert.equal(await readFile(new URL('../index.html',import.meta.url),'utf8'),await readFile(new URL('../34.html',import.meta.url),'utf8'));
for(const preset of retiredHomeStudies){
 assert.throws(()=>previewPageURL('home',preset),/Unknown home preset/);
 assert.equal(latestPreviewURL(`${preset}.html?example=1#help-shape-web`),'http://127.0.0.1:4411/34.html?example=1#help-shape-web');
}
assert.equal(latestPreviewURL('x.html?example=1#help-shape-web'),'http://127.0.0.1:4411/34.html?example=1#help-shape-web');
assert.equal(latestPreviewURL('r.html#feed-to-watch-later'),`${previewPageURL('home')}#feed-to-watch-later`);
assert.equal(latestPreviewURL('setup-a.html?choice=no'),`${previewPageURL('setup')}?choice=no`);
assert.equal(latestPreviewURL('https://example.com/r.html'),'https://example.com/r.html');
assert.equal(latestPreviewURL('#your-control'),'#your-control');
// New comparisons remain accessible without replacing an explicitly selected design.
homeStudies.push(['aa','Future preview']); previewPages.setup.presets.push(['c','Future setup']);
assert.equal(previewPageURL('home'),'http://127.0.0.1:4411/34.html');
assert.equal(previewPageURL('home','aa'),'http://127.0.0.1:4411/aa.html');
assert.equal(previewPageURL('setup'),'http://127.0.0.1:4411/setup-c.html');
assert.equal(latestPreviewURL('setup-instructions-b.html?path=web#join'),'http://127.0.0.1:4411/setup-instructions-b.html?path=web#join');
assert.ok(previewHeader().includes('http://127.0.0.1:4411/34.html'));
assert.ok(previewHeader().includes('http://127.0.0.1:4411/setup-c.html'));
homeStudies.pop(); previewPages.setup.presets.pop();

const pageKeys=['home','setup','setup-instructions','setup-hosting','concepts','help','contact','partners'];
assert.deepEqual(secondaryStudyRoutes,[
 'setup-b.html','setup-instructions-b.html','setup-hosting-b.html','setup-hosting-c.html','setup-hosting-d.html',
 'concepts-g.html',
 'help-c.html','help-d.html','help-e.html','help-f.html','contact-a.html','partners-a.html',
]);
assert.equal(previewPageURL('help'), 'http://127.0.0.1:4411/help-c.html', 'C is the owner-selected default even after adding new comparisons');
assert.deepEqual(previewPages.help.presets,[['c','Compact cards'],['d','Quotations'],['e','Folded notes'],['f','Conversation']]);
assert.ok(pageStudyNavigation('help','c').includes(`${previewPageURL('help','c')}#supporter-notes`));
for (const preset of ['a','b','g','h']) assert.throws(() => previewPageURL('help',preset), /Unknown help preset/);
for(const page of pageKeys){
 const rail=page==='home'?studyNavigation('r'):pageStudyNavigation(page);
 assert.match(rail,/<details class="study-page-picker"><summary>[^<]+previews<\/summary>/);
 for(const target of pageKeys)assert.ok(rail.includes(`href="${previewPageURL(target)}"`),`${page} links to ${target}`);
 const picker=rail.match(/<details[\s\S]*?<\/details>/)[0];
 assert.equal((picker.match(/aria-current="page"/g)||[]).length,1,'One active page in picker');
 assert.ok(picker.includes(`href="${previewPageURL(page)}" aria-current="page"`));
 const presets=rail.match(/<nav class="preview-tabs"[\s\S]*?<\/nav>/)[0];
 assert.equal((presets.match(/aria-current="page"/g)||[]).length,1,'One active preset in page series');
 if(page==='home'){
  assert.equal((presets.match(/<a /g)||[]).length,homeStudies.length);
  assert.ok(!presets.includes('Version X:'),'Retired X is absent from preview choices');
  for(const preset of retiredHomeStudies)assert.ok(!presets.includes(`Version ${preset.toUpperCase()}:`),'Retired homepage studies are absent');
  assert.ok(rail.includes('study-navigation-scroll.js'),'Home relative position behavior stays loaded');
 }else{
  assert.equal((presets.match(/<a /g)||[]).length,previewPages[page].presets.length,'Each page advertises its current designs');
  if(page==='concepts')assert.ok(presets.includes('G</span><span class="preview-tab-name">&nbsp;· Content-fit box'));
  if(page==='setup')assert.ok(presets.includes('B</span><span class="preview-tab-name">&nbsp;· Guided choice'));
  assert.ok(!rail.includes('study-navigation-scroll.js'),'Secondary pages do not use homepage landmarks');
 }
 // Removing the enhancement scripts leaves a native picker and ordinary links.
 const noJS=rail.replace(/<script[\s\S]*?<\/script>/g,'');
 assert.ok(noJS.includes('<details')&&noJS.includes(previewPageURL('setup')));
}
assert.throws(()=>pageStudyNavigation('home'),/Use studyNavigation/);
assert.throws(()=>pageStudyNavigation('setup','c'),/Unknown setup preset/);
assert.throws(()=>previewPageURL('invented'),/Unknown preview page/);
const setupB=pageStudyNavigation('setup','b');
assert.ok(setupB.includes(`href="${previewPageURL('setup','b')}" aria-label="Version B: Guided choice" aria-current="page"`));
assert.equal((setupB.match(/<nav class="preview-tabs"[\s\S]*?<\/nav>/)[0].match(/aria-current="page"/g)||[]).length,1);
const conceptsG=pageStudyNavigation('concepts','g');
assert.equal(previewPageURL('concepts'),previewPageURL('concepts','g'),'G is the Design Concepts landing page');
assert.ok(conceptsG.includes(`href="${previewPageURL('concepts','g')}" aria-label="Version G: Content-fit box" aria-current="page"`));
assert.equal((conceptsG.match(/<nav class="preview-tabs"[\s\S]*?<\/nav>/)[0].match(/aria-current="page"/g)||[]).length,1);
assert.deepEqual(previewPages.concepts.presets,[['g','Content-fit box']]);
for (const preset of ['a','b','c','d','e','f','h']) {
 assert.throws(() => previewPageURL('concepts',preset), /Unknown concepts preset/);
 assert.equal(latestPreviewURL(`concepts-${preset}.html?example=1#ai`), `${previewPageURL('concepts')}?example=1#ai`);
}

const source='<a class="i-primary" href="https://villow.app/download" target="_blank" rel="noopener">Get started</a><a class="rd-concepts-link" role="link" aria-disabled="true" tabindex="0" data-a-concepts-placeholder>Explore the design concepts</a><a href="https://villow.app/roadmap#ideas">Ideas</a><a href="https://fixtheweb.org" target="_blank">Project</a><li><span>Get started</span></li>';
const localized=localizePreviewLinks(source);
assert.equal((localized.match(/setup-b\.html/g)||[]).length,2);
assert.equal((localized.match(/concepts-g\.html/g)||[]).length,2);
assert.ok(!localized.includes('aria-disabled')&&!localized.includes('data-a-concepts-placeholder'));
assert.ok(localized.includes('<a href="https://fixtheweb.org" target="_blank">Project</a>'),'Unrelated links stay external');
assert.equal(localizePreviewLinks(localized),localized,'Localizing is idempotent');
const externalQuery='<a href="https://example.com/start?a=1&amp;b=2">External</a>';
assert.equal(localizePreviewLinks(externalQuery),externalQuery,'External URL escaping stays untouched');
const localQuery=localizePreviewLinks('<a href="setup-a.html?choice=no&amp;example=1">Setup</a>');
assert.equal(localizePreviewLinks(localQuery),localQuery,'Local query escaping stays stable on repeat builds');
for(const name of ['index',...homeStudies.map(([key])=>key),...secondaryStudyRoutes.map(file=>file.replace('.html',''))]){
 const html=await readFile(new URL(`../${name}.html`,import.meta.url),'utf8');
 const home=!secondaryStudyRoutes.includes(`${name}.html`);
 assert.ok(html.includes(previewHeader({home})),`${name} renders the shared selected 34 header, including menu content`);
 assert.ok(html.includes('href="preview-header.css"'),`${name} loads the shared header styling`);
 assert.equal(applyPreviewHeader(html,{home}),html,`${name} header synchronization is idempotent`);
 assert.equal((html.match(/id="site-directory-panel"/g)||[]).length,1,`${name} has one menu`);
 for(const asset of ['preview-header.css','site-directory.css','preview-footer.css','navigation-studies.css','footer-spidey.css','site-directory.js']){
  assert.equal((html.match(new RegExp(`(?:href|src)="${asset.replaceAll('.','\\.')}"`,'g'))||[]).length,1,`${name} loads ${asset} once`);
 }
 const header=html.match(/<header\b[\s\S]*?<\/header>/)[0];
 const menuToggle=header.match(/<button class="site-directory-toggle"[\s\S]*?<\/button>/)?.[0];
 assert.match(menuToggle,/aria-label="Open menu"/);
 assert.doesNotMatch(menuToggle,/<span|>Menu</);
 assert.equal((menuToggle.match(/<path\b/g)||[]).length,2);
 const footer=html.match(/<footer class="(?:(?:n-footer|sp-footer) )?shared-preview-footer"[\s\S]*?<\/footer>/)[0];
 for(const region of [header,footer]){
  const demoLink=region.match(/<a href="([^"]+)"><span>Try Villow<\/span><\/a>/);
  assert.ok(demoLink,`${name} links directly to the interactive app preview`);
  const demo=new URL(demoLink[1].replaceAll('&amp;','&'));
  assert.equal(demo.origin+demo.pathname,'http://127.0.0.1:5173/demo');
  assert.equal(demo.searchParams.get('return'),'website');
  assert.equal(demo.searchParams.get('returnTo'),previewPageURL('home'));
  assert.ok(!region.includes('about-a.html')&&!region.includes('Contribute your skills'),`${name} retires the separate contribution page`);
  assert.ok(region.includes(`<a href="${previewPageURL('help')}"><span>Get involved</span></a>`),`${name} links to the broad involvement page`);

  assert.ok(region.includes(`<a href="${previewPageURL('concepts')}"><span>Design concepts</span></a>`),`${name} links to design concepts`);
  assert.ok(!region.includes('<li><span>Preview</span></li>'),`${name} removes the Preview placeholder`);
  assert.ok(region.includes(`<a href="${previewPageURL('contact')}"><span>Contact</span></a>`),`${name} opens the on-site contact form`);
  assert.ok(region.includes(`<a href="${previewPageURL('partners')}"><span>Partners</span></a>`),`${name} links to the partnerships page`);
 }
 const menuItems=region=>region.match(/<nav class="n-footer-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
 assert.equal(menuItems(header),menuItems(footer),`${name} menu and footer have exactly the same entries`);
 const picker=html.match(/<details class="study-page-picker">[\s\S]*?<\/details>/)[0];
 assert.ok(picker.includes(`href="${previewPageURL('home')}"`),`${name} returns to the selected home preset without JS`);
}
for(const name of ['index',...'bcdefghijklmnopqr']){
 const html=await readFile(new URL(`../${name}.html`,import.meta.url),'utf8');
 assert.ok(html.includes('study-page-picker'),`${name} has a picker`);
 assert.ok(/setup-[ab]\.html/.test(html),`${name} has a local setup entry point`);
 assert.ok(!/<a[^>]+href="https:\/\/villow\.app\/(?:download|roadmap#ideas)"/.test(html),`${name} has no live setup/concepts entry points`);
 assert.ok(!/<a[^>]+(?:rd-concepts-link|xl-concept-link|xl-concepts-link)[^>]+aria-disabled/.test(html));
}

// Exercise picker keyboard/outside-click enhancement without browser tooling.
const listeners=new Map(),documentListeners=new Map();
let focuses=0,prevented=0;
const inside={},outside={};
const picker={open:true,contains:target=>target===inside,querySelector:()=>({focus:()=>focuses++}),addEventListener:(name,fn)=>listeners.set(name,fn)};
const document={querySelectorAll:selector=>selector==='.study-page-picker'?[picker]:[],addEventListener:(name,fn)=>documentListeners.set(name,fn)};
vm.runInNewContext((await readFile(new URL('../study-page-navigation.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,''),{document,previewPageURL,previewPages,latestPreviewURL});
listeners.get('keydown')({key:'Escape',preventDefault:()=>prevented++});
assert.equal(picker.open,false);assert.equal(focuses,1);assert.equal(prevented,1);
picker.open=true;documentListeners.get('pointerdown')({target:inside});assert.equal(picker.open,true);
documentListeners.get('pointerdown')({target:outside});assert.equal(picker.open,false);
picker.open=true;listeners.get('click')({target:{closest:()=>({})}});assert.equal(picker.open,false);

// Concepts preset links transfer the topic under the rail, without intercepting
// navigation or changing homepage scroll behavior.
const conceptEvents=new Map(),railEvents=new Map();
const presetLinks=['a','b'].map(preset=>({href:`http://127.0.0.1:4411/concepts-${preset}.html`,getAttribute(){return this.href;},setAttribute(name,value){assert.equal(name,'href');this.href=value;}}));
const topicRects=[{top:450,bottom:950},{top:980,bottom:1480},{top:1510,bottom:2010}];
const topics=['corrections','creator-actions','recommendations'].map((id,index)=>{
 const topic={id,getBoundingClientRect:()=>topicRects[index],closest:()=>topic};
 return topic;
});
const heroRect={bottom:450};
const conceptHero={getBoundingClientRect:()=>heroRect};
const conceptRail={querySelectorAll:()=>presetLinks,contains:target=>presetLinks.includes(target),getBoundingClientRect:()=>({bottom:42}),addEventListener:(name,fn)=>railEvents.set(name,fn)};
const conceptDocument={querySelectorAll:selector=>selector==='[data-study-page="concepts"]'?[conceptRail]:selector==='.concepts-topic[id],.cb-section[id]'?topics:selector==='.concepts-hero,.cb-hero'?[conceptHero]:[],getElementById:id=>topics.find(topic=>topic.id===id),addEventListener:()=>{}};
const conceptWindow={innerHeight:800,location:{hash:''},addEventListener:(name,fn)=>conceptEvents.set(name,fn)};
const conceptNavigationSource=(await readFile(new URL('../study-page-navigation.js',import.meta.url),'utf8')).replace(/^import[^\n]+\n/gm,'');
const runConceptNavigation=()=>vm.runInNewContext(conceptNavigationSource,{document:conceptDocument,window:conceptWindow,requestAnimationFrame:fn=>fn(),previewPageURL,previewPages,latestPreviewURL});
runConceptNavigation();
assert.ok(presetLinks.every(link=>!link.href.includes('#')),'Hero switches to the other preset at its top');
heroRect.bottom=-110;topicRects[0]={top:-80,bottom:420};topicRects[1]={top:450,bottom:950};topicRects[2]={top:980,bottom:1480};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#corrections')),'The topic covering the viewport below the rail transfers to both presets');
topicRects[0]={top:-470,bottom:30};topicRects[1]={top:60,bottom:560};topicRects[2]={top:590,bottom:1090};
railEvents.get('pointerdown')({target:{closest:()=>presetLinks[0]}});
assert.ok(presetLinks.every(link=>link.href.endsWith('#creator-actions')),'A gap uses the nearest visible topic');
conceptEvents.get('pointerup')();
heroRect.bottom=24;topicRects[0]={top:68,bottom:174};topicRects[1]={top:188,bottom:294};topicRects[2]={top:308,bottom:414};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#corrections')),'A first topic aligned with its scroll margin is not mistaken for the hero');

// Reproduce the live B recommendations anchor and the focus-induced scroll
// that used to rewrite a correct href to the preceding chapter mid-click.
heroRect.bottom=-1200;topicRects[0]={top:-1300,bottom:-600};topicRects[1]={top:-571.406,bottom:42.219};topicRects[2]={top:42.219,bottom:936.109};
conceptWindow.location.hash='#recommendations';
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')));
railEvents.get('pointerdown')({target:{closest:()=>presetLinks[0]}});
topicRects[1]={top:-480,bottom:133};topicRects[2]={top:133,bottom:1027};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'Pointer activation keeps its topic through rail focus scrolling');
assert.ok(!railEvents.has('focusin')&&!railEvents.has('click'),'Focus/click do not recompute native link destinations');
conceptEvents.get('pointerup')();conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'A visible hash topic wins over the previous section after a focus shift');

heroRect.bottom=450;topicRects[0]={top:450,bottom:950};topicRects[1]={top:980,bottom:1480};topicRects[2]={top:1510,bottom:2010};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>!link.href.includes('#')),'Returning to the hero removes an earlier topic hash');

// A may not have run the animation frame that opens/positions its hash target
// when the visitor immediately chooses B again.
conceptWindow.location.hash='#recommendations';
runConceptNavigation();
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'A valid initial hash survives the first frame at the hero');
railEvents.get('pointerdown')({target:{closest:()=>presetLinks[1]}});
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'An immediate preset click retains the pending requested topic');
conceptEvents.get('pointerup')();
heroRect.bottom=-200;topicRects[0]={top:-172,bottom:-66};topicRects[1]={top:-52,bottom:54};topicRects[2]={top:68,bottom:600};
conceptEvents.get('scroll')();
heroRect.bottom=450;topicRects[0]={top:450,bottom:950};topicRects[1]={top:980,bottom:1480};topicRects[2]={top:1510,bottom:2010};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'Native anchor/focus movement keeps the requested hash until explicit user intent');
conceptEvents.get('pointerdown')({target:presetLinks[1]});
assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')),'Interaction with the preview rail keeps the requested topic');
for(const type of ['wheel','touchmove','keydown','pointerdown']){
 runConceptNavigation();
 assert.ok(presetLinks.every(link=>link.href.endsWith('#recommendations')));
 conceptEvents.get(type)(type==='keydown'?{key:'Home',ctrlKey:true}:type==='pointerdown'?{target:{}}:{});
 assert.ok(presetLinks.every(link=>!link.href.includes('#')),`${type} clears the requested hash when the user chooses the hero`);
}
heroRect.bottom=-120;
const aiSection={id:'ai',getBoundingClientRect:()=>({top:41,bottom:580}),closest:()=>aiSection};
let selectedIdea=null;
topics.push(aiSection);
conceptDocument.querySelector=()=>selectedIdea;
conceptWindow.location.hash='#ai';
runConceptNavigation();
assert.ok(presetLinks.every(link=>link.href.endsWith('#ai')),'The AI chapter is the fallback anchor');
selectedIdea={id:'ai-community-notes'};
conceptEvents.get('scroll')();
assert.ok(presetLinks.every(link=>link.href.endsWith('#ai-community-notes')),'The rail honours the selected idea');
console.log('Page previews: native page picker, independent real preset series, local entry points, no-JS links, Escape/outside closing and saved homepage coverage passed.');
