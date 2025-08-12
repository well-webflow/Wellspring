import { faDotCircle, faPlusCircle, faSquare } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/Button';
import SelectedElement from '../../../components/SelectedElement';
import {
  convertElementToPaginationBullet,
  convertElementToPaginationBulletActive,
  convertElementToPaginationContainer,
  createPagination,
} from '../lib/waterfallElements';

export default function PaginationScreen() {
  return (
    <div className="flex flex-col gap-3">
      <Button icon={faPlusCircle} onClick={createPagination}>
        Create Pagination
      </Button>
      <Button icon={faSquare} onClick={convertElementToPaginationContainer}>
        Convert <SelectedElement /> to Pagination Container
      </Button>
      <Button icon={faDotCircle} onClick={convertElementToPaginationBullet}>
        Convert <SelectedElement /> to Bullet
      </Button>
      <Button icon={faDotCircle} onClick={convertElementToPaginationBulletActive}>
        Convert <SelectedElement /> to Bullet Active
      </Button>
    </div>
  );
}
