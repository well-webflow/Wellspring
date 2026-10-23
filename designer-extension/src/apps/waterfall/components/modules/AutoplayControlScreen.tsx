import { faCirclePause, faCirclePlay, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import {
  convertElementToAutoplayButton,
  convertElementToAutoplayPauseIcon,
  convertElementToAutoplayPlayIcon,
  createAutoplayControl,
} from '../../lib/waterfallElements';
import Card from '../../../../components/UI/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SelectedElement from '../../../../components/SelectedElement';
import { Heading } from '../../../../components/Typography';

export default function AutoplayControlScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading level={5} className="mb-3">
          Create
        </Heading>
        <Card onClick={createAutoplayControl} className="flex flex-col text-center">
          <FontAwesomeIcon icon={faPlayCircle} className="mb-2 text-primary" size="1x" />
          Autoplay Button
        </Card>
      </div>

      {/* Convert Section */}
      <div>
        <div className="flex flex-row justify-between items-center mb-3">
          <Heading level={5}>Convert Selected Element</Heading>
          <SelectedElement />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card onClick={convertElementToAutoplayButton} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faPlayCircle} className="mb-2 text-primary" size="1x" />
            Autoplay Button
          </Card>
          <Card onClick={convertElementToAutoplayPlayIcon} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faCirclePlay} className="mb-2 text-primary" size="1x" />
            Play Icon
          </Card>
          <Card onClick={convertElementToAutoplayPauseIcon} className="flex flex-col text-center">
            <FontAwesomeIcon icon={faCirclePause} className="mb-2 text-primary" size="1x" />
            Pause Icon
          </Card>
        </div>
      </div>

      {/* Options Section */}
      <div>
        <Heading level={5} className="mb-3">
          Options
        </Heading>
      </div>
    </div>
  );
}
