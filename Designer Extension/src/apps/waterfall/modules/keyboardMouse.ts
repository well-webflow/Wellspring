import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import { ATTR_KEYBOARD_ENABLED, ATTR_KEYBOARD_ONLY_IN_VIEWPORT, ATTR_KEYBOARD_PAGE_UP_DOWN } from 'well-waterfall';
import {
  ATTR_MOUSE_ENABLED,
  ATTR_MOUSE_EVENTS_TARGET,
  ATTR_MOUSE_FORCE_TO_AXIS,
  ATTR_MOUSE_INVERT,
  ATTR_MOUSE_NO_MOUSE_WHEEL_CLASS,
  ATTR_MOUSE_RELEASE_ON_EDGES,
  ATTR_MOUSE_SENSITIVITY,
  ATTR_MOUSE_THRESHOLD_DELTA,
  ATTR_MOUSE_THRESHOLD_TIME,
} from 'well-waterfall';

export default function keyboardMouseCategory() {
  let config: WaterfallCategory = {
    name: 'Keyboard & Mouse',
    id: 'keyboard-mouse',
    icon: faKeyboard,
    summary: 'Control how the swiper is navigated with the keyboard and mouse',
    description: 'Control how the swiper is navigated with the keyboard and mouse',
    groups: [
      {
        name: 'Keyboard',
        id: 'keyboard',
        items: [
          {
            name: 'Enabled',
            attr: ATTR_KEYBOARD_ENABLED,
            swiperDefault: 'false',
            description: 'Set to true to enable keyboard control',
            value: '',

            type: 'boolean',
          },
          {
            name: 'Only In Viewport',
            attr: ATTR_KEYBOARD_ONLY_IN_VIEWPORT,
            swiperDefault: 'true',
            description: 'When enabled it will control sliders that are currently in viewport',
            value: '',

            type: 'boolean',
          },
          {
            name: 'Page Up Down',
            attr: ATTR_KEYBOARD_PAGE_UP_DOWN,
            swiperDefault: 'true',
            description: 'When enabled it will enable keyboard navigation by Page Up and Page Down keys',
            value: '',

            type: 'boolean',
          },
        ],
      },
      {
        name: 'Mousewheel',
        id: 'mousewheel',
        items: [
          {
            name: 'Mouse Enabled',
            attr: ATTR_MOUSE_ENABLED,
            swiperDefault: 'false',
            description: 'Set to true to enable mousewheel control',
            type: 'boolean',
            value: '',
          },
          {
            name: 'Events Target',
            attr: ATTR_MOUSE_EVENTS_TARGET,
            swiperDefault: 'container',
            description:
              'String with CSS selector or HTML element of the container accepting mousewheel events. By default it is swiper',
            value: '',

            type: 'string',
          },
          {
            name: 'Force to Axis',
            attr: ATTR_MOUSE_FORCE_TO_AXIS,
            swiperDefault: 'false',
            description:
              'Set to true to force mousewheel swipes to axis. So in horizontal mode mousewheel will work only with horizontal mousewheel scrolling, and only with vertical scrolling in vertical mode.',
            value: '',
            type: 'boolean',
          },
          {
            name: 'Invert',
            attr: ATTR_MOUSE_INVERT,
            swiperDefault: 'false',
            description: 'Set to true to invert sliding direction',
            value: '',
            type: 'boolean',
          },
          {
            name: 'No Mousewheel Class',
            attr: ATTR_MOUSE_NO_MOUSE_WHEEL_CLASS,
            swiperDefault: 'swiper-no-mousewheel',
            description: 'Scrolling on elements with this class will be ignored',
            value: '',

            type: 'string',
          },
          {
            name: 'Release on Edges',
            attr: ATTR_MOUSE_RELEASE_ON_EDGES,
            swiperDefault: 'false',
            description:
              'Set to true and swiper will release mousewheel event and allow page scrolling when swiper is on edge positions (in the beginning or in the end)',
            value: '',
            type: 'boolean',
          },
          {
            name: 'Sensitivity',
            attr: ATTR_MOUSE_SENSITIVITY,
            swiperDefault: '1',
            description: 'Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity',
            value: '',

            type: 'number',
          },
          {
            name: 'Threshold Delta',
            attr: ATTR_MOUSE_THRESHOLD_DELTA,
            swiperDefault: 'null',
            description: 'Minimum mousewheel scroll delta to trigger swiper slide change',
            value: '',

            type: 'number',
          },
          {
            name: 'Threshold Time',
            attr: ATTR_MOUSE_THRESHOLD_TIME,
            swiperDefault: 'null',
            description: 'Minimum mousewheel scroll time delta (in ms) to trigger swiper slide change',
            value: '',

            type: 'number',
          },
        ],
      },
    ],
  };
  return config;
}
