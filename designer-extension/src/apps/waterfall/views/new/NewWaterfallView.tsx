import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '../../../../components/UI/Card';
import { Heading, Paragraph } from '../../../../components/Typography';
import { useWebflow } from '../../../../context/webflowContext';
import { useWaterfall } from '../../hooks/WaterfallContext';
import ContentTypeSetting from '../../components/ContentTypeSetting';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import CategoryList from '../../components/CategoryList';

export default function NewWaterfallView() {
  const { initNewWaterfall, waterfallConfig, setSelectedCategory, contentType, setContentType } = useWaterfall();

  const { elementSelected } = useWebflow();

  const navigate = useNavigate();

  useEffect(() => {
    // Only initialize if config doesn't exist yet
    if (!waterfallConfig) {
      initNewWaterfall();
    }
  }, []);

  function goToCategory(selectedCategory: string) {
    setSelectedCategory(selectedCategory);
    navigate(`/waterfall/new/${selectedCategory}`);
  }

  if (!elementSelected)
    return (
      <Card>
        <Heading level={2}>Select An Element</Heading>
        <Paragraph size="sm" className="text-text3 mb-0">
          Please select an <span className="text-primary">Element</span> to begin.
        </Paragraph>
      </Card>
    );

  return (
    <ErrorBoundary>
      <div className="space-y-2">
        <ContentTypeSetting value={contentType} onChange={setContentType} />
        <CategoryList categories={waterfallConfig} onCategoryClick={goToCategory} />
      </div>
    </ErrorBoundary>
  );
}
