-- Additive migration: existing approvals/hides and consent remain unchanged.
-- Older pending messages stay held until the owner reviews them in the new UI.
ALTER TABLE contributions ADD COLUMN auto_publish INTEGER NOT NULL DEFAULT 0 CHECK (auto_publish IN (0, 1));
ALTER TABLE contributions ADD COLUMN review_id TEXT;
ALTER TABLE contributions ADD COLUMN review_version INTEGER NOT NULL DEFAULT 0;
UPDATE contributions SET review_id = lower(hex(randomblob(16))) WHERE review_id IS NULL;
CREATE UNIQUE INDEX contributions_review_id ON contributions(review_id);
CREATE TRIGGER contributions_default_review_id AFTER INSERT ON contributions
WHEN NEW.review_id IS NULL BEGIN
  UPDATE contributions SET review_id = lower(hex(randomblob(16))) WHERE session_id = NEW.session_id;
END;

CREATE TABLE moderation_sessions (
  token_hash TEXT PRIMARY KEY,
  credential_version TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE checkout_returns (
  token_hash TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  project TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX checkout_returns_expiry ON checkout_returns(expires_at);
