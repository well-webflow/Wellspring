import { useEffect, useState } from 'react';
import { Select } from '../../../components/Input';
import { StickyNavigation } from '../components/Navigation';
import { Caption, Heading } from '../../../components/Typography';
import Button from '../../../components/Button';
import { setAttribute } from '../../../utils/webflowHelpers';

import { ATTR_MANIPULATION_ADD_SLIDE } from 'well-waterfall/src/lib/attributes';
import { useWaterfall } from '../hooks/WaterfallContext';
import SelectedElement from '../../../components/SelectedElement';
import { useWebflow } from '../../../context/webflowContext';

export default function ManipulationView() {
  const { waterfallNames } = useWaterfall();
  const { elementSelected, elementInfo } = useWebflow();
  const [selectedWaterfall, setSelectedWaterfall] = useState<string | null>(null);

  async function submitAddSlide() {
    const el = await webflow.getSelectedElement();
    if (!el) return;

    setAttribute(el, ATTR_MANIPULATION_ADD_SLIDE, selectedWaterfall);

    webflow.notify({ type: 'Success', message: `Set Element to add to ${selectedWaterfall} during runtime.` });
  }

  function onWaterfallSelectChange(e: any) {
    setSelectedWaterfall(e.target.value);
  }

  useEffect(() => {
    setSelectedWaterfall(waterfallNames[0]);
  }, [elementSelected]);

  return (
    <>
      <StickyNavigation onGoBack={() => {}}>
        <Heading level={4}>Manipulation</Heading>
      </StickyNavigation>
      <div className="p-3 space-y-4">
        <div className="space-y-1">
          <Heading level={3}>Add Element to Waterfall</Heading>
          <Caption>Set this element to add as a slide to a Waterfall during runtime.</Caption>
        </div>
        <div className="space-y-1">
          <Heading level={4}>Add Selected Element:</Heading>
          <SelectedElement el={elementInfo} />
        </div>
        <div className="space-y-1">
          <Heading level={4}>To Waterfall:</Heading>
          <Select onChange={(e) => onWaterfallSelectChange(e)} type="select" options={waterfallNames}></Select>
        </div>
        <div className="space-y-1">
          <Heading level={4}>With Method:</Heading>
          <Select options={['append', 'prepend', 'add']} type="select"></Select>
        </div>
        <Button onClick={submitAddSlide}>Convert</Button>
      </div>
    </>
  );
}
