import {mountPinnedFooterSpider} from './spidey/pinned-footer-spider.js';

// Static previews navigate normally, while the same lifecycle also handles
// replaced footer nodes and returning from the browser's back/forward cache.
export function installFooterSpideys() {
 const instances=new Map();
 let disposed=false;
 let suspended=false;
 let queued=false;
 const observer=new MutationObserver(scheduleSync);

 function sync() {
  if(disposed||suspended)return;
  for(const [slot,controller] of instances){
   if(slot.isConnected)continue;
   controller?.dispose();
   instances.delete(slot);
  }
  for(const slot of document.querySelectorAll('[data-footer-spidey]')){
   if(instances.has(slot))continue;
   instances.set(slot,null);
   try{instances.set(slot,mountPinnedFooterSpider(slot));}
   catch(error){
    // The bundled base SVG and the real link are already usable.
    console.error('[Villow footer Spidey] Mount failed',error);
    instances.delete(slot);
   }
  }
 }
 function scheduleSync() {
  if(queued||disposed||suspended)return;
  queued=true;
  queueMicrotask(()=>{queued=false;sync();});
 }
 function clearInstances() {
  observer.disconnect();
  for(const controller of instances.values())controller?.dispose();
  instances.clear();
 }
 function resume() {
  if(disposed)return;
  suspended=false;
  sync();
  observer.observe(document.body,{childList:true,subtree:true});
 }
 function onPageHide(event) {
  if(!event.persisted){dispose();return;}
  suspended=true;
  clearInstances();
 }
 function onPageShow(event) {if(event.persisted&&suspended)resume();}
 function dispose() {
  if(disposed)return;
  disposed=true;
  suspended=true;
  clearInstances();
  window.removeEventListener('pagehide',onPageHide);
  window.removeEventListener('pageshow',onPageShow);
 }
 window.addEventListener('pagehide',onPageHide);
 window.addEventListener('pageshow',onPageShow);
 resume();
 return {dispose};
}

installFooterSpideys();
