import { readFile, writeFile } from 'node:fs/promises';
import { studyNavigation } from './study-navigation.mjs';

// A–E's renderers call studyNavigation directly. F/G and future hand-authored
// previews use this synchronizer, preserving every byte outside navigation.
for (const key of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i','i2','i3','i4', 'j','k','l','m','n','n-previous','o','p','q','r','s','t','u','v','w','x', 'index']) {
  const file = new URL(`./${key}.html`, import.meta.url);
  let source;
  try { source = await readFile(file, 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  const current = key === 'index' ? 'a' : key==='n-previous'?'n':/^i[234]$/.test(key)?'i':key;
  const navigation = studyNavigation(current,{variant:key==='n-previous'?'previous':current==='i'?(key==='i'?'i1':key):undefined});
  const marked = /<!-- study-navigation:start -->[\s\S]*?<!-- study-navigation:end -->/;
  const oldShared = /<aside\b[^>]*\bstudy-navigation\b[^>]*>[\s\S]*?<\/aside>/;
  if (marked.test(source)) source = source.replace(marked, navigation);
  else if (oldShared.test(source)) source = source.replace(oldShared, navigation);
  else if (key === 'f') {
    source = source.replace(/<header>\s*<p class="identity">[\s\S]*?<\/header>/, '');
    source = source.replace(/<body([^>]*)>/, `<body$1>\n${navigation}`);
  } else if (key === 'g') {
    source = source.replace(/<aside class="study-bar"[\s\S]*?<\/aside>/, navigation);
  } else source = source.replace(/<body([^>]*)>/, `<body$1>\n${navigation}`);
  if (!source.includes('href="study-navigation.css"') && !source.includes('href="./study-navigation.css"')) {
    source = source.replace('</head>', '<link rel="stylesheet" href="study-navigation.css"></head>');
  }
  await writeFile(file, source);
}









