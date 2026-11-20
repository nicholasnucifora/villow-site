-- Keep donor originals for private review and only publish owner-approved masks.
ALTER TABLE contributions ADD COLUMN censored_name TEXT;
ALTER TABLE contributions ADD COLUMN censored_message TEXT;
