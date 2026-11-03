const API_BASE = 'https://api.wellspring-dev.com';

async function call<T>(path: string): Promise<T> {
  const [idToken, siteInfo] = await Promise.all([webflow.getIdToken(), webflow.getSiteInfo()]);

  const res = await fetch(`${API_BASE}/sites/${siteInfo.siteId}${path}`, {
    method: 'POST',
    headers: { 'X-Webflow-Id-Token': idToken },
  });

  if (res.status === 401) throw new NotAuthorizedError();

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function checkStatus(): Promise<{ authorized: boolean; installed: boolean }> {
  try {
    const [idToken, siteInfo] = await Promise.all([webflow.getIdToken(), webflow.getSiteInfo()]);

    const res = await fetch(`${API_BASE}/sites/${siteInfo.siteId}/status`, {
      method: 'GET',
      headers: { 'X-Webflow-Id-Token': idToken },
    });

    if (res.status === 401) {
      return { authorized: false, installed: false };
    }

    if (res.ok) {
      return await res.json();
    }

    // Any other error
    console.error('Status check failed:', res.status);
    return { authorized: false, installed: false };
  } catch (err) {
    console.error('Status check error:', err);
    return { authorized: false, installed: false };
  }
}

/**
 * Opens Webflow authorization in a new window. Poll checkStatus() to see when it completes: the window's
 * `closed` flag can't be trusted from the Designer, where it reads true while the window is still open.
 */
export function launchWebflowAuth() {
  window.open(`${API_BASE}/auth`, '_blank');
}

export class NotAuthorizedError extends Error {}

export const installWaterfall = () => call<{ ok: true; scriptId: string; needsPublish: boolean }>('/install-waterfall');

export const uninstallWaterfall = () => call<{ ok: true; scriptsRemoved: number; message: string }>('/uninstall');
