import type { APIRoute } from "astro";
import { config } from "../lib/config";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", config.site.url).href}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
