const API = 'https://api.webflow.com/v2';

export class WebflowError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = 'WebflowError';
	}
}

export class TokenRevokedError extends Error {
	constructor() {
		super('OAuth token has been revoked');
		this.name = 'TokenRevokedError';
	}
}

async function wf<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	});

	if (!res.ok) {
		// 401 on a previously valid token means it's been revoked
		if (res.status === 401) {
			throw new TokenRevokedError();
		}
		throw new WebflowError(res.status, `${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`);
	}
	return res.json() as Promise<T>;
}

/**
 * Checks whether an access token is still valid. Only a 401 counts as revoked;
 * any other failure is treated as transient so we never drop a working install.
 */
export async function isTokenRevoked(token: string): Promise<boolean> {
	const res = await fetch(`${API}/token/introspect`, {
		headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
	});
	return res.status === 401;
}

export type ScriptLocation = 'header' | 'footer';

export interface RegisteredScript {
	id: string;
	displayName: string;
	version: string;
	hostedLocation?: string;
	integrityHash?: string;
	canCopy?: boolean;
}

export interface AppliedScript {
	id: string;
	location: ScriptLocation;
	version: string;
	attributes?: Record<string, string>;
}

export async function listRegisteredScripts(token: string, siteId: string): Promise<RegisteredScript[]> {
	const { registeredScripts } = await wf<{ registeredScripts?: RegisteredScript[] }>(token, `/sites/${siteId}/registered_scripts`);
	return registeredScripts ?? [];
}

interface RegisterOptions {
	hostedLocation: string;
	integrityHash: string;
	displayName: string;
	version: string;
	canCopy?: boolean;
}

/** Registers a hosted script, or returns the existing registration if it's already there. */
export async function ensureScriptRegistered(token: string, siteId: string, opts: RegisterOptions): Promise<RegisteredScript> {
	const matches = (s: RegisteredScript) => s.displayName === opts.displayName && s.version === opts.version;

	const existing = (await listRegisteredScripts(token, siteId)).find(matches);
	if (existing) return existing;

	try {
		return await wf<RegisteredScript>(token, `/sites/${siteId}/registered_scripts/hosted`, {
			method: 'POST',
			body: JSON.stringify({
				hostedLocation: opts.hostedLocation,
				integrityHash: opts.integrityHash,
				displayName: opts.displayName,
				version: opts.version,
				canCopy: opts.canCopy ?? true,
			}),
		});
	} catch (err) {
		// Lost a race, or the derived ID collides — re-read and use what's there.
		if (err instanceof WebflowError && err.status === 409) {
			const found = (await listRegisteredScripts(token, siteId)).find(matches);
			if (found) return found;
		}
		throw err;
	}
}

type Target = { type: 'site' | 'page'; id: string };

const customCodePath = (t: Target) => (t.type === 'site' ? `/sites/${t.id}/custom_code` : `/pages/${t.id}/custom_code`);

export async function getAppliedScripts(token: string, target: Target): Promise<AppliedScript[]> {
	try {
		const body = await wf<{ scripts?: AppliedScript[] }>(token, customCodePath(target));
		return body.scripts ?? [];
	} catch (err) {
		if (err instanceof WebflowError && err.status === 404) return [];
		throw err;
	}
}

export async function applyScript(
	token: string,
	target: Target,
	script: { id: string; version: string; location: ScriptLocation; attributes?: Record<string, string> },
): Promise<void> {
	const existing = await getAppliedScripts(token, target);

	const entry = {
		id: script.id,
		location: script.location,
		version: script.version,
		...(script.attributes ? { attributes: script.attributes } : {}),
	};

	console.log('applyScript entry:', JSON.stringify(entry));
	console.log('existing before:', JSON.stringify(existing));

	const merged = [...existing.filter((s) => s.id !== script.id), entry];

	await wf(token, customCodePath(target), {
		method: 'PUT',
		body: JSON.stringify({ scripts: merged }),
	});

	const after = await getAppliedScripts(token, target);
	console.log('after PUT:', JSON.stringify(after));

	if (!after.some((s) => s.id === script.id)) {
		throw new Error(`PUT succeeded but ${script.id} is not in the applied list`);
	}
}

export async function removeScript(token: string, target: Target, scriptId: string): Promise<void> {
	const existing = await getAppliedScripts(token, target);
	if (!existing.some((s) => s.id === scriptId)) return;

	await wf(token, customCodePath(target), {
		method: 'PUT',
		body: JSON.stringify({ scripts: existing.filter((s) => s.id !== scriptId) }),
	});
}

export async function publishSite(token: string, siteId: string): Promise<void> {
	await wf(token, `/sites/${siteId}/publish`, {
		method: 'POST',
		body: JSON.stringify({ publishToWebflowSubdomain: true }),
	});
}

interface Page {
	id: string;
	siteId: string;
	title: string;
}

/** Get all pages for a site */
export async function listPages(token: string, siteId: string): Promise<Page[]> {
	const { pages } = await wf<{ pages: Page[] }>(token, `/sites/${siteId}/pages`);
	return pages;
}

/**
 * Remove a script from the site and all its pages.
 * This is the cleanup function for uninstall/revocation.
 */
export async function removeScriptEverywhere(token: string, siteId: string, scriptIdPattern: string): Promise<number> {
	let removedCount = 0;

	// Remove from site-level
	const siteScripts = await getAppliedScripts(token, { type: 'site', id: siteId });
	const siteMatches = siteScripts.filter((s) => s.id.includes(scriptIdPattern));
	if (siteMatches.length > 0) {
		console.log(`Removing ${siteMatches.length} script(s) from site ${siteId}`);
		await removeScript(token, { type: 'site', id: siteId }, siteMatches[0].id);
		removedCount += siteMatches.length;
	}

	// Remove from all pages
	const pages = await listPages(token, siteId);
	console.log(`Checking ${pages.length} pages for Waterfall scripts...`);

	for (const page of pages) {
		try {
			const pageScripts = await getAppliedScripts(token, { type: 'page', id: page.id });
			const pageMatches = pageScripts.filter((s) => s.id.includes(scriptIdPattern));

			if (pageMatches.length > 0) {
				console.log(`Removing ${pageMatches.length} script(s) from page ${page.id} (${page.title})`);
				await removeScript(token, { type: 'page', id: page.id }, pageMatches[0].id);
				removedCount += pageMatches.length;
			}
		} catch (err) {
			// A revoked token means stop calling the API entirely
			if (err instanceof TokenRevokedError) throw err;
			// Continue if a page fails (might be deleted, etc.)
			console.warn(`Failed to check/clean page ${page.id}:`, err);
		}
	}

	return removedCount;
}
