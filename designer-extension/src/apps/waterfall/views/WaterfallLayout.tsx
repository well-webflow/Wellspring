import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { NavLink, Outlet, useMatch } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faCirclePlus, faGear, faPencil, faCheck, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WellflowHeader } from '../../../HomeView';
import { useEffect } from 'react';
import { useScrollRestoration } from '../../../hooks/useScrollRestoration';
import Button from '../../../components/UI/Button';
import { useWaterfallInstall } from '../hooks/useWaterfallInstall';

export default function WaterfallWrapper() {
  useEffect(() => {
    webflow.setExtensionSize('large');
  }, []);

  return (
    <WaterfallProvider>
      <WaterfallLayout />
    </WaterfallProvider>
  );
}

export function WaterfallLayout() {
  const { isLoading } = useWaterfall();
  const scrollContainerRef = useScrollRestoration();

  return (
    <div>
      {isLoading && <Loader />}
      <div className="h-screen flex flex-col grow">
        <WellflowHeader />
        <div className="flex flex-1 overflow-hidden">
          <WaterfallSidebar />
          <div ref={scrollContainerRef} className="flex-1 w-full min-w-0 overflow-hidden flex flex-col overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function WaterfallSidebar() {
  const isWaterfallRoot = useMatch('/waterfall');
  const isNewMatch = useMatch('/waterfall/new/*');
  const isEditMatch = useMatch('/waterfall/edit/*');

  return (
    <div className="flex flex-col h-full border-b border-r border-border1">
      <div className="flex flex-col gap-2 px-3 py-4">
        <NavLink to="/waterfall" end className="w-full">
          {({ isActive }) => (
            <Tab
              label="New"
              icon={faCirclePlus}
              active={isActive || !!isWaterfallRoot || !!isNewMatch}
              className="w-full text-left"
            />
          )}
        </NavLink>

        <NavLink to="/waterfall/select" className="w-full">
          {({ isActive }) => (
            <Tab label="Edit" icon={faPencil} active={isActive || !!isEditMatch} className="w-full text-left" />
          )}
        </NavLink>

        <NavLink to="/waterfall/setup" className="w-full">
          {({ isActive }) => <Tab label="Setup" icon={faGear} active={isActive} className="w-full text-left" />}
        </NavLink>
      </div>
    </div>
  );
}

export function AuthorizationStatus() {
  const {
    isAuthorized,
    isCodeInstalled,
    isInstalling,
    isWaitingForAuth,
    install,
    authorizeAndInstall,
    cancelAuthorize,
  } = useWaterfallInstall();

  return (
    <>
      {isAuthorized === null ? (
        <div className="flex items-center gap-2 text-xs text-text2">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          Checking...
        </div>
      ) : !isAuthorized ? (
        <div className="flex flex-row gap-2">
          {isWaitingForAuth && (
            <Button onClick={cancelAuthorize} size="sm">
              Cancel
            </Button>
          )}
          <Button onClick={authorizeAndInstall} icon={faLock} size="sm" disabled={isInstalling}>
            {isWaitingForAuth ? 'Waiting for authorization...' : 'Install'}
          </Button>
        </div>
      ) : !isCodeInstalled ? (
        <Button onClick={install} size="sm" disabled={isInstalling}>
          {isInstalling ? 'Installing...' : 'Install Code'}
        </Button>
      ) : (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <FontAwesomeIcon icon={faCheck} />
          Connected
        </div>
      )}
    </>
  );
}
