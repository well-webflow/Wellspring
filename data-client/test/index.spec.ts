import { env, fetchMock } from 'cloudflare:test';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../src/index';
import { getToken, saveInstall } from '../src/db';

const SITE = 'site123';
const ACCESS_TOKEN = 'access-token';
const WEBFLOW = 'https://api.webflow.com';

const SCHEMA = [
	'CREATE TABLE IF NOT EXISTS installs (site_id TEXT PRIMARY KEY, access_token TEXT NOT NULL, token_iv TEXT NOT NULL, scopes TEXT, installed_at TEXT NOT NULL, updated_at TEXT NOT NULL)',
	'CREATE TABLE IF NOT EXISTS oauth_states (state TEXT PRIMARY KEY, created_at INTEGER NOT NULL)',
];

const request = (path: string, method = 'GET') =>
	app.request(path, { method, headers: { 'X-Webflow-Id-Token': 'id-token' } }, env);

const webflow = () => fetchMock.get(WEBFLOW);

const resolveOk = () =>
	webflow()
		.intercept({ path: '/beta/token/resolve', method: 'POST' })
		.reply(200, { id: 'u1', email: 'a@b.c', firstName: 'A', lastName: 'B', siteId: SITE });

beforeAll(() => {
	fetchMock.activate();
	fetchMock.disableNetConnect();
});

beforeEach(async () => {
	for (const sql of SCHEMA) await env.DB.prepare(sql).run();
	await saveInstall(env, { siteId: SITE, accessToken: ACCESS_TOKEN, scopes: 'sites:read' });
});

// Storage is isolated per test, so only the mocks need checking here.
afterEach(() => {
	fetchMock.assertNoPendingInterceptors();
});

describe('auth middleware', () => {
	it('keeps the install when only the ID token is bad', async () => {
		webflow().intercept({ path: '/beta/token/resolve', method: 'POST' }).reply(401, 'bad id token');
		webflow().intercept({ path: '/v2/token/introspect' }).reply(200, {});

		const res = await request(`/sites/${SITE}/status`);

		expect(res.status).toBe(401);
		expect(await getToken(env, SITE)).toBe(ACCESS_TOKEN);
	});

	it('drops the install when the access token is revoked', async () => {
		webflow().intercept({ path: '/beta/token/resolve', method: 'POST' }).reply(401, 'revoked');
		webflow().intercept({ path: '/v2/token/introspect' }).reply(401, 'revoked');

		const res = await request(`/sites/${SITE}/status`);

		expect(res.status).toBe(404);
		expect(await getToken(env, SITE)).toBeNull();
	});

	it('makes no Webflow calls once the install is gone', async () => {
		await env.DB.prepare('DELETE FROM installs').run();

		const res = await request(`/sites/${SITE}/status`);

		expect(res.status).toBe(404);
	});
});

describe('status', () => {
	it('treats a 401 from custom code as revocation', async () => {
		resolveOk();
		webflow().intercept({ path: `/v2/sites/${SITE}/custom_code` }).reply(401, 'revoked');

		const res = await request(`/sites/${SITE}/status`);

		expect(await res.json()).toEqual({ authorized: false, installed: false });
		expect(await getToken(env, SITE)).toBeNull();
	});
});

describe('uninstall', () => {
	it('stops calling pages after a 401', async () => {
		resolveOk();
		webflow().intercept({ path: `/v2/sites/${SITE}/custom_code` }).reply(200, { scripts: [] });
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/pages` })
			.reply(200, {
				pages: [
					{ id: 'p1', siteId: SITE, title: 'Home' },
					{ id: 'p2', siteId: SITE, title: 'About' },
				],
			});
		webflow().intercept({ path: '/v2/pages/p1/custom_code' }).reply(401, 'revoked');

		// No interceptor for p2: with net connect disabled, any call to it would fail the test.
		const res = await request(`/sites/${SITE}/uninstall`, 'POST');

		expect(await res.json()).toMatchObject({ ok: true, scriptsRemoved: 0, message: expect.stringContaining('revoked') });
		expect(await getToken(env, SITE)).toBeNull();
	});
});

describe('oauth callback', () => {
	const saveState = (state: string, createdAt = Date.now()) =>
		env.DB.prepare('INSERT INTO oauth_states (state, created_at) VALUES (?, ?)').bind(state, createdAt).run();
	const stateExists = async (state: string) =>
		!!(await env.DB.prepare('SELECT 1 FROM oauth_states WHERE state = ?').bind(state).first());
	const callback = (query: string) => app.request(`/oauth/callback?${query}`, {}, env);

	it('shows a cancelled page when the user denies access', async () => {
		await saveState('s1');

		// No interceptors: with net connect disabled, any Webflow call would fail the test
		const res = await callback('error=access_denied&state=s1');

		expect(res.status).toBe(200);
		expect(await res.text()).toContain('Authorization cancelled');
		expect(await stateExists('s1')).toBe(false);
	});

	it('rejects a callback with no code', async () => {
		const res = await callback('state=s1');

		expect(res.status).toBe(400);
		expect(await res.text()).toContain('Authorization incomplete');
	});

	it('rejects an expired state', async () => {
		await saveState('old', Date.now() - 16 * 60 * 1000);

		const res = await callback('code=abc&state=old');

		expect(res.status).toBe(400);
		expect(await res.text()).toContain('Authorization expired');
	});
});
