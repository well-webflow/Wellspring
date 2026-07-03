import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';
import { Input } from '../../../../components/UI/Input';
import { ATTR_WATERFALL } from 'well-waterfall';

export default function EditLayout() {
  const { loadWaterfall, loadedWaterfall, saveWaterfall, updateWaterfall } = useWaterfall();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateWaterfall(ATTR_WATERFALL, e.target.value);
  };

  return (
    <div className="">
      <Toolbar>
        <Input
          type="text"
          value={loadedWaterfall?.name || ''}
          onChange={handleNameChange}
          placeholder="Waterfall Name"
          inputSize="base"
        />
        <div className="flex gap-2">
          <Button size="sm" icon={faArrowsRotate} onClick={loadWaterfall} color="secondary">
            Reload
          </Button>
          <Button size="sm" icon={faSave} onClick={saveWaterfall} color="primary">
            Save
          </Button>
        </div>
      </Toolbar>
      <div className="p-3">
        <Outlet />
      </div>
    </div>
  );
}
