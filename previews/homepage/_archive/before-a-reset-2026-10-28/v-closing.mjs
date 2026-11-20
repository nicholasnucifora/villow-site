export function renderVClosing(primaryAction){
 if(!primaryAction?.startsWith('<a class="i-primary"'))throw new Error('Expected existing hero Get started action.');
 return `<!-- homepage-closing:start -->
<section class="hc-closing v-closing" id="help-shape-web" aria-labelledby="hc-title">
 <div class="hc-inner i-width">
  <h2 id="hc-title">Together, we can build<br><span>a better web.</span></h2>
  <div class="hc-copy"><p>Villow is a working experiment in how YouTube—and social media more widely—could be designed around people. Feeds, boundaries, reflection and shared watching become one connected experience across phone, tablet and computer.</p><p>YouTube time in connected browsers joins your Villow usage. Feedback you choose to share can help improve the design and inform future research and policy.</p></div>
  <div class="hc-actions">${primaryAction}<a class="hc-movement" href="https://fixtheweb.org" target="_blank" rel="noopener">Help fix the web <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11"/></svg></a></div>
 </div>
</section>
<!-- homepage-closing:end -->`;
}
