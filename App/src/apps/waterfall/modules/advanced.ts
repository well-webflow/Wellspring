import { faLock } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../../types/waterfall-types';
import {
  ATTR_BREAKPOINTS_BASE,
  ATTR_CREATE_ELEMENTS,
  ATTR_CSS_MODE,
  ATTR_FOCUSABLE_ELEMENTS,
  ATTR_LAZY_PRELOAD_PREV_NEXT,
  ATTR_LAZY_PRELOADER_CLASS,
  ATTR_MAX_BACKFACE_HIDDEN_SLIDES,
  ATTR_NORMALIZE_SLIDE_INDEX,
  ATTR_PASSIVE_LISTENERS,
  ATTR_ROUND_LENGTHS,
  ATTR_RUN_CALLBACKS_ON_INIT,
  ATTR_SET_WRAPPER_SIZE,
  ATTR_SWIPER_ELEMENT_NODE_NAME,
  ATTR_UNIQUE_NAV_ELEMENTS,
  ATTR_URL,
  ATTR_USER_AGENT,
  ATTR_VIRTUAL_TRANSLATE,
  ATTR_WATCH_OVERFLOW,
  ATTR_WATCH_SLIDES_PROGRESS,
} from 'well-waterfall/src/lib/attributes';

export default function advancedCategory() {
  let config: WaterfallCategory = {
    name: 'Other Settings (Advanced)',
    id: 'other-advanced',
    icon: faLock,
    summary: "Settings you probably shouldn't touch unless you really know what you're doing",
    items: [
      {
        name: 'Breakpoints Base',
        attr: ATTR_BREAKPOINTS_BASE,
        swiperDefault: 'window',
        value: '',
        description:
          'Base for breakpoints (beta). Can be window or container. If set to window (by default) then breakpoint keys mean window width. If set to container then breakpoint keys treated as swiper container width',

        type: 'select',
        options: ['window', 'container'],
      },
      {
        name: 'Create Elements',
        attr: ATTR_CREATE_ELEMENTS,
        swiperDefault: 'false',
        value: '',
        description:
          'When enabled Swiper will automatically wrap slides with swiper-wrapper element, and will create required elements for navigation, pagination and scrollbar they are enabled (with their respective params object or with boolean true))',

        type: 'boolean',
      },
      {
        name: 'CSS Mode',
        attr: ATTR_CSS_MODE,
        swiperDefault: 'false',
        value: '',
        description: 'See https://swiperjs.com/swiper-api#param-cssMode for more information',

        type: 'boolean',
      },
      {
        name: 'Focusable Elements',
        attr: ATTR_FOCUSABLE_ELEMENTS,
        swiperDefault: 'input, select, option, textarea, button, video, label',
        value: '',
        description:
          'CSS selector for focusable elements. Swiping will be disabled on such elements if they are "focused"',

        type: 'string',
      },
      {
        name: 'Lazy Load Prev Next',
        attr: ATTR_LAZY_PRELOAD_PREV_NEXT,
        swiperDefault: '0',
        value: '',
        description: 'Number of next and previous slides to preload. Only applicable if using lazy loading.',

        type: 'number',
      },
      {
        name: 'Lazy Preloader Class',
        attr: ATTR_LAZY_PRELOADER_CLASS,
        swiperDefault: 'swiper-lazy-preloader',
        value: '',
        description: 'CSS class name of lazy preloader',

        type: 'string',
      },
      {
        name: 'Max Backface Hidden Slides',
        attr: ATTR_MAX_BACKFACE_HIDDEN_SLIDES,
        swiperDefault: '10',
        value: '',
        description:
          'If total number of slides less than specified here value, then Swiper will enable backface-visibility: hidden on slide elements to reduce visual "flicker" in Safari.',

        type: 'number',
      },
      {
        name: 'Normalize Slide Index',
        attr: ATTR_NORMALIZE_SLIDE_INDEX,
        swiperDefault: 'true',
        value: '',
        description: 'Normalize slide index. First slide = 1 instead of 0.',

        type: 'boolean',
      },
      {
        name: 'Passive Listeners',
        attr: ATTR_PASSIVE_LISTENERS,
        swiperDefault: 'true',
        value: '',
        description:
          'Passive event listeners will be used by default where possible to improve scrolling performance on mobile devices. But if you need to use e.preventDefault and you have conflict with it, then you should disable this parameter',

        type: 'boolean',
      },
      {
        name: 'Round Lengths',
        attr: ATTR_ROUND_LENGTHS,
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such)',

        type: 'boolean',
      },
      {
        name: 'Run Callbacks on Init',
        attr: ATTR_RUN_CALLBACKS_ON_INIT,
        swiperDefault: 'true',
        value: '',
        description:
          'Fire Transition/SlideChange/Start/End events on swiper initialization. Such events will be fired on initialization in case of your initialSlide is not 0, or you use loop mode',

        type: 'boolean',
      },
      {
        name: 'Set Wrapper Size',
        attr: ATTR_SET_WRAPPER_SIZE,
        swiperDefault: 'false',
        value: '',
        description:
          "Enable this option and plugin to set width/height on swiper wrapper equal to total size of all slides. Mostly should be used as compatibility fallback option for browser that don't support flexbox layout well",

        type: 'boolean',
      },
      {
        name: 'Swiper Element Node Name',
        attr: ATTR_SWIPER_ELEMENT_NODE_NAME,
        swiperDefault: 'SWIPER-CONTAINER',
        value: '',
        description: 'The name of the swiper element node name; used for detecting web component rendering',

        type: 'string',
      },
      {
        name: 'Unique Nav Elements',
        attr: ATTR_UNIQUE_NAV_ELEMENTS,
        swiperDefault: 'true',
        value: '',
        description:
          'If enabled (by default) and navigation elements\' parameters passed as a string (like ".pagination") then Swiper will look for such elements through child elements first. Applies for pagination, prev/next buttons and scrollbar elements',

        type: 'boolean',
      },
      {
        name: 'URL',
        attr: ATTR_URL,
        swiperDefault: '',
        value: '',
        description: 'Required for active slide detection when rendered on server-side and enabled history',

        type: 'string',
      },
      {
        name: 'User Agent',
        attr: ATTR_USER_AGENT,
        swiperDefault: '',
        value: '',
        description: 'userAgent string. Required for browser/device detection when rendered on server-side',

        type: 'string',
      },
      {
        name: 'Virtual Translate',
        attr: ATTR_VIRTUAL_TRANSLATE,
        swiperDefault: 'false',
        value: '',
        description:
          'Enabled this option and swiper will be operated as usual except it will not move, real translate values on wrapper will not be set. Useful when you may need to create custom slide transition',

        type: 'boolean',
      },
    ],
  };
  return config;
}
