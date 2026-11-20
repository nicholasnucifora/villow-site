-- Bind OAuth completion to the trusted interface that started the connection.
-- NULL preserves callbacks already in flight from the primary website.
ALTER TABLE discord_oauth_states ADD COLUMN return_origin TEXT;
