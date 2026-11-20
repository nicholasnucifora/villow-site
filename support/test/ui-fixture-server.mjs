// Isolated UI checks: no Stripe, Discord, email or database requests leave here.
// Run with node support/test/ui-fixture-server.mjs; browse port 4422.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../previews/homepage/', import.meta.url));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ttf': 'font/ttf' };
createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4422');
  const json = (data, status = 200) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
  if (url.pathname.startsWith('/api/')) {
    let input = ''; for await (const part of req) { input += part; if (input.length > 4096) { json({}, 413); return; } }
    let body; try { body = input ? JSON.parse(input) : {}; } catch { json({}, 400); return; }
    switch (url.pathname.slice(5)) {
      case 'config': json({ mode: 'live', currency: 'aud', enabled: true, discord: { enabled: true }, portal: 'https://billing.stripe.com/p/login/ui_fixture' }); break;
      case 'exchange-rates': json({ base: 'AUD', date: '2026-11-05', rates: { AUD: 1, USD: .65, JPY: 100 }, dates: {} }); break;
      case 'supporters': json({ supporters: [], hasMore: false, nextPage: 1 }); break;
      case 'discord-request':
        if (body.email === 'failure@example.com') json({ error: 'We couldn’t send your verification email. Please try again.' }, 503);
        else json({ message: 'Verification email sent. Check your inbox to continue.' });
        break;
      case 'discord-status':
        if (body.token === 'a'.repeat(64)) json({ eligible: false, connected: false, disconnecting: false });
        else if (body.token === 'b'.repeat(64)) json({ eligible: true, connected: false, disconnecting: false });
        else json({ error: 'This link has expired. Request a new email link.' }, 400);
        break;
      default: json({ error: 'This UI fixture cannot change accounts or create payments.' }, 403);
    }
    return;
  }
  try {
    const name = ['/', '/support'].includes(url.pathname) ? 'help-a.html' : decodeURIComponent(url.pathname.slice(1));
    const file = resolve(root, name);
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep) || !types[extname(file)]) { res.writeHead(404); res.end(); return; }
    let content = await readFile(file);
    if (name === 'help-page-a.js') content = content.toString().replace('https://fixtheweb-support.nuciforan.workers.dev/v1/projects/villow', 'http://127.0.0.1:4422/api');
    res.writeHead(200, { 'Content-Type': types[extname(file)], 'Cache-Control': 'no-store' }); res.end(content);
  } catch { res.writeHead(404); res.end(); }
}).listen(4422, '127.0.0.1', () => console.log('Isolated supporter UI fixture: http://127.0.0.1:4422/help-a.html#financial-support'));
