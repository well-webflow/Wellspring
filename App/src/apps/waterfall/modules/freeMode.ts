import { faRoadSpikes } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_FREE_MODE_ENABLED,
  ATTR_FREE_MODE_MINIMUM_VELOCITY,
  ATTR_FREE_MODE_MOMENTUM,
  ATTR_FREE_MODE_MOMENTUM_BOUNCE,
  ATTR_FREE_MODE_MOMENTUM_BOUNCE_RATIO,
  ATTR_FREE_MODE_MOMENTUM_RATIO,
  ATTR_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
  ATTR_FREE_MODE_STICKY,
} from 'well-waterfall';

export default function freemodeCategory() {
  let config: WaterfallCategory = {
    name: 'Free Mode',
    id: 'free-mode',
    icon: faRoadSpikes,
    summary: 'Allow users to swipe the slider freely with swipes',
    description: 'Allow users to swipe the slider freely with swipes',
    items: [
      {
        name: 'Enabled',
        attr: ATTR_FREE_MODE_ENABLED,
        swiperDefault: 'false',
        value: '',
        description: "If 'true', users have full control over the slider with swipes",

        type: 'boolean',
      },
      {
        name: 'Minimum Velocity',
        attr: ATTR_FREE_MODE_MINIMUM_VELOCITY,
        swiperDefault: '0.02',
        value: '',
        description: 'Minimum touchmove-velocity required to trigger free mode momentum',

        type: 'number',
      },
      {
        name: 'Momentum',
        attr: ATTR_FREE_MODE_MOMENTUM,
        swiperDefault: 'true',
        value: '',
        description: 'If enabled, then slide will keep moving for a while after you release it',

        type: 'boolean',
      },
      {
        name: 'Momentum Ratio',
        attr: ATTR_FREE_MODE_MOMENTUM_RATIO,
        swiperDefault: '1',
        value: '',
        description: 'Higher value produces larger momentum distance after you release slider',

        type: 'number',
      },
      {
        name: 'Momentum Bounce',
        attr: ATTR_FREE_MODE_MOMENTUM_BOUNCE,
        swiperDefault: 'true',
        value: '',
        description: 'Set to false if you want to disable momentum bounce when reaching first/last slides in free mode',

        type: 'number',
      },
      {
        name: 'Momentum Bounce Ratio',
        attr: ATTR_FREE_MODE_MOMENTUM_BOUNCE_RATIO,
        swiperDefault: '1',
        value: '',
        description: 'Higher value produces larger momentum bounce effect',

        type: 'number',
      },
      {
        name: 'Momentum Velocity Ratio',
        attr: ATTR_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
        swiperDefault: '1',
        value: '',
        description: 'Higher value produces larger momentum velocity after you release slider',

        type: 'number',
      },
      {
        name: 'Sticky',
        attr: ATTR_FREE_MODE_STICKY,
        swiperDefault: 'false',
        value: '',
        description: 'Set to enabled to enable snap to slides positions in free mode',

        type: 'boolean',
      },
    ],
  };
  return config;
}
