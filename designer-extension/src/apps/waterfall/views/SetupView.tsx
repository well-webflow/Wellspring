import { Heading, Paragraph } from '../../../components/Typography';
import waterfallIcon from '../../../assets/waterfall.png';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import Button from '../../../components/UI/Button';
import { uninstallWaterfall } from '../../../lib/api';
import { faCheck, faCircleInfo, faLinkSlash, faLock, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useWaterfallInstall } from '../hooks/useWaterfallInstall';
import HorizontalRule from '../../../components/UI/hr';

export default function SetupView() {
  const {
    isAuthorized,
    isCodeInstalled,
    checkAuthStatus,
    isInstalling,
    isWaitingForAuth,
    install,
    authorizeAndInstall,
    cancelAuthorize,
  } = useWaterfallInstall();

  const [isUninstalling, setIsUninstalling] = useState(false);

  async function handleUninstall() {
    const confirmed = confirm(
      'Are you sure you want to uninstall Waterfall?\n\nThis will remove all Waterfall scripts from your site and pages. Publish your site afterwards to remove them from the live site.'
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

  // Deletes the authorization stored for this site when Waterfall isn't installed (the uninstall
  // endpoint also removes any scripts it finds, so it's safe to reuse here)
  async function handleDisconnect() {
    const confirmed = confirm(
      "Disconnect Wellspring from this site?\n\nThis deletes the authorization Wellspring stored for this site. To remove Wellspring's access completely, also uninstall the App from your Webflow site settings."
    );

    if (!confirmed) return;

    setIsUninstalling(true);
    try {
      await uninstallWaterfall();
      await webflow.notify({ type: 'Success', message: 'Wellspring was disconnected from this site.' });
      await checkAuthStatus();
    } catch (err) {
      await webflow.notify({ type: 'Error', message: (err as Error).message });
    } finally {
      setIsUninstalling(false);
    }
  }

  return (
    <ErrorBoundary>
      <div className="p-3 w-full min-w-0 overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <img src={waterfallIcon} width={36} className="relative -top-0.75 rounded-sm"></img>
          <Heading level={2}>Waterfall</Heading>
        </div>

        <Paragraph size="sm" className="text-text2 mb-5">
          Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with
          attributes. The Wellspring app helps you create, edit, and manage Waterfalls with an easy-to-use interface.
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

          {/* The status badge shows the spinner while checking, so there's nothing to offer here yet */}
          {isAuthorized === null ? null : !isAuthorized ? (
            <div className="flex flex-row gap-2">
              {isWaitingForAuth && (
                <Button onClick={cancelAuthorize} size="sm">
                  Cancel
                </Button>
              )}
              <Button onClick={authorizeAndInstall} icon={faLock} size="sm" disabled={isInstalling}>
                {isWaitingForAuth ? 'Waiting for authorization...' : isInstalling ? 'Installing...' : 'Install'}
              </Button>
            </div>
          ) : !isCodeInstalled ? (
            <div className="flex flex-row gap-2">
              {!isInstalling && (
                <Button onClick={handleDisconnect} icon={faLinkSlash} size="sm" disabled={isUninstalling}>
                  {isUninstalling ? 'Disconnecting...' : 'Disconnect'}
                </Button>
              )}
              <Button onClick={install} size="sm" disabled={isInstalling || isUninstalling}>
                {isInstalling ? 'Installing...' : 'Install Code'}
              </Button>
            </div>
          ) : (
            <div className="">
              <Button onClick={handleUninstall} icon={faTrash} size="sm" disabled={isUninstalling}>
                {isUninstalling ? 'Uninstalling...' : 'Uninstall'}
              </Button>
            </div>
          )}
        </div>

        {isAuthorized === false && (
          <Paragraph size="sm" className="text-text2 mt-3">
            Removed Wellspring's access to this site earlier? The Waterfall script may still be on your published site,
            and Wellspring can't remove it without access. Click Install to reconnect: if the script is still there,
            Wellspring won't add it again and will show an Uninstall button instead. Uninstall, then publish your site
            to remove it.
          </Paragraph>
        )}
      </div>
    </ErrorBoundary>
  );
}
