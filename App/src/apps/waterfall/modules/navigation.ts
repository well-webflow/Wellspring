import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import NavigationElements from '../components/Nav';

import {
  ATTR_ALLOW_SLIDE_NEXT,
  ATTR_ALLOW_SLIDE_PREV,
  ATTR_NAVIGATION_DISABLED_CLASS,
  ATTR_NAVIGATION_ENABLED,
  ATTR_NAVIGATION_HIDDEN_CLASS,
  ATTR_NAVIGATION_HIDE_ON_CLICK,
  ATTR_NAVIGATION_LOCK_CLASS,
  ATTR_NAVIGATION_NAVIGATION_DISABLED_CLASS,
} from 'well-waterfall';

export default function navigationCategory() {
  let config: WaterfallCategory = {
    name: 'Navigation',
    id: 'nav',
    icon: faArrowsLeftRight,
    summary: 'Add navigation buttons to the slider',
    description: 'Add navigation buttons to the slider',
    component: NavigationElements,
    groups: [
      {
        name: 'Classes',
        id: 'nav-classes',
        items: [
          {
            name: 'Disabled Class',
            attr: ATTR_NAVIGATION_DISABLED_CLASS,
            swiperDefault: 'swiper-button-disabled',
            value: '',
            description: 'CSS class name added to navigation button when it becomes disabled',

            type: 'string',
          },
          {
            name: 'Hidden Class',
            attr: ATTR_NAVIGATION_HIDDEN_CLASS,
            swiperDefault: 'swiper-button-hidden',
            value: '',
            description: 'CSS class name added to navigation button when it becomes hidden',

            type: 'string',
          },
          {
            name: 'Lock Class',
            attr: ATTR_NAVIGATION_LOCK_CLASS,
            swiperDefault: 'swiper-button-lock',
            value: '',
            description: 'CSS class name added to navigation button when it is disabled',

            type: 'string',
          },
          {
            name: 'Navigation Disabled Class',
            attr: ATTR_NAVIGATION_NAVIGATION_DISABLED_CLASS,
            swiperDefault: 'swiper-navigation-disabled',
            value: '',
            description: 'CSS class name added on swiper container when navigation is disabled by breakpoint',

            type: 'string',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Enabled',
        attr: ATTR_NAVIGATION_ENABLED,
        swiperDefault: '',
        value: '',
        description: 'Boolean property to use with breakpoints to enable/disable navigation on certain breakpoints',

        type: 'boolean',
      },
      {
        name: 'Hide on Click',
        attr: ATTR_NAVIGATION_HIDE_ON_CLICK,
        swiperDefault: 'false',
        value: '',
        description: "Toggle navigation buttons visibility after click on Slider's container",

        type: 'boolean',
      },
      {
        name: 'Allow Slide Next',
        attr: ATTR_ALLOW_SLIDE_NEXT,
        swiperDefault: 'true',
        value: '',
        description: 'Set to false to disable swiping to next slide direction (to right or bottom)',

        type: 'boolean',
      },
      {
        name: 'Allow Slide Prev',
        attr: ATTR_ALLOW_SLIDE_PREV,
        swiperDefault: 'true',
        value: '',
        description: 'Set to false to disable swiping to previous slide direction (to left or top)',

        type: 'boolean',
      },
    ],
  };
  return config;
}
