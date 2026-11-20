import {videos,feedIds} from './n-data.js';
import {setupThumbnailFeed} from './w-thumbnail-feed.js';
import {horizontalSwipe,cardSwipeOffset} from './horizontal-swipe.js';

// Same clock/trash paths and feedback progression as the app's
// HomeSwipeFeedback / VideoActionIcons, adapted to this buildless demo.
const swipeIcons = {
 save: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
 remove: 'M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16',
};
function showSwipeFeedback(card, offset) {
 const feedback = card.querySelector('.ifs-swipe-feedback');
 const action = offset > 0 ? 'save' : 'remove';
 if (feedback.dataset.action !== action) {
  feedback.dataset.action = action;
  feedback.innerHTML = `<span class="wf-swipe-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${swipeIcons[action]}"/></svg></span>`;
 }
 const progress = Math.pow(Math.min(1, Math.max(0, Math.abs(offset) - 22) / 72), .85);
 feedback.style.setProperty('--wf-swipe-progress', String(progress));
 feedback.style.setProperty('--wf-swipe-scale', String(.68 + progress * .4));
 feedback.style.setProperty('--wf-swipe-tint', action === 'remove' ? `rgba(0,0,0,${.08+progress*.24})` : `rgba(36,93,81,${.04+progress*.18})`);
}

