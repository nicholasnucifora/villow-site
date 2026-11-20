import './footer-spidey.js';

// A click-to-open directory with identical, pre-rendered content on every page.
const header=document.querySelector('[data-site-directory]');
if(header){
 const toggle=header.querySelector('[data-directory-toggle]');
 const standard=header.querySelector('[data-directory-standard]');
 const panel=header.querySelector('#site-directory-panel');
 const content=header.querySelector('[data-directory-content]');
 const project=content.querySelector('.n-footer-project');
 const navigation=content.querySelector('.n-footer-nav');
 if(project&&navigation){
  toggle.hidden=false;
  let open=false;
  const updateRoom=()=>{
   panel.style.setProperty('--directory-room',`${Math.max(0,window.innerHeight-header.getBoundingClientRect().top-12)}px`);
  };
  const setOpen=(next,{restoreFocus=false}={})=>{
   if(open===next)return;
   open=next;
   if(open)updateRoom();
   if(!open&&restoreFocus&&panel.contains(document.activeElement))toggle.focus({preventScroll:true});
   header.toggleAttribute('data-directory-open',open);
   toggle.setAttribute('aria-expanded',String(open));
   toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
   standard.inert=open;
   standard.setAttribute('aria-hidden',String(open));
   panel.inert=!open;
   panel.setAttribute('aria-hidden',String(!open));
  };
  toggle.addEventListener('click',()=>setOpen(!open));
  // Absolute-positioned descendants are still inside the header, so moving
  // from its top row into the panel never closes it. Touch stays click-based.
  header.addEventListener('pointerleave',event=>{
   if(event.pointerType==='mouse')setOpen(false,{restoreFocus:true});
  });
  document.addEventListener('pointerdown',event=>{
   if(!header.contains(event.target))setOpen(false,{restoreFocus:true});
  });
  header.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&open){
    event.preventDefault();setOpen(false,{restoreFocus:true});toggle.focus({preventScroll:true});
   }
  });
  header.addEventListener('focusout',event=>{
   // Tab to another control closes the directory. Clicking its plain text
   // can leave focus on the document, but should keep the panel open.
   if(event.relatedTarget&&!header.contains(event.relatedTarget))setOpen(false);
  });
  panel.addEventListener('click',event=>{
   if(event.target.closest('a'))setOpen(false,{restoreFocus:true});
  });
  window.addEventListener('resize',()=>{if(open)updateRoom();});
  window.addEventListener('scroll',()=>{if(open)updateRoom();},{passive:true});
 }
}
