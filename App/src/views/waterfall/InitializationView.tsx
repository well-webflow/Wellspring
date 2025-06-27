import Button from '../../components/Button';
import {
  faPenToSquare,
  faPlus,
  faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';
import { useWaterfallContext } from '../../context/waterfallContext';
import { Heading, Paragraph } from '../../components/Typography';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { WellflowHeader } from '../WellflowMainView';

export default function InitializationView() {
  const { createWaterfall, loadWaterfall, elementSelected, waterfallSelected } =
    useWaterfallContext();

  const navigate = useNavigate();

  useEffect(() => {
    webflow.setExtensionSize('large');
  });

  function loadAndEditWaterfall() {
    loadWaterfall();
    navigate('/edit');
  }

  return (
    <div className="h-screen flex flex-col">
      <WellflowHeader />
      <div className="p-3 h-full">
        <div className="mb-5">
          <Heading
            level={1}
            className="text-5xl text-primary font-bold font-brand"
          >
            Waterfall
          </Heading>
          <p className="text-sm">
            Waterfall is a wrapper around SwiperJS (11.1.14) that allows for
            full swiper customization using attributes with a sensible builder.
          </p>
        </div>
        {elementSelected ? (
          <div className="p-3 grid grid-cols-3 gap-4 items-center justify-stretch w-full h-full">
            <div className="border border-dashed border-border2 p-5 flex-grow h-full flex flex-col justify-center items-center">
              <Button
                icon={faPlus}
                onClick={createWaterfall}
                color="primary"
                className="w-full"
              >
                Create New Waterfall
              </Button>
            </div>
            <div className="border border-dashed border-border2 p-5 flex-grow h-full flex flex-col justify-center items-center">
              <Button icon={faPlusSquare} onClick={() => navigate('/create')}>
                Create Elements
              </Button>
            </div>
            <div className="border border-dashed border-border2 p-5 flex-grow h-full flex flex-col justify-center items-center text-center">
              {!waterfallSelected ? (
                <>
                  <span>or</span>
                  <span>
                    Select an existing{' '}
                    <span className="text-primary">Waterfall</span>
                  </span>
                </>
              ) : (
                <Button
                  icon={faPenToSquare}
                  onClick={() => loadAndEditWaterfall()}
                  color="secondary"
                >
                  Edit {waterfallSelected}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-background2 p-5 rounded-lg">
            <Heading level={2}>Select An Element</Heading>
            <Paragraph size="sm" className="text-text3 mb-0">
              Please select an <span className="text-primary">Element</span> to
              begin.
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
}
