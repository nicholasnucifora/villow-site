import test from 'node:test';
import assert from 'node:assert/strict';
import { database, environment, session, fakeStripe, event, project } from './helpers.mjs';
import { processEvent } from '../lib/events.mjs';
import { normaliseEmail, privateHash, requestRemoval } from '../lib/privacy.mjs';
import { beginDiscord, requestDiscordLink } from '../lib/discord.mjs';

test('email matching is normalised and keyed separately from the database', async () => {
  const env = environment(database());
  const value = `email:${normaliseEmail('  Sam@Example.com ')}`;
  const fingerprint = await privateHash(env, value);
  assert.equal(fingerprint, await privateHash(env, 'email:sam@example.com'));
  assert.match(fingerprint, /^[a-f0-9]{64}$/);
  assert.notEqual(fingerprint, await privateHash({ ...env, EMAIL_HASH_SECRET: 'another-independent-secret-at-least-32-characters' }, value));
  await assert.rejects(privateHash({ ...env, EMAIL_HASH_SECRET: '' }, value));
});

test('payment, removal and Discord verification persist no payment email or usable email token', async () => {
  const db = database();
  const env = { ...environment(db), DISCORD_ENABLED: 'true', DISCORD_CLIENT_ID: '1567089987013312694',
    DISCORD_GUILD_ID: '1523582670867791882', DISCORD_SUPPORTER_ROLE_ID: '1567088430628737136',
    DISCORD_ONGOING_ROLE_ID: '1567088983496982620', DISCORD_TEST_USER_ID: '1523582210056126494',
    DISCORD_CLIENT_SECRET: 'fixture-client-secret', DISCORD_BOT_TOKEN: 'fixture-bot-token',
    DISCORD_REDIRECT_URI: 'https://support.example/v1/discord/callback' };
  const payment = session();
  await processEvent(db, env, fakeStripe(payment), event('checkout.session.completed', payment));
  const sent = [];
  await requestRemoval(db, env, 'villow', project, 'sam@example.com', async message => sent.push(message));
  await requestDiscordLink(db, env, 'villow', project, 'sam@example.com', async message => sent.push(message));
  const linkToken = new URLSearchParams(new URL(sent[1].url).hash.slice(1)).get('discord-link');
  const start = await beginDiscord(db, env, 'villow', linkToken);
  const state = new URL(start.headers.get('Location')).searchParams.get('state');
  const cookie = start.headers.get('Set-Cookie').split(';')[0].split('=')[1];
  const tables = db.sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all();
  const rows = tables.map(({ name }) => {
    assert.match(name, /^[a-z_]+$/);
    return db.sqlite.prepare(`SELECT * FROM ${name}`).all();
  });
  const stored = JSON.stringify(rows);
  assert(!stored.includes('sam@example.com'));
  assert(!stored.includes(env.EMAIL_HASH_SECRET));
  assert(!stored.includes(env.STRIPE_SECRET_KEY));
  assert(!stored.includes(state));
  assert(!stored.includes(cookie));
  for (const message of sent) {
    assert.equal(message.to, 'sam@example.com'); // The delivery provider necessarily receives it.
    const token = [...new URLSearchParams(new URL(message.url).hash.slice(1)).values()][0];
    assert(!stored.includes(token));
  }
  assert(stored.includes(await privateHash(env, 'email:sam@example.com')));
});
