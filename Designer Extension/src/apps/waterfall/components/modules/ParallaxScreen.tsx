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
import { WaterfallSetting } from '../../waterfall';
import Setting from '../Setting';

export default function ParallaxScreen() {
  const [parallaxValue, setParallaxValue] = useState('');
  const [parallaxXValue, setParallaxXValue] = useState('');
  const [parallaxYValue, setParallaxYValue] = useState('');
  const [parallaxScaleValue, setParallaxScaleValue] = useState('');
  const [parallaxOpacityValue, setParallaxOpacityValue] = useState('');
  const [parallaxDuration, setParallaxDuration] = useState('');

  const handleSubmit = async (attr: string, value: string) => {
    await addAttributeToSelectedElement(attr, value);
  };

  const FIELDS: WaterfallSetting[] = [
    {
      name: 'Parallax',
      attr: ATTR_PARALLAX,
      type: 'string',
      swiperDefault: '',
      description:
        'This attribute may accept: number (px) or percentage (%). Ex: if element has 400px width and data-swiper-parallax="50%" it will be moved ± 200px',
      value: parallaxValue,
      onChange: setParallaxValue,
      onSubmit: () => handleSubmit(ATTR_PARALLAX, parallaxValue),
    },
    {
      name: 'Parallax X',
      attr: ATTR_PARALLAX_X,
      type: 'string',
      swiperDefault: '',
      description: 'Parallax in the x-direction only',
      value: parallaxXValue,
      onChange: setParallaxXValue,
      onSubmit: () => handleSubmit(ATTR_PARALLAX_X, parallaxXValue),
    },
    {
      name: 'Parallax Y',
      attr: ATTR_PARALLAX_Y,
      type: 'string',
      swiperDefault: '',
      description: 'Parallax in the y-direction only',
      value: parallaxYValue,
      onChange: setParallaxYValue,
      onSubmit: () => handleSubmit(ATTR_PARALLAX_Y, parallaxYValue),
    },
    {
      name: 'Parallax Scale',
      attr: ATTR_PARALLAX_SCALE,
      type: 'string',
      swiperDefault: '',
      description: 'Scale ratio of the parallax element when it is in "inactive" (not on active slide) state',
      value: parallaxScaleValue,
      onChange: setParallaxScaleValue,
      onSubmit: () => handleSubmit(ATTR_PARALLAX_SCALE, parallaxScaleValue),
    },
    {
      name: 'Parallax Opacity',
      attr: ATTR_PARALLAX_OPACITY,
      type: 'string',
      swiperDefault: '',
      description: 'Opacity (0.0 - 1.0) of the parallax element when it is in "inactive" (not on active slide) state',
      value: parallaxOpacityValue,
      onChange: setParallaxOpacityValue,
      onSubmit: () => handleSubmit(ATTR_PARALLAX_OPACITY, parallaxOpacityValue),
    },
    {
      name: 'Parallax Duration',
      attr: ATTR_PARALLAX_DURATION,
      type: 'string',
      swiperDefault: '',
      description: 'Custom transition duration for parallax elements',
      value: parallaxDuration,
      onChange: setParallaxDuration,
      onSubmit: () => handleSubmit(ATTR_PARALLAX_DURATION, parallaxDuration),
    },
  ];

  const noopUpdate = () => {};

  return (
    <div className="space-y-5">
      <Caption>
        Add to elements inside the Waterfall to make them parallax. Remember! You need to enable Parallax on the
        Waterfall for this feature to work.
      </Caption>
      {FIELDS.map((field) => (
        <Setting size="lg" key={field.attr} prop={field} update={noopUpdate} />
      ))}
    </div>
  );
}
