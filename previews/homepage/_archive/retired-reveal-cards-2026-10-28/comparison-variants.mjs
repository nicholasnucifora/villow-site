// Both options use the accepted Visuals first composition on wide screens.
export const comparisonOptions = [
  ['a', 'Reveal cards'],
  ['b', 'Shared switch'],
];
const swapIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14l-3-3M19 17H5l3 3"/></svg>';
export function applyComparisonOption(source, key) {
  if (!comparisonOptions.some(([option]) => key === option)) throw new Error(`Unknown option: ${key}`);
  const prefix = source.slice(0, source.indexOf('<section class="x-life"'));
  const suffix = source.slice(source.indexOf('<div class="xl-concepts '));
  let result = source.replace('class="xl-comparisons"', `class="xl-comparisons xc-${key === 'a' ? 'reveal' : 'switch'}" data-xc-comparison data-xc-mode="${key === 'a' ? 'reveal' : 'switch'}"`);
  if (result === source) throw new Error('Missing comparison container');
  const rows = [...source.matchAll(/<section class="xl-compare-row[^>]*>[\s\S]*?<\/section>/g)].map(match => match[0]);
  if (rows.length !== 3) throw new Error('Expected three comparison rows');
  for (const row of rows) {
    const topic = row.match(/data-xl-topic="([^"]+)"/)[1];
    const title = row.match(/<h3 class="xl-pair-topic"[^>]*>(.*?)<\/h3>/)[1];
    let updated = row.replace('data-xl-topic=', 'data-xc-selected="villow" data-xl-topic=');
    const cells = [...row.matchAll(/<article class="xl-compare-cell[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    if (cells.length !== 2) throw new Error('Expected two comparison faces');
    for (const cell of cells) {
      const side = cell.includes('xl-cell-pattern') ? 'pattern' : 'villow';
      const label = side === 'villow' ? 'Villow’s approach' : 'Common pattern on other apps';
      const next = cell.replace('<article ', `<article id="xc-${topic}-${side}" data-xc-face="${side}" tabindex="-1" `)
        .replace(/(<article[^>]*>)/, `$1<div class="xc-side-marker" id="xc-${topic}-${side}-label">${label}</div>`);
      updated = updated.replace(cell, next);
    }
    if (key === 'a') {
      const button = `<div class="xc-reveal-footer"><button type="button" class="xc-reveal-button" data-xc-toggle aria-controls="xc-${topic}-pattern xc-${topic}-villow" aria-label="${title}: compare the common pattern">${swapIcon}<span data-xc-toggle-label>Compare the common pattern</span></button></div>`;
      updated = updated.replace('</section>', `${button}</section>`);
    }
    result = result.replace(row, updated);
  }
  if (key === 'b') {
    const controls = '<div class="xc-shared-control" role="group" aria-label="Choose the comparison approach"><button type="button" data-xc-select="pattern" aria-pressed="false" aria-controls="xc-streaks-pattern xc-sidebar-pattern xc-social-pattern"><span>Common patterns</span><small>On other apps</small></button><button type="button" data-xc-select="villow" aria-pressed="true" aria-controls="xc-streaks-villow xc-sidebar-villow xc-social-villow"><span>Villow’s approach</span><small>Designed differently</small></button></div>';
    result = result.replace('<div class="xl-column-headings"', controls + '<div class="xl-column-headings"');
  }
  result = result.replace('<div class="xl-column-headings"', '<p class="sr-only" aria-live="polite" aria-atomic="true" data-xc-announcement></p><div class="xl-column-headings"');
  if (!result.startsWith(prefix) || !result.endsWith(suffix)) throw new Error('Changed content outside comparisons');
  return result;
}
