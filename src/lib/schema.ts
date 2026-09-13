/**
 * The shapes of site.config.yaml and the content files. A misspelt or unexpected field fails the build
 * with a message naming the file and field, so copy edits can't silently go missing.
 */
import { z } from "astro/zod";
import { themes } from "./themes";

/** YAML reads an empty `key:` as null; treat that as an empty string. */
const optionalText = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

/* ── Site config ─────────────────────────────────────────────────────────── */

export const statuses = ["live", "coming", "showcase", "exploring", "tbd"] as const;
const status = z.enum(statuses);

const featureBase = {
  id: z.string(),
  name: z.string(),
  status,
  summary: z.string().optional(),
  notes: z.string().optional(),
};

export const configSchema = z
  .strictObject({
    site: z.strictObject({ name: z.string(), url: z.url(), lang: z.string() }),
    theme: z.enum(themes),
    brand: z.strictObject({ logo: optionalText, favicon: optionalText, appIcon: optionalText }),
    links: z.record(z.string(), optionalText),
    tbd: z.record(z.string(), z.strictObject({ note: z.string(), value: optionalText })),
    images: z.record(
      z.string(),
      z.strictObject({
        label: z.string(),
        ratio: z.string().regex(/^\d+(\.\d+)?\/\d+(\.\d+)?$/, "ratio should look like 16/10"),
        src: optionalText,
        alt: optionalText,
      }),
    ),
    statusLabels: z.strictObject(Object.fromEntries(statuses.map((s) => [s, z.string()])) as Record<(typeof statuses)[number], z.ZodString>),
    features: z.strictObject({
      app: z.array(z.strictObject({ ...featureBase, area: z.string() })),
      extension: z.array(
        z.strictObject({
          ...featureBase,
          alone: z.boolean(),
          linked: z.boolean(),
          aloneNote: z.string().optional(),
          linkedNote: z.string().optional(),
        }),
      ),
      getting: z.array(z.strictObject(featureBase)),
    }),
  })
  .superRefine((config, ctx) => {
    const ids = [...config.features.app, ...config.features.extension, ...config.features.getting].map((f) => f.id);
    for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) {
      ctx.addIssue({ code: "custom", message: `Feature id "${id}" is used more than once`, path: ["features"] });
    }
  });

export type SiteConfig = z.output<typeof configSchema>;
export type Status = (typeof statuses)[number];

/* ── Shared pieces of content ────────────────────────────────────────────── */

/** Inline Markdown: **bold**, *italic*, [links](/path), {tbd:key}, {status:id}. Body fields also allow lists and paragraphs. */
const text = z.string();

/** `/path`, `/path#anchor`, `#anchor`, `https://…`, `mailto:…`, or `link:key` for a link in site.config.yaml. */
const href = z.string().min(1);

export const actionSchema = z.strictObject({
  label: z.string(),
  href,
  style: z.enum(["primary", "secondary", "text"]).default("secondary"),
});
export type Action = z.output<typeof actionSchema>;

const actions = z.array(actionSchema).optional();
/** A key under `images:` in site.config.yaml. */
const image = z.string().optional();

const blockBase = {
  /** Anchor for links like /features#feed. */
  id: z.string().optional(),
  eyebrow: text.optional(),
  /** Gives the band a background: soft is a gentle tint, strong is the accent. */
  background: z.enum(["none", "soft", "strong"]).optional(),
};

/* ── Blocks ──────────────────────────────────────────────────────────────── */

const hero = z.strictObject({
  type: z.literal("hero"),
  ...blockBase,
  title: text,
  lead: text.optional(),
  actions,
  smallPrint: z.array(text).optional(),
  image,
});

const section = z.strictObject({
  type: z.literal("section"),
  ...blockBase,
  /** statement: one large, centred line or two. */
  variant: z.enum(["default", "statement"]).default("default"),
  heading: text.optional(),
  body: text.optional(),
  image,
  imageSide: z.enum(["left", "right"]).default("right"),
  callouts: z
    .array(
      z.strictObject({
        heading: text.optional(),
        body: text,
        tone: z.enum(["note", "caution"]).default("note"),
      }),
    )
    .optional(),
  tagline: text.optional(),
  actions,
});

