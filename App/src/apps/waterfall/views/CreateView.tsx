import { Heading, Paragraph } from '../../../components/Typography';
import Card from '../../../components/UI/Card';
import { useWebflow } from '../../../context/webflowContext';
import {
  convertElementToNextButton,
  convertElementToPaginationBullet,
  convertElementToPaginationBulletActive,
  convertElementToPaginationContainer,
  convertElementToPrevButton,
  convertElementToScrollbarContainer,
  convertElementToScrollbarDrag,
  convertElementToSlideCount,
  createNavigation,
  createPagination,
  createScrollbar,
  createSlideCount,
} from '../lib/waterfallElements';
import { Toolbar } from '../../../components/UI/Toolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faArrowsLeftRight,
  faCircle,
  faDotCircle,
  faEllipsis,
  faHashtag,
  faSquare,
} from '@fortawesome/free-solid-svg-icons';
import SelectedElement from '../../../components/SelectedElement';
import ParallaxScreen from '../components/modules/ParallaxScreen';

export default function CreateView() {
  const { elementSelected } = useWebflow();

  return (
    <>
      <Toolbar>
        <div className="flex items-center justify-between w-full">
          <div>Elements</div>
          <div className="flex items-center gap-3">
            <div className="text-sm">Selected Element:</div>
            <SelectedElement />
          </div>
        </div>
      </Toolbar>
      <div className="p-3 flex-1 overflow-y-auto space-y-20">
        {!elementSelected ? (
          <Card>
            <Heading level={2}>Select An Element</Heading>
            <Paragraph size="sm" className="text-text3 mb-0">
              Please select an <span className="text-primary">Element</span> to begin.
            </Paragraph>
          </Card>
        ) : (
          <>
            <div>
              <Heading level={3} className="mb-3">
                Pagination
              </Heading>
              <div className="grid grid-cols-2 gap-3">
                <Card onClick={createPagination} className="flex flex-col text-center">
                  <FontAwesomeIcon icon={faEllipsis} className="mb-2 text-primary" size="1x" />
                  Create New Pagination
                </Card>
                <Card onClick={convertElementToPaginationContainer} className="flex flex-col text-center">
                  <FontAwesomeIcon icon={faSquare} className="mb-2 text-primary" size="1x" />
                  Convert to Pagination Container
                </Card>
                <Card onClick={convertElementToPaginationBullet} className="flex flex-col text-center">
                  <FontAwesomeIcon icon={faCircle} className="mb-2 text-primary" size="1x" />
                  Convert to Pagination Bullet
                </Card>
                <Card onClick={convertElementToPaginationBulletActive} className="flex flex-col text-center">
                  <FontAwesomeIcon icon={faDotCircle} className="mb-2 text-primary" size="1x" />
                  Convert to Pagination Bullet (Active)
                </Card>
              </div>
              <div>
                <Heading level={3} className="mt-8 mb-3">
                  Navigation
                </Heading>
                <div className="grid grid-cols-3 gap-3">
                  <Card onClick={createNavigation} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faArrowsLeftRight} className="mb-2 text-primary" size="1x" />
                    Create Navigation
                  </Card>
                  <Card onClick={convertElementToNextButton} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faArrowRight} className="mb-2 text-primary" size="1x" />
                    Convert to Next Button
                  </Card>
                  <Card onClick={convertElementToPrevButton} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="mb-2 text-primary" size="1x" />
                    Convert to Prev Button
                  </Card>
                </div>
              </div>
              <div>
                <Heading level={3} className="mt-8 mb-3">
                  Scrollbar
                </Heading>
                <div className="grid grid-cols-3 gap-3">
                  <Card onClick={createScrollbar} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faArrowsLeftRight} className="mb-2 text-primary" size="1x" />
                    Create New Scrollbar
                  </Card>
                  <Card onClick={convertElementToScrollbarContainer} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faSquare} className="mb-2 text-primary" size="1x" />
                    Convert to Scrollbar Container
                  </Card>
                  <Card onClick={convertElementToScrollbarDrag} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faArrowsLeftRight} className="mb-2 text-primary" size="1x" />
                    Convert to Scrollbar Drag
                  </Card>
                </div>
              </div>
              <div>
                <Heading level={3} className="mt-8 mb-3">
                  Slide Count
                </Heading>
                <div className="grid grid-cols-2 gap-3">
                  <Card onClick={createSlideCount} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faHashtag} className="mb-2 text-primary" size="1x" />
                    Create New Slide Count
                  </Card>
                  <Card onClick={convertElementToSlideCount} className="flex flex-col text-center">
                    <FontAwesomeIcon icon={faHashtag} className="mb-2 text-primary" size="1x" />
                    Convert to Slide Count
                  </Card>
                </div>
              </div>
              <div>
                <Heading level={3} className="mt-8 mb-3">
                  Parallax
                </Heading>
                <ParallaxScreen />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
