import { useNavigate, useParams } from 'react-router';
import { useWaterfall } from '../../hooks/WaterfallContext';
import { useEffect } from 'react';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import CategoryList from '../../components/CategoryList';

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
      <CategoryList categories={waterfallConfig} onCategoryClick={goToCategory} />
    </ErrorBoundary>
  );
}
