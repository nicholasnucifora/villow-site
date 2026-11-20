ALTER TABLE subscriptions ADD COLUMN current_period_end INTEGER;

-- Discord identity is private and independent of public-message consent.
-- The shared Fix the Web server recognises support across configured projects.
CREATE TABLE discord_links (
  email_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  disconnect_requested INTEGER NOT NULL DEFAULT 0,
  sync_due INTEGER NOT NULL DEFAULT 0,
  lease_until INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  last_result TEXT
);
CREATE INDEX discord_sync_due ON discord_links(sync_due, lease_until);
CREATE TABLE discord_tokens (
  token_hash TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE TABLE discord_oauth_states (
  state_hash TEXT PRIMARY KEY,
  cookie_hash TEXT NOT NULL,
  project TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
