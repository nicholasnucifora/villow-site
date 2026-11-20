// Local comparison server with the expanded B–F allowlist.
process.env.VILLOW_PREVIEW_PORT = '4401';
await import('./serve.mjs');
