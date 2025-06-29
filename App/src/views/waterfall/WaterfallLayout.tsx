import { Outlet } from 'react-router';
import { WellflowHeader } from '../WellflowMainView';

export default function WaterfallLayout() {
  return (
    <div className="h-screen flex flex-col">
      <WellflowHeader />
      <Outlet />
    </div>
  );
}
