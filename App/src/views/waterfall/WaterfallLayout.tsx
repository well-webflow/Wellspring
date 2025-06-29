import { Outlet } from 'react-router';
import { WellflowHeader } from '../WellflowMainView';
import { useWaterfall } from '../../context/WaterfallContext';
import Loader from '../../components/Loader';

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
