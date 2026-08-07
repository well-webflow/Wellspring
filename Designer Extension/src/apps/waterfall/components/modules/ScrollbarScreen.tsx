import { faArrowsLeftRightToLine, faPlusCircle, faSquare } from '@fortawesome/free-solid-svg-icons';
import {
  convertElementToScrollbarContainer,
  convertElementToScrollbarDrag,
  createScrollbar,
} from '../../lib/waterfallElements';
import SelectedElement from '../../../../components/SelectedElement';
import Button from '../../../../components/UI/Button';

export default function ScrollbarScreen() {
  return (
    <div className="flex flex-col gap-3">
      <Button icon={faPlusCircle} onClick={createScrollbar}>
        Create Scrollbar
      </Button>
      <Button icon={faSquare} onClick={convertElementToScrollbarContainer}>
        Convert <SelectedElement /> to Scrollbar Container
      </Button>
      <Button icon={faArrowsLeftRightToLine} onClick={convertElementToScrollbarDrag}>
        Convert <SelectedElement /> to Scrollbar Drag
      </Button>
    </div>
  );
}
