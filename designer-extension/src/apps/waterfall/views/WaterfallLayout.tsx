import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { NavLink, Outlet, useMatch } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faCirclePlus, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { WellflowHeader } from '../../../HomeView';
import { useEffect } from 'react';
import { useScrollRestoration } from '../../../hooks/useScrollRestoration';
import { useUpdateAnnouncement } from '../hooks/useWaterfallUpdate';

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

  // Check and notify users if there is an update available
  useUpdateAnnouncement();

  return (
    <div>
      {isLoading && <Loader />}
      <div className="h-screen flex flex-col grow">
        <WellflowHeader />
        <div className="flex flex-1 overflow-hidden">
          <WaterfallSidebar />
          <div
            ref={scrollContainerRef}
            className="flex-1 w-full min-w-0 flex flex-col overflow-x-hidden overflow-y-auto"
          >
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
        <NavLink
          to="/waterfall"
          end
          className="w-full rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          {({ isActive }) => (
            <Tab
              as="span"
              label="New"
              icon={faCirclePlus}
              active={isActive || !!isWaterfallRoot || !!isNewMatch}
              className="w-full text-left"
            />
          )}
        </NavLink>

        <NavLink
          to="/waterfall/select"
          className="w-full rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          {({ isActive }) => (
            <Tab
              as="span"
              label="Edit"
              icon={faPencil}
              active={isActive || !!isEditMatch}
              className="w-full text-left"
            />
          )}
        </NavLink>

        <NavLink
          to="/waterfall/setup"
          className="w-full rounded-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          {({ isActive }) => (
            <Tab as="span" label="Setup" icon={faGear} active={isActive} className="w-full text-left" />
          )}
        </NavLink>
      </div>
    </div>
  );
}
