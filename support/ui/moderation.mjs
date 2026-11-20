export const adminHTML = local => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Supporter messages · Fix the Web</title><link rel="stylesheet" href="/admin/support/app.css"><script type="module" src="/admin/support/app.js"></script></head><body>
<main><header><div><p class="eyebrow">Fix the Web / Villow</p><h1>Supporter messages</h1></div><button id="logout" hidden>Sign out</button></header>
${local ? '<aside class="preview">Local preview · fictional messages only. Changes here never affect live supporters. <a href="/__support-review/">View the example public page</a></aside>' : ''}
<section id="login-panel" class="login" hidden><h2>A quiet place to review.</h2><p>Sign in to manage the names and messages shared by supporters.</p><form id="login"><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" required maxlength="200"><button class="primary" type="submit">Sign in</button></form>${local ? '<p class="hint">Demo password: <code>villow-local-review</code></p>' : ''}</section>
<section id="workspace" hidden><p class="intro">Unreviewed messages are already visible. Approve the ones you’ve checked, or hide them. Messages needing review stay private until you decide.</p>
<nav id="filters" aria-label="Filter messages"><button data-state="unreviewed" aria-pressed="true">Unreviewed <span></span></button><button data-state="needs_review" aria-pressed="false">Needs review <span></span></button><button data-state="approved" aria-pressed="false">Approved <span></span></button><button data-state="hidden" aria-pressed="false">Hidden <span></span></button><button data-state="all" aria-pressed="false">All <span></span></button></nav>
<div class="toolbar"><p id="filter-help"></p><label>Sort <select id="order"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><button id="refresh">Refresh</button></div>
<ul id="messages" aria-label="Supporter messages"></ul><p id="empty" hidden>No messages in this view.</p>
<nav class="pagination" aria-label="Message pages"><button id="previous">Previous</button><span id="page"></span><button id="next">Next</button></nav></section>
<p id="status" role="status">Checking your sign-in…</p><p id="error" role="alert" hidden></p></main></body></html>`;

export const adminCSS = `
.version-preview{border:1px solid #cbd7c5;background:#f5f7ef;border-radius:12px;padding:16px;margin:16px 0}.version-preview h3{font-size:13px;font-weight:600;margin:0 0 14px;color:#617265}.version-preview strong{overflow-wrap:anywhere}.version-preview .hint{font-size:13px}.version-preview button{font-size:13px}
:root{font-family:ui-rounded,"Segoe UI",system-ui,sans-serif;color:#274b3e;background:#fbfaf3;font-synthesis:none}*{box-sizing:border-box}body{margin:0}main{max-width:960px;margin:0 auto;padding:48px 24px 80px}header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:30px}.eyebrow{font-size:13px;color:#617265;margin:0 0 7px}h1{font-size:32px;letter-spacing:-.8px;font-weight:600;margin:0}h2{font-weight:600}p{line-height:1.65}button,input,select{font:inherit}button,select{border:0;border-radius:12px;padding:11px 16px;color:inherit;background:#e8eddf}button{cursor:pointer;font-weight:600}button:hover:not(:disabled){background:#dbe5d0}button:disabled{opacity:.5;cursor:default}button.primary,button[data-state][aria-pressed=true]{background:#365c47;color:#fff}.login{max-width:420px;margin:50px auto}.login form{display:grid;gap:12px}.login input{min-width:0;width:100%;border:1px solid #b6c8b3;border-radius:10px;padding:13px;background:#fff}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:3px solid #8fae87;outline-offset:3px}.preview{border-radius:14px;background:#f1ead9;padding:16px 20px;margin-bottom:24px;font-size:14px;line-height:1.6}.preview a{color:inherit}.intro{max-width:740px;color:#53685b;font-size:15px;margin-bottom:25px}#filters{display:flex;gap:8px;flex-wrap:wrap}#filters span{font-size:12px;margin-left:7px;opacity:.8}.toolbar{display:flex;gap:12px;align-items:center;margin:24px 0}.toolbar p{margin:0;flex:1;color:#617265;font-size:14px}.toolbar label{white-space:nowrap;font-size:13px}.toolbar select{padding:9px;font-size:13px;background:transparent}#messages{list-style:none;padding:0;margin:0;display:grid;gap:16px}.message{background:#fff;border-radius:18px;padding:24px;box-shadow:0 2px 14px #284b3610}.message header{margin:0;align-items:start}.message h2{font-size:18px;margin:0;overflow-wrap:anywhere}.badge{border-radius:8px;padding:5px 9px;font-size:12px;white-space:nowrap;background:#eef1e8;color:#52634f}.badge[data-state=needs_review]{background:#f4ead7;color:#7b6138}.badge[data-state=hidden]{background:#f1e8e3;color:#7a5d50}.message p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:16px;color:#334c40;margin:18px 0}.actions{display:flex;flex-wrap:wrap;gap:8px}.actions button,.actions select{font-size:13px;padding:9px 13px}.actions select{background:transparent}.pagination{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:28px;font-size:13px}#error{color:#8a493c}#status:empty{display:none}.hint,#empty{color:#6c796c;font-size:14px}[hidden]{display:none!important}@media(max-width:600px){main{padding:25px 16px 50px}h1{font-size:26px}header{align-items:start}.toolbar{flex-wrap:wrap}.toolbar p{flex-basis:100%}.message{padding:19px}#filters{gap:6px}#filters button{font-size:13px;padding:10px}header #logout{white-space:nowrap}.message header{gap:10px}}
`;

export const adminJS = `
const get = selector => document.querySelector(selector);
const labels = {unreviewed:'Unreviewed',needs_review:'Needs review',approved:'Approved',hidden:'Hidden',all:'All'};
const descriptions = {unreviewed:'Visible publicly · not yet checked by you',needs_review:'Private · waiting for your review',approved:'Visible publicly · checked by you',hidden:'Private · hidden by you',all:'All shared names and messages'};
let state='unreviewed',page=0,busy=false,requestId=0;
async function api(path,body){
  const response=await fetch('/admin/support/api/'+path,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000),...(body?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
  const data=await response.json();
  if(!response.ok)throw Object.assign(new Error(data.error||'Please try again.'),{status:response.status});
  return data;
}
function signedIn(value){get('#workspace').hidden=!value;get('#logout').hidden=!value;get('#login-panel').hidden=value;if(!value){requestId++;get('#messages').replaceChildren();get('#password').value='';}}
function error(err){if(err.status===401)signedIn(false);get('#error').textContent=err.message||'We couldn’t connect. Please try again.';get('#error').hidden=false;get('#status').textContent='';}
function lock(value){busy=value;for(const el of document.querySelectorAll('#workspace button,#workspace select,#logout'))el.disabled=value||el.dataset.current==='true';}
async function decide(record,status,variant='keep'){
  if(busy)return;lock(true);get('#error').hidden=true;get('#status').textContent='Saving…';let saved=false;
  try{await api('decision',{id:record.id,version:record.version,status,variant});get('#status').textContent=variant==='censored'?'Censored version published.':variant==='original'?'Original version published.':'Moved to '+labels[status]+'.';await load();saved=true;}
  catch(err){error(err);}finally{lock(false);updatePaging();if(saved)(get('#messages button:not(:disabled)')||get('#filters button[aria-pressed=true]')).focus();}
}
let paging={page:0,hasMore:false};
function updatePaging(){get('#previous').disabled=busy||!paging.page;get('#next').disabled=busy||!paging.hasMore;}
function card(record){
  const li=document.createElement('li');li.className='message';
  const header=document.createElement('header'),name=document.createElement('h2'),badge=document.createElement('span');name.textContent=record.name||'Anonymous';badge.textContent=labels[record.status];badge.className='badge';badge.dataset.state=record.status;header.append(name,badge);li.append(header);
  const text=document.createElement('p');text.textContent=record.message||'No message shared.';li.append(text);
  function versionBox(title,version){const box=document.createElement('section');box.className='version-preview';const heading=document.createElement('h3');heading.textContent=title;const n=document.createElement('strong');n.textContent=version.name||'Anonymous';const m=document.createElement('p');m.textContent=version.message||'No message shared.';box.append(heading,n,m);return box;}
  if(record.censored){const current=versionBox('Censored public version',{name:record.publicName,message:record.publicMessage});const note=document.createElement('p');note.className='hint';note.textContent='The original above is kept for your review. This version is shown only while the message is visible.';current.append(note);li.append(current);}
  const actions=document.createElement('div');actions.className='actions';
  for(const [status,label] of [['approved','Approve'],['hidden','Hide']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.dataset.current=String(record.status===status);button.disabled=record.status===status;button.addEventListener('click',()=>void decide(record,status));actions.append(button);}
  const more=document.createElement('select');more.setAttribute('aria-label','Move message from '+(record.name||'Anonymous'));
  for(const [value,label] of [['','Move to…'],['unreviewed','Unreviewed (visible)'],['needs_review','Needs review (private)']]){const option=document.createElement('option');option.value=value;option.textContent=label;more.append(option);}
  more.addEventListener('change',()=>{const value=more.value;more.value='';if(value)void decide(record,value);});actions.append(more);li.append(actions);
  if(record.suggestion.changed&&(!record.censored||record.publicName!==record.suggestion.name||record.publicMessage!==record.suggestion.message)){
    const preview=versionBox('Suggested public version',record.suggestion);preview.hidden=true;
    const note=document.createElement('p');note.className='hint';note.textContent='Detected words are fully replaced with hearts. Check the whole message before publishing; the original stays available here.';preview.append(note);
    const publish=document.createElement('button');publish.type='button';publish.className='primary';publish.textContent='Publish censored version';publish.addEventListener('click',()=>void decide(record,'approved','censored'));preview.append(publish);
    const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Preview censored version';toggle.setAttribute('aria-expanded','false');toggle.addEventListener('click',()=>{preview.hidden=!preview.hidden;toggle.setAttribute('aria-expanded',String(!preview.hidden));toggle.textContent=preview.hidden?'Preview censored version':'Close preview';});actions.append(toggle);li.append(preview);
  }
  if(record.censored){
    const restore=document.createElement('button');restore.type='button';restore.textContent='Publish original…';const confirm=document.createElement('div');confirm.className='version-preview';confirm.hidden=true;
    const note=document.createElement('p');note.textContent='Publish the original name and message shown above, including any uncensored words?';const yes=document.createElement('button');yes.type='button';yes.textContent='Publish original';yes.addEventListener('click',()=>void decide(record,'approved','original'));confirm.append(note,yes);
    restore.addEventListener('click',()=>{confirm.hidden=!confirm.hidden;});actions.append(restore);li.append(confirm);
  }
  return li;
}
async function load(){
  const id=++requestId;get('#error').hidden=true;
  try{
    const data=await api('messages?'+new URLSearchParams({state,page:String(page),order:get('#order').value}));if(id!==requestId)return;
    if(!data.messages.length&&page>0){page--;return load();}
    paging=data;get('#messages').replaceChildren(...data.messages.map(card));get('#empty').hidden=!!data.messages.length;
    for(const button of document.querySelectorAll('[data-state]')){if(button.tagName!=='BUTTON')continue;button.setAttribute('aria-pressed',String(button.dataset.state===state));button.querySelector('span').textContent=data.counts[button.dataset.state];}
    get('#filter-help').textContent=descriptions[state];get('#page').textContent='Page '+(page+1);updatePaging();
  }catch(err){if(id===requestId){error(err);throw err;}}
}
async function reload(){if(busy)return;lock(true);get('#status').textContent='Loading messages…';try{await load();get('#status').textContent='';}catch{}finally{lock(false);updatePaging();}}
get('#login').addEventListener('submit',async event=>{event.preventDefault();const button=get('#login button');button.disabled=true;get('#error').hidden=true;get('#status').textContent='Signing in…';try{await api('login',{password:get('#password').value});get('#password').value='';signedIn(true);await reload();}catch(err){error(err);}finally{button.disabled=false;}});
get('#logout').addEventListener('click',async()=>{if(busy)return;lock(true);try{await api('logout',{});signedIn(false);get('#status').textContent='Signed out.';get('#password').focus();}catch(err){error(err);}finally{lock(false);}});
for(const button of document.querySelectorAll('#filters button'))button.addEventListener('click',()=>{state=button.dataset.state;page=0;void reload();});
get('#order').addEventListener('change',()=>{page=0;void reload();});get('#refresh').addEventListener('click',()=>void reload());
get('#previous').addEventListener('click',()=>{page--;void reload();});get('#next').addEventListener('click',()=>{page++;void reload();});
async function start(){try{await api('session');signedIn(true);await reload();}catch(err){if(err.status===401){signedIn(false);get('#status').textContent='';}else error(err);}}
window.addEventListener('pagehide',()=>signedIn(false));window.addEventListener('pageshow',event=>{if(event.persisted)void start();});void start();
`;
