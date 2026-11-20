import {initialiseExtensionStory} from './setup-interactive-story-b.js';
import {createRecommendationTransition,createStoryDisclosure} from './setup-choice-motion.js';
import './setup-motion.js';

const guide = document.querySelector('#setup-guide');

if (guide) {
 const result = guide.querySelector('#setup-recommendation');
 const panels = [...result.querySelectorAll('[data-result]')];
 const story = guide.querySelector('.sg-story-overview');
 const storyDisclosure = guide.querySelector('#app-extension-flow');
 const transition = createRecommendationTransition(result);
 let currentChoice = null;
 let updateStory;
 const showStory = () => {
  if (!story || !storyDisclosure?.open || result.hidden || panels.find(panel => panel.dataset.result === 'options')?.hidden) return;
  if (!updateStory) {
   const setDevice = initialiseExtensionStory(story);
   const mobile = window.matchMedia('(max-width:650px)');
   updateStory = () => {
    // Both feeds follow the viewer's layout and retain available choices.
    setDevice(mobile.matches ? 'ios' : 'computer');
   };
   mobile.addEventListener('change',updateStory);
  }
  updateStory();
 };
 const storyTransition = createStoryDisclosure(storyDisclosure,{onOpen:()=>{transition.finish();showStory();}});
 const updateRecommendation = (animate = false) => {
  const youtube = guide.querySelector('input[name="youtube"]:checked')?.value;
  const choice = youtube === 'yes' ? 'options' : youtube === 'no' ? 'web' : null;
  if (choice === currentChoice) {transition.cancel(); return;}
  const firstChoice = !currentChoice;
  transition.run(() => {
   panels.forEach(panel => { panel.hidden = panel.dataset.result !== choice; });
   result.hidden = !choice;
   currentChoice = choice;
   if (choice === 'options') showStory();
   else storyTransition.close();
  }, {animate, outgoing:panels.find(panel => !panel.hidden), incoming:() => firstChoice ? result : panels.find(panel => !panel.hidden)});
 };
 const previousChoice = new URLSearchParams(location.search).get('choice');
 if (previousChoice === 'yes' || previousChoice === 'no') {
  const previousInput = guide.querySelector(`input[name="youtube"][value="${previousChoice}"]`);
  if (previousInput) previousInput.checked = true;
 }
 guide.addEventListener('change', event => {
  if (!event || event.target.name === 'youtube') updateRecommendation(true);
 });
 const finishTransitions = () => {transition.finish();storyTransition.finish();};
 window.addEventListener('resize', finishTransitions);
 window.addEventListener('setup-motion-change', finishTransitions);
 document.fonts?.ready.then(finishTransitions);
 storyDisclosure?.addEventListener('toggle', showStory);
 updateRecommendation();
 guide.hidden = false;
}

// Keep links from earlier versions useful after moving the instructions.
const legacyRoutes = {'#web-app':'web', '#create':'web', '#join':'web', '#extension':'extension', '#use-together':'both'};
if (legacyRoutes[location.hash]) location.replace(`setup-instructions-b.html?path=${legacyRoutes[location.hash]}${location.hash}`);
