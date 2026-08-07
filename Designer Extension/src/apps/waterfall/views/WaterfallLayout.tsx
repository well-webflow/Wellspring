import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { NavLink, Outlet, useMatch } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faBox, faCirclePlus, faGear, faPencil, faCheck, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WellflowHeader } from '../../../views/WellspringMainView';
import { useEffect, useRef } from 'react';
import { useScrollRestoration } from '../../../hooks/useScrollRestoration';
import { useWebflow } from '../../../context/webflowContext';
import Button from '../../../components/UI/Button';
import { installWaterfall, launchWebflowAuth, NotAuthorizedError } from '../../../lib/api';

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
  const { isAuthorized, isCodeInstalled, checkAuthStatus } = useWebflow();
  const pollingIntervalRef = useRef<number | null>(null);

  async function handleSetup() {
    try {
      const result = await installWaterfall();
      await webflow.notify({ type: 'Success', message: `Applied ${result.scriptId}. Publish to go live.` });
      await checkAuthStatus();
    } catch (err) {
      if (err instanceof NotAuthorizedError) {
        await checkAuthStatus();
        return;
      }
      await webflow.notify({ type: 'Error', message: (err as Error).message });
    }
  }

  async function handleAuthorize() {
    launchWebflowAuth();
    await webflow.notify({ type: 'Info', message: 'Please complete authorization in the opened window.' });

    // Start polling for authorization status
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = window.setInterval(async () => {
      await checkAuthStatus();
    }, 2000);

    // Stop polling after 2 minutes
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, 120000);
  }

  // Stop polling when authorized or component unmounts
  useEffect(() => {
    if (isAuthorized && pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuthorized]);

  return (
    <div className="flex flex-col justify-between h-full border-b border-r border-border1">
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

        <NavLink to="/waterfall/create" className="w-full">
          {({ isActive }) => <Tab label="Elements" icon={faBox} active={isActive} className="w-full text-left" />}
        </NavLink>

        <NavLink to="/waterfall/setup" className="w-full">
          {({ isActive }) => <Tab label="Setup" icon={faGear} active={isActive} className="w-full text-left" />}
        </NavLink>
      </div>

      <div className="px-3 py-4 border-t border-border1">
        {isAuthorized === null ? (
          <div className="flex items-center gap-2 text-xs text-text2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Checking...
          </div>
        ) : !isAuthorized ? (
          <Button onClick={handleAuthorize} icon={faLock} className="w-full text-sm">
            Authorize
          </Button>
        ) : !isCodeInstalled ? (
          <Button onClick={handleSetup} className="w-full text-sm">
            Install Code
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-green-600">
            <FontAwesomeIcon icon={faCheck} />
            Connected
          </div>
        )}
      </div>
    </div>
  );
}
