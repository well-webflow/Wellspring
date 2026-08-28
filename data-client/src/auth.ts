import type { MiddlewareHandler } from 'hono';
import type { AppEnv, ResolvedUser } from './types';
import { getToken } from './db';

export const requireDesignerAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
	const siteId = c.req.param('siteId');
	const idToken = c.req.header('X-Webflow-Id-Token');

	if (!siteId || !idToken) return c.json({ error: 'Missing site or ID token' }, 401);

	const accessToken = await getToken(c.env, siteId);
	if (!accessToken) return c.json({ error: 'Site not authorized' }, 404);

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
		return c.json({ error: 'Invalid ID token' }, 401);
	}

	const user = (await res.json()) as ResolvedUser;

	if (user.siteId !== siteId) return c.json({ error: 'Token does not match site' }, 403);

	c.set('user', user);
	c.set('accessToken', accessToken);
	await next();
};
