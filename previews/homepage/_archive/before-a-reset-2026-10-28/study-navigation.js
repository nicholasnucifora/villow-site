const navigation = document.querySelector('.study-navigation');
if (navigation) {
  if (navigation.querySelector('[data-i-view-options]')) setupIComparison(navigation);
  else setupHashVariants(navigation);
}

function setupIComparison(navigation) {
  const viewLinks = [...navigation.querySelectorAll('[data-i-view-choice]')];
  const artLinks = [...navigation.querySelectorAll('[data-i-art-choice]')];
  const compareLinks=[...navigation.querySelectorAll('[data-i-compare-choice]')];
  const comparison=navigation.querySelector('[data-i-art-comparison]');
  const closeComparison=(focus=false)=>{if(comparison){comparison.open=false;if(focus)comparison.querySelector('summary').focus({preventScroll:true});}};
  navigation.querySelector('[data-i-compare-close]')?.addEventListener('click',()=>closeComparison(true));
  document.addEventListener('click',event=>{if(comparison?.open&&!comparison.contains(event.target))closeComparison();});
  const views = new Set(viewLinks.map(link => link.dataset.iViewChoice));
  const artwork = new Set(artLinks.map(link => link.dataset.iArtChoice));
  const familyButtons=[...navigation.querySelectorAll('[data-i-family]')];
  const familyPanels=[...navigation.querySelectorAll('[data-i-family-panel]')];
  const familyLast={cinema:'cinema-cloud-cat',agency:'agency-cinema',next:'flow-ribbon',quiet:'quiet-focus',first:'stop'};
  let family='cinema';

  function readSelection() {
    const requestedView = new URL(location.href).searchParams.get('view');
    const requestedArt = location.hash.slice(1);
    return {
      view: views.has(requestedView) ? requestedView : 'stack',
      art: artwork.has(requestedArt) ? requestedArt : 'i15',
    };
  }
  function targetURL(view, art) {
    const target = new URL('i.html', location.href);
    target.search = location.search;
    target.searchParams.set('view', view);
    target.hash = art;
    return target;
  }
  function syncSelection() {
    const selection = readSelection();
    for(const link of compareLinks)link.href=targetURL(link.dataset.iCompareChoice,selection.art).href;
    for(const [selector,anchor] of [['[data-i-feed-jump]','feed-to-watch-later'],['[data-i-company-jump]','good-company']]){
      const link=navigation.querySelector(selector);
      if(link){const view=selector==='[data-i-feed-jump]'&&selection.view==='stack'?'flow-ribbon':selection.view;const target=targetURL(view,selection.art);target.hash=anchor;link.href=target.href;}
    }
    const selectedLink=viewLinks.find(link=>link.dataset.iViewChoice===selection.view);
    const selectedFamily=selectedLink?.closest('[data-i-family-panel]')?.dataset.iFamilyPanel;
    if(selectedFamily){family=selectedFamily;familyLast[family]=selection.view;}
    for(const panel of familyPanels)panel.hidden=panel.dataset.iFamilyPanel!==family;
    for(const button of familyButtons){const active=button.dataset.iFamily===family;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
    const activeFamily=familyButtons.find(button=>button.dataset.iFamily===family);
    const familyStrip=activeFamily?.parentElement;
    if(activeFamily&&familyStrip){const b=familyStrip.getBoundingClientRect(),t=activeFamily.getBoundingClientRect();if(t.left<b.left)familyStrip.scrollLeft+=t.left-b.left;else if(t.right>b.right)familyStrip.scrollLeft+=t.right-b.right;}
    for (const link of viewLinks) {
      const view = link.dataset.iViewChoice;
      link.href = targetURL(view, selection.art).href;
      if (view === selection.view) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    for (const link of artLinks) {
      const art = link.dataset.iArtChoice;
      link.href = targetURL(selection.view, art).href;
      if (art === selection.art) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    const selectedView = viewLinks.find(link => link.dataset.iViewChoice === selection.view);
    const viewStrip = selectedView?.closest('[data-i-view-options]');
    if (selectedView && viewStrip) {
      // Reveal a selection in the phone strip without scrolling the page itself.
      const stripBounds = viewStrip.getBoundingClientRect();
      const linkBounds = selectedView.getBoundingClientRect();
      if (linkBounds.left < stripBounds.left) viewStrip.scrollLeft += linkBounds.left - stripBounds.left;
      else if (linkBounds.right > stripBounds.right) viewStrip.scrollLeft += linkBounds.right - stripBounds.right;
    }
  }

  function chooseFamily(button,focus=false){
    const key=button.dataset.iFamily;
    const link=viewLinks.find(item=>item.dataset.iViewChoice===familyLast[key]);
    if(link)choose(link);
    if(focus)button.focus({preventScroll:true});
  }
  familyButtons.forEach((button,index)=>{
    button.addEventListener('click',()=>chooseFamily(button));
    button.addEventListener('keydown',event=>{
      const next=event.key==='ArrowRight'?(index+1)%familyButtons.length:event.key==='ArrowLeft'?(index+familyButtons.length-1)%familyButtons.length:event.key==='Home'?0:event.key==='End'?familyButtons.length-1:null;
      if(next===null)return;event.preventDefault();chooseFamily(familyButtons[next],true);
    });
  });
  navigation.querySelector('[data-i-jump]')?.addEventListener('change',event=>{
    const link=viewLinks.find(item=>item.dataset.iViewChoice===event.target.value);
    if(link)choose(link);
    event.target.value='';
  });
  function choose(link, focus = false) {
    const target = new URL(link.href, location.href);
    // The old i2/i3/i4 files are archives, so their links perform real navigation.
    if (target.pathname !== location.pathname) {
      location.assign(target.href);
      return;
    }
    const oldURL = location.href;
    const oldHash = location.hash;
    if (target.href !== oldURL) history.pushState(null, '', target.href);
    syncSelection();
    window.dispatchEvent(new CustomEvent('i-preview-change', { detail: readSelection() }));
    if (oldHash !== target.hash) {
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: target.href }));
    }
    if (focus) link.focus({ preventScroll: true });
  }

  navigation.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('[data-i-view-choice], [data-i-art-choice], [data-i-compare-choice]');
    if (!link || !navigation.contains(link)) return;
    const target = new URL(link.href, location.href);
    if (target.pathname !== location.pathname) return;
    event.preventDefault();
    choose(link);
    if(link.hasAttribute('data-i-compare-choice')){closeComparison();viewLinks.find(item=>item.dataset.iViewChoice===link.dataset.iCompareChoice)?.focus({preventScroll:true});}
  });
  navigation.addEventListener('keydown', event => {
    if(event.key==='Escape'&&comparison?.open){event.preventDefault();closeComparison(true);return;}
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const link = event.target.closest('[data-i-view-choice], [data-i-art-choice]');
    if (!link || !navigation.contains(link)) return;
    const links = link.hasAttribute('data-i-view-choice') ? [...link.closest('[data-i-view-options]').querySelectorAll('[data-i-view-choice]')] : artLinks;
    const index = links.indexOf(link);
    let next;
    if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
    else if (event.key === 'ArrowRight') next = Math.min(links.length - 1, index + 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = links.length - 1;
    else return;
    event.preventDefault();
    choose(links[next], true);
  });
  syncSelection();
  window.addEventListener('hashchange', syncSelection);
  window.addEventListener('popstate', syncSelection);
}

function setupHashVariants(navigation) {
  const links = [...navigation.querySelectorAll('[data-preview-variant]')];
  let active = navigation.dataset.defaultVariant;
  function syncVariant() {
    const hash = location.hash.slice(1);
    if (!hash) active = navigation.dataset.defaultVariant;
    else if (links.some(link => link.dataset.previewVariant === hash)) active = hash;
    for (const link of links) {
      if (link.dataset.previewVariant === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  syncVariant();
  window.addEventListener('hashchange', syncVariant);
  window.addEventListener('popstate', syncVariant);
}
