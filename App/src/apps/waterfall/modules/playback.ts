import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../../types/waterfall-types';
import {
  ATTR_AUTOPLAY,
  ATTR_DELAY,
  ATTR_DISABLE_ON_INTERACTION,
  ATTR_LOOP_ADD_ADDITIONAL_SLIDES,
  ATTR_LOOP_ADD_BLANK_SLIDES,
  ATTR_LOOP_PREVENTS_SLIDING,
  ATTR_PAUSE_ON_MOUSE_ENTER,
  ATTR_PLAYBACK_MODE,
  ATTR_REVERSE_DIRECTION,
  ATTR_SMOOTH_AUTOPLAY,
  ATTR_SPEED,
  ATTR_STOP_ON_LAST_SLIDE,
  ATTR_WAIT_FOR_TRANSITION,
} from 'well-waterfall/src/lib/attributes';

export default function playbackCategory() {
  let config: WaterfallCategory = {
    name: 'Playback',
    id: 'playback',
    icon: faPlay,
    summary: 'Control speed, and automatically move between slides',
    description: 'Control speed, and automatically move between slides',
    groups: [
      {
        name: 'Autoplay',
        id: 'autoplay',
        items: [
          {
            name: 'AutoPlay',
            attr: ATTR_AUTOPLAY,
            swiperDefault: 'false',
            value: '',
            description: "If true, 'autoplay' is enabled.",
            type: 'boolean',
            tested: true,
          },
          {
            name: 'Smooth Autoplay',
            attr: ATTR_SMOOTH_AUTOPLAY,
            swiperDefault: 'false',
            value: '',
            type: 'boolean',
            description: 'If true, the slides will move continuously instead of stopping on each slide.',
            tested: false,
          },
          {
            name: 'Autoplay Delay',
            attr: ATTR_DELAY,
            swiperDefault: '',
            value: '',
            type: 'number',
            description:
              'Delay between transitions (in ms). If this parameter is not specified, auto play will be disabled. If you need to specify different delay for specific slides you can do it by usingdata-swiper-autoplay (in ms) attribute on slide.',
            tested: true,
          },
          {
            name: 'Disable Autoplay on Interaction',
            attr: ATTR_DISABLE_ON_INTERACTION,
            swiperDefault: 'false', // documentation says default is true, doesn't appear to be true
            value: '',
            type: 'boolean',
            description: 'If true, autoplay be disabled after any user interactions',
            tested: true,
          },
          {
            name: 'Pause Autoplay on Hover',
            attr: ATTR_PAUSE_ON_MOUSE_ENTER,
            swiperDefault: 'false',
            value: '',
            type: 'boolean',
            description: 'If true, autoplay will be paused when the pointer enters the Swiper container.',
            tested: true,
          },
          {
            name: 'Reverse Autoplay Direction',
            attr: ATTR_REVERSE_DIRECTION,
            swiperDefault: 'false',
            value: '',
            type: 'boolean',
            description: "If true, autoplays in the reverse direction. Works well with 'loop'.",
            tested: true,
          },
          {
            name: 'Stop Autoplay on Last Slide',
            attr: ATTR_STOP_ON_LAST_SLIDE,
            swiperDefault: 'false',
            value: '',
            type: 'boolean',
            description: 'If true, autoplay will be stopped when it reaches last slide (has no effect in loop mode)',
            tested: true,
          },
          {
            name: 'Autoplay Wait for Transition',
            attr: ATTR_WAIT_FOR_TRANSITION,
            swiperDefault: 'true',
            value: '',
            type: 'boolean',
            description:
              'If true, autoplay will wait for the wrapper transition to continue. Can be disabled in case of using Virtual Translate when your slider may not have transition',
            tested: false,
          },
        ],
      },
      {
        name: 'Loop',
        id: 'loop-settings',
        items: [
          {
            name: 'Loop Add Blank Slides',
            attr: ATTR_LOOP_ADD_BLANK_SLIDES,
            swiperDefault: 'true',
            value: '',
            description:
              'Automatically adds blank slides if you use Grid or slidesPerGroup and the total amount of slides is not even to slidesPerGroup or to grid.rows',
            tested: false,
            type: 'boolean',
          },
          {
            name: 'Loop Additional Slides',
            attr: ATTR_LOOP_ADD_ADDITIONAL_SLIDES,
            swiperDefault: '0',
            value: '',
            description:
              'Increase amount of looped slides which may help with loading. Must be less than slidesPerView.',
            tested: true,
            type: 'number',
          },
          {
            name: 'Loop Prevents Sliding',
            attr: ATTR_LOOP_PREVENTS_SLIDING,
            swiperDefault: 'true',
            value: '',
            description: 'If enabled then slideNext/Prev will do nothing while slider is animating in loop mode',
            tested: false,
            type: 'boolean',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Speed',
        attr: ATTR_SPEED,
        swiperDefault: '300',
        value: '',
        description: 'Duration of transition between slides (in ms). Small number go fast.',
        tested: true,
        type: 'number',
      },
      {
        name: 'Playback Mode',
        attr: ATTR_PLAYBACK_MODE,
        swiperDefault: 'none',
        value: '',
        description: 'Choose between loop, rewind, and none',
        options: ['none', 'loop', 'rewind', 'none'],
        tested: false,
        type: 'select',
      },
    ],
  };
  return config;
}
