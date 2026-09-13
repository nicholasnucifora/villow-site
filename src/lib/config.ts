import text from "../../site.config.yaml?raw";
import { loadYaml } from "./load";
import { configSchema, type Status } from "./schema";

export const config = loadYaml("site.config.yaml", text, configSchema);

export interface FeatureEntry {
  id: string;
  name: string;
  status: Status;
  summary?: string;
  /** Where it belongs, e.g. "Feed" or "Extension". */
  area: string;
}

export const allFeatures: FeatureEntry[] = [
  ...config.features.app,
  ...config.features.extension.map((f) => ({ ...f, area: "Extension" })),
  ...config.features.getting.map((f) => ({ ...f, area: "Getting Villow" })),
];

export function getFeature(id: string): FeatureEntry {
  const found = allFeatures.find((f) => f.id === id);
  if (!found) throw new Error(`No feature with id "${id}". Add it under features: in site.config.yaml.`);
  return found;
}

export function getImage(key: string) {
  const found = config.images[key];
  if (!found) throw new Error(`No image called "${key}". Add it under images: in site.config.yaml.`);
  return found;
}

export function getTbd(key: string) {
  const found = config.tbd[key];
  if (!found) throw new Error(`No TBD called "${key}". Add it under tbd: in site.config.yaml.`);
  return found;
}
