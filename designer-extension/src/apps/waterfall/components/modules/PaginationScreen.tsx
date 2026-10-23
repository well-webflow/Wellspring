import { faCircle, faDotCircle, faEllipsis, faSquare } from '@fortawesome/free-solid-svg-icons';
import {
  convertElementToPaginationBullet,
  convertElementToPaginationBulletActive,
  convertElementToPaginationContainer,
  createPagination,
} from '../../lib/waterfallElements';
import Card from '../../../../components/UI/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Heading } from '../../../../components/Typography';
import SelectedElement from '../../../../components/SelectedElement';

export default function PaginationScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={5} className="mb-3">
          Create
        </Heading>
        <Card onClick={createPagination} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faEllipsis} className="mb-2 text-primary" size="1x" />
          Pagination
        </Card>
      </div>

      {/* Convert Section */}
      <div>
        <div className="flex flex-row justify-between items-center mb-3">
          <Heading level={5}>Convert Selected Element</Heading>
          <SelectedElement />
        </div>
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
      </div>
    </div>
  );
}
