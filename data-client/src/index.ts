import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './types';
import { requireDesignerAuth } from './auth';
import { getToken, saveInstall, consumeState, deleteInstall } from './db';
import {
	ensureScriptRegistered,
	applyScript,
	getAppliedScripts,
	publishSite,
	WebflowError,
	TokenRevokedError,
	removeScriptEverywhere,
} from './webflow';

interface TokenResponse {
	access_token: string;
	token_type: string;
}

interface SitesResponse {
	sites: Array<{ id: string; displayName: string }>;
}

const SCOPES = [
	'sites:read',
	'sites:write',
	'pages:read',
	'pages:write',
	'authorized_user:read',
	'custom_code:read',
	'custom_code:write',
].join(' ');

const WELL_WATERFALL = {
	displayName: 'Well Waterfall',
	version: '1.3.1',
	// Exact file, not the bare package URL: jsDelivr generates that response dynamically, so SRI can't be pinned to it.
	hostedLocation: 'https://cdn.jsdelivr.net/npm/well-waterfall@1.3.1/dist/well-waterfall.umd.js',
	// SHA-256 of dist/well-waterfall.umd.js in the published well-waterfall@1.3.1 tarball.
	integrityHash: 'sha256-5Y92BFkrm06vQ+A7OpB00tNuyaKVHNko3KAHqXIAj2I=',
	location: 'footer' as const,
};

const app = new Hono<AppEnv>();

app.use(
	'/sites/*',
	cors({
		origin: ['http://localhost:1337', 'https://6a5e8b1540168e9c517f1e0b.webflow-ext.com'],
		allowHeaders: ['Content-Type', 'X-Webflow-Id-Token'],
		allowMethods: ['GET', 'POST', 'OPTIONS'],
	}),
);

// All /sites/:siteId/* routes require Designer auth
app.use('/sites/:siteId/*', requireDesignerAuth);

// Status endpoint - protected by requireDesignerAuth middleware
app.get('/sites/:siteId/status', async (c) => {
	const siteId = c.req.param('siteId');
	const token = c.get('accessToken'); // Retrieved from middleware after auth

	if (!token) {
		return c.json({ authorized: false, installed: false });
	}

	try {
		// Check if Waterfall is installed by fetching applied scripts
		const scripts = await getAppliedScripts(token, { type: 'site', id: siteId });
		const installed = scripts.some((s) => s.id.includes('waterfall'));

		return c.json({ authorized: true, installed });
	} catch (err) {
		// If token was revoked, stop using it and report the site as unauthorized
		if (err instanceof TokenRevokedError) {
			console.log(`Token revoked for site ${siteId} during status check, cleaning up`);
			await deleteInstall(c.env, siteId);
			return c.json({ authorized: false, installed: false });
		}

		console.error('Status check error:', err);
		return c.json({ authorized: true, installed: false });
	}
});

app.post('/sites/:siteId/install-waterfall', async (c) => {
	const siteId = c.req.param('siteId');
	const token = c.get('accessToken'); // Retrieved from middleware after auth

	try {
		const script = await ensureScriptRegistered(token, siteId, WELL_WATERFALL);
		await applyScript(
			token,
			{ type: 'site', id: siteId },
			{
				id: script.id,
				version: script.version,
				location: WELL_WATERFALL.location,
			},
		);

		return c.json({
			ok: true,
			scriptId: script.id,
			needsPublish: true,
			message: 'Waterfall script installed successfully. Please publish your site to apply changes.',
		});
	} catch (err) {
		// If token was revoked, clean up and return 401
		if (err instanceof TokenRevokedError) {
			console.log(`Token revoked for site ${siteId} during install, cleaning up`);
			await deleteInstall(c.env, siteId);
			return c.json({ error: 'Authorization has been revoked. Please re-authorize.' }, 401);
		}

		if (err instanceof WebflowError) {
			console.error(err.message);
			return c.json({ error: 'Webflow API error', status: err.status }, 502);
		}
		throw err;
	}
});

app.post('/sites/:siteId/publish', async (c) => {
	const siteId = c.req.param('siteId');
	const token = c.get('accessToken'); // Retrieved from middleware after auth

	try {
		await publishSite(token, siteId);
		return c.json({ ok: true });
	} catch (err) {
		// If token was revoked, clean up and return 401
		if (err instanceof TokenRevokedError) {
			console.log(`Token revoked for site ${siteId} during publish, cleaning up`);
			await deleteInstall(c.env, siteId);
			return c.json({ error: 'Authorization has been revoked' }, 401);
		}
		throw err;
	}
});

