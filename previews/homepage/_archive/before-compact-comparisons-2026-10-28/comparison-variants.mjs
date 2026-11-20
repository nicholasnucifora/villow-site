export const comparisonOptions = [
  ['a', 'Baseline'],
  ['b', 'Visuals first'],
  ['c', 'Messages first'],
  ['d', 'Topic rail'],
];

export function applyComparisonOption(source, key) {
  if (key === 'a') return source;
  if (!['b', 'c', 'd'].includes(key)) throw new Error(`Unknown option: ${key}`);
  const originalPrefix = source.slice(0, source.indexOf('<section class="x-life"'));
  const originalSuffix = source.slice(source.indexOf('<div class="xl-concepts '));
  let result = source;
  const rows = [...source.matchAll(/<section class="xl-compare-row[^>]*>[\s\S]*?<\/section>/g)].map(match => match[0]);
  if (rows.length !== 3) throw new Error('Expected three comparison rows');

  for (const row of rows) {
    let updated = row;
    const topic = row.match(/data-xl-topic="([^"]+)"/)[1];
    const cells = [...row.matchAll(/<article class="xl-compare-cell[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
    if (cells.length !== 2) throw new Error('Expected two sides');
    for (const cell of cells) {
      let next = cell;
      if (key === 'b' || key === 'd') {
        next = next.replace(/<h4 id="[^"]+">[\s\S]*?<\/h4>/, '');
        const side = cell.includes('xl-cell-pattern') ? 'pattern' : 'villow';
        next = next.replace(/aria-labelledby="[^"]+"/, `aria-labelledby="xl-${side}-column xl-topic-${topic}"`);
      } else {
        const paragraphStart = next.lastIndexOf('<p>');
        const paragraphEnd = next.lastIndexOf('</p>') + 4;
        if (paragraphStart < 0 || paragraphEnd !== next.indexOf('</article>')) throw new Error('Unexpected caption structure');
        const paragraph = next.slice(paragraphStart, paragraphEnd);
        next = next.slice(0, paragraphStart) + next.slice(paragraphEnd);
        const headingEnd = next.indexOf('</h4>') + 5;
        next = next.slice(0, headingEnd) + paragraph + next.slice(headingEnd);
      }
      updated = updated.replace(cell, next);
    }
    if (key === 'b' || key === 'c') updated = updated.replace(/<span class="xl-comparison-shift"[^>]*>[\s\S]*?<\/span>/, '');
    if (key === 'c') updated = updated.replace('class="xl-pair-topic"', 'class="sr-only"');
    result = result.replace(row, updated);
  }
  if (key === 'd') result = result.replace('<div class="xl-column-headings" role="group" aria-label="Comparison columns">', '<div class="xl-column-headings" role="group" aria-label="Comparison columns"><div class="cv-rail-spacer" aria-hidden="true"></div>');

  if (!result.startsWith(originalPrefix) || !result.endsWith(originalSuffix)) throw new Error('Changed content outside comparisons');
  const paragraphs = value => [...value.matchAll(/<article class="xl-compare-cell[^>]*>[\s\S]*?<\/article>/g)].map(match => {
    const start = match[0].lastIndexOf('<p>');
    if (key === 'c' && value === result) {
      const caption = match[0].match(/<\/h4>(<p>[\s\S]*?<\/p>)/);
      return caption[1];
    }
    return match[0].slice(start, match[0].lastIndexOf('</p>') + 4);
  });
  if (JSON.stringify(paragraphs(source)) !== JSON.stringify(paragraphs(result))) throw new Error('Changed comparison captions');
  return result;
}
