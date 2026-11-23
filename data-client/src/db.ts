import { encrypt, decrypt } from './crypto';

interface SaveInstallInput {
	siteId: string;
	accessToken: string;
	scopes: string;
}

export async function saveInstall(env: Env, input: SaveInstallInput): Promise<void> {
	const { ciphertext, iv } = await encrypt(input.accessToken, env.TOKEN_ENCRYPTION_KEY);
	const now = new Date().toISOString();

	await env.DB.prepare(
		`
    INSERT INTO installs (site_id, access_token, token_iv, scopes, installed_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(site_id) DO UPDATE SET
      access_token = excluded.access_token,
      token_iv     = excluded.token_iv,
      scopes       = excluded.scopes,
      updated_at   = excluded.updated_at
  `,
	)
		.bind(input.siteId, ciphertext, iv, input.scopes, now, now)
		.run();
}

export async function getToken(env: Env, siteId: string): Promise<string | null> {
	const row = await env.DB.prepare('SELECT access_token, token_iv FROM installs WHERE site_id = ?')
		.bind(siteId)
		.first<{ access_token: string; token_iv: string }>();

	if (!row) return null;
	return decrypt(row.access_token, row.token_iv, env.TOKEN_ENCRYPTION_KEY);
}

/** How long an in-flight authorization stays valid. */
export const OAUTH_STATE_TTL_MS = 15 * 60 * 1000;

/**
 * Records an in-flight authorization, bound to the browser session that started it.
 * `sessionId` is the value of the HttpOnly cookie /auth sets on that browser.
 */
export async function saveState(env: Env, state: string, sessionId: string): Promise<void> {
	await env.DB.prepare('INSERT INTO oauth_states (state, session_id, created_at) VALUES (?, ?, ?)')
		.bind(state, sessionId, Date.now())
		.run();
}

/**
 * Verifies and consumes a state in one step. Returns false unless the state exists, was
 * issued to this same browser session, and is still inside its TTL.
 *
 * A state that doesn't match the calling session is left in place rather than deleted:
 * deleting it would let anyone cancel someone else's pending authorization just by
 * replaying the state value.
 */
export async function consumeState(env: Env, state: string, sessionId: string): Promise<boolean> {
	if (!sessionId) return false;

	const row = await env.DB.prepare('SELECT created_at FROM oauth_states WHERE state = ? AND session_id = ?')
		.bind(state, sessionId)
		.first<{ created_at: number }>();

	if (!row) return false;

	await env.DB.prepare('DELETE FROM oauth_states WHERE state = ?').bind(state).run();
	return Date.now() - row.created_at < OAUTH_STATE_TTL_MS;
}

export async function deleteInstall(env: Env, siteId: string): Promise<void> {
	await env.DB.prepare('DELETE FROM installs WHERE site_id = ?').bind(siteId).run();
}
