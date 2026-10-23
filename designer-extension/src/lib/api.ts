const API_BASE = 'https://wellspring.sirkevinicus.workers.dev';

async function call<T>(path: string): Promise<T> {
  const [idToken, siteInfo] = await Promise.all([webflow.getIdToken(), webflow.getSiteInfo()]);

  const res = await fetch(`${API_BASE}/sites/${siteInfo.siteId}${path}`, {
    method: 'POST',
    headers: { 'X-Webflow-Id-Token': idToken },
  });

  if (res.status === 404) throw new NotAuthorizedError();

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

    if (res.status === 404 || res.status === 401) {
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

export async function launchWebflowAuth() {
  window.open(`${API_BASE}/auth`, '_blank');
}

export class NotAuthorizedError extends Error {}

export const installWaterfall = () => call<{ ok: true; scriptId: string; needsPublish: boolean }>('/install-waterfall');

export const publishSite = () => call<{ ok: true }>('/publish');

export const uninstallWaterfall = () => call<{ ok: true; scriptsRemoved: number; message: string }>('/uninstall');
