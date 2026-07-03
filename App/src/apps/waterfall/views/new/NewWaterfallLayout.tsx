import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';
import { useWebflow } from '../../../../context/webflowContext';
import Tooltip from '../../../../components/UI/Tooltip';
import { Input } from '../../../../components/UI/Input';
import { ATTR_WATERFALL } from 'well-waterfall';

export default function NewWaterfallLayout() {
  const { createWaterfall, loadedWaterfall, updateWaterfall } = useWaterfall();
  const { elementSelected } = useWebflow();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWaterfall(ATTR_WATERFALL, e.target.value);
  };

  const hasName = loadedWaterfall?.name && loadedWaterfall.name.trim() !== '';
  const canCreate = elementSelected?.children && hasName;

  return (
    <div>
      <Toolbar>
        <Input
          type="text"
          value={loadedWaterfall?.name || ''}
          onChange={handleNameChange}
          placeholder="Slider Name"
          inputSize="base"
          required
        />
        {!canCreate ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="secondary"
              disabled
              disabledTooltip={
                !elementSelected?.children
                  ? 'Select an Element to create a Waterfall'
                  : 'Enter a waterfall name to continue'
              }
            >
              <Tooltip
                content={
                  !elementSelected?.children
                    ? 'Select an Element to create a Waterfall'
                    : 'Enter a waterfall name to continue'
                }
                position="left"
              ></Tooltip>
              Create
            </Button>
          </div>
        ) : (
          <Button size="sm" color="primary" onClick={createWaterfall}>
            Create
          </Button>
        )}
      </Toolbar>
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
