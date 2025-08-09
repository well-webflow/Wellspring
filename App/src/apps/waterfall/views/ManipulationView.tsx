import { useEffect, useState } from 'react';
import { Select } from '../../../components/Input';
import { StickyNavigation } from '../components/Navigation';
import { Caption, Heading } from '../../../components/Typography';
import SelectedElement, { SelectedElementInfo } from '../../../components/SelectedElement';
import Button from '../../../components/Button';
import { setAttribute } from '../../../utils/webflowHelpers';

import { ATTR_MANIPULATION_ADD_SLIDE } from 'well-waterfall/src/lib/attributes';
import { useWaterfall } from '../hooks/WaterfallContext';

export default function ManipulationView() {
  const { waterfallNames, elementSelected } = useWaterfall();
  const [elementInfo, setElementInfo] = useState<SelectedElementInfo | null>(null);
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
    async function displaySelectedElement() {
      const t = elementSelected?.type || 'Unknown';
      if (elementSelected && elementSelected.styles) {
        const styles = await elementSelected.getStyles();

        const styleDetails = (
          await Promise.all(
            styles?.map(async (style) => {
              if (!style) return null;
              const styleName = await style.getName();
              return styleName;
            }) ?? []
          )
        ).filter((name): name is string => !!name); // <- This ensures string[]

        console.log('Resolved style details:', styleDetails);
        setElementInfo({ type: t, classes: styleDetails });
      }
    }

    displaySelectedElement();
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
        <Button onClick={submitAddSlide}>Convert</Button>
      </div>
    </>
  );
}
