import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_SCROLLBAR_DRAG_SIZE,
  ATTR_SCROLLBAR_DRAGGABLE,
  ATTR_SCROLLBAR_ENABLED,
  ATTR_SCROLLBAR_HIDE,
  ATTR_SCROLLBAR_HORIZONTAL_CLASS,
  ATTR_SCROLLBAR_LOCK_CLASS,
  ATTR_SCROLLBAR_SCROLLBAR_DISABLED_CLASS,
  ATTR_SCROLLBAR_SNAP_ON_RELEASE,
  ATTR_SCROLLBAR_VERTICAL_CLASS,
} from 'well-waterfall';
import ScrollbarScreen from '../components/Scrollbar';

export default function scrollbarCategory() {
  let config: WaterfallCategory = {
    name: 'Scrollbar',
    id: 'scrollbar',
    icon: faBarsProgress,
    summary: 'Add a scrollbar to the slider',
    description: 'Add a scrollbar to the slider',
    component: ScrollbarScreen,
    groups: [
      {
        name: 'Class Names',
        id: 'scroll-classes',
        items: [
          {
            name: 'Horizontal Class',
            attr: ATTR_SCROLLBAR_HORIZONTAL_CLASS,
            swiperDefault: 'swiper-scrollbar-horizontal',
            value: '',
            type: 'string',
            description: 'CSS class name set to scrollbar in horizontal Swiper',
          },
          {
            name: 'Lock Class',
            attr: ATTR_SCROLLBAR_LOCK_CLASS,
            swiperDefault: 'swiper-scrollbar-lock',
            value: '',
            type: 'string',
            description: 'Scrollbar element additional CSS class when it is disabled',
          },
          {
            name: 'Scrollbar Disabled Class',
            attr: ATTR_SCROLLBAR_SCROLLBAR_DISABLED_CLASS,
            swiperDefault: 'swiper-scrollbar-disabled',
            value: '',
            description:
              'CSS class name added on swiper container and scrollbar element when scrollbar is disabled by breakpoint',

            type: 'string',
          },
          {
            name: 'Vertical Class',
            attr: ATTR_SCROLLBAR_VERTICAL_CLASS,
            swiperDefault: 'swiper-scrollbar-vertical',
            value: '',
            description: 'CSS class name set to scrollbar in vertical Swiper',

            type: 'string',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Drag Size',
        attr: ATTR_SCROLLBAR_DRAG_SIZE,
        swiperDefault: 'auto',
        value: '',
        description: 'Size of scrollbar draggable element in px',

        type: 'string',
      },
      {
        name: 'Draggable',
        attr: ATTR_SCROLLBAR_DRAGGABLE,
        swiperDefault: 'false',
        value: '',
        type: 'boolean',
        description: 'Set to true to enable make scrollbar draggable that allows you to control slider position',
      },
      {
        name: 'Enabled',
        attr: ATTR_SCROLLBAR_ENABLED,
        swiperDefault: '',
        value: '',
        type: 'boolean',
        description: 'Boolean property to use with breakpoints to enable/disable scrollbar on certain breakpoints',
      },
      {
        name: 'Hide',
        attr: ATTR_SCROLLBAR_HIDE,
        swiperDefault: 'true',
        value: '',
        type: 'boolean',
        description: '(Not Working) Set to true to hide scrollbar automatically after user interaction',
      },
      {
        name: 'Snap on Release',
        attr: ATTR_SCROLLBAR_SNAP_ON_RELEASE,
        swiperDefault: 'false', // the documentation says default is false but is actually true lmao
        value: '',
        type: 'boolean',
        description: 'Set to true to snap slider position to slides when you release scrollbar',
      },
    ],
  };
  return config;
}
