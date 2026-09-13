import { z } from "astro/zod";
import { parse } from "yaml";

/** Parses a YAML file's text and checks it against a schema, failing the build with a readable message if it doesn't fit. */
export function loadYaml<T extends z.ZodType>(file: string, text: string, schema: T): z.output<T> {
  let data: unknown;
  try {
    data = parse(text);
  } catch (error) {
    throw new Error(`${file} has a YAML syntax error:\n${(error as Error).message}`);
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${file} doesn't match the expected shape:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
