-- Only the Worker can access D1. No database credentials reach browsers.
CREATE TABLE contributions (
  session_id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('once', 'monthly')),
  subscription_id TEXT UNIQUE,
  email_hash TEXT,
  display_name TEXT,
  message TEXT,
  consent INTEGER NOT NULL DEFAULT 0 CHECK (consent IN (0, 1)),
  consent_version TEXT,
  consent_at INTEGER,
  moderation TEXT NOT NULL DEFAULT 'pending' CHECK (moderation IN ('pending', 'approved', 'hidden')),
  removed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX contributions_email ON contributions(project, email_hash);
CREATE INDEX contributions_public ON contributions(project, consent, moderation, removed_at);

-- An invoice has one payment row, including the first monthly payment.
-- Renewals update recency without repeating a supporter's message in the feed.
CREATE TABLE payments (
  payment_id TEXT PRIMARY KEY,
  session_id TEXT,
  subscription_id TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL,
  paid_at INTEGER NOT NULL
);
CREATE INDEX payments_session ON payments(session_id);
CREATE INDEX payments_subscription ON payments(subscription_id);

CREATE TABLE subscriptions (
  subscription_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  cancel_at_period_end INTEGER NOT NULL,
  event_created INTEGER NOT NULL
);
CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  processed_at INTEGER NOT NULL
);
CREATE TABLE suppressions (
  project TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  removed_at INTEGER NOT NULL,
  PRIMARY KEY(project, email_hash)
);
CREATE TABLE removal_tokens (
  token_hash TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE TABLE rate_limits (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
