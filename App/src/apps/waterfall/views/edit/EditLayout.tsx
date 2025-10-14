import { Outlet } from 'react-router';
import Button from '../../../../components/UI/Button';
import { faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { Toolbar } from '../../../../components/UI/Toolbar';

export default function EditLayout() {
  const { loadWaterfall, loadedWaterfall, saveWaterfall } = useWaterfall();
  return (
    <div className="">
      <Toolbar>
        <div className="font-mono text-center">{loadedWaterfall?.name}</div>
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
