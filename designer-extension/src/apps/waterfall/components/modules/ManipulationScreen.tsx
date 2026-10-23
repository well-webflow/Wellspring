import { useEffect, useState } from 'react';
import { useWaterfall } from '../../hooks/WaterfallContext';
import Button from '../../../../components/UI/Button';
import { setAttribute } from '../../../../utils/webflowHelpers';
import { Select } from '../../../../components/UI/Select';
import { Input } from '../../../../components/UI/Input';

import {
  ATTR_MANIPULATION_PREPEND_SLIDE,
  ATTR_MANIPULATION_APPEND_SLIDE,
  ATTR_MANIPULATION_ADD_SLIDE,
  ATTR_MANIPULATION_ADD_INDEX,
  ATTR_MANIPULATION_REMOVE_SLIDE,
  ATTR_MANIPULATION_REMOVE_INDEX,
} from 'well-waterfall';
import SelectedElement from '../../../../components/SelectedElement';

type ManipulationMethod = 'append' | 'prepend' | 'add' | 'remove';

export default function ManipulationScreen() {
  const { waterfallNames, searchForWaterfalls } = useWaterfall();

  const [selectedWaterfall, setSelectedWaterfall] = useState<string | null>(null);
  const [manipulationMethod, setManipulationMethod] = useState<ManipulationMethod>('add');
  const [index, setIndex] = useState<string>('0');

  useEffect(() => {
    searchForWaterfalls();
  }, [searchForWaterfalls]);

  useEffect(() => {
    if (waterfallNames.length > 0) {
      setSelectedWaterfall(waterfallNames[0]);
    }
  }, [waterfallNames]);

  async function submit() {
    const el = await webflow.getSelectedElement();
    if (!el) return;

    if (manipulationMethod === 'prepend') {
      setAttribute(el, ATTR_MANIPULATION_PREPEND_SLIDE, selectedWaterfall);
    } else if (manipulationMethod === 'append') {
      setAttribute(el, ATTR_MANIPULATION_APPEND_SLIDE, selectedWaterfall);
    } else if (manipulationMethod === 'add') {
      setAttribute(el, ATTR_MANIPULATION_ADD_SLIDE, selectedWaterfall);
      setAttribute(el, ATTR_MANIPULATION_ADD_INDEX, index);
    } else if (manipulationMethod === 'remove') {
      setAttribute(el, ATTR_MANIPULATION_REMOVE_SLIDE, selectedWaterfall);
      setAttribute(el, ATTR_MANIPULATION_REMOVE_INDEX, index);
    }

    webflow.notify({ type: 'Success', message: `Set Element to add to ${selectedWaterfall} during runtime.` });
  }

  function onWaterfallSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedWaterfall(e.target.value);
  }

  function onMethodChange(e: React.ChangeEvent<HTMLSelectElement>) {
    let method = e.target.value as ManipulationMethod;
    setManipulationMethod(method);
  }

  function onIndexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIndex(e.target.value);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-1 items-center">
        <Select
          onChange={(e) => onMethodChange(e)}
          options={['add', 'append', 'prepend', 'remove']}
          type="select"
          autoSize
        />
        <SelectedElement />
        <div className="px-1">to</div>
        <Select onChange={(e) => onWaterfallSelectChange(e)} type="select" options={waterfallNames} autoSize></Select>
        {(manipulationMethod === 'add' || manipulationMethod === 'remove') && (
          <>
            <div>at index</div>
            <Input type="number" value={index} onChange={onIndexChange} min="0" />
          </>
        )}
      </div>
      <Button size="sm" onClick={submit}>
        Convert
      </Button>
    </div>
  );
}
