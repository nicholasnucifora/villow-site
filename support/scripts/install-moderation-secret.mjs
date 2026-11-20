// Pass only the generated password HASH to Wrangler via stdin. Never print it.
import { spawn } from 'node:child_process';
if (process.stdin.isTTY) throw new Error('Provide only the generated hash through protected stdin. Do not use a command-line secret or a file in this repo.');
let source = '';
for await (const chunk of process.stdin) { source += chunk;if (source.length > 256) throw new Error('Expected one password hash.'); }
const hash = source.trim();
if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Expected one generated password hash through stdin.');
const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'secret', 'put', 'MODERATION_PASSWORD_HASH', '--config', 'wrangler.production.jsonc'], { cwd: new URL('..', import.meta.url), stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
child.stdin.end(hash + '\n');
// Wrangler output normally contains only metadata; redact defensively.
child.stdout.on('data', value => process.stdout.write(String(value).replaceAll(hash, '[redacted]')));
child.stderr.on('data', value => process.stderr.write(String(value).replaceAll(hash, '[redacted]')));
child.on('exit', code => { process.exitCode = code ?? 1; });
