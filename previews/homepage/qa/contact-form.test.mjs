import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {contactForm,contactPageBody} from '../contact-form.mjs';
import {helpPageBody} from '../help-page-a.mjs';
import {partnersPageBody} from '../partners-page.mjs';
import {latestPreviewURL,previewPageURL,previewPages} from '../preview-pages.js';

const source=(await readFile(new URL('../contact-form.js',import.meta.url),'utf8')).replace('export function','function');
function fixture(fetcher){
 const button={disabled:true,textContent:'Send message'},status={dataset:{},textContent:''};
 const fields=['email','topic','message','website'].map(name=>({name,disabled:false}));
 const form={dataset:{},values:{email:'visitor@example.com',topic:'code',message:'I can help improve the codebase.',website:''},valid:true,
  reportValidity(){return this.valid;},reset(){this.values={email:'',topic:'general',message:'',website:''};},
  querySelector(selector){return selector==='[type=submit]'?button:selector==='[data-contact-status]'?status:fields.find(field=>selector.includes(field.name));},
  querySelectorAll(){return fields;},addEventListener(type,handler){this.submit=handler;},
 };
 const root={querySelectorAll(selector){return selector==='[data-contact-form]'?[form]:[];}};
 const context={fetch:fetcher,FormData:class{constructor(form){this.values={...form.values};}get(key){return this.values[key];}},AbortSignal,document:{documentElement:{dataset:{}},querySelectorAll:()=>[]}};
 vm.createContext(context);vm.runInContext(source,context);
 let ids=0;context.initialiseContactForms(root,{fetcher,uuid:()=>`request-${++ids}`});
 return {form,button,status,fields,submit:()=>form.submit({preventDefault(){}})};
}
test('Get involved links to Partners and the Contact page owns the form',()=>{
 const help=helpPageBody(),contact=contactPageBody(),partners=partnersPageBody();
 assert.doesNotMatch(help,/data-contact-form|Leave a message below/);
 assert.match(help,/class="sp-button-secondary" href="partners-a.html">Partner with Villow/);
 assert.match(help,/Join us on Reddit or Discord to share ideas or help with the codebase, research or design decisions/);
 assert.match(partners,/href="contact-a.html#contact">Get in touch/);
 assert.doesNotMatch(partners,/data-contact-form/);
 assert.ok(contact.includes(contactForm('contact-page')));
 for(const text of ['MPs, senators','organisations','content creators','codebase','design decisions'])assert.ok(help.includes(text));
 assert.doesNotMatch(help,/mailto:|Contribute your skills|about-a.html|about-team|about-message/);
 assert.equal(previewPages.about,undefined);
 assert.equal(latestPreviewURL('about-a.html#contact'),`${previewPageURL('help')}#contact`);
});
test('failed delivery preserves the draft and retry identity; accepted delivery clears it',async()=>{
 const sent=[];let ok=false;
 const f=fixture(async(_url,options)=>{sent.push(JSON.parse(options.body));return {ok,status:ok?200:503,json:async()=>ok?{sent:true}:{error:'Unavailable'}};});
 await f.submit();assert.equal(f.form.values.email,'visitor@example.com');assert.match(f.status.textContent,/draft is still here/);assert.equal(f.button.disabled,false);
 ok=true;await f.submit();assert.equal(sent[0].requestId,sent[1].requestId);assert.equal(f.form.values.message,'');assert.match(f.status.textContent,/message has been sent/);assert.ok(f.fields.every(field=>!field.disabled));
});
test('pending sends lock edits and duplicate submissions; invalid fields make no request',async()=>{
 let finish,calls=0;const f=fixture(()=>{calls++;return new Promise(resolve=>finish=resolve);});
 f.form.valid=false;await f.submit();assert.equal(calls,0);
 f.form.valid=true;const pending=f.submit();await f.submit();assert.equal(calls,1);assert.equal(f.button.disabled,true);assert.ok(f.fields.every(field=>field.disabled));
 finish({ok:true,status:200,json:async()=>({sent:true})});await pending;assert.equal(f.button.disabled,false);
});
