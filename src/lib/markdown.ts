/**
 * Turns copy into HTML. Copy can use Markdown plus two placeholders:
 *   {tbd:key}    the value from tbd: in site.config.yaml, or a TBD chip showing its note
 *   {status:id}  the badge for a feature's status (nothing once it's live)
 * Links can point at link:key to use a URL from site.config.yaml.
 */
import { Marked } from "marked";
import { config, getFeature, getTbd } from "./config";
import { knownPaths, ui } from "./content";
import type { Status } from "./schema";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function slugify(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Where a link goes. `href` is null when it points at a link: key that hasn't been filled in yet. */
export function resolveHref(href: string): { href: string | null; external: boolean } {
  if (href.startsWith("link:")) {
    const key = href.slice("link:".length);
    if (!(key in config.links)) throw new Error(`No link called "${key}". Add it under links: in site.config.yaml.`);
    const value = config.links[key]!;
    return value ? resolveHref(value) : { href: null, external: false };
  }
  if (/^(https?:|mailto:)/.test(href)) return { href, external: true };
  if (href.startsWith("#")) return { href, external: false };
  if (href.startsWith("/")) {
    const path = href.split("#")[0]!;
    if (!knownPaths.has(path)) throw new Error(`Link to ${href}, but there's no page at ${path}.`);
    return { href, external: false };
  }
  throw new Error(`Link "${href}" should start with /, #, https://, mailto: or link:`);
}

export function tbdHtml(note: string): string {
  return `<span class="tbd" title="${escapeHtml(ui.tbdTitle)}"><span class="tbd__label">${escapeHtml(ui.tbd)}</span><span class="tbd__note">${escapeHtml(note)}</span></span>`;
}

export function statusBadgeHtml(status: Status): string {
  if (status === "live") return "";
  return `<span class="badge badge--${status}">${escapeHtml(config.statusLabels[status])}</span>`;
}

/** A link, or while its URL is missing, something that looks like one, is marked TBD, and does nothing. */
export function linkHtml(href: string, innerHtml: string, className = ""): string {
  const resolved = resolveHref(href);
  const classAttr = (extra: string) => {
    const names = [className, extra].filter(Boolean).join(" ");
    return names ? ` class="${names}"` : "";
  };
  if (!resolved.href) {
    return `<a${classAttr("is-inert")} role="link" aria-disabled="true" tabindex="0" title="${escapeHtml(ui.inertLinkTitle)}">${innerHtml}<span class="tbd tbd--mini">${escapeHtml(ui.tbd)}</span></a>`;
  }
  return `<a${classAttr("")} href="${escapeHtml(resolved.href)}">${innerHtml}</a>`;
}

const marked = new Marked({
  gfm: true,
  renderer: {
    link({ href, tokens }) {
      return linkHtml(href, this.parser.parseInline(tokens));
    },
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(inner)}">${inner}</h${depth}>\n`;
    },
  },
});

function expandPlaceholders(html: string): string {
  return html.replace(/\{(tbd|status):([\w-]+)\}/g, (_, kind: string, key: string) => {
    if (kind === "status") return statusBadgeHtml(getFeature(key).status);
    const entry = getTbd(key);
    return entry.value ? inline(entry.value) : tbdHtml(entry.note);
  });
}

/** Markdown with paragraphs and lists. */
export function md(source: string): string {
  return expandPlaceholders(marked.parse(source, { async: false }));
}

/** Markdown for a single line: headings, labels, table cells. */
export function inline(source: string): string {
  return expandPlaceholders(marked.parseInline(source, { async: false }));
}
