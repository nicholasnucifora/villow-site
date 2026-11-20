import {HttpError} from './config.mjs';
import {normaliseEmail,privateHash,rateLimit} from './privacy.mjs';

const topics={general:'General enquiry',code:'Code, testing or documentation',design:'Design feedback or research',policy:'Policy or organisations',sharing:'Creators, media or sharing'};
export function contactReady(env){return env.CONTACT_ENABLED==='true'&&Boolean(env.CONTACT_TO&&env.RESEND_API_KEY&&env.MAIL_FROM);}

export async function sendContact(env,projectId,input,fetcher=fetch){
 if(!contactReady(env))throw new HttpError(503,'The contact form is temporarily unavailable. Please try again later.');
 if(!input||typeof input!=='object'||Array.isArray(input))throw new HttpError(400,'Enter your email and a message.');
 if(input.website)throw new HttpError(400,'We couldn’t accept this submission. Please try again.');
 const email=normaliseEmail(input.email);
 if(/[\r\n<>\u0000]/.test(email))throw new HttpError(400,'Enter a valid email address.');
 if(typeof input.message!=='string'||input.message.trim().length<10||input.message.length>3000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(input.message))throw new HttpError(400,'Write a message between 10 and 3,000 characters.');
 if(typeof input.topic!=='string'||!Object.hasOwn(topics,input.topic))throw new HttpError(400,'Choose a message topic.');
 if(typeof input.requestId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.requestId))throw new HttpError(400,'Please reload the form and try again.');
 const emailHash=await privateHash(env,`contact-email:${email}`);
 await rateLimit(env.DB,`contact:${projectId}:${emailHash}`,5,3600);
 // The visitor controls reply-to and plain text only, never sender/recipient.
 const result=await fetcher('https://api.resend.com/emails',{
  method:'POST',signal:AbortSignal.timeout(15000),
  headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact/${projectId}/${emailHash}/${input.requestId}`},
  body:JSON.stringify({from:env.MAIL_FROM,to:[env.CONTACT_TO],reply_to:email,
   subject:`Villow — ${topics[input.topic]}`,
   text:`From: ${email}\nTopic: ${topics[input.topic]}\n\n${input.message.trim()}`}),
 });
 if(!result.ok)throw new HttpError(503,'We couldn’t send your message. Please try again later.');
 const accepted=await result.json();
 if(typeof accepted?.id!=='string'||!accepted.id)throw new HttpError(503,'We couldn’t confirm delivery. Please try again.');
 return {sent:true};
}
