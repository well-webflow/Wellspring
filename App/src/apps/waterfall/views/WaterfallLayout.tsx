import { Outlet } from 'react-router';
import { WellflowHeader } from '../../../views/WellflowMainView';
import Loader from '../../../components/UI/Loader';
import { useWaterfall, WaterfallProvider } from '../hooks/WaterfallContext';

export default function WaterfallLayout() {
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
