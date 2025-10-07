import { Outlet, useMatch, useNavigate } from 'react-router';
import { StickyNavigation } from '../../components/Navbar';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { useEffect } from 'react';
import { Heading } from '../../../../components/Typography';
import Button from '../../../../components/UI/Button';
import { faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';

export default function WaterfallEditLayout() {
  const { setSelectedCategory, unloadWaterfall, loadedWaterfall } = useWaterfall();
  const navigate = useNavigate();

  useEffect(() => {
    webflow.setExtensionSize('large');
  }, []);

  const isCategoryRoute = useMatch('/waterfall/edit/:categoryName');

  function goBack() {
    if (isCategoryRoute) {
      navigate('/waterfall/edit'); // go to the main edit screen
    } else {
      navigate(-1); // go back to previous page
      unloadWaterfall();
    }

    setSelectedCategory(null);
  }

  return (
    <>
      <EditNavbar onGoBack={goBack} heading={`Editing ${loadedWaterfall?.name}`} />
      <Outlet />
    </>
  );
}

export function EditNavbar({ heading, onGoBack }: { heading: string; onGoBack: () => void }) {
  const { loadWaterfall, saveWaterfall } = useWaterfall();
  return (
    <StickyNavigation onGoBack={onGoBack}>
      <div className="w-full flex flex-row justify-between items-center">
        <Heading level={4}>{heading}</Heading>
        <div className="flex flex-row gap-2">
          <Button size="sm" icon={faArrowsRotate} onClick={loadWaterfall} color="secondary">
            Reload
          </Button>
          <Button size="sm" icon={faSave} onClick={saveWaterfall} color="primary">
            Save
          </Button>
        </div>
      </div>
    </StickyNavigation>
  );
}
