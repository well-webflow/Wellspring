import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { NavLink, Outlet, useMatch } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faArrowsRotate, faBox, faCirclePlus, faGear, faPencil, faSave } from '@fortawesome/free-solid-svg-icons';
import { WellflowHeader } from '../../../views/WellflowMainView';
import { useEffect } from 'react';

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

  return (
    <div>
      {isLoading && <Loader />}
      <div className="h-screen flex flex-col grow">
        <WellflowHeader />
        <div className="flex flex-1 overflow-hidden">
          <WaterfallSidebar />
          <div className="flex-1 w-full min-w-0 overflow-hidden flex flex-col overflow-y-auto">
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
    <div className="flex flex-col gap-2 px-3 border-b border-r border-border1 py-4">
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
  );
}
