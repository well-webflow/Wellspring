import { useEffect, useState } from 'react';
import { useWebflow } from '../../../context/webflowContext';
import { getPendingPublish, shouldAnnounce } from '../../../lib/updateState';

/**
 * Raises a native Designer notification when the site's Waterfall script is behind,
 * or when an applied update still hasn't been published.
 *
 * Mounted once in the Waterfall shell rather than in Setup, so a user who never opens
 * the Setup tab still hears about it. It announces at most once per session per
 * version — see shouldAnnounce — so navigating between tabs doesn't re-toast.
 */
export function useUpdateAnnouncement() {
  const { isCodeInstalled, installedVersion, latestVersion, updateKind } = useWebflow();

  useEffect(() => {
    // null means the status check hasn't answered yet. Saying nothing beats guessing.
    if (updateKind === null || !isCodeInstalled) return;

    let cancelled = false;

    (async () => {
      try {
        const { siteId } = await webflow.getSiteInfo();
        if (cancelled) return;

        if (updateKind !== 'none' && latestVersion) {
          if (!shouldAnnounce(siteId, latestVersion)) return;

          const breaking = updateKind === 'breaking';
          await webflow.notify({
            type: breaking ? 'Error' : 'Warning',
            message: breaking
              ? `Waterfall ${latestVersion} is available and contains breaking changes. Open Setup to review what changed before updating.`
              : `Waterfall ${latestVersion} is available — this site is on ${installedVersion}. Open Setup to update.`,
          });
          return;
        }

        // Up to date. The remaining question is whether the update ever went live.
        const pending = await getPendingPublish(siteId);
        if (cancelled || !pending) return;
        if (!shouldAnnounce(siteId, `publish:${pending}`)) return;

        await webflow.notify({
          type: 'Warning',
          message: `Waterfall ${pending} is installed but your site hasn't been published since. Publish to make it live.`,
        });
      } catch (err) {
        // A notification isn't worth breaking the panel over.
        console.error('Could not check for Waterfall updates:', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [updateKind, isCodeInstalled, installedVersion, latestVersion]);
}

/**
 * The version that is applied but not yet published, or null when nothing is pending.
 *
 * Re-runs whenever the status changes, so applying an update immediately surfaces the
 * reminder, and publishing clears it on the next status check.
 */
export function usePendingPublish(): string | null {
  const { isCodeInstalled, installedVersion, updateKind } = useWebflow();
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (updateKind === null || !isCodeInstalled) {
      setPending(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { siteId } = await webflow.getSiteInfo();
        const version = await getPendingPublish(siteId);
        if (!cancelled) setPending(version);
      } catch {
        if (!cancelled) setPending(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [updateKind, isCodeInstalled, installedVersion]);

  return pending;
}
