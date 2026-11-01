import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';
import { useWebflow } from '../../../../context/webflowContext';
import { Input } from '../../../../components/UI/Input';
import { ATTR_WATERFALL } from 'well-waterfall/attributes';
import BreakpointSelector from '../../components/BreakpointSelector';

export default function NewWaterfallLayout() {
  const { createWaterfall, loadedWaterfall, updateWaterfall } = useWaterfall();
  const { elementSelected } = useWebflow();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWaterfall(ATTR_WATERFALL, e.target.value);
  };

  const hasName = loadedWaterfall?.name && loadedWaterfall.name.trim() !== '';
  const canCreate = Boolean(elementSelected?.children && hasName);

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
        <BreakpointSelector />
        <Button
          size="sm"
          color={canCreate ? 'primary' : 'secondary'}
          onClick={createWaterfall}
          disabled={!canCreate}
          disabledTooltip={
            !elementSelected?.children
              ? 'Select an element to create a Waterfall'
              : 'Enter a Waterfall name to continue'
          }
          tooltipAlign="end"
        >
          Create
        </Button>
      </Toolbar>
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
