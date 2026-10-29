import type { MiddlewareHandler } from 'hono';
import type { AppEnv, ResolvedUser } from './types';
import { getToken, deleteInstall } from './db';
import { isTokenRevoked } from './webflow';

// Every auth failure gets the same response, so callers can't tell whether a site has the App
// installed, whether the ID token was bad, or whether it belongs to another site.
const notAuthorized = { error: 'Not authorized' };

export const requireDesignerAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
	const siteId = c.req.param('siteId');
	const idToken = c.req.header('X-Webflow-Id-Token');

	if (!siteId || !idToken) return c.json(notAuthorized, 401);

	const accessToken = await getToken(c.env, siteId);
	if (!accessToken) return c.json(notAuthorized, 401);

	const res = await fetch('https://api.webflow.com/beta/token/resolve', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ idToken }),
	});

	if (!res.ok) {
		console.error('Token resolve failed', res.status, await res.text());

		// A 401 here can mean a bad ID token (client-controlled) or a revoked access token.
		// Confirm against the access token alone before dropping the install, so a forged
		// ID token can't delete someone else's install.
		if (res.status === 401 && (await isTokenRevoked(accessToken))) {
			console.log(`Token revoked for site ${siteId}, removing stored install`);
			await deleteInstall(c.env, siteId);
		}

		return c.json(notAuthorized, 401);
	}

	const user = (await res.json()) as ResolvedUser;

	if (user.siteId !== siteId) {
		console.error(`ID token is for site ${user.siteId}, not ${siteId}`);
		return c.json(notAuthorized, 401);
	}

	c.set('user', user);
	c.set('accessToken', accessToken);
	await next();
};
