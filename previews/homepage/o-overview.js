// Static content is complete. Only first entrance receives a short reveal.
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const visuals=[...document.querySelectorAll('[data-oo-visual]')];
if(!reduced.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entry.target.classList.remove('oo-pending');
   entry.target.classList.add('oo-entered');
   observer.unobserve(entry.target);
  }
 },{threshold:.15});
 for(const visual of visuals){visual.classList.add('oo-pending');observer.observe(visual);}
 reduced.addEventListener('change',event=>{
  if(!event.matches)return;
  observer.disconnect();
  for(const visual of visuals)visual.classList.remove('oo-pending','oo-entered');
 });
}
