import SelectedElement from '../../../../components/SelectedElement';
import Card from '../../../../components/UI/Card';
import { Heading } from '../../../../components/Typography';
import { convertElementToNextButton, convertElementToPrevButton, createNavigation } from '../../lib/waterfallElements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function NavigationScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={5} className="mb-3">
          Create
        </Heading>
        <Card onClick={createNavigation} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faArrowsLeftRight} className="mb-2 text-primary" size="1x" />
          Navigation
        </Card>
      </div>

      {/* Convert Section */}
      <div>
        <div className="flex flex-row justify-between items-center mb-3">
          <Heading level={5}>Convert Selected Element</Heading>
          <SelectedElement />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={convertElementToPrevButton} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faChevronLeft} className="mb-2 text-primary" size="1x" />
            Previous Button
          </Card>
          <Card onClick={convertElementToNextButton} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faChevronRight} className="mb-2 text-primary" size="1x" />
            Next Button
          </Card>
        </div>
      </div>
    </div>
  );
}
