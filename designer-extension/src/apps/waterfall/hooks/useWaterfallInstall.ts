import { useEffect, useRef, useState } from 'react';
import { useWebflow } from '../../../context/webflowContext';
import { installWaterfall, launchWebflowAuth, NotAuthorizedError } from '../../../lib/api';
import { markUpdated } from '../../../lib/updateState';

/**
 * Authorizes Wellspring for the current site and installs the Waterfall script.
 * Shared by every view that offers an Install button so they all behave the same.
 */
export function useWaterfallInstall() {
  const { isAuthorized, isCodeInstalled, installedVersion, latestVersion, updateKind, checkAuthStatus } = useWebflow();

  const pollingIntervalRef = useRef<number | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  /**
   * Applies the pinned Waterfall version. Shared by the first install and by updates,
   * which hit the same endpoint: every version of the script shares one id, so applying
   * a new one replaces whatever was there.
   */
  async function applyWaterfall(describeSuccess: (version: string) => string) {
    setIsInstalling(true);
    try {
      const result = await installWaterfall();

      try {
        const { siteId } = await webflow.getSiteInfo();
        markUpdated(siteId, result.version);
      } catch (err) {
        console.error('Could not record the pending publish:', err);
      }

      await webflow.notify({ type: 'Success', message: describeSuccess(result.version) });
      await checkAuthStatus();
    } catch (err) {
      if (err instanceof NotAuthorizedError) {
        await webflow.notify({
          type: 'Error',
          message: 'Wellspring no longer has access to this site. Click Install to authorize again.',
        });
        await checkAuthStatus();
        return;
      }
      await webflow.notify({ type: 'Error', message: (err as Error).message });
    } finally {
      setIsInstalling(false);
    }
  }

  async function install() {
    await applyWaterfall(() => 'Waterfall installed. Publish your site to make the changes live.');
  }

  /**
   * Moves the site to the pinned version.
   *
   * A breaking update asks first, naming the consequence: Waterfall ignores attribute
   * names it doesn't recognise, so an existing slider doesn't error — it quietly falls
   * back to defaults. That is worth a confirmation the user has to read.
   */
  async function update() {
    if (updateKind === 'breaking') {
      const confirmed = confirm(
        `Update Waterfall from ${installedVersion} to ${latestVersion}?\n\n` +
          'This update contains breaking changes. Attribute names changed, and Waterfall ignores ' +
          'names it no longer recognises, so sliders built on the older version will fall back to ' +
          'their default settings until their attributes are updated.\n\n' +
          'The changelog in Setup lists what changed. Publish your site afterwards to make the update live.'
      );

      if (!confirmed) return;
    }

    await applyWaterfall((version) => `Waterfall updated to ${version}. Publish your site to make the update live.`);
  }

  function stopPolling() {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }

  // Stops waiting for authorization, e.g. when the user closed or denied the authorization window
  function cancelAuthorize() {
    stopPolling();
    setIsInstalling(false);
    setIsWaitingForAuth(false);
  }

  /**
   * Opens the authorization window, then waits for it to complete.
   */
  async function authorizeAndInstall() {
    launchWebflowAuth();

    setIsWaitingForAuth(true);
    setIsInstalling(true);

    await webflow.notify({ type: 'Info', message: 'Please complete authorization in the opened window.' });

    // Clear any existing polling
    stopPolling();

    // Start polling for authorization status
    pollingIntervalRef.current = window.setInterval(checkAuthStatus, 2000);

    // Stop polling after 2 minutes. Authorizing clears this timeout, so reaching it means authorization never completed
    pollingTimeoutRef.current = window.setTimeout(async () => {
      stopPolling();
      setIsInstalling(false);
      setIsWaitingForAuth(false);
      await webflow.notify({
        type: 'Error',
        message: 'Authorization timed out. Please try again and complete the authorization in the opened window.',
      });
    }, 120000);
  }

  // Stop polling when authorized, and install if Waterfall isn't on the site yet
  useEffect(() => {
    if (isAuthorized && pollingIntervalRef.current) {
      stopPolling();

      if (isWaitingForAuth && !isCodeInstalled) {
        setIsWaitingForAuth(false);
        install();
      } else if (isWaitingForAuth) {
        // Already installed, just clear the flag
        setIsWaitingForAuth(false);
        setIsInstalling(false);
      }
    }
  }, [isAuthorized, isWaitingForAuth, isCodeInstalled]);

  // Stop polling on unmount only. Stopping in the effect above would clear the interval ref before
  // its next run could see the authorization land, so the install would never start.
  useEffect(() => stopPolling, []);

  return {
    isAuthorized,
    isCodeInstalled,
    checkAuthStatus,
    isInstalling,
    isWaitingForAuth,
    install,
    update,
    authorizeAndInstall,
    cancelAuthorize,
  };
}
