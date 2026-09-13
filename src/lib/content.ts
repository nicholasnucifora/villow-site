/** Loads the copy in src/content/. */
import siteText from "../content/site.yaml?raw";
import { loadYaml } from "./load";
import { pageSchema, siteContentSchema } from "./schema";

export const siteContent = loadYaml("src/content/site.yaml", siteText, siteContentSchema);
export const ui = siteContent.ui;

const pageFiles = import.meta.glob<string>("/src/content/pages/*.yaml", { query: "?raw", import: "default", eager: true });

export const pages = Object.entries(pageFiles).map(([file, text]) => {
  const slug = file.slice(file.lastIndexOf("/") + 1, -".yaml".length);
  if (slug === "privacy") {
    throw new Error("src/content/pages/privacy.yaml would replace /privacy, the extension's privacy policy. Use another name.");
  }
  return { slug, path: slug === "index" ? "/" : `/${slug}`, ...loadYaml(file.slice(1), text, pageSchema) };
});

/** Pages served straight from public/ rather than built from content. */
export const publicPaths = ["/privacy"];

export const knownPaths = new Set([...pages.map((p) => p.path), ...publicPaths]);

const proseFiles = import.meta.glob<string>("/src/content/prose/*.md", { query: "?raw", import: "default", eager: true });

export function getProse(name: string): string {
  const found = proseFiles[`/src/content/prose/${name}.md`];
  if (found === undefined) throw new Error(`No prose file src/content/prose/${name}.md`);
  return found;
}
