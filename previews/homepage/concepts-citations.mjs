// Checked against the papers' abstracts/results on 8 November 2026.
// Keep post-note effects distinct from lifetime / 36-hour totals.
const studies = {
 1: {
  publication: 'PNAS · 2025',
  title: 'Community notes reduce engagement with and diffusion of false information online',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12478135/',
  finding: 'The study estimated <strong>46.1% fewer reposts after a note appeared</strong>. Across posts’ full lifespans, the estimated reduction was <strong>11.6%</strong>.',
  scope: 'Observational research on X, using synthetic controls. It did not test YouTube or correction notifications.',
 },
 2: {
  publication: 'Nature Communications · 2026',
  title: 'Community-based fact-checking reduces the spread of misleading posts on X (formerly Twitter)',
  url: 'https://www.nature.com/articles/s41467-026-72597-0',
  finding: 'Notes took a median <strong>18.1 hours</strong> to appear. The study estimated <strong>61.2% fewer reposts after notes appeared</strong>, but <strong>14.9% fewer overall</strong> in its 36-hour analysis.',
  scope: 'Observational research on X. It did not test whether notifying earlier viewers changes their beliefs.',
 },
};

export function researchCitation(number, instance = number) {
 const study = studies[number];
 if (!study) throw new Error(`Unknown research citation: ${number}`);
 const id = `cb-citation-${instance}`;
 return `<span class="cb-citation"><a class="cb-research-ref" href="${study.url}" target="_blank" rel="noopener" data-citation-trigger aria-label="Study ${number}: ${study.publication}">[${number}]</a><span class="cb-citation-popover" id="${id}" popover="manual" role="dialog" aria-labelledby="${id}-title" hidden><span class="cb-citation-publication">${study.publication}</span><span class="cb-citation-title" id="${id}-title">${study.title}</span><span class="cb-citation-finding">${study.finding}</span><span class="cb-citation-scope">${study.scope}</span><a class="cb-citation-source" href="${study.url}" target="_blank" rel="noopener">Read the paper <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><button class="cb-citation-close" type="button" aria-label="Close study ${number} summary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></span></span>`;
}
