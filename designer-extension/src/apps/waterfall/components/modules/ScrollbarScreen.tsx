import { faArrowsLeftRightToLine, faBarsProgress, faSquare } from '@fortawesome/free-solid-svg-icons';
import {
  convertElementToScrollbarContainer,
  convertElementToScrollbarDrag,
  createScrollbar,
} from '../../lib/waterfallElements';
import SelectedElement from '../../../../components/SelectedElement';
import Card from '../../../../components/UI/Card';
import { Heading } from '../../../../components/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ScrollbarScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={5} className="mb-3">
          Create
        </Heading>
        <Card onClick={createScrollbar} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faBarsProgress} className="mb-2 text-primary" size="1x" />
          Scrollbar
        </Card>
      </div>

      {/* Convert Section */}
      <div>
        <div className="flex flex-row justify-between items-center mb-3">
          <Heading level={5}>Convert Selected Element</Heading>
          <SelectedElement />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={convertElementToScrollbarContainer} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faSquare} className="mb-2 text-primary" size="1x" />
            Scrollbar Container
          </Card>
          <Card onClick={convertElementToScrollbarDrag} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faArrowsLeftRightToLine} className="mb-2 text-primary" size="1x" />
            Scrollbar Drag
          </Card>
        </div>
      </div>
    </div>
  );
}
