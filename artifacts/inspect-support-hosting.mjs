import { readFileSync, writeFileSync } from 'node:fs';
const config = readFileSync('C:/Users/Nebula PC/AppData/Roaming/xdg.config/.wrangler/config/default.toml', 'utf8');
const token = config.match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
if (!token) throw new Error('Cloudflare sign-in unavailable');
async function get(path) {
  const r = await fetch('https://api.cloudflare.com/client/v4/' + path, { headers: { Authorization: `Bearer ${token}` } });
  const data = await r.json(); if (!data.success) throw new Error(JSON.stringify(data.errors)); return data.result;
}
const account = 'accounts/4dd755707a29c1386e547d5368fef8e4';
const report = { zones: [], domains: await get(account + '/workers/domains') };
for (const name of ['fixtheweb.org', 'villow.app']) {
  const zones = await get('zones?name=' + name);
  for (const zone of zones) report.zones.push({ name: zone.name, id: zone.id, status: zone.status, routes: await get(`zones/${zone.id}/workers/routes`) });
}
for (const worker of ['fixtheweb-support', 'villow-site']) {
  const settings = await get(account + `/workers/scripts/${worker}/settings`);
  report[worker] = { bindingNames: settings.bindings?.map(b => ({ name: b.name, type: b.type })), routes: settings.routes, deployments: await get(account + `/workers/scripts/${worker}/deployments`) };
}
writeFileSync(new URL('./support-hosting-before.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
