/** Lists everything in site.config.yaml that's still empty. Run with `npm run placeholders`. */
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const config = parse(await readFile(new URL("../site.config.yaml", import.meta.url), "utf8"));

const sections = [
  ["Brand", Object.entries(config.brand).filter(([, v]) => !v).map(([k]) => k)],
  ["Links", Object.entries(config.links).filter(([, v]) => !v).map(([k]) => k)],
  ["Not decided yet", Object.entries(config.tbd).filter(([, v]) => !v.value).map(([k, v]) => `${k}: ${v.note}`)],
  ["Images", Object.entries(config.images).filter(([, v]) => !v.src).map(([k, v]) => `${k}: ${v.label} (${v.ratio})`)],
  [
    "Features not yet live",
    Object.values(config.features)
      .flat()
      .filter((f) => f.status !== "live")
      .map((f) => `${f.id}: ${f.status}`),
  ],
];

let total = 0;
for (const [heading, items] of sections) {
  if (!items.length) continue;
  console.log(`\n${heading} (${items.length})`);
  for (const item of items) console.log(`  - ${item}`);
  if (heading !== "Features not yet live") total += items.length;
}
console.log(`\n${total} placeholders left in site.config.yaml.\n`);
