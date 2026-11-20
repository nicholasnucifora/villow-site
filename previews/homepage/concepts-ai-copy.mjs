// Condensed from src/content/pages/ai.yaml. These are discussion proposals,
// not implemented features, promises, or AI credibility/bot-detection claims.
export const aiConceptIntro = 'Villow works without generative AI. Its current suggestions use transparent rules based on your ratings, skips and usage. These six possibilities are early ideas, with no imminent release plans. Each would need to show a useful benefit over simpler tools.';

export const aiConceptIdeas = [
  {
    id: 'chapters',
    title: 'Find your place in a video',
    benefit: 'Labelled timestamps could help you find a useful moment or return to something you want to revisit.',
    caution: 'Wrong labels or missing visual context could misrepresent a video.',
    stance: 'Start with creator-provided chapters. Explore generated ones only when source access is permitted and timestamps can be checked.',
  },
  {
    id: 'video-conversations',
    title: 'Ask a question about a video',
    benefit: 'Ask a focused question or revisit an argument without searching the whole video.',
    caution: 'A fluent answer can still be wrong, and transcripts may be incomplete or unavailable.',
    stance: 'Any experiment should cite the source, separate added context and make it easy to return to the video.',
  },
  {
    id: 'comments',
    title: 'Think through a comment',
    benefit: 'Explore unfamiliar wording or consider a clarifying question before replying.',
    caution: 'A short comment rarely gives enough context to settle its author’s intent or a claim’s truth.',
    stance: 'Keep the original visible and treat generated interpretations as possibilities, never credibility scores.',
  },
  {
    id: 'topic-guidance',
    title: 'Describe your topic preferences',
    benefit: 'Describe what you want to find, such as more archaeology and fewer battle histories.',
    caution: 'Ambiguous preferences could silently narrow what reaches you.',
    stance: 'Only explore this with an inspectable interpretation, a preview, and ordinary controls to change or undo it.',
  },
  {
    id: 'recommendations',
    title: 'Refine recommendations in your words',
    benefit: 'Explain what you want from discovery and explore material that simple filters might miss.',
    caution: 'Opaque AI ranking could recreate the loss of control Villow is trying to address. It would not import YouTube’s personalized feed.',
    stance: 'Defer it unless it shows a useful benefit over simpler, explained choices.',
  },
  {
    id: 'things-to-do',
    title: 'Consider what to do next',
    benefit: 'Talk through what you want to do next, including rest or doing nothing.',
    caution: 'Personal plans can be sensitive, and advice could add pressure or become another endless conversation.',
    stance: 'Leave decisions and changes with you. A simple list may already be enough.',
  },
];

export const aiConceptConditions = 'Before building any of these, we would need clear choices about privacy, creator permissions, reliability, resource use and cost. People should know what data is sent, be able to turn the feature off, and stay in control of what changes.';
