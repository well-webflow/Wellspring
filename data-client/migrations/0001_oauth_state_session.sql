-- Binds each in-flight OAuth state to the browser session that started it.
--
-- Existing rows predate the column and can never match a real cookie value, so they are
-- cleared rather than left to fail closed one by one. They are only in-flight
-- authorizations with a 15-minute lifetime; anyone mid-install simply clicks Install again.
ALTER TABLE oauth_states ADD COLUMN session_id TEXT NOT NULL DEFAULT '';
DELETE FROM oauth_states;
