/**
 * Runs after `astro build`. Fails the build if:
 *  - /privacy (the extension's privacy policy, linked from the extension store listings) changed at all
 *  - a page is missing the "not affiliated with YouTube or Google" line
 *  - a page loads anything from another site (the site promises no third parties)
 *  - copy uses wording the brief rules out (see "Never claim" and "Talking about YouTube")
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";

// The SHA-256 of the committed file, which is also what villow.app/privacy served on 14 September 2026.
// If you deliberately update public/privacy.html, replace this with the new file's SHA-256.
// (.gitattributes stops Git changing its line endings, which would change this hash on Windows.)
const PRIVACY_SHA256 = "d5ca44e0933fe492293121577b813bb3dd57bb877e989f2ff8c99d57e4e6c866";

const AFFILIATION = "not affiliated with, endorsed by, or sponsored by YouTube or Google";

// Each rule: a pattern to catch, and why. Lookaheads allow the few places the brief itself uses the words.
const WORDING = [
  [/replace(ment)? (for )?youtube(?!\?)|youtube (replacement|alternative)|alternative to youtube|substitute for youtube/i, 'Frame Villow as proof, not a replacement or alternative ("a healthier way to watch YouTube").'],
  [/never open youtube again/i, "Frame Villow as proof, not a replacement."],
  [/villow ?tube|villow for youtube/i, 'Don\'t put "YouTube" in the product name. Say "an app for YouTube".'],
  [/ad-free(?!\?)/i, 'Say "Villow adds no ads of its own"; YouTube\'s player can still show ads.'],
  [/no tracking(?! of videos made for kids)/i, 'Don\'t say "no tracking" about the app. Say "measured for you, kept in your own Villow".'],
  [/ai-powered|smart ai|machine learning|algorithm-free/i, 'Suggestions come from a transparent algorithm, not AI. Say "an algorithm that works for you".'],
  [/addict|hooked\b/i, 'Say "satisfying", "quick" or "fun", and don\'t promise health outcomes.'],
  [/\bcures?\b/i, "Don't promise health outcomes."],
  [/endorsed by youtube|approved by (youtube|google)|partner(ed|ship)? with (youtube|google)/i, "Never imply YouTube or Google endorses Villow."],
];

const dist = new URL("../dist/", import.meta.url);
const failures = [];

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

const decode = (text) =>
  text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const visibleText = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  );

// 1. The extension's privacy policy ships untouched.
for (const [label, url] of [
  ["public/privacy.html", new URL("../public/privacy.html", import.meta.url)],
  ["dist/privacy.html", new URL("privacy.html", dist)],
]) {
  const hash = sha256(await readFile(url));
  if (hash !== PRIVACY_SHA256) {
    failures.push(`${label} has changed. It's the extension's privacy policy, linked from the store listings. Restore it, or update PRIVACY_SHA256 in scripts/check-build.mjs if the change is deliberate.`);
  }
}

// 2–4. Every built page.
const htmlFiles = (await readdir(dist, { recursive: true })).filter((f) => f.endsWith(".html") && f !== "privacy.html");

for (const file of htmlFiles) {
  const html = await readFile(new URL(file, dist), "utf8");
  const text = visibleText(html);

  if (!text.includes(AFFILIATION)) failures.push(`${file}: missing "${AFFILIATION}".`);

  const external = html.match(/<(script|link|img|iframe|video|audio|source)\b[^>]*\b(src|href)="(https?:)?\/\/[^"]*"[^>]*>/gi) ?? [];
  for (const tag of external) {
    if (/<link\b[^>]*rel="canonical"/i.test(tag)) continue;
    failures.push(`${file}: loads something from another site: ${tag}`);
  }

  for (const [pattern, advice] of WORDING) {
    const match = text.match(pattern);
    if (match) {
      const at = match.index ?? 0;
      failures.push(`${file}: "…${text.slice(Math.max(0, at - 40), at + match[0].length + 40).trim()}…"\n    ${advice}`);
    }
  }
}

if (failures.length) {
  console.error(`\n✗ Build checks failed:\n\n${failures.map((f) => `  • ${f}`).join("\n")}\n`);
  process.exit(1);
}
console.log(`✓ Build checks passed: /privacy unchanged, ${htmlFiles.length} pages checked.`);
