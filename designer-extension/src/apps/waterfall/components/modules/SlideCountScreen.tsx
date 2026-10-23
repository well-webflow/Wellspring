import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { convertElementToSlideCount, createSlideCount } from '../../lib/waterfallElements';
import SelectedElement from '../../../../components/SelectedElement';
import Card from '../../../../components/UI/Card';
import { Heading } from '../../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SlideCountScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={5} className="mb-3">
          Create
        </Heading>
        <Card onClick={createSlideCount} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faHashtag} className="mb-2 text-primary" size="1x" />
          Slide Count
        </Card>
      </div>

      {/* Convert Section */}
      <div>
        <div className="flex flex-row justify-between items-center mb-3">
          <Heading level={5}>Convert Selected Element</Heading>
          <SelectedElement />
        </div>
        <Card onClick={convertElementToSlideCount} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faHashtag} className="mb-2 text-primary" size="1x" />
          Slide Count
        </Card>
      </div>
    </div>
  );
}