export function createWFeedState(ids=feedIds){
 let remaining=[...ids];const saved=new Set();
 return{get remaining(){return remaining;},get current(){return remaining[0];},saved,
  choose(id,action){if(!remaining.length||id!==remaining[0]||!['save','remove'].includes(action))return false;if(action==='save')saved.add(id);remaining=remaining.filter(item=>item!==id);return true;},
 };
}
for(const demo of typeof document==='undefined'?[]:document.querySelectorAll('[data-wf-demo]')){
 const stack=demo.querySelector('[data-ifs-stack]'),complete=demo.querySelector('[data-wf-complete]'),status=demo.querySelector('[data-wf-status]');
 if(!stack||!complete||!status)continue;
 const thumbnailFeed = demo.hasAttribute('data-thumbnail-feed');
 if (thumbnailFeed) setupThumbnailFeed(demo);
 const model=createWFeedState(),media=matchMedia('(prefers-reduced-motion:reduce)'),active=new Set(),settling=new Map(),returning=new Map();
 let busy=false,celebrated=false,gesture;
 const reduced=()=>media.matches;
 const announce=message=>{status.textContent=message;};
 function cancelDrag(){gesture?.cancel();}
 function finishMotion(){cancelDrag();for(const animation of active){try{animation.finish();}catch{animation.cancel();}}}
 media.addEventListener('change',event=>{if(event.matches)finishMotion();});window.addEventListener('resize',finishMotion);
 async function animate(node,frames,options,allowReduced=false,channel){
  if(reduced()&&!allowReduced||typeof node?.animate!=='function')return;
  let animation;try{animation=node.animate(frames,options);active.add(animation);if(channel)channel.set(node,animation);await animation.finished.catch(()=>{});}catch{}finally{if(animation)active.delete(animation);if(channel?.get(node)===animation)channel.delete(node);}
 }
 function sync(){const done=!model.remaining.length;stack.hidden=done;complete.hidden=!done;demo.dataset.wfCount=String(model.remaining.length);demo.dataset.wfSaved=String(model.saved.size);if(done&&!celebrated){celebrated=true;complete.classList.add('is-celebrating');}}
 function setBusy(value){if(value)cancelDrag();busy=value;stack.setAttribute('aria-busy',String(value));demo.querySelectorAll('button').forEach(button=>button.disabled=value);}
 function promote(){
  const cards=model.remaining.map(id=>stack.querySelector(`[data-ifs-card="${id}"]`)).filter(Boolean),before=cards.map(card=>getComputedStyle(card).transform);
  // A fast next swipe can advance the stack before its previous shuffle ends.
  // Continue each remaining card from its displayed pose, without old animations
  // later restoring an obsolete depth or blocking the new front card.
  cards.forEach(card=>settling.get(card)?.cancel());
  cards.forEach((card,depth)=>{card.classList.toggle('ifs-front',!depth);card.classList.toggle('ifs-back',!!depth);card.style.setProperty('--ifs-depth',String(depth));card.inert=!!depth;if(depth)card.setAttribute('aria-hidden','true');else card.removeAttribute('aria-hidden');card.querySelectorAll('button').forEach(button=>button.tabIndex=depth?-1:0);});
  cards.forEach((card,index)=>void animate(card,[{transform:before[index]},{transform:getComputedStyle(card).transform}],{duration:reduced()?140:180,easing:'cubic-bezier(.2,.7,.3,1)'},true,settling));
  sync();
 }
 async function exitCard(card,action){
  // Freeze the exact combined shuffle/drag pose before replacing it with the exit.
  const pose=getComputedStyle(card),from=pose.transform,translate=pose.translate||'0px',rotate=pose.rotate||'0deg';
  settling.get(card)?.cancel();returning.get(card)?.cancel();
  Object.assign(card.style,{transform:from,translate,rotate});
  if(reduced()){await animate(card,[{opacity:1},{opacity:0}],{duration:160,fill:'forwards'},true);return;}
  const width=card.offsetWidth,wide=window.innerWidth>=640;
  const dx=(wide?width+72:Math.max(width+120,window.innerWidth+width*.35))*(action==='save'?1:-1);
  const angle=(parseFloat(getComputedStyle(card).getPropertyValue('--ifs-front-angle'))||0)+(action==='save'?1:-1)*(wide?2.5:5);
  const start=new DOMMatrixReadOnly(from).m41+(parseFloat(translate)||0),remaining=Math.min(1,Math.abs(dx-start)/Math.max(width,window.innerWidth*.85));
  const duration=wide?240:Math.round(Math.max(210,Math.min(380,220+remaining*170-Math.min(1,Math.abs(start)/Math.max(72,width*.56))*70)));
  await animate(card,[{transform:from,translate,rotate,opacity:1},{transform:`translateX(${dx}px) rotate(${angle}deg) scale(.985)`,translate:'0px',rotate:'0deg',opacity:0}],{duration,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
 }
 async function choose(id,action,keyboard){
  if(busy||id!==model.current)return;const card=stack.querySelector(`[data-ifs-card="${id}"]`);if(!card)return;setBusy(true);
  try{await exitCard(card,action);}finally{try{card.remove();model.choose(id,action);promote();}finally{setBusy(false);announce(`${videos[id].title}. ${action==='save'?'Saved to Watch Later.':'Removed from the feed.'}${model.remaining.length?'':' All caught up.'}`);if(keyboard)(stack.querySelector(`.ifs-front button[data-ifs-action="${action}"]`)||complete.querySelector('h3')).focus({preventScroll:true});}}
 }
 demo.addEventListener('click',event=>{const button=event.target.closest('button[data-ifs-action]');if(!button||button.disabled)return;const action=button.dataset.ifsAction;if(action==='save'||action==='remove')void choose(button.dataset.ifsId,action,event.detail===0);});
 gesture=horizontalSwipe(stack,{
  begin(event){
   if(busy||event.target.closest('a,input,select,textarea,[contenteditable="true"],[data-no-swipe],button:not(.wf-sample)'))return;
   if(thumbnailFeed&&!['touch','pen'].includes(event.pointerType))return;
   const card=event.target.closest('.ifs-front');
   if(!card)return;
   // Drag has its own transform channels, so the shuffle can keep settling.
   // Only interrupt a previous horizontal snap-back, keeping its current pose.
   const pose=getComputedStyle(card),start=parseFloat(pose.translate)||0,turn=parseFloat(pose.rotate)||0;
   returning.get(card)?.cancel();
   card.style.translate=`${start}px`;card.style.rotate=`${turn}deg`;
   return {card,capture:card,id:card.dataset.ifsCard,offset:start,start};
  },
  move(current,{dx}){
   const width=current.card.offsetWidth,wide=window.innerWidth>=640;
   current.offset=cardSwipeOffset(current.start+dx,wide?width+24:Math.max(width+120,window.innerWidth+width*.35));
   const turn=Math.sign(dx)*(wide?2.5:5)*Math.min(1,Math.abs(current.offset)/Math.max(72,width*.5));
   current.card.classList.add('is-dragging');
   if(!reduced()){current.card.style.translate=`${current.offset}px`;current.card.style.rotate=`${turn}deg`;}
   showSwipeFeedback(current.card,current.offset);
  },
  end(current,{cancelled,horizontal}){
   if(!cancelled&&horizontal&&Math.abs(current.offset)>=72){
    // Preserve the held position until the exit animation takes over.
    void choose(current.id,current.offset>0?'save':'remove');
    return;
   }
   const pose=getComputedStyle(current.card),translate=pose.translate||'0px',rotate=pose.rotate||'0deg';
   current.card.classList.remove('is-dragging');
   current.card.style.translate='';current.card.style.rotate='';
   if((horizontal||current.start)&&!reduced())void animate(current.card,[{translate,rotate},{translate:'0px',rotate:'0deg'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'},false,returning);
  },
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finishMotion();});
 window.addEventListener('pagehide',finishMotion);sync();
}



