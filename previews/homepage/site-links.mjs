import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {resolve} from 'node:path';

// Shared with the main website. Community URLs are never separate draft pages.
export const siteLinks = parse(readFileSync(resolve('site.config.yaml'), 'utf8')).links;
export const escapeLink = value => String(value || '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
