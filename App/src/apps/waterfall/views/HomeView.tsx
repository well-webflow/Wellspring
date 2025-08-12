import { Heading, Paragraph } from '../../../components/Typography';
import { useEffect } from 'react';
import Card from '../../../components/Card';
import { useWaterfall } from '../hooks/WaterfallContext';
import { useWebflow } from '../../../context/webflowContext';

export default function InitializationView() {
  const { createWaterfall, waterfalls, searchForWaterfalls } = useWaterfall();
  const { elementSelected } = useWebflow();

  useEffect(() => {
    webflow.setExtensionSize('comfortable');
    searchForWaterfalls();
  });

  return (
    <div>
      <div className="p-3 h-full">
        <div className="mb-5">
          <Heading level={1} className="text-5xl text-primary font-bold font-brand">
            Waterfall
          </Heading>
          <p className="text-sm">
            Waterfall is a wrapper around SwiperJS (11.1.14) that allows for full swiper customization using attributes
            with a sensible builder.
          </p>
        </div>
        {elementSelected ? (
          <div className="flex flex-col gap-4 items-stretch justify-stretch w-full">
            <Card href="/waterfall/search" disabled={waterfalls.length <= 0}>
              <Heading level={4}>Edit Waterfall</Heading>
            </Card>
            <Card onClick={() => createWaterfall('cms')}>
              <Heading level={4}>Create CMS Waterfall</Heading>
            </Card>
            <Card onClick={() => createWaterfall('static')}>
              <Heading level={4}>Create Waterfall</Heading>
            </Card>
          </div>
        ) : (
          <Card>
            <Heading level={2}>Select An Element</Heading>
            <Paragraph size="sm" className="text-text3 mb-0">
              Please select an <span className="text-primary">Element</span> to begin.
            </Paragraph>
          </Card>
        )}
      </div>
    </div>
  );
}
