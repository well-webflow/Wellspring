import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';

export default function NewWaterfallLayout() {
  const { createWaterfall, loadedWaterfall } = useWaterfall();

  return (
    <div>
      <Toolbar>
        <div className="font-mono text-center">{loadedWaterfall?.name}</div>
        <Button size="sm" color="primary" onClick={createWaterfall}>
          Create Waterfall
        </Button>
      </Toolbar>
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
