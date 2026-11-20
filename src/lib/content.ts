/** Loads the copy in src/content/. */
import siteText from "../content/site.yaml?raw";
import { loadYaml } from "./load";
import { pageSchema, siteContentSchema } from "./schema";
import { siteRoutes } from "../../previews/homepage/site-routes.js";

export const siteContent = loadYaml("src/content/site.yaml", siteText, siteContentSchema);
export const ui = siteContent.ui;

const pageFiles = import.meta.glob<string>("/src/content/pages/*.yaml", { query: "?raw", import: "default", eager: true });

export const pages = Object.entries(pageFiles).map(([file, text]) => {
  const slug = file.slice(file.lastIndexOf("/") + 1, -".yaml".length);
  if (slug === "extension-privacy") {
    throw new Error("src/content/pages/extension-privacy.yaml would replace the dedicated /extension-privacy policy route. Use another name.");
  }
  return { slug, path: slug === "index" ? "/" : `/${slug}`, ...loadYaml(file.slice(1), text, pageSchema) };
});

/** Dedicated routes rather than YAML content pages. */
export const publicPaths = ["/extension-privacy"];

export const knownPaths = new Set([...pages.map((p) => p.path), ...publicPaths, ...Object.values(siteRoutes)]);

const proseFiles = import.meta.glob<string>("/src/content/prose/*.md", { query: "?raw", import: "default", eager: true });

export function getProse(name: string): string {
  const found = proseFiles[`/src/content/prose/${name}.md`];
  if (found === undefined) throw new Error(`No prose file src/content/prose/${name}.md`);
  return found;
}
