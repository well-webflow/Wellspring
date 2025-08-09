import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import { ATTR_CONTROLLER, ATTR_CONTROLLER_BY, ATTR_CONTROLLER_INVERSE } from 'well-waterfall/src/lib/attributes';

export default function controllerCategory() {
  let config: WaterfallCategory = {
    name: 'Controller',
    id: 'controller',
    icon: faGamepad,
    summary: 'Make another Waterfall controlled by this one',
    items: [
      {
        name: 'Control',
        attr: ATTR_CONTROLLER,
        swiperDefault: '--',
        description:
          'Pass here another Swiper instance or array with Swiper instances that should be controlled by this Swiper. Also accepts string with CSS selector of Swiper element, or HTMLElement of Swiper element',
        value: '',
        type: 'waterfall',
      },
      {
        name: 'By',
        attr: ATTR_CONTROLLER_BY,
        swiperDefault: 'slide',
        description:
          "Defines a way how to control another slider: slide by slide (with respect to other slider's grid) or depending on all slides/container (depending on total slider percentage).",
        options: ['slide', 'container'],
        value: '',

        type: 'select',
      },
      {
        name: 'Inverse',
        attr: ATTR_CONTROLLER_INVERSE,
        swiperDefault: 'false',
        description: 'Set to true and controlling will be in inverse direction',
        value: '',
        type: 'boolean',
      },
    ],
  };
  return config;
}
