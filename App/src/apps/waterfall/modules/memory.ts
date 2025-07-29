import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../../types/waterfall-types';
import { ATTR_HASH_REPLACE_STATE, ATTR_HASH_WATCH_STATE } from 'well-waterfall/src/lib/attributes';

export default function memoryCategory() {
  let config: WaterfallCategory = {
    name: 'Memory',
    id: 'hash',
    icon: faRotateRight,
    summary: 'Remember the current slide on reload using hash navigation',
    description:
      'AKA Hash Navigation. Allows linking to a specific slide. This enables loading the page with a specific slide opened. To use this, add [data-hash="SLIDENAME"] to swiper-slide elements.',
    items: [
      {
        name: 'Replace State',
        attr: ATTR_HASH_REPLACE_STATE,
        swiperDefault: 'false',
        description: 'Replace the current url state with the current slide instead of adding it to history',
        value: '',
        tested: false,
        type: 'boolean',
      },
      {
        name: 'Watch State',
        attr: ATTR_HASH_WATCH_STATE,
        swiperDefault: 'false',
        description: 'Enable navigation through slides using browser history or by setting the hash directly',
        value: '',
        tested: false,
        type: 'boolean',
      },
    ],
  };
  return config;
}
