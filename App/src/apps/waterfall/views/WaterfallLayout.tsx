import { Outlet } from 'react-router';
import { WellflowHeader } from '../../../views/WellflowMainView';
import Loader from '../../../components/Loader';
import { useWaterfall } from '../hooks/WaterfallContext';

export default function WaterfallLayout() {
  const { isLoading } = useWaterfall();
  return (
    <div className="min-h-screen flex flex-col">
      <WellflowHeader />
      {isLoading && <Loader />}
      <Outlet />
    </div>
  );
}
