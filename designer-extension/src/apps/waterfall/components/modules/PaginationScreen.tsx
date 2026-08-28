import { faCircle, faDotCircle, faSquare } from '@fortawesome/free-solid-svg-icons';
import {
  convertElementToPaginationBullet,
  convertElementToPaginationBulletActive,
  convertElementToPaginationContainer,
} from '../../lib/waterfallElements';
import Card from '../../../../components/UI/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PaginationScreen() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card onClick={convertElementToPaginationContainer} className="flex flex-col text-center">
        <FontAwesomeIcon icon={faSquare} className="mb-2 text-primary" size="1x" />
        Pagination Container
      </Card>
      <Card onClick={convertElementToPaginationBullet} className="flex flex-col text-center">
        <FontAwesomeIcon icon={faCircle} className="mb-2 text-primary" size="1x" />
        Pagination Bullet
      </Card>
      <Card onClick={convertElementToPaginationBulletActive} className="flex flex-col text-center">
        <FontAwesomeIcon icon={faDotCircle} className="mb-2 text-primary" size="1x" />
        Pagination Bullet (Active)
      </Card>
    </div>
  );
}
