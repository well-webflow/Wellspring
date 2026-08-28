CREATE TABLE IF NOT EXISTS installs (
  site_id       TEXT PRIMARY KEY,
  access_token  TEXT NOT NULL,
  token_iv      TEXT NOT NULL,
  scopes        TEXT,
  installed_at  TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_states (
  state       TEXT PRIMARY KEY,
  created_at  INTEGER NOT NULL
);