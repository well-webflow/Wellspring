import { Outlet } from 'react-router';
import { WellflowHeader } from '../../../views/WellflowMainView';
import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';
import { useEffect } from 'react';

export default function WaterfallLayout() {
  useEffect(() => {
    webflow.setExtensionSize('large');
  });
  return (
    <WaterfallProvider>
      <WaterfallWrapper />
    </WaterfallProvider>
  );
}

function WaterfallWrapper() {
  const { isLoading } = useWaterfall();

  return (
    <div className="min-h-screen flex flex-col">
      <WellflowHeader />
      {isLoading && <Loader />}
      <Outlet />
    </div>
  );
}
