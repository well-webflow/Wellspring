import { useWaterfall } from '../../context/WaterfallContext';
import { Heading, Paragraph } from '../../components/Typography';
import { useEffect } from 'react';
import Card from '../../components/Card';

export default function InitializationView() {
  const { createWaterfall, createWaterfallCMS, elementSelected, waterfalls, searchForWaterfalls } = useWaterfall();

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
              <Paragraph size="sm" className="text-text2 mb-0">
                Modify an existing Waterfall on this page
              </Paragraph>
            </Card>
            <Card onClick={createWaterfallCMS}>
              <Heading level={4}>Create CMS Waterfall</Heading>
              <Paragraph size="sm" className="text-text2 mb-0">
                Add a waterfall ready to be connected to a CMS List
              </Paragraph>
            </Card>
            <Card onClick={createWaterfall}>
              <Heading level={4}>Create Waterfall</Heading>
              <Paragraph size="sm" className="text-text2 mb-0">
                Add a waterfall with static slides
              </Paragraph>
            </Card>
            <Card href="/waterfall/create">
              <Heading level={4}>Create Waterfall Elements</Heading>
              <Paragraph size="sm" className="text-text2 mb-0">
                Add elements like scrollbar, navigation, pagination
              </Paragraph>
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
