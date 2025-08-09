import { faEye } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_OBSERVE_SLIDE_CHILDREN,
  ATTR_OBSERVE_SLIDE_PARENTS,
  ATTR_OBSERVER,
  ATTR_RESIZE_OBSERVER,
  ATTR_UPDATE_ON_WINDOW_RESIZE,
  ATTR_WATCH_OVERFLOW,
  ATTR_WATCH_SLIDES_PROGRESS,
} from 'well-waterfall/src/lib/attributes';

export default function ObserverCategory() {
  let config: WaterfallCategory = {
    name: 'Observer',
    id: 'observer',
    icon: faEye,
    summary: 'Observe updates to the Waterfall.',
    description:
      'Observe updates and mutations to the Waterfall. SwiperJS will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)',
    items: [
      {
        name: 'Observer',
        attr: ATTR_OBSERVER,
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true to enable Mutation Observer on Swiper and its elements. In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)',

        type: 'boolean',
      },
      {
        name: 'Observe Slide Parents',
        attr: ATTR_OBSERVE_SLIDE_PARENTS,
        swiperDefault: 'false',
        value: '',
        description: 'Set to true if you also need to watch Mutations for Swiper parent elements',

        type: 'boolean',
      },
      {
        name: 'Observe Slide Children',
        attr: ATTR_OBSERVE_SLIDE_CHILDREN,
        swiperDefault: 'false',
        value: '',
        description: 'Set to true if you also need to watch Mutations for Swiper slide children elements',

        type: 'boolean',
      },
      {
        name: 'Resize Observer',
        attr: ATTR_RESIZE_OBSERVER,
        swiperDefault: 'true',
        value: '',
        description:
          'When enabled it will use ResizeObserver (if supported by browser) on swiper container to detect container resize (instead of watching for window resize)',

        type: 'boolean',
      },
      {
        name: 'Update on Window Resize',
        attr: ATTR_UPDATE_ON_WINDOW_RESIZE,
        swiperDefault: 'true',
        value: '',
        description: 'Swiper will recalculate slides position on window resize (orientationchange)',

        type: 'boolean',
      },
      {
        name: 'Watch Overflow',
        attr: ATTR_WATCH_OVERFLOW,
        swiperDefault: 'true',
        value: '',
        description:
          'When enabled Swiper will be disabled and hide navigation buttons on case there are not enough slides for sliding.',

        type: 'boolean',
      },
      {
        name: 'Watch Slides Progress',
        attr: ATTR_WATCH_SLIDES_PROGRESS,
        swiperDefault: 'false',
        value: '',
        description:
          'Enable this feature to calculate each slides progress and visibility (slides in viewport will have additional visible class)',

        type: 'boolean',
      },
    ],
  };
  return config;
}
