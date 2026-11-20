const endpoint='https://fixtheweb-support.nuciforan.workers.dev/v1/projects/villow/contact';

export function initialiseContactForms(root=document,{fetcher=fetch,uuid=()=>crypto.randomUUID()}={}) {
 for(const form of root.querySelectorAll('[data-contact-form]')) {
  if(form.dataset.contactReady)continue;
  form.dataset.contactReady='true';
  const button=form.querySelector('[type=submit]'),status=form.querySelector('[data-contact-status]');
  let busy=false,requestId=null,submittedPayload='';
  button.disabled=false;
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   if(busy||!form.reportValidity())return;
   if(document.documentElement.dataset.supportPreview){status.textContent='Sending is unavailable in this sample view.';return;}
   const data=new FormData(form);
   const values={email:data.get('email'),topic:data.get('topic'),message:data.get('message'),website:data.get('website')};
   const payload=JSON.stringify(values);
   if(payload!==submittedPayload||!requestId){requestId=uuid();submittedPayload=payload;}
   busy=true;button.disabled=true;button.textContent='Sending…';status.textContent='';status.dataset.error='false';
   // Keep the submitted draft stable until the response arrives.
   const fields=[...form.querySelectorAll('input,select,textarea')];fields.forEach(field=>field.disabled=true);
   try {
    const response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,requestId}),signal:AbortSignal.timeout(20000)});
    const result=await response.json();
    if(!response.ok||result.sent!==true){const error=new Error([400,429].includes(response.status)&&typeof result.error==='string'?result.error:'We couldn’t send your message. Your draft is still here. Please try again later.');error.contactMessage=true;throw error;}
    form.reset();requestId=null;submittedPayload='';status.textContent='Thanks—your message has been sent. We can reply to the email you provided.';
   } catch(error) {
    status.dataset.error='true';status.textContent=error.name==='TimeoutError'?'We couldn’t confirm delivery. Your draft is still here; you can safely try again.':error.contactMessage?error.message:'We couldn’t send your message. Your draft is still here. Please check your connection and try again.';
   } finally {busy=false;fields.forEach(field=>field.disabled=false);button.disabled=false;button.textContent='Send message';}
  });
 }
 root.querySelectorAll('[data-contact-topic]').forEach(link=>link.addEventListener('click',()=>{
  const form=root.querySelector('[data-contact-form]');
  if(form&&!form.querySelector('[name=topic]').disabled)form.querySelector('[name=topic]').value=link.dataset.contactTopic;
 }));
}
if(typeof document!=='undefined')initialiseContactForms();
