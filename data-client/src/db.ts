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

export async function consumeState(env: Env, state: string): Promise<boolean> {
	const row = await env.DB.prepare('SELECT created_at FROM oauth_states WHERE state = ?').bind(state).first<{ created_at: number }>();

	if (!row) return false;

	await env.DB.prepare('DELETE FROM oauth_states WHERE state = ?').bind(state).run();
	return Date.now() - row.created_at < 15 * 60 * 1000;
}

export async function deleteInstall(env: Env, siteId: string): Promise<void> {
	await env.DB.prepare('DELETE FROM installs WHERE site_id = ?').bind(siteId).run();
}
