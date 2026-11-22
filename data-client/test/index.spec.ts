import { env, fetchMock } from 'cloudflare:test';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app, { WELL_WATERFALL } from '../src/index';
import { describeUpdate } from '../src/releases';
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

		expect(res.status).toBe(401);
		expect(await getToken(env, SITE)).toBeNull();
	});

	it('makes no Webflow calls once the install is gone', async () => {
		await env.DB.prepare('DELETE FROM installs').run();

		const res = await request(`/sites/${SITE}/status`);

		expect(res.status).toBe(401);
	});

	it('gives the same response for every auth failure', async () => {
		const bodies = [];

		// No ID token
		bodies.push(await (await app.request(`/sites/${SITE}/status`, {}, env)).json());

		// ID token for a different site
		webflow()
			.intercept({ path: '/beta/token/resolve', method: 'POST' })
			.reply(200, { id: 'u1', email: 'a@b.c', firstName: 'A', lastName: 'B', siteId: 'other-site' });
		const mismatch = await request(`/sites/${SITE}/status`);
		expect(mismatch.status).toBe(401);
		bodies.push(await mismatch.json());

		// Site with no install
		const unknown = await request('/sites/unknown-site/status');
		expect(unknown.status).toBe(401);
		bodies.push(await unknown.json());

		expect(new Set(bodies.map((b) => JSON.stringify(b))).size).toBe(1);
	});
});

describe('status', () => {
	// Returns the status body for a site whose applied Waterfall script is at `version`.
	const statusWithVersion = async (version: string | undefined) => {
		resolveOk();
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/custom_code` })
			.reply(200, { scripts: [{ id: 'well_waterfall', location: 'footer', ...(version ? { version } : {}) }] });

		return (await request(`/sites/${SITE}/status`)).json() as Promise<Record<string, unknown>>;
	};

	it('treats a 401 from custom code as revocation', async () => {
		resolveOk();
		webflow().intercept({ path: `/v2/sites/${SITE}/custom_code` }).reply(401, 'revoked');

		const res = await request(`/sites/${SITE}/status`);

		expect(await res.json()).toMatchObject({ authorized: false, installed: false, updateKind: 'none' });
		expect(await getToken(env, SITE)).toBeNull();
	});

	it('reports no update when the site is on the pinned version', async () => {
		expect(await statusWithVersion(WELL_WATERFALL.version)).toMatchObject({
			installed: true,
			installedVersion: WELL_WATERFALL.version,
			updateKind: 'none',
			updateReleases: [],
		});
	});

	it('reports the releases a site has yet to cross', async () => {
		const body = await statusWithVersion('1.5.1');

		// Everything above 1.5.1, and nothing at or below it. The kind follows the pin:
		// 1.6.0 is breaking, so a site on 1.5.1 is told so.
		expect(body).toMatchObject({ installed: true, installedVersion: '1.5.1', updateKind: 'breaking' });
		expect((body.updateReleases as Array<{ version: string }>).map((r) => r.version)).toEqual([
			'1.6.0',
			'1.5.4',
			'1.5.3',
			'1.5.2',
		]);
	});

	it('reports a routine update when the hop crosses no breaking release', () => {
		// Against an explicit target rather than the pin, so the routine path stays
		// covered even while the pinned version happens to be a breaking one.
		const update = describeUpdate('1.5.1', '1.5.4');

		expect(update.kind).toBe('routine');
		expect(update.releases.map((r) => r.version)).toEqual(['1.5.4', '1.5.3', '1.5.2']);
	});

	it('reports a breaking update when the hop crosses 1.5.0', async () => {
		const body = await statusWithVersion('1.4.2');

		expect(body).toMatchObject({ updateKind: 'breaking' });
		expect((body.updateReleases as Array<{ version: string; breaking?: boolean }>).some((r) => r.breaking)).toBe(true);
	});

	it('does not nag when the version cannot be read', async () => {
		expect(await statusWithVersion(undefined)).toMatchObject({ installed: true, updateKind: 'none' });
	});

	it('does not offer a downgrade when the site is ahead of the pin', async () => {
		expect(await statusWithVersion('9.9.9')).toMatchObject({ updateKind: 'none', updateReleases: [] });
	});
});

describe('releases', () => {
	it('serves the changelog for the Setup tab', async () => {
		resolveOk();

		const body = (await (await request(`/sites/${SITE}/releases`)).json()) as {
			latestVersion: string;
			releases: Array<{ version: string; summary: string }>;
		};

		expect(body.latestVersion).toBe(WELL_WATERFALL.version);
		expect(body.releases[0].version).toBe(WELL_WATERFALL.version);
		expect(body.releases.every((r) => r.summary.length > 0)).toBe(true);
	});
});

describe('install', () => {
	it('recovers when the version turns out to be registered already', async () => {
		const registered = { id: 'well_waterfall', displayName: WELL_WATERFALL.displayName, version: WELL_WATERFALL.version };
		resolveOk();

		// Nothing registered on the first read...
		webflow().intercept({ path: `/v2/sites/${SITE}/registered_scripts` }).reply(200, { registeredScripts: [] });
		// ...but Webflow rejects the registration, and doesn't document a status for "already there"
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/registered_scripts/hosted`, method: 'POST' })
			.reply(400, 'already registered');
		// Re-reading finds it, so the install carries on
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/registered_scripts` })
			.reply(200, { registeredScripts: [registered] });

		webflow().intercept({ path: `/v2/sites/${SITE}/custom_code` }).reply(200, { scripts: [] });
		webflow().intercept({ path: `/v2/sites/${SITE}/custom_code`, method: 'PUT' }).reply(200, {});
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/custom_code` })
			.reply(200, { scripts: [{ id: 'well_waterfall', location: 'footer', version: WELL_WATERFALL.version }] });

		const res = await request(`/sites/${SITE}/install-waterfall`, 'POST');

		expect(await res.json()).toMatchObject({ ok: true, scriptId: 'well_waterfall' });
	});

	it('still fails when registration fails and nothing is there', async () => {
		resolveOk();
		webflow().intercept({ path: `/v2/sites/${SITE}/registered_scripts` }).reply(200, { registeredScripts: [] });
		webflow()
			.intercept({ path: `/v2/sites/${SITE}/registered_scripts/hosted`, method: 'POST' })
			.reply(400, 'bad integrity hash');
		webflow().intercept({ path: `/v2/sites/${SITE}/registered_scripts` }).reply(200, { registeredScripts: [] });

		const res = await request(`/sites/${SITE}/install-waterfall`, 'POST');

		expect(res.status).toBe(502);
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

describe('cors', () => {
	const preflight = (origin: string) =>
		app.request(
			`/sites/${SITE}/status`,
			{ method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'GET' } },
			env,
		);

	it('allows the production extension origin', async () => {
		const res = await preflight('https://6a5e8b1540168e9c517f1e0b.webflow-ext.com');
		expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://6a5e8b1540168e9c517f1e0b.webflow-ext.com');
	});

	it('does not allow localhost unless CORS_DEV_ORIGINS lists it', async () => {
		const res = await preflight('http://localhost:1337');
		expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
	});
});
