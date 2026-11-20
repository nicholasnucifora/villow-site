import {setupChoiceIcons} from './setup-choice-icons.mjs';
const choices = [
 {title:'Villow app',path:'web',action:'Get Villow',features:[
  'A finite feed from subscriptions, videos popular in your country and friends’ recommendations.',
  'Ratings, detailed viewing insights, suggested adjustments and settings to shape your experience.',
  'Share videos and playlists, or watch together with friends.',
  'Your feed, saved progress and viewing time stay in sync across devices.',
 ]},
 {title:'Villow extension',path:'extension',action:'Get the extension',features:[
  'YouTube as you know it, including its recommendations, with extra controls.',
  'Set daily limits on time spent, recommendations seen and videos watched.',
  'No Villow sharing or watch-together features.',
  'No cross-device sync or detailed viewing insights. Usage stays in this browser.',
 ]},
 {title:'Villow app + extension',path:'both',action:'Get the app and extension',features:[
  'Villow’s feed, plus videos you choose from YouTube’s recommendations using the extension.',
  'App insights and suggested adjustments also include your connected YouTube usage.',
  'Share videos and playlists, or watch together in the Villow app.',
  'App progress syncs across devices; usage and supported limits sync across connected extensions.',
 ]},
];

export function setupComparisonB() {
 return `<section class="setup-comparison-section" aria-labelledby="setup-title"><div class="setup-compare-columns">${choices.map(choice=>`<article class="setup-compare-column"><header><span class="setup-compare-icon">${setupChoiceIcons[choice.path]}</span><h2>${choice.title}</h2></header><ul>${choice.features.map(text=>`<li>${text}</li>`).join('')}</ul><footer><a class="sp-button" href="setup-instructions-b.html?path=${choice.path}">${choice.action}</a></footer></article>`).join('')}</div></section>`;
}
