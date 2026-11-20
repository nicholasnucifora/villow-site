import assert from 'node:assert/strict';
import {test} from 'node:test';
import {detectExtensionStore,extensionStoreMarkup} from '../src/lib/extension-store-links.js';

const chrome='Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0.0.0 Safari/537.36';
test('store choice follows the browser without a Chrome fallback',()=>{
  for(const [userAgent,expected] of [
    [chrome,'chrome'],[chrome+' Edg/140.0','edge'],[chrome+' OPR/100.0','chrome'],
    ['Mozilla/5.0 Firefox/140.0','firefox'],['Chromium/140.0','chrome'],
    ['Version/18.0 Safari/605.1',null],['Unknown desktop',null],['',null],
    ['Mozilla/5.0 (iPhone) FxiOS/140.0 Safari/605.1',null],
    ['Mozilla/5.0 (Linux; Android 15) Chrome/140.0 Mobile Safari/537.36',null],
  ]) assert.equal(detectExtensionStore({userAgent}),expected,userAgent);
  const android={userAgent:'Mozilla/5.0 (Android 15) Firefox/140.0'};
  assert.equal(detectExtensionStore(android),'firefox');
  assert.equal(detectExtensionStore(android,true),null,'Computer advice on a phone must not pretend to detect desktop Chrome');
  assert.equal(detectExtensionStore({userAgent:chrome,platform:'MacIntel',maxTouchPoints:5}),null,'iPads with desktop UA cannot install desktop extensions');
});
test('no-JavaScript fallback exposes ordinary links and no badge',()=>{
  const html=extensionStoreMarkup();
  assert.match(html,/data-store-badge hidden/);
  assert.equal((html.match(/<li data-store-alternative=/g)||[]).length,3);
  assert.doesNotMatch(html,/<button|img src=/);
});
