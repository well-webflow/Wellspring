const API_BASE = 'https://api.heywellspring.com';

/** A Waterfall release, as the Worker's src/releases.ts describes it. */
export interface Release {
  version: string;
  date: string;
  breaking?: boolean;
  summary: string;
  changes?: string[];
  migrationUrl?: string;
}

/**
 * How the version on the site compares to the one the app pins.
 * 'breaking' means the upgrade crosses a release that can change an existing slider.
 */
export type UpdateKind = 'none' | 'routine' | 'breaking';

export interface SiteStatus {
  authorized: boolean;
  installed: boolean;
  installedVersion: string | null;
  latestVersion: string | null;
  updateKind: UpdateKind;
  /** Releases between the installed version and the pinned one. Newest first. */
  updateReleases: Release[];
}

/**
 * Helper function to call the API with the current site's ID and the user's idToken.
 */
async function call<T>(path: string, method: 'GET' | 'POST' = 'POST'): Promise<T> {
  const [idToken, siteInfo] = await Promise.all([webflow.getIdToken(), webflow.getSiteInfo()]);

  const res = await fetch(`${API_BASE}/sites/${siteInfo.siteId}${path}`, {
    method,
    headers: { 'X-Webflow-Id-Token': idToken },
  });

  if (res.status === 401) throw new NotAuthorizedError();

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Anything that isn't a clean answer reads as "not connected, no update to offer",
 * so a failed check never produces an update prompt.
 */
const UNKNOWN_STATUS: SiteStatus = {
  authorized: false,
  installed: false,
  installedVersion: null,
  latestVersion: null,
  updateKind: 'none',
  updateReleases: [],
};

export async function checkStatus(): Promise<SiteStatus> {
  try {
    const [idToken, siteInfo] = await Promise.all([webflow.getIdToken(), webflow.getSiteInfo()]);

    const res = await fetch(`${API_BASE}/sites/${siteInfo.siteId}/status`, {
      method: 'GET',
      headers: { 'X-Webflow-Id-Token': idToken },
    });

    if (res.status === 401) {
      return UNKNOWN_STATUS;
    }

    if (res.ok) {
      // An older Worker won't send the version fields, so fill in the gaps rather
      // than letting undefined reach the UI.
      return { ...UNKNOWN_STATUS, ...((await res.json()) as Partial<SiteStatus>) };
    }

    // Any other error
    console.error('Status check failed:', res.status);
    return UNKNOWN_STATUS;
  } catch (err) {
    console.error('Status check error:', err);
    return UNKNOWN_STATUS;
  }
}

/**
 * Opens Webflow authorization in a new window.
 */
export function launchWebflowAuth() {
  window.open(`${API_BASE}/auth`, '_blank', 'noopener,noreferrer');
}

export class NotAuthorizedError extends Error {}

/** Registers the pinned Waterfall version on the site and applies it. */
export const installWaterfall = () =>
  call<{ ok: true; scriptId: string; version: string; needsPublish: boolean; message: string }>('/install-waterfall');

/** The full changelog, for the Setup tab. Served by the Worker so releases ship without an extension rebuild. */
export const fetchReleases = () => call<{ latestVersion: string; releases: Release[] }>('/releases', 'GET');

export const uninstallWaterfall = () => call<{ ok: true; scriptsRemoved: number; message: string }>('/uninstall');
