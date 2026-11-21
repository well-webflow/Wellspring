/**
 * Per-browser bookkeeping for the Waterfall update prompt.
 *
 * None of this is authoritative — the Worker's status check is. It only stops the
 * app repeating itself: showing the same toast on every remount, or nagging about a
 * publish that already happened. Every read and write is wrapped, because storage
 * throws in some embedded contexts, and the feature has to survive that by going
 * quiet rather than breaking the panel.
 */

const UPDATED_KEY = (siteId: string) => `wellspring:waterfall-updated:${siteId}`;
const TOAST_KEY = (siteId: string, version: string) => `wellspring:update-toast:${siteId}:${version}`;

interface UpdateMarker {
  version: string;
  /** Epoch ms when the update was applied. */
  at: number;
}

function read(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function write(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    // Storage unavailable or full. The prompt just repeats itself; nothing breaks.
  }
}

function remove(store: Storage | undefined, key: string): void {
  try {
    store?.removeItem(key);
  } catch {
    // As above.
  }
}

/** Records that the script was updated, so we can nag until the site is published. */
export function markUpdated(siteId: string, version: string): void {
  write(window.localStorage, UPDATED_KEY(siteId), JSON.stringify({ version, at: Date.now() } satisfies UpdateMarker));

  // The success toast for the install already said to publish, so take this session's
  // publish reminder as spent. It comes back next session if they still haven't.
  shouldAnnounce(siteId, `publish:${version}`);
}

export function clearUpdatedMarker(siteId: string): void {
  remove(window.localStorage, UPDATED_KEY(siteId));
}

function readMarker(siteId: string): UpdateMarker | null {
  const raw = read(window.localStorage, UPDATED_KEY(siteId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<UpdateMarker>;
    if (typeof parsed.version !== 'string' || typeof parsed.at !== 'number') return null;
    return { version: parsed.version, at: parsed.at };
  } catch {
    return null;
  }
}

/**
 * The version waiting to be published, or null when there's nothing pending.
 *
 * Webflow has no publish API and no "has unpublished changes" flag, so this compares
 * the moment we applied the update against the most recent publish of any domain.
 * A site that has never been published counts as pending.
 *
 * Clears its own marker once a publish overtakes it, so the reminder disappears on
 * its own rather than needing the user to dismiss it.
 */
export async function getPendingPublish(siteId: string): Promise<string | null> {
  const marker = readMarker(siteId);
  if (!marker) return null;

  try {
    const { domains } = await webflow.getSiteInfo();

    const lastPublished = domains
      .map((domain) => (domain.lastPublished ? Date.parse(domain.lastPublished) : NaN))
      .filter((time) => !Number.isNaN(time));

    const mostRecent = lastPublished.length > 0 ? Math.max(...lastPublished) : null;

    if (mostRecent !== null && mostRecent >= marker.at) {
      clearUpdatedMarker(siteId);
      return null;
    }

    return marker.version;
  } catch (err) {
    // Can't tell. Say nothing rather than nag on a guess.
    console.error('Could not read publish state:', err);
    return null;
  }
}

/**
 * True the first time this session is asked about a given target version.
 *
 * Keyed by version, so a later release prompts again, and scoped to the session so
 * reopening the Designer tomorrow re-surfaces an update the user walked past.
 */
export function shouldAnnounce(siteId: string, version: string): boolean {
  const key = TOAST_KEY(siteId, version);
  if (read(window.sessionStorage, key)) return false;
  write(window.sessionStorage, key, '1');
  return true;
}
