import { useEffect } from 'react';
import { Heading } from '../../../components/Typography';
import Card from '../../../components/UI/Card';
import { WaterfallCode } from '../components/WaterfallCode';
import { useWaterfall } from '../hooks/WaterfallContext';

export default function SetupView() {
  const { setMode } = useWaterfall();
  useEffect(() => {
    setMode('view');
  });

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <img src="../public/brand/waterfall.png" width={36} className="relative top-[-3px] rounded-sm"></img>
        <Heading level={1}>Waterfall</Heading>
      </div>
      <p className="text-sm text-text2 mb-5">
        Waterfall is a Javascript library for Webflow that enables developers to build sliders based on SwiperJS with
        attributes. The Wellflow app also helps create, edit, and manage Waterfalls with an easy to use interface with
        full documentation.
      </p>
      <Card>
        {/* <WaterfallCode /> */}
        <WaterfallCode version="1.2.4" />
      </Card>
    </div>
  );
}
