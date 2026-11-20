const sections=[...document.querySelectorAll('[data-xl-reveal]')],motion=matchMedia('(prefers-reduced-motion:reduce)');
if(!motion.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('xl-pending');observer.unobserve(entry.target);}},{threshold:.15});
 for(const section of sections){section.classList.add('xl-pending');observer.observe(section);}
 motion.addEventListener('change',event=>{if(event.matches){for(const section of sections)section.classList.remove('xl-pending');observer.disconnect();}},{once:true});
}
