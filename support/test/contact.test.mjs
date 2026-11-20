import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorker} from '../worker.mjs';
import {database,environment} from './helpers.mjs';
const payload={email:'visitor@example.com',message:'I have an idea for improving the design.',topic:'design',website:'',requestId:'12345678-1234-4123-8123-123456789abc'};
function setup(fetcher=async()=>Response.json({id:'mail-test'})){
 const db=database(),env={...environment(db),CONTACT_ENABLED:'true',CONTACT_TO:'support@villow.app'};
 const worker=createWorker({contactFetch:fetcher});
 const request=(body=payload,origin='https://villow.example')=>worker.fetch(new Request('https://api.example/v1/projects/villow/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),env);
 return {db,env,worker,request};
}
test('contact sends plain text to the fixed inbox with reply-to and stable retry key',async()=>{
 const sent=[];const {request,db}=setup(async(url,options)=>{sent.push({url,...options});return Response.json({id:'mail-test'});});
 try{
  for(let i=0;i<2;i++){const result=await request({...payload,to:'attacker@example.com',from:'spoof@example.com'});assert.equal(result.status,200);assert.deepEqual(await result.json(),{sent:true});}
  const mail=JSON.parse(sent[0].body);assert.deepEqual(mail.to,['support@villow.app']);assert.equal(mail.from,'test@example.com');assert.equal(mail.reply_to,payload.email);assert.equal(mail.html,undefined);assert.match(mail.text,/improving the design/);
  assert.equal(sent[0].headers['Idempotency-Key'],sent[1].headers['Idempotency-Key']);assert.ok(!sent[0].headers['Idempotency-Key'].includes(payload.email));
  assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM contributions').get().n,0);
 }finally{db.sqlite.close();}
});
test('invalid input and foreign origins never send email',async()=>{
 for(const body of [null,{...payload,email:'bad'},{...payload,email:'x@example.com\r\nBcc:a@b.com'},{...payload,message:'short'},{...payload,message:'x'.repeat(3001)},{...payload,topic:'__proto__'},{...payload,requestId:'bad'},{...payload,website:'spam'}]){
  let calls=0;const {request,db}=setup(async()=>{calls++;return Response.json({id:'mail-test'});});
  try{assert.equal((await request(body)).status,400);assert.equal(calls,0);}finally{db.sqlite.close();}
 }
 const {request,db}=setup(()=>{throw Error('must not send');});
 try{assert.equal((await request(payload,'https://evil.example')).status,403);}finally{db.sqlite.close();}
});
test('provider failures, missing configuration and rate limiting never report success',async()=>{
 for(const response of [()=>new Response('',{status:500}),()=>Response.json({})]){
  const {request,db}=setup(async()=>response());try{assert.equal((await request()).status,503);}finally{db.sqlite.close();}
 }
 const {request,env,db}=setup();
 try{env.CONTACT_ENABLED='false';assert.equal((await request()).status,503);}finally{db.sqlite.close();}
 const limited=setup();try{for(let i=0;i<5;i++)assert.equal((await limited.request()).status,200);assert.equal((await limited.request()).status,429);}finally{limited.db.sqlite.close();}
});