const steps = z.strictObject({
  type: z.literal("steps"),
  ...blockBase,
  heading: text.optional(),
  intro: text.optional(),
  /** row: side by side on wide screens. column: a numbered list down the page. */
  layout: z.enum(["row", "column"]).default("row"),
  items: z.array(
    z.strictObject({
      title: text,
      body: text.optional(),
      image,
      actions,
    }),
  ),
});

const cards = z.strictObject({
  type: z.literal("cards"),
  ...blockBase,
  heading: text.optional(),
  intro: text.optional(),
  items: z.array(
    z.strictObject({
      title: text,
      body: text.optional(),
      href: href.optional(),
      image,
    }),
  ),
  actions,
});

const spotlight = z.strictObject({
  type: z.literal("spotlight"),
  ...blockBase,
  heading: text,
  body: text,
  image,
  imageSide: z.enum(["left", "right"]).default("right"),
  actions,
});

const feature = z.strictObject({
  type: z.literal("feature"),
  ...blockBase,
  id: z.string(),
  heading: text,
  image,
  what: text,
  why: text.optional(),
  tagline: text.optional(),
  actions,
});

const table = z.strictObject({
  type: z.literal("table"),
  ...blockBase,
  /** comparison: styled as a before/after, two columns. */
  variant: z.enum(["default", "comparison"]).default("default"),
  heading: text.optional(),
  intro: text.optional(),
  columns: z.array(z.string()),
  rows: z.array(z.array(text)),
  note: text.optional(),
});

const faq = z.strictObject({
  type: z.literal("faq"),
  ...blockBase,
  heading: text.optional(),
  intro: text.optional(),
  items: z.array(z.strictObject({ q: text, a: text })),
});

const cta = z.strictObject({
  type: z.literal("cta"),
  ...blockBase,
  /** fixtheweb: Fix the Web's colours and spider mark, for policy links. */
  variant: z.enum(["villow", "fixtheweb"]).default("villow"),
  heading: text,
  body: text.optional(),
  actions,
});

const roadmap = z.strictObject({
  type: z.literal("roadmap"),
  ...blockBase,
  groups: z.array(z.strictObject({ status, heading: text, intro: text.optional() })),
});

const extensionTable = z.strictObject({
  type: z.literal("extensionTable"),
  ...blockBase,
  heading: text.optional(),
  intro: text.optional(),
  columns: z.tuple([z.string(), z.string(), z.string()]),
});

const prose = z.strictObject({
  type: z.literal("prose"),
  ...blockBase,
  /** A file in src/content/prose/, without .md */
  file: z.string(),
});

const notice = z.strictObject({
  type: z.literal("notice"),
  ...blockBase,
  tone: z.enum(["draft", "info"]).default("info"),
  heading: text.optional(),
  body: text,
});

const toc = z.strictObject({
  type: z.literal("toc"),
  ...blockBase,
  heading: text.optional(),
});

export const blockSchema = z.discriminatedUnion("type", [
  hero,
  section,
  steps,
  cards,
  spotlight,
  feature,
  table,
  faq,
  cta,
  roadmap,
  extensionTable,
  prose,
  notice,
  toc,
]);
export type Block = z.output<typeof blockSchema>;
export type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;

export const pageSchema = z.strictObject({
  /** Shown in the browser tab as "Title · Villow". */
  title: z.string(),
  /** For search results and link previews. */
  description: z.string(),
  blocks: z.array(blockSchema),
});

/* ── Site-wide copy (header, footer, small interface words) ──────────────── */

const navLink = z.strictObject({ label: z.string(), href });

export const siteContentSchema = z.strictObject({
  header: z.strictObject({ links: z.array(navLink), action: actionSchema }),
  footer: z.strictObject({
    project: z.strictObject({ label: z.string(), href, blurb: text }),
    groups: z.array(z.strictObject({ heading: z.string(), links: z.array(navLink) })),
    notes: z.array(text),
  }),
  ui: z.strictObject({
    skipToContent: z.string(),
    mainNav: z.string(),
    footerNav: z.string(),
    logoPlaceholder: z.string(),
    tbd: z.string(),
    tbdTitle: z.string(),
    inertLinkTitle: z.string(),
    imagePlaceholder: z.string(),
    featureWhat: z.string(),
    featureWhy: z.string(),
    yes: z.string(),
    no: z.string(),
    fixTheWebMark: z.string(),
    themePicker: z.string(),
  }),
});
