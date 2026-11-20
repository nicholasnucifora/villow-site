// Ordinary native disclosures work without JavaScript. A direct link to an idea
// or a nested example opens its ancestors before positioning that content.
function openLinkedIdea() {
 let id;
 try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
 if (!id) return;
 const target = document.getElementById(id);
 if (!target || !target.closest('.concepts-topics')) return;
 let parent = target;
 while (parent) {
  if (parent.matches('details')) parent.open = true;
  parent = parent.parentElement;
 }
 requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
}
window.addEventListener('hashchange',openLinkedIdea);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',openLinkedIdea,{once:true});
else openLinkedIdea();