app.post('/sites/:siteId/uninstall', async (c) => {
	const siteId = c.req.param('siteId');
	const token = c.get('accessToken'); // Retrieved from middleware after auth

	try {
		// Remove Waterfall scripts from site and all pages
		const scriptsRemoved = await removeScriptEverywhere(token, siteId, 'waterfall');

		// Delete the stored OAuth token
		await deleteInstall(c.env, siteId);

		return c.json({
			ok: true,
			scriptsRemoved,
			message: scriptsRemoved > 0 ? 'Waterfall uninstalled. Please publish your site to remove scripts from the live site.' : 'Waterfall was not installed on this site.',
		});
	} catch (err) {
		// If token was revoked (401), just clean up the database
		if (err instanceof TokenRevokedError) {
			console.log(`Token already revoked for site ${siteId}, cleaning up database`);
			await deleteInstall(c.env, siteId);
			return c.json({
				ok: true,
				scriptsRemoved: 0,
				message: 'Authorization was already revoked. Database cleaned up.',
			});
		}

		if (err instanceof WebflowError) {
			console.error('Uninstall error:', err.message);
			return c.json({ error: 'Failed to uninstall', details: err.message }, 502);
		}

		throw err;
	}
});

app.get('/auth', async (c) => {
	const state = crypto.randomUUID();
	const redirectUri = new URL('/oauth/callback', c.req.url).toString();

	await c.env.DB.prepare('INSERT INTO oauth_states (state, created_at) VALUES (?, ?)').bind(state, Date.now()).run();

	const url = new URL('https://webflow.com/oauth/authorize');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', c.env.WEBFLOW_CLIENT_ID);
	url.searchParams.set('redirect_uri', redirectUri);
	url.searchParams.set('scope', SCOPES);
	url.searchParams.set('state', state);

	return c.redirect(url.toString());
});

/** The page shown in the authorization window. It closes itself so the App can pick up the result. */
const authPage = (title: string, message: string) => `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>${title} · Wellspring</title>
		<style>
			body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1e1e1e; color: #f5f5f5; display: grid; place-items: center; min-height: 100vh; margin: 0; }
			main { max-width: 420px; padding: 24px; text-align: center; }
			h1 { font-size: 18px; margin: 0 0 8px; }
			p { font-size: 14px; line-height: 1.5; color: #bdbdbd; margin: 0; }
		</style>
	</head>
	<body>
		<main>
			<h1>${title}</h1>
			<p>${message}</p>
		</main>
		<script>
			setTimeout(() => window.close(), 3000);
		</script>
	</body>
</html>`;

app.get('/oauth/callback', async (c) => {
	const code = c.req.query('code');
	const state = c.req.query('state');

	// The user denied access (or Webflow reported another error): nothing to exchange
	if (c.req.query('error')) {
		if (state) await consumeState(c.env, state);
		return c.html(
			authPage(
				'Authorization cancelled',
				'Wellspring was not connected to your site. You can close this window and click Install in the Wellspring App to try again.',
			),
		);
	}

	if (!code || !state) {
		return c.html(authPage('Authorization incomplete', 'Close this window and start again from the Wellspring App.'), 400);
	}
	if (!(await consumeState(c.env, state))) {
		return c.html(
			authPage('Authorization expired', 'This authorization link has expired or was already used. Close this window and start again from the Wellspring App.'),
			400,
		);
	}

	const redirectUri = new URL('/oauth/callback', c.req.url).toString();

	const tokenRes = await fetch('https://api.webflow.com/oauth/access_token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: c.env.WEBFLOW_CLIENT_ID,
			client_secret: c.env.WEBFLOW_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri,
		}),
	});

	if (!tokenRes.ok) {
		console.error('Token exchange failed', tokenRes.status, await tokenRes.text());
		return c.html(authPage('Authorization failed', "Webflow couldn't complete the authorization. Close this window and try again."), 502);
	}

	const { access_token } = await tokenRes.json<TokenResponse>();

	const sitesRes = await fetch('https://api.webflow.com/v2/sites', {
		headers: { Authorization: `Bearer ${access_token}`, accept: 'application/json' },
	});
	if (!sitesRes.ok) {
		console.error('Listing authorized sites failed', sitesRes.status, await sitesRes.text());
		return c.html(authPage('Authorization failed', "Webflow couldn't complete the authorization. Close this window and try again."), 502);
	}
	const { sites } = await sitesRes.json<SitesResponse>();

	for (const site of sites) {
		await saveInstall(c.env, { siteId: site.id, accessToken: access_token, scopes: SCOPES });
	}

	return c.html(
		authPage('Wellspring connected', `Connected to ${sites.length} site(s). This window will close automatically.`),
	);
});

app.onError((err, c) => {
	console.error('Unhandled error:', err instanceof Error ? err.stack : err);
	return c.text(`Error: ${err instanceof Error ? err.message : String(err)}`, 500);
});

export default app;
