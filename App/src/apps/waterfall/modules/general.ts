import { faBug, faCog, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import { ATTR_DEBUG_MODE, ATTR_ENABLED, ATTR_INIT, ATTR_WATERFALL } from 'well-waterfall';

export default function generalConfig() {
  let config: WaterfallCategory = {
    name: 'General',
    id: 'general',
    icon: faCog,
    description: 'Basic settings for all sliders',
    summary: 'Basic settings for all sliders',
    groups: [
      {
        name: 'Enable/Disable (Advanced)',
        id: 'enable-advanced',
        items: [
          {
            name: 'Enabled',
            attr: ATTR_ENABLED,
            swiperDefault: 'true',
            value: '',
            description:
              "Whether Swiper initially enabled. When Swiper is disabled, it will hide all navigation elements and won't respond to any events and interactions",

            type: 'boolean',
          },
          {
            name: 'Init',
            attr: ATTR_INIT,
            swiperDefault: 'true',
            value: '',
            description:
              'Whether Swiper should be initialised automatically when you create an instance. If disabled, then you need to init it manually by calling swiper.init()',

            type: 'boolean',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Waterfall Name',
        attr: ATTR_WATERFALL,
        swiperDefault: '-',
        value: 'New Waterfall',
        description: 'The name of the waterfall',

        icon: faNoteSticky,
        type: 'string',
      },
      {
        name: 'Debug',
        attr: ATTR_DEBUG_MODE,
        swiperDefault: 'false',
        value: '',
        description: 'Prints out debug statements to the browser console',

        icon: faBug,
        type: 'boolean',
      },
    ],
  };

  return config;
}
