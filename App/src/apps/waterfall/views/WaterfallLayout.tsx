import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { NavLink, Outlet, useLocation, useMatch } from 'react-router';
import { Tab } from '../../../components/Tabs';
import { faArrowsRotate, faBox, faCirclePlus, faGear, faPencil, faSave } from '@fortawesome/free-solid-svg-icons';
import { WellflowHeader } from '../../../views/WellflowMainView';
import Button from '../../../components/UI/Button';
import { Toolbar } from '../../../components/UI/Toolbar';
import { useEffect } from 'react';
import HistoryNavigationButtons from '../../../components/UI/HistoryNavigationButtons';

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
          <div className="flex-1 w-full min-w-0 overflow-hidden flex flex-col">
            <ControlToolbar />
            <div className="p-3 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ControlToolbar() {
  const { mode, createWaterfall, loadWaterfall, saveWaterfall, loadedWaterfall } = useWaterfall();

  const location = useLocation();

  return (
    <Toolbar position="top">
      <div className="flex flex-row gap-2 w-full justify-between">
        <div className="flex gap-3 items-baseline">
          <HistoryNavigationButtons minPath="/waterfall" />
          {mode !== 'view' && <div className="font-mono text-center">{loadedWaterfall?.name}</div>}
          <div className="text-sm text-text2">{location.pathname}</div>
        </div>
        <div className="flex gap-2 justify-end">
          {mode === 'new' && (
            <Button size="sm" color="primary" onClick={createWaterfall}>
              Create Waterfall
            </Button>
          )}
          {mode === 'edit' && (
            <>
              <Button size="sm" icon={faArrowsRotate} onClick={loadWaterfall} color="secondary">
                Reload
              </Button>
              <Button size="sm" icon={faSave} onClick={saveWaterfall} color="primary">
                Save
              </Button>{' '}
            </>
          )}
        </div>
      </div>
    </Toolbar>
  );
}

export function WaterfallFooter() {
  const { createWaterfall, mode, loadWaterfall, saveWaterfall } = useWaterfall();
  return (
    <div className="sticky z-10 bg-background1 px-2 py-2 flex gap-3 items-center justify-end border-t border-border1 bottom-0 left-0 right-0 w-full">
      <Button size="sm" onClick={() => window.history.back()} className="mb-5">
        &larr; Back
      </Button>
      {mode === 'new' && (
        <Button size="sm" color="primary" onClick={createWaterfall} icon={faSave}>
          Create Waterfall
        </Button>
      )}
      {mode === 'edit' && (
        <div className="flex gap-2">
          <Button size="sm" icon={faArrowsRotate} onClick={loadWaterfall} color="secondary">
            Reload
          </Button>
          <Button size="sm" icon={faSave} onClick={saveWaterfall} color="primary">
            Save
          </Button>
        </div>
      )}
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

      <NavLink to="/waterfall/edit" className="w-full">
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
