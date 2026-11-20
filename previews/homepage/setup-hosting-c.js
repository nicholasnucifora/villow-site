import {createAnimatedDisclosure} from './disclosure-motion.js';
import './setup-hosting-b.js';
import {adminDestination} from './hosting-admin-url.js';

const disclosures = new Map([...document.querySelectorAll('.hc-disclosure')].map(details => [details, createAnimatedDisclosure(details, {contentSelector:'.hc-disclosure-body'})]));
function revealHash() {
 let target;
 try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
 const details = target?.closest('.hc-disclosure');
 if (!details) return;
 disclosures.get(details)?.open({animate:false});
 requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
}
addEventListener('hashchange', revealHash);
// Also reopen a collapsed disclosure when its existing hash is clicked again.
document.addEventListener('click', event => {
 const link = event.target.closest('a[href^="#"]');
 if (link && link.hash === location.hash) revealHash();
});
addEventListener('resize', () => disclosures.forEach(control => control.finish()));
document.fonts?.ready.then(() => disclosures.forEach(control => control.finish()));
revealHash();

const form = document.querySelector('[data-admin-form]');
const input = form.querySelector('input');
const error = form.querySelector('[data-admin-error]');
form.hidden = false;
input.addEventListener('input', () => { input.setCustomValidity(''); error.hidden = true; });
form.addEventListener('submit', event => {
 event.preventDefault();
 try {
  const destination = adminDestination(input.value);
  error.hidden = true;
  window.open(destination, '_blank', 'noopener,noreferrer');
 } catch {
  input.setCustomValidity('Enter your Villow’s HTTPS address, without a username or password.');
  error.textContent = 'Use your Villow’s web address, for example https://your-villow.vercel.app.';
  error.hidden = false;
  input.reportValidity();
 }
});
