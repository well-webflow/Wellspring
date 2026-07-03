<<<<<<< Updated upstream:App/src/utils/modules/advanced.ts
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../types/waterfall-types';
=======
import { faLock, faBug } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_BREAKPOINTS_BASE,
  ATTR_CREATE_ELEMENTS,
  ATTR_CSS_MODE,
  ATTR_DEBUG_MODE,
  ATTR_ENABLED,
  ATTR_FOCUSABLE_ELEMENTS,
  ATTR_INIT,
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
} from 'well-waterfall';
>>>>>>> Stashed changes:App/src/apps/waterfall/modules/advanced.ts

export default function advancedCategory() {
  let config: WaterfallCategory = {
    name: 'Other Settings (Advanced)',
    id: 'other-advanced',
    icon: faLock,
    summary:
      "Settings you probably shouldn't touch unless you really know what you're doing",
    items: [
      {
        name: 'Debug',
        attr: ATTR_DEBUG_MODE,
        swiperDefault: 'false',
        value: '',
        description: 'Prints out debug statements to the browser console',
        icon: faBug,
        type: 'boolean',
      },
      {
        name: 'Breakpoints Base',
        attr: 'breakpoints-base',
        swiperDefault: 'window',
        value: '',
        description:
          'Base for breakpoints (beta). Can be window or container. If set to window (by default) then breakpoint keys mean window width. If set to container then breakpoint keys treated as swiper container width',
        tested: false,
      },
      {
        name: 'Create Elements',
        attr: 'create-elements',
        swiperDefault: 'false',
        value: '',
        description:
          'When enabled Swiper will automatically wrap slides with swiper-wrapper element, and will create required elements for navigation, pagination and scrollbar they are enabled (with their respective params object or with boolean true))',
        tested: false,
      },
      {
        name: 'CSS Mode',
        attr: 'css-mode',
        swiperDefault: 'false',
        value: '',
        description:
          'See https://swiperjs.com/swiper-api#param-cssMode for more information',
        tested: false,
      },
      {
        name: 'Focusable Elements',
        attr: 'focusable-elements',
        swiperDefault: 'input, select, option, textarea, button, video, label',
        value: '',
        description:
          'CSS selector for focusable elements. Swiping will be disabled on such elements if they are "focused"',
        tested: false,
      },
      {
        name: 'Lazy Load Prev Next',
        attr: 'lazy-load-prev-next',
        swiperDefault: '0',
        value: '2',
        description:
          'Number of next and previous slides to preload. Only applicable if using lazy loading.',
        tested: true,
      },
      {
        name: 'Lazy Preloader Class',
        attr: 'lazy-preloader-class',
        swiperDefault: 'swiper-lazy-preloader',
        value: '',
        description: 'CSS class name of lazy preloader',
        tested: true,
      },
      {
        name: 'Max Backface Hidden Slides',
        attr: 'max-backface-hidden-slides',
        swiperDefault: '10',
        value: '',
        description:
          'If total number of slides less than specified here value, then Swiper will enable backface-visibility: hidden on slide elements to reduce visual "flicker" in Safari.',
        tested: false,
      },
      {
        name: 'Normalize Slide Index',
        attr: 'normalize-slide-index',
        swiperDefault: 'true',
        value: '',
        description: 'Normalize slide index. First slide = 1 instead of 0.',
        tested: false,
      },
      {
        name: 'Observe Parents',
        attr: 'observe-parents',
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true if you also need to watch Mutations for Swiper parent elements',
        tested: false,
      },
      {
        name: 'Observe Slide Children',
        attr: 'observe-slide-children',
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true if you also need to watch Mutations for Swiper slide children elements',
        tested: false,
      },
      {
        name: 'Observer',
        attr: 'observer',
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true to enable Mutation Observer on Swiper and its elements. In this case Swiper will be updated (reinitialized) each time if you change its style (like hide/show) or modify its child elements (like adding/removing slides)',
        tested: false,
      },
      {
        name: 'Passive Listeners',
        attr: 'passive-listeners',
        swiperDefault: 'true',
        value: '',
        description:
          'Passive event listeners will be used by default where possible to improve scrolling performance on mobile devices. But if you need to use e.preventDefault and you have conflict with it, then you should disable this parameter',
        tested: false,
      },
      {
        name: 'Resize Observer',
        attr: 'resize-observer',
        swiperDefault: 'true',
        value: '',
        description:
          'When enabled it will use ResizeObserver (if supported by browser) on swiper container to detect container resize (instead of watching for window resize)',
        tested: false,
      },
      {
        name: 'Round Lengths',
        attr: 'round-lengths',
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true to round values of slides width and height to prevent blurry texts on usual resolution screens (if you have such)',
        tested: false,
      },
      {
        name: 'Run Callbacks on Init',
        attr: 'run-callbacks-on-init',
        swiperDefault: 'true',
        value: '',
        description:
          'Fire Transition/SlideChange/Start/End events on swiper initialization. Such events will be fired on initialization in case of your initialSlide is not 0, or you use loop mode',
        tested: false,
      },
      {
        name: 'Set Wrapper Size',
        attr: 'set-wrapper-size',
        swiperDefault: 'false',
        value: '',
        description:
          "Enabled this option and plugin will set width/height on swiper wrapper equal to total size of all slides. Mostly should be used as compatibility fallback option for browser that don't support flexbox layout well",
        tested: false,
      },
      {
        name: 'Swiper Element Node Name',
        attr: 'swiper-element-node-name',
        swiperDefault: 'SWIPER-CONTAINER',
        value: '',
        description:
          'The name of the swiper element node name; used for detecting web component rendering',
        tested: false,
      },
      {
        name: 'Unique Nav Elements',
        attr: 'unique-nav-elements',
        swiperDefault: 'true',
        value: '',
        description:
          'If enabled (by default) and navigation elements\' parameters passed as a string (like ".pagination") then Swiper will look for such elements through child elements first. Applies for pagination, prev/next buttons and scrollbar elements',
        tested: false,
      },
      {
        name: 'URL',
        attr: 'url',
        swiperDefault: '',
        value: '',
        description:
          'Required for active slide detection when rendered on server-side and enabled history',
        tested: false,
      },
      {
        name: 'User Agent',
        attr: 'user-agent',
        swiperDefault: '',
        value: '',
        description:
          'userAgent string. Required for browser/device detection when rendered on server-side',
        tested: false,
      },
      {
        name: 'Virtual Translate',
        attr: 'virtual-translate',
        swiperDefault: 'false',
        value: '',
        description:
          'Enabled this option and swiper will be operated as usual except it will not move, real translate values on wrapper will not be set. Useful when you may need to create custom slide transition',
        tested: false,
      },
      {
        name: 'Watch Overflow',
        attr: 'watch-overflow',
        swiperDefault: 'true',
        value: '',
        description:
          'When enabled Swiper will be disabled and hide navigation buttons on case there are not enough slides for sliding.',
        tested: false,
      },
      {
        name: 'Watch Slides Progress',
        attr: 'watch-slides-progress',
        swiperDefault: 'false',
        value: '',
        description:
          'Enable this feature to calculate each slides progress and visibility (slides in viewport will have additional visible class)',
        tested: false,
      },
    ],
  };
  return config;
}
