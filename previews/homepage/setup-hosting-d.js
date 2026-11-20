import {createAnimatedDisclosure} from './disclosure-motion.js';
import {previewPageURL} from './preview-pages.js';

const path = new URLSearchParams(location.search).get('path');
if (['web','both','all'].includes(path)) {
 for (const link of document.querySelectorAll('[data-setup-return]')) link.href = `${previewPageURL('setup-instructions')}?path=${path}#create`;
}

const disclosures = new Map([...document.querySelectorAll('.hd-disclosure')].map(details => [details,createAnimatedDisclosure(details,{contentSelector:'.hd-disclosure-body'})]));
function revealHash() {
 let target;
 try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
 const details = target?.closest('.hd-disclosure');
 if (!details) return;
 disclosures.get(details)?.open({animate:false});
 requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
}
addEventListener('hashchange',revealHash);
// A reload can restore the old scroll offset after details expand. Place the
// requested topic again once restoration has finished, without a long scroll.
addEventListener('pageshow',event => {if (!event.persisted) revealHash();});
document.addEventListener('click',event => {
 const link = event.target.closest('a[href^="#"]');
 if (link && link.hash === location.hash) revealHash();
});
addEventListener('resize',() => disclosures.forEach(control => control.finish()));
document.fonts?.ready.then(() => disclosures.forEach(control => control.finish()));
revealHash();

