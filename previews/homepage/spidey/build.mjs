import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
export const rawSVG = {
  name: "local-source-svg",
  setup(builder) {
    builder.onResolve({ filter: /\.svg\?raw$/ }, ({ path: asset, resolveDir }) => ({
      path: path.resolve(resolveDir, asset.slice(0, -4)), namespace: "source-svg",
    }));
    builder.onLoad({ filter: /.*/, namespace: "source-svg" }, async ({ path: asset }) => ({
      contents: await readFile(asset, "utf8"), loader: "text",
    }));
  },
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build({
    entryPoints: [path.join(directory, "pinned-footer-spider.ts")],
    outfile: path.join(directory, "pinned-footer-spider.js"),
    bundle: true, platform: "browser", format: "esm", target: "es2020",
    plugins: [rawSVG], minify: true, legalComments: "none", metafile: true,
  });
  const inputs = Object.keys(result.metafile.inputs);
  const forbidden = inputs.filter((input) => /(?:^|[/\\])(?:rope|anchor|particles|drag|pluck|food|look|index)\.ts$/.test(input));
  if (forbidden.length) throw new Error(`Pinned bundle unexpectedly includes runtime modules: ${forbidden.join(", ")}`);
  console.log(`Built local pinned footer module (${inputs.length} inputs; no tether/food/storage entry points).`);
}
