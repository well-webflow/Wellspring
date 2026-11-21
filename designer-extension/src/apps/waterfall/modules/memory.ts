import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_HASH_NAVIGATION_REPLACE_STATE,
  ATTR_HASH_NAVIGATION_WATCH_STATE,
  ATTR_HISTORY_KEEP_QUERY,
  ATTR_HISTORY_KEY,
  ATTR_HISTORY_REPLACE_STATE,
  ATTR_HISTORY_ROOT,
} from 'well-waterfall/attributes';

export default function memoryCategory() {
  const config: WaterfallCategory = {
    name: 'Memory',
    id: 'hash',
    icon: faRotateRight,
    summary: 'Remember the current slide in the URL, so it survives a reload or a shared link',
    description:
      'Two ways to put the current slide in the URL. Hash Navigation adds #slide-name and needs [data-hash="SLIDENAME"] on each swiper-slide. History writes a real path instead and needs [data-history="SLIDENAME"]. Setting any History field turns History on, and History takes precedence over Hash Navigation when both are set.',
    groups: [
      {
        name: 'Hash Navigation',
        id: 'hash-navigation',
        description: 'Adds #slide-name to the URL. Needs [data-hash="SLIDENAME"] on each slide.',
        items: [
          {
            name: 'Replace State',
            attr: ATTR_HASH_NAVIGATION_REPLACE_STATE,
            swiperDefault: 'false',
            description: 'Replace the current url state with the current slide instead of adding it to history',
            value: '',
            type: 'boolean',
          },
          {
            name: 'Watch State',
            attr: ATTR_HASH_NAVIGATION_WATCH_STATE,
            swiperDefault: 'false',
            description: 'Enable navigation through slides using browser history or by setting the hash directly',
            value: '',
            type: 'boolean',
          },
        ],
      },
      {
        name: 'History',
        id: 'history-navigation',
        description:
          'Writes a real URL path such as /slides/slide-name. Needs [data-history="SLIDENAME"] on each slide. Setting any field here turns History on and overrides Hash Navigation.',
        items: [
          {
            name: 'Key',
            attr: ATTR_HISTORY_KEY,
            swiperDefault: 'slides',
            description: 'The path segment placed before the slide name, as in /slides/slide-name',
            value: '',
            type: 'string',
          },
          {
            name: 'Root',
            attr: ATTR_HISTORY_ROOT,
            swiperDefault: '',
            description: 'Set the root URL when the slider is not at the root of the site, e.g. /tour',
            value: '',
            type: 'string',
          },
          {
            name: 'Replace State',
            attr: ATTR_HISTORY_REPLACE_STATE,
            swiperDefault: 'false',
            description: 'Replace the current url state with the current slide instead of adding it to history',
            value: '',
            type: 'boolean',
          },
          {
            name: 'Keep Query',
            attr: ATTR_HISTORY_KEEP_QUERY,
            swiperDefault: 'false',
            description: 'Keep any query parameters already in the URL when the slide changes',
            value: '',
            type: 'boolean',
          },
        ],
      },
    ],
  };
  return config;
}
