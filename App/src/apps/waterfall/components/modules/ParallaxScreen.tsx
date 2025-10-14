import { useState } from 'react';
import {
  ATTR_PARALLAX,
  ATTR_PARALLAX_DURATION,
  ATTR_PARALLAX_OPACITY,
  ATTR_PARALLAX_SCALE,
  ATTR_PARALLAX_X,
  ATTR_PARALLAX_Y,
} from 'well-waterfall';
import { addAttributeToSelectedElement } from '../../lib/waterfallElements';
import { Caption } from '../../../../components/Typography';
import SelectedElement from '../../../../components/SelectedElement';
import { GenericSetting } from '../UI/GenericSetting';
import Tooltip from '../../../../components/UI/Tooltip';
import { InputWithButton } from '../../../../components/UI/Input';

type ParallaxField = {
  label: string;
  description: string;
  tooltip: string;
  attr: string;
  size?: 'sm' | 'md' | 'lg';
};

const FIELDS: ParallaxField[] = [
  {
    label: 'Parallax',
    description: ATTR_PARALLAX,
    tooltip:
      'This attribute may accept: number (px) or percentage (%). Ex: if element has 400px width and data-swiper-parallax="50%" it will be moved ± 200px',
    attr: ATTR_PARALLAX,
  },
  {
    label: 'Parallax X',
    description: ATTR_PARALLAX_X,
    tooltip: 'Parallax in the x-direction only',
    attr: ATTR_PARALLAX_X,
  },
  {
    label: 'Parallax Y',
    description: ATTR_PARALLAX_Y,
    tooltip: 'Parallax in the y-direction only',
    attr: ATTR_PARALLAX_Y,
  },
  {
    label: 'Parallax Scale',
    description: ATTR_PARALLAX_SCALE,
    tooltip: 'Scale ratio of the parallax element when it is in "inactive" (not on active slide) state',
    attr: ATTR_PARALLAX_SCALE,
  },
  {
    label: 'Parallax Opacity',
    description: ATTR_PARALLAX_OPACITY,
    tooltip: 'Opacity (0.0 - 1.0) of the parallax element when it is in "inactive" (not on active slide) state',
    attr: ATTR_PARALLAX_OPACITY,
  },
  {
    label: 'Parallax Duration',
    description: ATTR_PARALLAX_DURATION,
    tooltip: 'Custom transition duration for parallax elements',
    attr: ATTR_PARALLAX_DURATION,
  },
];

export default function ParallaxScreen() {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (attr: string, val: string) => {
    setValues((prev) => ({ ...prev, [attr]: val }));
  };

  const handleSubmit = async (attr: string) => {
    const value = values[attr];
    if (!value) return;
    await addAttributeToSelectedElement(attr, value);
  };

  return (
    <div className="space-y-5">
      <Caption>Reminder! You need to enable Parallax on the Waterfall for this feature to work.</Caption>
      <div>
        Add Parallax to Selected: <SelectedElement />
      </div>

      {FIELDS.map(({ label, description, tooltip, attr }) => (
        <GenericSetting
          key={attr}
          header={
            <div className="flex flex-row gap-2">
              <label>{label}</label>
              <Tooltip content={tooltip} />
            </div>
          }
          description={description}
          input={
            <InputWithButton
              inputSize="lg"
              onChange={(e) => handleChange(attr, e.target.value)}
              buttonText="Submit"
              onButtonClick={() => handleSubmit(attr)}
            />
          }
        />
      ))}
    </div>
  );
}
