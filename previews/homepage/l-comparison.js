// L keeps every comparison in the document; without JavaScript they all remain visible.
for (const comparison of document.querySelectorAll('.version-l-insight [data-xc-comparison]')) {
  const rows = [...comparison.querySelectorAll('[data-xl-topic]')];
  const topics = [
    {key:'streaks', label:'Streaks', icon:'<path d="M12 3c1.2 3.6-2.7 4.9-1.7 8-1.3-.5-2.2-1.6-2.4-2.8C5.9 10.1 5 11.9 5 14.2a7 7 0 0 0 14 0c0-2.4-1.2-4.8-3.3-6.6-.1 2-1 3.2-2 3.8.8-3.1.4-5.8-1.7-8.4Z"/>'},
    {key:'sidebar', label:'Beside video', icon:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M14 5v14M7 9l4 3-4 3z"/>'},
    {key:'usage', label:'Controls', icon:'<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="8" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="10" cy="17" r="2"/>'},
    {key:'social', label:'Social', icon:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5v1"/>'},
  ];
  // M uses the same Social and Time Usage drawings as Villow’s navigation.
  if (comparison.closest('.version-m-insight')) {
    const usage = topics.find(topic => topic.key === 'usage');
    usage.label = 'Usage access';
    usage.icon = '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>';
    const social = topics.find(topic => topic.key === 'social');
    social.viewBox = '0 0 256 256';
    social.mode = 'fill';
    social.icon = '<path d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z"/>';
  }
  if (rows.length !== topics.length || topics.some(topic => !rows.find(row => row.dataset.xlTopic === topic.key))) continue;
  const tabs = document.createElement('div');
  tabs.className = 'l-topic-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','Choose a design comparison');
  for (const topic of topics) {
    const row = rows.find(item => item.dataset.xlTopic === topic.key);
    row.id ||= `l-topic-panel-${topic.key}`;
    row.setAttribute('role','tabpanel');
    row.setAttribute('aria-labelledby',`l-topic-tab-${topic.key}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'l-topic-tab';
    button.id = `l-topic-tab-${topic.key}`;
    button.dataset.lTopic = topic.key;
    button.setAttribute('role','tab');
    button.setAttribute('aria-controls', row.id);
    const viewBox = topic.viewBox || '0 0 24 24';
    const width = comparison.closest('.version-m-insight') && topic.key === 'usage' ? '2' : '1.7';
    const paint = topic.mode === 'fill' ? 'fill="currentColor" stroke="none"' : `fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`;
    button.innerHTML = `<span class="l-topic-icon" aria-hidden="true"><svg viewBox="${viewBox}" ${paint}>${topic.icon}</svg></span><span>${topic.label}</span>`;
    tabs.append(button);
  }
  const buttons = [...tabs.querySelectorAll('button')];
  function select(index, focus = false) {
    for (let i = 0; i < buttons.length; i++) {
      const selected = i === index;
      buttons[i].setAttribute('aria-selected', String(selected));
      buttons[i].tabIndex = selected ? 0 : -1;
      const row = rows.find(item => item.dataset.xlTopic === buttons[i].dataset.lTopic);
      row.hidden = !selected;
    }
    if (focus) buttons[index].focus({preventScroll:true});
  }
  for (const [index, button] of buttons.entries()) {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      select(next, true);
    });
  }
  comparison.before(tabs);
  comparison.classList.add('l-topics-ready');
  select(0);
}
