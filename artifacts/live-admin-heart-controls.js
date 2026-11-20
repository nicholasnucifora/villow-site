
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
