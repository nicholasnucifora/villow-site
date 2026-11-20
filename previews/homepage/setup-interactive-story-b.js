import {mountExtensionStoryDemo} from './assets/extension-story-demo/extension-story-demo.js';
import {initialiseHomeScene} from './setup-home-scene-b.js';

// Shared controller owns limits and both directions of the Home sync delay.
export function initialiseExtensionStory(story) {
 const host = story.querySelector('[data-extension-story-demo]');
 const home = initialiseHomeScene(story);
 // arrivedIds is the last completed Home refresh, not the immediate saved state.
 // A removed video intentionally stays here until the controller's delay ends.
 const updateHome = state => home.setVideos({selectedIds: state.arrivedIds, pendingIds: state.pendingIds});
 const demo = mountExtensionStoryDemo(host, {
  device: 'desktop',
  theme: 'light',
  includeStory: true,
  youtubeLogoUrl: 'assets/extension-youtube-logo.png',
  onStateChange: updateHome,
 });
 updateHome(demo.getState());
 host.addEventListener('extension-story-demo-home', () => {
  story.querySelector('.sg-story-home').scrollIntoView({block: 'center', behavior: window.matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
 });
 return device => {
  const storyDevice = device === 'computer' ? 'desktop' : 'mobile';
  story.dataset.storyDevice = storyDevice;
  demo.updateAppearance({device: storyDevice, theme: 'light'});
  home.setDevice(device);
 };
}
