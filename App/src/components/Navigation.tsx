import { faArrowLeft, faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import { useNavigate } from 'react-router';
import { useWaterfall } from '../context/WaterfallContext';
import { Heading } from './Typography';

export function EditNavigation({ heading, onGoBack }: { heading: string; onGoBack: () => void }) {
  const { loadWaterfall, saveWaterfall } = useWaterfall();
  return (
    <StickyNavigation onGoBack={onGoBack}>
      <div className="w-full flex flex-row justify-between items-center">
        <Heading level={4}>{heading}</Heading>
        <div className="flex flex-row gap-2">
          <Button icon={faArrowsRotate} onClick={() => loadWaterfall()} color="secondary">
            Reload
          </Button>
          <Button icon={faSave} onClick={async () => await saveWaterfall()} color="primary">
            Save
          </Button>
        </div>
      </div>
    </StickyNavigation>
  );
}

export function StickyNavigation({ children, onGoBack }: { children: React.ReactNode; onGoBack: () => void }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
    onGoBack();
  };
  return (
    <div className="sticky z-40 top-0 left-0 right-0 flex flex-row justify-stretch items-center gap-2 p-2 bg-background4">
      <Button icon={faArrowLeft} onClick={() => goBack()} color="secondary" disabled={window.history.length <= 1}>
        {}
      </Button>
      {children}
    </div>
  );
}
