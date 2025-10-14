import { Heading, Paragraph } from '../../../components/Typography';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { useWebflow } from '../../../context/webflowContext';
import ParallaxScreen from '../components/modules/ParallaxScreen';
import { convertElementToSlideCount } from '../lib/waterfallElements';
import PaginationScreen from '../components/modules/PaginationScreen';
import NavigationScreen from '../components/modules/NavigationScreen';
import ScrollbarScreen from '../components/modules/ScrollbarScreen';

export default function CreateView() {
  const { elementSelected } = useWebflow();

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
    <div className="p-3 flex-1 overflow-y-auto space-y-4">
      <div>
        <Heading level={3} className="mb-3">
          Pagination
        </Heading>
        <PaginationScreen />
      </div>
      <div>
        <Heading level={3} className="mt-8 mb-3">
          Navigation
        </Heading>
        <NavigationScreen />
      </div>
      <div>
        <Heading level={3} className="mt-8 mb-3">
          Scrollbar
        </Heading>
        <ScrollbarScreen />
      </div>
      <div>
        <Heading level={3} className="mt-8 mb-3">
          Slide Count
        </Heading>
        <Button onClick={() => convertElementToSlideCount()} size="lg" className="mt-4 w-full">
          Convert to Slide Count
        </Button>
      </div>
      <div>
        <Heading level={3} className="mt-8 mb-3">
          Parallax
        </Heading>
        <ParallaxScreen />
      </div>
    </div>
  );
}
