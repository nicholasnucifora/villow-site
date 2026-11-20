import type { APIRoute } from "astro";
import { config } from "../lib/config";
import { pages, publicPaths } from "../lib/content";
import { designPages, designAliases } from '../lib/site-design.mjs';

export const GET: APIRoute = () => {
  const paths = [...new Set([
    ...pages.filter((p) => p.slug !== '404' && !designAliases[p.path]).map((p) => p.path),
    ...designPages.filter((p) => !p.path.startsWith('/previews/')).map((p) => p.path),
    '/hosting-details', ...publicPaths,
  ])];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, config.site.url).href}</loc></url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
