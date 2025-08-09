import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { EditNavigation } from '../../components/Navigation';
import Button from '../../../../components/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';

export default function EditView() {
  const { setSelectedCategory, waterfallConfig: waterfallSettings, unloadWaterfall, loadedWaterfall } = useWaterfall();

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
      <EditNavigation onGoBack={goBack} heading={`Editing ${loadedWaterfall?.name}`} />
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
