// Reads Stripe configuration without creating payments or changing your account.
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import Stripe from 'stripe';
import { API_VERSION, projectConfig, verifiedLink } from '../lib/config.mjs';
const { values } = parseArgs({ options: {
  links: { type: 'string' }, origin: { type: 'string' }, mode: { type: 'string' }, project: { type: 'string', default: 'villow' },
} });
try {
  if (!values.links || !values.origin || !['test', 'live'].includes(values.mode)) throw new Error('Usage: npm run discover -- --links stripe-links.test.json --origin http://localhost:4321 --mode test');
  if (!new RegExp(`^(sk|rk)_${values.mode}_`).test(process.env.STRIPE_SECRET_KEY || '')) throw new Error('Set the matching STRIPE_SECRET_KEY in your shell environment first.');
  const desired = JSON.parse(await readFile(values.links, 'utf8'));
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: API_VERSION });
  const entries = {};
  for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
    for (const key of ['once', 'monthly5', 'monthly10', 'monthly20']) if (link.url === desired[key]) entries[key] = link.id;
  }
  const project = { origin: values.origin, currency: desired.currency, portal: desired.portal, links: entries };
  const env = { PROJECTS_JSON: JSON.stringify({ [values.project]: project }), STRIPE_MODE: values.mode };
  projectConfig(env, values.project);
  for (const key of Object.keys(entries)) {
    const { link } = await verifiedLink(stripe, env, project, key);
    if (!link.active) throw new Error(`${key}: Payment Link is inactive.`);
  }
  console.log(env.PROJECTS_JSON);
} catch (error) {
  // Avoid dumping SDK errors, request headers or credentials.
  console.error(error instanceof Stripe.errors.StripeError ? 'Stripe configuration could not be read. Check the key, account, permissions, and links.' : error.message);
  process.exitCode = 1;
}
