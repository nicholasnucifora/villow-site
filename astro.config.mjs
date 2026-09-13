import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import { parse } from "yaml";

const siteConfig = parse(readFileSync(new URL("./site.config.yaml", import.meta.url), "utf8"));

export default defineConfig({
  site: siteConfig.site.url,
  // Pages build to name.html, the same way public/privacy.html is served at /privacy.
  build: { format: "file" },
  trailingSlash: "never",
});
