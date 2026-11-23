CREATE TABLE IF NOT EXISTS installs (
  site_id       TEXT PRIMARY KEY,
  access_token  TEXT NOT NULL,
  token_iv      TEXT NOT NULL,
  scopes        TEXT,
  installed_at  TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

-- An in-flight OAuth authorization. `session_id` is the value of the HttpOnly cookie set on
-- /auth, so the callback can prove the state it receives belongs to the browser that started
-- the flow. A state is single-use and expires; see consumeState in src/db.ts.
CREATE TABLE IF NOT EXISTS oauth_states (
  state       TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);
