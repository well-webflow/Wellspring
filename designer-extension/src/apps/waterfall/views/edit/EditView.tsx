import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../../components/UI/Button';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { useEffect } from 'react';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';

export default function EditView() {
  const { waterfallName } = useParams<{ waterfallName: string }>();
  const { setSelectedCategory, waterfallConfig, loadWaterfall, loadedWaterfall, findWaterfallByName } = useWaterfall();

  const navigate = useNavigate();

  useEffect(() => {
    // Track if this effect is still active to prevent race conditions
    let isCancelled = false;

    // Only load waterfall if config is null (coming from SelectWaterfallView)
    // Skip if config already exists (coming from CategoryView)
    if (waterfallName && waterfallConfig === null) {
      findWaterfallByName(waterfallName).then((element) => {
        // Don't update state if component unmounted or waterfall changed
        if (isCancelled) return;

        if (element) {
          console.log('Found waterfall element:', element);
          webflow.setSelectedElement(element);
          loadWaterfall();
        } else {
          console.log('Waterfall not found');
        }
      });
    }

    // Cleanup: mark this effect as cancelled when dependencies change or component unmounts
    return () => {
      isCancelled = true;
    };
  }, [waterfallName, waterfallConfig]);

  function goToCategory(selectedCategory: string) {
    setSelectedCategory(selectedCategory);
    navigate(`/waterfall/edit/${loadedWaterfall?.name}/${selectedCategory}`);
  }

  return (
    <ErrorBoundary>
      <div className="space-y-2">
        {waterfallConfig
          ?.filter((category) => category.id !== 'general')
          .map((category) => (
            <Button size="lg" key={category.id} onClick={() => goToCategory(category.id)} className="w-full">
              <div className="flex flex-row items-center text-left gap-4">
                {category.icon && (
                  <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={category.icon} className="text-primary-dark" />
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
    </ErrorBoundary>
  );
}
