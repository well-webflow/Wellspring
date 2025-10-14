import { useEffect, useState } from 'react';
import { useWebflow } from '../../../../context/webflowContext';
import { useWaterfall } from '../../hooks/WaterfallContext';
import Button from '../../../../components/UI/Button';
import { setAttribute } from '../../../../utils/webflowHelpers';
import { Select } from '../../../../components/UI/Select';

import { ATTR_MANIPULATION_PREPEND_SLIDE, ATTR_MANIPULATION_APPEND_SLIDE } from 'well-waterfall';
import SelectedElement from '../../../../components/SelectedElement';
import { Caption, Heading } from '../../../../components/Typography';

// FIXME The 'Add' method is currently broken, Swiper seems to add it as a string, instead of parsing the outerHTML.

type ManipulationMethod = 'append' | 'prepend';

export default function ManipulationScreen() {
  const { elementSelected } = useWebflow();
  const { waterfallNames } = useWaterfall();

  const [selectedWaterfall, setSelectedWaterfall] = useState<string | null>(null);
  const [manipulationMethod, setManipulationMethod] = useState<ManipulationMethod>('append');

  useEffect(() => {
    console.log(waterfallNames);
    setSelectedWaterfall(waterfallNames[0]);
  }, [elementSelected]);

  async function submit() {
    const el = await webflow.getSelectedElement();
    if (!el) return;

    if (manipulationMethod === 'prepend') setAttribute(el, ATTR_MANIPULATION_PREPEND_SLIDE, selectedWaterfall);
    else if (manipulationMethod === 'append') setAttribute(el, ATTR_MANIPULATION_APPEND_SLIDE, selectedWaterfall);

    webflow.notify({ type: 'Success', message: `Set Element to add to ${selectedWaterfall} during runtime.` });
  }

  function onWaterfallSelectChange(e: any) {
    setSelectedWaterfall(e.target.value);
  }

  function onMethodChange(e: any) {
    let method = e.target.value;
    setManipulationMethod(method);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Heading level={3}>Add Element to Waterfall</Heading>
        <Caption>Set this element to add as a slide to a Waterfall during runtime.</Caption>
      </div>
      <div className="space-y-1">
        <Heading level={4}>Add Selected Element:</Heading>
        <SelectedElement />
      </div>
      <div className="space-y-1">
        <Heading level={4}>To Waterfall:</Heading>
        <Select onChange={(e) => onWaterfallSelectChange(e)} type="select" options={waterfallNames}></Select>
      </div>
      <div className="space-y-1">
        <Heading level={4}>With Method:</Heading>
        <Select onChange={(e) => onMethodChange(e)} options={['append', 'prepend']} type="select"></Select>
      </div>
      <Button size="sm" onClick={submit}>
        Convert
      </Button>
    </div>
  );
}
