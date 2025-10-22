import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';
import { useWebflow } from '../../../../context/webflowContext';
import Tooltip from '../../../../components/UI/Tooltip';

export default function NewWaterfallLayout() {
  const { createWaterfall, loadedWaterfall } = useWaterfall();
  const { elementSelected } = useWebflow();

  return (
    <div>
      <Toolbar>
        <div className="font-mono text-center">{loadedWaterfall?.name}</div>
        {!elementSelected?.children ? (
          <div className="flex items-center gap-2">
            <Button size="sm" color="secondary" disabled disabledTooltip="Select an Element to create a Waterfall">
              <Tooltip content="Select an Element to create a Waterfall" position="left"></Tooltip>
              Create Waterfall
            </Button>
          </div>
        ) : (
          <Button size="sm" color="primary" onClick={createWaterfall}>
            Create Waterfall
          </Button>
        )}
      </Toolbar>
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
