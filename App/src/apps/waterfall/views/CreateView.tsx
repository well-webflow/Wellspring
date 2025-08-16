import { Heading, Paragraph } from '../../../components/Typography';
import Button from '../../../components/UI/Button';
import Card from '../../../components/UI/Card';
import { useWebflow } from '../../../context/webflowContext';
import { useWaterfall } from '../hooks/WaterfallContext';

export default function CreateView() {
  const { createWaterfall } = useWaterfall();
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
    <div className="grid grid-cols-2 gap-4 items-stretch justify-stretch w-full h-80">
      <button onClick={() => createWaterfall('cms')} className="cursor-pointer relative group">
        <img
          src="/images/waterfall.jpg"
          className="transition-all duration-300 opacity-0 group-hover:opacity-100 z-0 absolute w-full h-full object-cover"
        />
        <div className="relative z-20 flex items-center justify-center h-full">
          <Button size="lg">Create CMS Waterfall</Button>
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 group-hover:opacity-0 z-10"></div>
        </div>
      </button>
      <button onClick={() => createWaterfall('static')} className="cursor-pointer relative group">
        <img
          src="/images/waterfall.jpg"
          className="transition-all duration-300 opacity-0 group-hover:opacity-100 z-0 absolute w-full h-full object-cover"
        />
        <div className="relative z-20 flex items-center justify-center h-full">
          <Button size="lg">Create Static Waterfall</Button>
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 group-hover:opacity-0 z-10"></div>
        </div>
      </button>
    </div>
  );
}
