// Self-contained homepage examples; nothing is stored or sent to Villow.
const limit = document.querySelector('[data-rf-limit]');
if (limit) {
  const main = limit.querySelector('[data-rf-limit-main]');
  const editor = limit.querySelector('[data-rf-limit-edit]');
  const day = limit.querySelector('[data-rf-day]');
  const duration = limit.querySelector('[data-rf-day-limit]');
  const summary = limit.querySelector('[data-rf-custom-summary]');
  const edit = limit.querySelector('[data-rf-edit-day]');
  const status = limit.querySelector('[data-rf-limit-status]');
  function showEditor(open) {
    main.hidden = open;
    editor.hidden = !open;
    (open ? day : edit).focus({preventScroll: true});
  }
  edit.addEventListener('click', () => showEditor(true));
  limit.querySelector('[data-rf-cancel-day]').addEventListener('click', () => showEditor(false));
  limit.querySelector('[data-rf-save-day]').addEventListener('click', () => {
    summary.textContent = `${day.value} · ${duration.value}`;
    edit.textContent = 'Change day';
    status.textContent = `Example: ${day.value} limit set to ${duration.value}.`;
    showEditor(false);
  });
}

const ratingButtons = [...document.querySelectorAll('[data-rf-rating]')];
const ratingStatus = document.querySelector('[data-rf-rating-status]');
for (const button of ratingButtons) button.addEventListener('click', () => {
  for (const item of ratingButtons) item.setAttribute('aria-pressed', String(item === button));
  ratingStatus.textContent = `${button.dataset.rfRating} · example`;
});

const suggestionStatus = document.querySelector('[data-rf-suggestion-status]');
for (const button of document.querySelectorAll('[data-rf-suggestion-choice]')) button.addEventListener('click', () => {
  suggestionStatus.textContent = `${button.dataset.rfSuggestionChoice} in this example · no real settings changed`;
});
