import Button from '../../components/Button';
import { useWaterfall } from '../../context/WaterfallContext';
import { useNavigate } from 'react-router';
import { faArrowsRotate, faSave } from '@fortawesome/free-solid-svg-icons';
import { StickyNavigation } from '../../components/Navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

export default function EditView() {
  const { setSelectedCategory, waterfallSettings, unloadWaterfall, loadedWaterfall, loadWaterfall, saveWaterfall } =
    useWaterfall();

  const navigate = useNavigate();

  useEffect(() => {
    webflow.setExtensionSize('large');
  }, []);

  function goToCategory(selectedCategory: string) {
    setSelectedCategory(selectedCategory);
    navigate(`/waterfall/edit/${selectedCategory}`);
  }

  function goBack() {
    setSelectedCategory(null);
    unloadWaterfall();
  }

  return (
    <div className="">
      <StickyNavigation onGoBack={goBack}>
        <div className="w-full flex flex-row justify-between items-center">
          <div>Editing {loadedWaterfall?.name}</div>
          <div className="flex flex-row gap-2">
            <Button icon={faArrowsRotate} onClick={() => loadWaterfall()} color="secondary">
              Reload
            </Button>
            <Button icon={faSave} onClick={() => saveWaterfall()} color="primary">
              Save
            </Button>
          </div>
        </div>
      </StickyNavigation>{' '}
      <div className="p-2">
        <div className="space-y-3">
          {waterfallSettings?.map((category) => (
            <Button key={category.id} onClick={() => goToCategory(category.id)} className="w-full">
              <div className="flex flex-row items-center text-left gap-4">
                {category.icon && (
                  <div className="bg-primary-dark w-8 h-8 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={category.icon} className="text-white" />
                  </div>
                )}
                <div className="">
                  <div className="text-base font-bold">{category.name}</div>
                  <div className="text-sm text-text2">{category.summary}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
