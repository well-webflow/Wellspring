import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { AppEnv } from './types';
import { requireDesignerAuth } from './auth';
import { getToken, saveInstall, consumeState, deleteInstall } from './db';
import { ensureScriptRegistered, applyScript, publishSite, WebflowError, TokenRevokedError, removeScriptEverywhere } from './webflow';

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
	hostedLocation: 'https://cdn.jsdelivr.net/npm/well-waterfall@1.3.1',
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
		const customCodeRes = await fetch(`https://api.webflow.com/v2/sites/${siteId}/custom_code`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				accept: 'application/json',
			},
		});

		let installed = false;
		if (customCodeRes.ok) {
			const { scripts } = await customCodeRes.json<{ scripts?: Array<{ id: string }> }>();
			installed = scripts?.some((s) => s.id.includes('waterfall')) ?? false;
		}

		return c.json({ authorized: true, installed });
	} catch (err) {
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

app.get('/oauth/callback', async (c) => {
	const code = c.req.query('code');
	const state = c.req.query('state');

	if (!code || !state) return c.text('Missing code or state', 400);
	if (!(await consumeState(c.env, state))) return c.text('Invalid or expired state', 400);

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
		return c.text('Authorization failed', 502);
	}

	const { access_token } = await tokenRes.json<TokenResponse>();

	const sitesRes = await fetch('https://api.webflow.com/v2/sites', {
		headers: { Authorization: `Bearer ${access_token}`, accept: 'application/json' },
	});
	const { sites } = await sitesRes.json<SitesResponse>();

	for (const site of sites) {
		await saveInstall(c.env, { siteId: site.id, accessToken: access_token, scopes: SCOPES });
	}

	return c.html(`
		<html>
			<head><title>Authorization Complete</title></head>
			<body>
				<p>Wellspring connected to ${sites.length} site(s). This window will close automatically.</p>
				<script>
					setTimeout(() => window.close(), 2000);
				</script>
			</body>
		</html>
	`);
});

app.onError((err, c) => {
	console.error('Unhandled error:', err instanceof Error ? err.stack : err);
	return c.text(`Error: ${err instanceof Error ? err.message : String(err)}`, 500);
});

export default app;
