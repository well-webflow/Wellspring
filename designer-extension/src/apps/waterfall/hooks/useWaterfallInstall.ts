import { useEffect, useRef, useState } from 'react';
import { useWebflow } from '../../../context/webflowContext';
import { installWaterfall, launchWebflowAuth, NotAuthorizedError } from '../../../lib/api';

/**
 * Authorizes Wellspring for the current site and installs the Waterfall script.
 * Shared by every view that offers an Install button so they all behave the same.
 */
export function useWaterfallInstall() {
  const { isAuthorized, isCodeInstalled, checkAuthStatus } = useWebflow();

  const pollingIntervalRef = useRef<number | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  // True from clicking Install until authorization lands (then the install starts) or is cancelled
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  async function install() {
    setIsInstalling(true);
    try {
      await installWaterfall();
      await webflow.notify({
        type: 'Success',
        message: 'Waterfall installed. Publish your site to make the changes live.',
      });
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

  async function authorizeAndInstall() {
    setIsWaitingForAuth(true);
    setIsInstalling(true);

    launchWebflowAuth();
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
    authorizeAndInstall,
    cancelAuthorize,
  };
}
