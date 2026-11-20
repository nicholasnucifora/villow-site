import assert from 'node:assert/strict';
import {createExampleState, changeExampleLimit, toggleSaveLimit, addExampleSave, removeExampleSave, exampleMetrics, exampleSaveRefusal} from '../assets/extension-story-demo/extension-story-demo.js';

// Expected behaviour comes from the extension's source contract, not its demo UI.
let state = createExampleState();
assert.equal(state.usage.saves, 0);
assert.equal(state.usage.savedDurationSeconds, 0);
assert.ok(state.videos.every(video => !video.saved && video.status === 'idle'));
assert.equal(exampleMetrics(state).seen.remainingFraction, .5);
state = changeExampleLimit(state, 'seen', 200);
assert.equal(state.usage.recommendationsSeen, 50);
assert.equal(exampleMetrics(state).seen.remainingFraction, .75);

state = toggleSaveLimit(state, 'saveDuration', true);
assert.equal(exampleMetrics(state).saves.mode, 'both');
assert.equal(exampleMetrics(state).saves.remainingSlots, 6);
assert.equal(exampleMetrics(state).saves.remainingFraction, 1);
const before = state;
state = addExampleSave(state);
assert.equal(state.usage.saves, 1);
assert.equal(state.usage.savedDurationSeconds, 768);
assert.equal(exampleMetrics(state).saves.remainingSlots, 5);
assert.equal(state.videos.find(video=>video.id==='hills').status, 'pending', 'Saving reserves allowance before Home receives the video');
assert.equal(state.usage.activeSeconds, before.usage.activeSeconds);
assert.equal(state.usage.recommendationsSeen, before.usage.recommendationsSeen);
assert.deepEqual(addExampleSave(state), state, 'The same save cannot consume allowance twice');
assert.deepEqual(removeExampleSave(state).usage, before.usage, 'Removing the unwatched example refunds exactly its reservation');
state = addExampleSave(state, 'sea');
assert.equal(state.usage.saves, 2);
assert.equal(state.usage.savedDurationSeconds, 768 + 612);
assert.equal(state.videos.filter(video=>video.status==='pending').length, 2);
assert.deepEqual(addExampleSave(state, 'sea'), state, 'Each video has its own duplicate guard');
const withoutFirst = removeExampleSave(state, 'hills');
assert.equal(withoutFirst.usage.saves, 1);
assert.equal(withoutFirst.usage.savedDurationSeconds, 612);
assert.equal(withoutFirst.videos.find(video=>video.id==='sea').saved, true, 'Removing one pick keeps the other');

let ordered = addExampleSave(addExampleSave(createExampleState(), 'sea'), 'hills');
assert.deepEqual(ordered.selectionOrder, ['hills', 'sea'], 'Home shows the newest selection first');
ordered = addExampleSave(removeExampleSave(ordered, 'hills'), 'hills');
assert.deepEqual(ordered.selectionOrder, ['hills', 'sea'], 'Re-adding the newest pick keeps it first');
ordered = addExampleSave(removeExampleSave(ordered, 'sea'), 'sea');
assert.deepEqual(ordered.selectionOrder, ['sea', 'hills'], 'Re-adding the older pick moves it to the front');
assert.equal(ordered.usage.saves, 2, 'Remove/re-add never duplicates or overcharges a pick');
assert.equal(ordered.usage.savedDurationSeconds, 1380);
assert.deepEqual(ordered.videos.map(video=>video.id), ['hills','sea','cup','river'], 'YouTube retains its original card positions');

state = toggleSaveLimit(state, 'saves', false);
assert.equal(exampleMetrics(state).saves.mode, 'duration');
state = toggleSaveLimit(state, 'saveDuration', false);
assert.equal(exampleMetrics(state).saves.mode, 'none');
state = toggleSaveLimit(state, 'saves', true);
assert.equal(state.config.saveLimit, 6, 'Turning a cap back on remembers its amount');
assert.equal(exampleMetrics(state).saves.mode, 'count');

state = addExampleSave(changeExampleLimit(createExampleState(), 'saves', 1));
assert.equal(exampleSaveRefusal(state, 'sea'), 'count');
assert.deepEqual(addExampleSave(state, 'sea'), state, 'A spent count cap blocks a new reservation');
state = toggleSaveLimit(createExampleState(), 'saveDuration', true);
state = changeExampleLimit(state, 'saveDuration', 10);
assert.equal(exampleSaveRefusal(state), 'duration');
assert.deepEqual(addExampleSave(state), state, 'A video cannot exceed the remaining duration allowance');
state = changeExampleLimit(state, 'time', 0);
assert.equal(exampleMetrics(state).time.limit, 0);
assert.equal(exampleMetrics(state).time.spent, false);
console.log('Extension demo: recommendation limits, all save modes, duplicate protection, refunds and separate time measurements passed.');
