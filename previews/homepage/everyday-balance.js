const addDay = document.querySelector('[data-eb-add-day]');
if (addDay) {
  const example = document.getElementById(addDay.getAttribute('aria-controls'));
  addDay.addEventListener('click', () => {
    const expanded = addDay.getAttribute('aria-expanded') === 'true';
    addDay.setAttribute('aria-expanded', String(!expanded));
    example.hidden = expanded;
  });
}
