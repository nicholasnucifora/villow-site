export function renderHomepageClosing(primaryAction){
 if(!primaryAction?.startsWith('<a class="i-primary"'))throw new Error('Expected existing hero Get started action.');
 return `<!-- homepage-closing:start -->
<section class="hc-closing" id="help-shape-web" aria-labelledby="hc-title">
 <div class="hc-inner i-width">
  <h2 id="hc-title">We can build<br><span>a better web.</span></h2>
  <div class="hc-copy"><p>Villow is an experiment in how YouTube—and social media more widely—could be designed around the people using it.</p><p>We need your help to learn what works. Try it, share your experience, and help shape what comes next.</p></div>
  <div class="hc-actions">${primaryAction}<a class="hc-movement" href="https://fixtheweb.org" target="_blank" rel="noopener">Help fix the web <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M7 6h11v11"/></svg></a></div>
 </div>
</section>
<!-- homepage-closing:end -->`;
}
export function addHomepageClosing(source,{previous}={}){
 let html=source.replace(/<!-- homepage-closing:start -->[\s\S]*?<!-- homepage-closing:end -->\s*/g,'').replace(/<!-- closing-comparison:start -->[\s\S]*?<!-- closing-comparison:end -->/g,'');
 const primary=html.match(/<a class="i-primary"[^>]*>[\s\S]*?<\/a>/)?.[0];
 const footer='<footer class="i-preview-note i-width">';
 if(html.split(footer).length!==2)throw new Error('Expected one preview footer.');
 html=html.replace(footer,`${renderHomepageClosing(primary)}\n ${footer}${previous?`<!-- closing-comparison:start --><a class="hc-comparison" href="${previous}#good-company">Compare before closing section</a><!-- closing-comparison:end -->`:''}`);
 if(!html.includes('href="homepage-closing.css"'))html=html.replace('</head>','<link rel="stylesheet" href="homepage-closing.css"></head>');
 return html;
}
