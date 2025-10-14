import { Heading, Paragraph } from '../../../components/Typography';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { useWebflow } from '../../../context/webflowContext';
import ParallaxScreen from '../components/modules/ParallaxScreen';
import {
  convertElementToNextButton,
  convertElementToPaginationBullet,
  convertElementToPaginationBulletActive,
  convertElementToPaginationContainer,
  convertElementToPrevButton,
  convertElementToScrollbarContainer,
  convertElementToScrollbarDrag,
  convertElementToSlideCount,
  createNavigation,
  createPagination,
  createScrollbar,
} from '../lib/waterfallElements';

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
    <>
      <div>
        <Heading level={3} className="">
          Pagination
        </Heading>
        <Button onClick={() => createPagination()} size="lg" className="mt-4 w-full">
          Create Pagination
        </Button>
        <Button onClick={() => convertElementToPaginationBullet()} size="lg" className="mt-4 w-full">
          Convert to Pagination Bullet
        </Button>
        <Button onClick={() => convertElementToPaginationBulletActive()} size="lg" className="mt-4 w-full">
          Convert to Pagination Bullet Active
        </Button>
        <Button onClick={() => convertElementToPaginationContainer()} size="lg" className="mt-4 w-full">
          Convert to Pagination Container
        </Button>
      </div>
      <div>
        <Heading level={3} className="mt-8">
          Navigation
        </Heading>
        <Button onClick={() => createNavigation()} size="lg" className="mt-4 w-full">
          Create Navigation
        </Button>
        <Button onClick={() => convertElementToNextButton()} size="lg" className="mt-4 w-full">
          Convert to Next Button
        </Button>
        <Button onClick={() => convertElementToPrevButton()} size="lg" className="mt-4 w-full">
          Convert to Prev Button
        </Button>
      </div>
      <div>
        <Heading level={3} className="mt-8">
          Scrollbar
        </Heading>
        <Button onClick={() => createScrollbar()} size="lg" className="mt-4 w-full">
          Create Scrollbar
        </Button>
        <Button onClick={() => convertElementToScrollbarContainer()} size="lg" className="mt-4 w-full">
          Convert to Scrollbar Container
        </Button>
        <Button onClick={() => convertElementToScrollbarDrag()} size="lg" className="mt-4 w-full">
          Convert to Scrollbar Drag
        </Button>
      </div>
      <div>
        <Heading level={3} className="mt-8">
          Slide Count
        </Heading>
        <Button onClick={() => convertElementToSlideCount()} size="lg" className="mt-4 w-full">
          Convert to Slide Count
        </Button>
      </div>
      <div>
        <Heading level={3} className="mt-8">
          Parallax
        </Heading>
        <ParallaxScreen />
      </div>
    </>
  );
}
