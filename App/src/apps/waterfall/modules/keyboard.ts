import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_KEYBOARD_ENABLED,
  ATTR_KEYBOARD_ONLY_IN_VIEWPORT,
  ATTR_KEYBOARD_PAGE_UP_DOWN,
} from 'well-waterfall/src/lib/attributes';

export default function keyboardCategory() {
  let config: WaterfallCategory = {
    name: 'Keyboard',
    id: 'keyboard',
    icon: faKeyboard,
    summary: 'Allow the swiper to be navigated via the keyboard',
    description: 'Allow the swiper to be navigated via the keyboard',
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
  };
  return config;
}
