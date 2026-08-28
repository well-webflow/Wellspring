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
		throw new WebflowError(res.status, `${init.method ?? 'GET'} ${path} → ${res.status}: ${await res.text()}`);
	}
	return res.json() as Promise<T>;
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

/** Fetches the script and computes its SRI hash. */
export async function computeIntegrityHash(url: string): Promise<string> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Could not fetch script at ${url}: ${res.status}`);

	const digest = await crypto.subtle.digest('SHA-256', await res.arrayBuffer());
	return `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;
}

export async function listRegisteredScripts(token: string, siteId: string): Promise<RegisteredScript[]> {
	const { registeredScripts } = await wf<{ registeredScripts?: RegisteredScript[] }>(token, `/sites/${siteId}/registered_scripts`);
	return registeredScripts ?? [];
}

interface RegisterOptions {
	hostedLocation: string;
	displayName: string;
	version: string;
	canCopy?: boolean;
}

/** Registers a hosted script, or returns the existing registration if it's already there. */
export async function ensureScriptRegistered(token: string, siteId: string, opts: RegisterOptions): Promise<RegisteredScript> {
	const matches = (s: RegisteredScript) => s.displayName === opts.displayName && s.version === opts.version;

	const existing = (await listRegisteredScripts(token, siteId)).find(matches);
	if (existing) return existing;

	const integrityHash = await computeIntegrityHash(opts.hostedLocation);

	try {
		return await wf<RegisteredScript>(token, `/sites/${siteId}/registered_scripts/hosted`, {
			method: 'POST',
			body: JSON.stringify({
				hostedLocation: opts.hostedLocation,
				integrityHash,
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

async function getAppliedScripts(token: string, target: Target): Promise<AppliedScript[]> {
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
