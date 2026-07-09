import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Card from '../../../../components/UI/Card';
import { Heading, Paragraph } from '../../../../components/Typography';
import Button from '../../../../components/UI/Button';
import { useWebflow } from '../../../../context/webflowContext';
import { useWaterfall } from '../../hooks/WaterfallContext';
import ContentTypeSetting from '../../components/ContentTypeSetting';

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
    <div className="space-y-2">
      <ContentTypeSetting value={contentType} onChange={setContentType} />

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
  );
}
