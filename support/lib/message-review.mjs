// Local, deterministic hold list. This is a screening aid, not a judgment about
// the donor. Originals remain available privately; only owner-approved masks publish.
// Terms are deliberately explicit here so maintainers can audit the filter.
const terms = [
  'nigger', 'niggers', 'nigga', 'niggas', 'faggot', 'faggots', 'fag', 'fags',
  'kike', 'kikes', 'chink', 'chinks', 'gook', 'gooks', 'spic', 'spics',
  'wetback', 'wetbacks', 'tranny', 'trannies', 'retard', 'retarded',
  'cunt', 'cunts', 'fuck', 'fucker', 'fuckers', 'fucking', 'motherfucker',
  'shit', 'shitty', 'bullshit', 'bitch', 'bitches', 'asshole', 'arsehole',
];
const substitutions = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i',
  'а': 'a', 'е': 'e', 'і': 'i', 'о': 'o', 'с': 'c', 'р': 'p', 'х': 'x', 'у': 'y', 'к': 'k', 'т': 't', 'ν': 'v' };
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Whole-word boundaries avoid matching ordinary words such as Scunthorpe.
// Separators, repeated letters and common substitutions catch basic evasion.
const patterns = terms.map(term => new RegExp(`(?:^|[^a-z0-9])${[...term].map(char => `${escape(char)}+`).join('[\\s._*\\-]*')}(?=$|[^a-z0-9])`, 'u'));
function normalise(value) {
  return String(value || '').normalize('NFKD').toLowerCase().replace(/[\p{M}\p{Cf}]/gu, '')
    .replace(/[013457@$!аеіосрхуктν]/gu, char => substitutions[char]);
}
export function needsReview(name, message) {
  return [name, message].some(value => {
    const text = normalise(value);
    return patterns.some(pattern => pattern.test(text)) || /\b(kill yourself|heil hitler|white power)\b/u.test(text);
  });
}
// Map normalised characters back to their original UTF-16 spans, so accents,
// full-width letters, separator tricks and invisible marks are masked together.
// This proposes a literal mask only: no paraphrasing or change of sentiment.
export function censorText(value) {
  if (!value) return value;
  const source = String(value), spans = []; let text = '', offset = 0;
  for (const segment of new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(source)) {
    const normal = normalise(segment.segment);
    for (let i = 0; i < normal.length; i++) spans.push([segment.index, segment.index + segment.segment.length]);
    text += normal;
  }
  const ranges = [];
  for (const term of [...terms, 'kill yourself', 'heil hitler', 'white power']) {
    const expression = [...term].map(char => char === ' ' ? '[\\s._*\\-]+' : `${escape(char)}+`).join('[\\s._*\\-]*');
    const pattern = new RegExp(`(?<![a-z0-9])${expression}(?![a-z0-9])`, 'gu');
    for (const match of text.matchAll(pattern)) ranges.push({ start: spans[match.index][0], end: spans[match.index + match[0].length - 1][1], term });
  }
  ranges.sort((a, b) => a.start - b.start || b.end - a.end);
  let result = '';
  for (const range of ranges) {
    if (range.start < offset) continue;
    // Fully mask each detected word/phrase. Text hearts inherit Villow's colour
    // and avoid exposing letters or length. Publication still needs approval.
    result += source.slice(offset, range.start) + '♥♥♥';
    offset = range.end;
  }
  return result + source.slice(offset);
}
export function censorSuggestion(name, message) {
  const suggestedName = censorText(name), suggestedMessage = censorText(message);
  return { name: suggestedName, message: suggestedMessage, changed: suggestedName !== name || suggestedMessage !== message };
}
export const reviewStatusSQL = `CASE WHEN moderation = 'approved' THEN 'approved' WHEN moderation = 'hidden' THEN 'hidden' WHEN auto_publish = 1 THEN 'unreviewed' ELSE 'needs_review' END`;
export const reviewStates = ['unreviewed', 'approved', 'hidden', 'needs_review'];
export function reviewStatus(record) {
  return record.moderation === 'approved' ? 'approved' : record.moderation === 'hidden' ? 'hidden' : record.auto_publish === 1 ? 'unreviewed' : 'needs_review';
}
