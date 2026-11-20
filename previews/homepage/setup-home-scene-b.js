// The frame contains the app's real Home with isolated fictional inputs.
// Only fixture IDs cross the sandbox boundary; no account data or URLs do.
export function initialiseHomeScene(story) {
 const holder = story.querySelector('[data-home-preview]');
 let frame = holder.querySelector('iframe');
 let mobile = false;
 let previousDevice = null;
 let latest = {selectedIds: [], pendingIds: []};
 let lastSent = null;
 const sendState = (force = false) => {
  const signature = JSON.stringify(latest);
  if (!force && lastSent === signature) return;
  frame.contentWindow?.postMessage({type: 'villow:extension-story:selection', version: 1, ...latest}, '*');
  lastSent = signature;
 };
 const onReady = event => {
  if (event.source !== frame.contentWindow || event.data?.type !== 'villow:extension-story:ready' || event.data.version !== 1) return;
  sendState(true);
 };
 window.addEventListener('message', onReady);
 const onLoad = () => sendState(true);
 const resize = () => {
  const width = mobile ? 390 : 1190;
  const height = mobile ? 480 : 620;
  holder.style.aspectRatio = `${width} / ${height}`;
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
  frame.style.transform = `scale(${Math.min(1, holder.clientWidth / width)})`;
 };
 const observer = new ResizeObserver(resize);
 observer.observe(holder);
 return {
  setDevice(device) {
   mobile = device !== 'computer';
   const sceneDevice = mobile ? 'phone' : 'desktop';
   if (sceneDevice !== previousDevice) {
    const nextFrame = frame.cloneNode(false);
    nextFrame.src = `assets/villow-home-scene.html#scene=extension-story&device=${sceneDevice}&capture=1&theme=light&interactive=1`;
    nextFrame.title = `Villow Home example on ${mobile ? 'mobile' : 'desktop'}`;
    nextFrame.loading = 'eager';
    frame.removeEventListener('load', onLoad);
    nextFrame.addEventListener('load', onLoad);
    frame.replaceWith(nextFrame);
    frame = nextFrame;
    previousDevice = sceneDevice;
    lastSent = null;
   }
   resize();
  },
  setVideos({selectedIds = [], pendingIds = []}) {
   latest = {selectedIds: [...selectedIds], pendingIds: [...pendingIds]};
   sendState();
  },
  destroy() {
   observer.disconnect();
   frame.removeEventListener('load', onLoad);
   window.removeEventListener('message', onReady);
  },
 };
}


