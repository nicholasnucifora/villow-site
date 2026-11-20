import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {decodeStudyPosition,studyPositionURL,studyScrollTarget} from '../study-navigation-scroll.js';

const state={v:1,k:'together',f:.5,y:.42,r:.37,t:'usage',s:'pattern'};
const url=new URL(studyPositionURL('http://127.0.0.1:4410/q.html',state));
assert.equal(url.origin,'http://127.0.0.1:4410');
assert.equal(url.hash,'#watch-together');
assert.deepEqual(decodeStudyPosition(url.searchParams.get('study-position')),state);
assert.equal(new URL(studyPositionURL('http://127.0.0.1:4409/p.html',{...state,k:'comparison:usage'})).hash,'#xl-topic-usage');
assert.equal(new URL(studyPositionURL('http://127.0.0.1:4410/q.html',{...state,k:'hero'})).hash,'');
assert.equal(new URL(studyPositionURL('http://127.0.0.1:4410/q.html?retained=1',state)).searchParams.get('retained'),'1');
const controlURL=new URL(studyPositionURL('http://127.0.0.1:4411/s.html',{...state,k:'control'}));
assert.equal(controlURL.hash,'#your-control');
assert.equal(decodeStudyPosition(controlURL.searchParams.get('study-position')).k,'control');
for (const path of ['/', '/previews/home-device-landscapes', '/previews/home-device-feed']) {
 const devices=new URL(studyPositionURL('http://127.0.0.1:4411'+path,{...state,k:'devices'}));
 assert.equal(devices.hash,'#across-devices');
 assert.equal(devices.searchParams.has('study-position'),false);
}

// A semantic position survives different page lengths and section sizes.
assert.equal(studyScrollTarget(state,{top:100,height:400},2000,1000,6000),1880);
assert.equal(studyScrollTarget(state,{top:100,height:400},4500,1000,9000),4380);
assert.equal(studyScrollTarget(state,{top:100,height:800},2000,1000,6000),2080);
assert.equal(studyScrollTarget(state,null,0,1000,9000),3330);
assert.equal(studyScrollTarget({...state,f:0},{top:-100,height:400},0,1000,6000),0);
assert.equal(studyScrollTarget({...state,f:1,y:0},{top:100,height:400},5900,1000,6000),6000);
for(const invalid of [null,'','{}','{',JSON.stringify({...state,v:2}),JSON.stringify({...state,k:'untrusted-selector'}),JSON.stringify({...state,f:10}),JSON.stringify({...state,y:-1}),JSON.stringify({...state,r:2})]) assert.equal(decodeStudyPosition(invalid),null);
assert.deepEqual(decodeStudyPosition(JSON.stringify({...state,t:'unknown',s:'unknown'})),{v:1,k:'together',f:.5,y:.42,r:.37});

// Exercise native rail activation without a browser or production dependencies.
const source=(await readFile(new URL('../study-navigation-scroll.js',import.meta.url),'utf8')).replace(/^export /gm,'').replace(/^import .*;\r?\n/gm,'');
const handlers=new Map(),scrollCalls=[];
let sectionTop=100;
const links=[
 {href:'http://127.0.0.1:4409/p.html',offsetLeft:0},
 {href:'http://127.0.0.1:4410/q.html',offsetLeft:100},
];
for(const link of links)link.closest=()=>link;
const nav={clientWidth:800,offsetLeft:0,scrollLeft:0,querySelectorAll:()=>links,querySelector:()=>links[0],addEventListener:(type,handler)=>handlers.set(type,handler)};
const section={getBoundingClientRect:()=>({top:sectionTop,bottom:sectionTop+400,height:400,width:460}),closest:()=>null};
const document={
 readyState:'complete',documentElement:{scrollHeight:7000,style:{}},
 querySelector:selector=>selector==='.study-navigation .preview-tabs'?nav:selector==='.study-navigation'?{getBoundingClientRect:()=>({bottom:40})}:selector==='#watch-together'?section:null,
 querySelectorAll:()=>[],
};
const context={document,innerHeight:1000,scrollY:2000,URL,Set,Map,JSON,Math,Number,Promise,console,location:{href:'http://127.0.0.1:4409/p.html#watch-together'},history:{scrollRestoration:'auto'},window:{scrollTo:value=>scrollCalls.push(value)}};
vm.runInNewContext(source,{...context,addControlStudyLinks:()=>{}});
assert.equal(scrollCalls.length,0,'A direct normal anchor must not trigger custom restoration');
assert.equal(context.history.scrollRestoration,'auto');
assert.equal(nav.scrollLeft,0,'Existing rail positioning remains active');
for(const [name,type,extra]of[
 ['ordinary click','click',{}],
 ['keyboard activation','click',{detail:0}],
 ['modified click','click',{ctrlKey:true,metaKey:true}],
 ['middle click','auxclick',{button:1}],
 ['context-menu new tab','contextmenu',{}],
]){
 sectionTop-=20;
 handlers.get(type)({target:links[1],...extra});
 const target=new URL(links[1].href),position=decodeStudyPosition(target.searchParams.get('study-position'));
 assert.equal(target.origin,'http://127.0.0.1:4410',name);
 assert.equal(target.hash,'#watch-together',name);
 assert.equal(position.k,'together',name);
 assert.equal(position.f,Math.round((420-sectionTop)/400*100000)/100000,name);
}
handlers.get('pointerdown')({target:links[1]});
const beforeFocus=links[1].href;
sectionTop+=700;
handlers.get('focusin')({target:links[1]});
handlers.get('click')({target:links[1]});
assert.equal(links[1].href,beforeFocus,'Rail focus must preserve the section captured on pointerdown');
handlers.get('pointercancel')();
console.log('Preview navigation: URL transport, semantic position, fallback, validation, native/keyboard/modified/new-tab activation, rail focus and direct anchors passed.');
