import { Heading, Paragraph } from '../../../components/Typography';
import waterfallIcon from '../../../assets/waterfall.png';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { useWebflow } from '../../../context/webflowContext';
import Button from '../../../components/UI/Button';
import { installWaterfall, launchWebflowAuth, NotAuthorizedError, uninstallWaterfall } from '../../../lib/api';
import { faCheck, faCircleInfo, faLock, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import HorizontalRule from '../../../components/UI/hr';

export default function SetupView() {
  const { isAuthorized, isCodeInstalled, checkAuthStatus } = useWebflow();

  const pollingIntervalRef = useRef<number | null>(null);
  const pollingTimeoutRef = useRef<number | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);
  const [autoInstallAfterAuth, setAutoInstallAfterAuth] = useState(false);

  async function handleInstall() {
    setIsInstalling(true);
    try {
      await installWaterfall();
      await webflow.notify({ type: 'Success', message: `Waterfall installed! Publish your site to apply changes.` });
      await checkAuthStatus();
    } catch (err) {
      if (err instanceof NotAuthorizedError) {
        await checkAuthStatus();
        return;
      }
      await webflow.notify({ type: 'Error', message: (err as Error).message });
    } finally {
      setIsInstalling(false);
    }
  }

  async function handleUninstall() {
    const confirmed = confirm(
      'Are you sure you want to uninstall Waterfall?\n\nThis will remove all Waterfall scripts from your site and pages. You will need to publish your site to complete the removal.'
    );

    if (!confirmed) return;

    setIsUninstalling(true);
    try {
      const result = await uninstallWaterfall();
      await webflow.notify({
        type: 'Success',
        message: `${result.message} (${result.scriptsRemoved} script(s) removed)`,
      });
      await checkAuthStatus();
    } catch (err) {
      await webflow.notify({ type: 'Error', message: (err as Error).message });
    } finally {
      setIsUninstalling(false);
    }
  }

  async function handleAuthorizeAndInstall() {
    setAutoInstallAfterAuth(true);
    setIsInstalling(true);
    await handleAuthorize();
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

  async function handleAuthorize() {
    launchWebflowAuth();
    await webflow.notify({ type: 'Info', message: 'Please complete authorization in the opened window.' });

    // Clear any existing polling
    stopPolling();

    // Start polling for authorization status
    pollingIntervalRef.current = window.setInterval(async () => {
      await checkAuthStatus();
    }, 2000);

    // Stop polling after 2 minutes with timeout notification
    pollingTimeoutRef.current = window.setTimeout(async () => {
      stopPolling();

      // If still not authorized after 2 minutes, reset state and notify
      if (!isAuthorized) {
        setIsInstalling(false);
        setAutoInstallAfterAuth(false);
        await webflow.notify({
          type: 'Error',
          message: 'Authorization timed out. Please try again and complete the authorization in the opened window.'
        });
      }
    }, 120000);
  }

  // Stop polling when authorized or component unmounts, and auto-install if needed
  useEffect(() => {
    if (isAuthorized && pollingIntervalRef.current) {
      stopPolling();

      // Auto-install if this was triggered by handleAuthorizeAndInstall
      if (autoInstallAfterAuth && !isCodeInstalled) {
        setAutoInstallAfterAuth(false);
        handleInstall();
      } else if (autoInstallAfterAuth) {
        // Already installed, just clear the flag
        setAutoInstallAfterAuth(false);
        setIsInstalling(false);
      }
    }

    return () => {
      stopPolling();
    };
  }, [isAuthorized, autoInstallAfterAuth, isCodeInstalled]);

  return (
    <ErrorBoundary>
      <div className="p-3 w-full min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <img src={waterfallIcon} width={36} className="relative -top-0.75 rounded-sm"></img>
          <Heading level={2}>Waterfall</Heading>
        </div>

        <Paragraph size="sm" className="text-text2 mb-5">
          Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with
          attributes. The Wellflow app helps you create, edit, and manage Waterfalls with an easy-to-use interface.
        </Paragraph>

        <HorizontalRule className="my-4" />

        <div className="bg-background2 p-3 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row gap-2">
            <Heading level={4} className="">
              Install
            </Heading>
            {isAuthorized === null ? (
              <div className="flex items-center gap-2 text-sm text-text2 bg-background5 p-3 rounded">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Checking Authorization...
              </div>
            ) : !isAuthorized || !isCodeInstalled ? (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-background5 p-3 rounded">
                <FontAwesomeIcon icon={faCircleInfo} />
                Complete Setup
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-background5 p-3 rounded">
                <FontAwesomeIcon icon={faCheck} />
                Connected
              </div>
            )}
          </div>

          {isAuthorized === null ? (
            <div className="flex items-center gap-2 text-sm text-text2 bg-background5 p-3 rounded">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Checking Authorization...
            </div>
          ) : !isAuthorized ? (
            <div className="">
              <Button onClick={handleAuthorizeAndInstall} icon={faLock} size="sm" disabled={isInstalling}>
                {isInstalling ? 'Installing...' : 'Install'}
              </Button>
            </div>
          ) : !isCodeInstalled ? (
            <Button onClick={handleInstall} size="sm" disabled={isInstalling}>
              {isInstalling ? 'Installing...' : 'Install Code'}
            </Button>
          ) : (
            <div className="">
              <Button onClick={handleUninstall} icon={faTrash} size="sm" disabled={isUninstalling}>
                {isUninstalling ? 'Uninstalling...' : 'Uninstall'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
