import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const origin = 'https://fixtheweb.org', endpoint = origin + '/admin/support/api/';
const backend = 'https://fixtheweb-support.nuciforan.workers.dev';
if (process.stdin.isTTY) throw new Error('Sign in through the browser, or provide the saved password through protected stdin. Do not save it in this repo.');
let input = '';
for await (const chunk of process.stdin) { input += chunk;if (input.length > 256) throw new Error('Expected one password.'); }
const password = input.trim();
if (!password || password.length > 200) throw new Error('A saved admin password is required through stdin.');
let cookie;
const call = (path, body, auth = true, requestOrigin = origin) => fetch(endpoint + path, {
  method: body ? 'POST' : 'GET', redirect: 'error',
  headers: { ...(auth && cookie ? { Cookie: cookie } : {}), ...(body ? { Origin: requestOrigin, 'Content-Type': 'application/json' } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
});
const report = {};
assert.equal((await call('messages')).status, 401);report.unauthenticatedDataDenied = true;
assert.equal((await fetch(backend + '/admin/support')).status, 404);report.otherHostDenied = true;
const response = await call('login', { password });assert.equal(response.status, 200);
const full = response.headers.get('set-cookie');
assert.match(full, /HttpOnly/);assert.match(full, /Secure/);assert.match(full, /SameSite=Strict/);assert.match(full, /Path=\/admin\/support/);
cookie = full.split(';')[0];report.secureSignIn = true;
try {
  assert.equal((await call('session')).status, 200);
  assert.equal((await call('decision', {}, true, 'https://example.com')).status, 403);report.foreignOriginDenied = true;
  const listing = await call('messages?state=all');assert.equal(listing.status, 200);assert.equal(listing.headers.get('cache-control'), 'no-store');
  const data = await listing.json();report.countsBefore = data.counts;
  for (const row of data.messages) for (const key of Object.keys(row)) assert(['id', 'name', 'message', 'status', 'version', 'publicName', 'publicMessage', 'censored', 'suggestion'].includes(key));
  report.privateFieldsExcluded = true;
  if (process.argv.includes('--approve-owner-message')) {
    const expected = "Wow I love villow and what you're doing here, keep it up!";
    const matches = data.messages.filter(row => row.name === 'Steve' && row.message === expected);
    assert.equal(matches.length, 1, 'The owner’s exact donation message must match uniquely');
    const row = matches[0];assert.equal(row.suggestion.changed, false);
    if (row.status === 'needs_review') {
      const saved = await call('decision', { id: row.id, version: row.version, status: 'approved' });assert.equal(saved.status, 200);
      report.ownerMessageApproved = true;
    } else assert.equal(row.status, 'approved');
    const feed = await (await fetch(backend + '/v1/projects/villow/supporters')).json();
    assert(feed.supporters.some(item => item.displayName === 'Steve' && item.message === expected));report.ownerMessagePublic = true;
  }
} finally {
  assert.equal((await call('logout', {})).status, 200);
  assert.equal((await call('session')).status, 401);report.signOutRevokesSession = true;
}
writeFileSync(new URL('../../artifacts/live-moderation-verification.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
