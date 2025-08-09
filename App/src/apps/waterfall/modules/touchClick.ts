import { faArrowsTurnRight, faBan, faHandPointer, faICursor, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_ALLOW_TOUCH_MOVE,
  ATTR_EDGE_SWIPE_DETECTION,
  ATTR_EDGE_SWIPE_THRESHOLD,
  ATTR_FOLLOW_FINGER,
  ATTR_GRAB_CURSOR,
  ATTR_LONG_SWIPES,
  ATTR_LONG_SWIPES_MS,
  ATTR_LONG_SWIPES_RATIO,
  ATTR_NESTED,
  ATTR_NO_SWIPING,
  ATTR_NO_SWIPING_CLASS,
  ATTR_NO_SWIPING_SELECTOR,
  ATTR_ONE_WAY_MOVEMENT,
  ATTR_PREVENT_CLICKS,
  ATTR_PREVENT_CLICKS_PROPAGATION,
  ATTR_PREVENT_INTERACTION_ON_TRANSITION,
  ATTR_RESISTANCE,
  ATTR_RESISTANCE_RATIO,
  ATTR_SHORT_SWIPES,
  ATTR_SIMULATE_TOUCH,
  ATTR_SLIDE_TO_CLICKED_SLIDE,
  ATTR_SWIPE_HANDLER,
  ATTR_THRESHOLD,
  ATTR_TOUCH_ANGLE,
  ATTR_TOUCH_EVENTS_TARGET,
  ATTR_TOUCH_MOVE_STOP_PROPAGATION,
  ATTR_TOUCH_RATIO,
  ATTR_TOUCH_RELEASE_ON_EDGES,
  ATTR_TOUCH_START_FORCE_PREVENT_DEFAULT,
  ATTR_TOUCH_START_PREVENT_DEFAULT,
} from 'well-waterfall/src/lib/attributes';

export default function touchClickCategory() {
  let config: WaterfallCategory = {
    name: 'Touch & Click',
    id: 'touch',
    icon: faICursor,
    summary: 'Click and touchscreen options for mobile iOS/Android',
    description: 'Mobile iOS/Android or touchscreen settings',
    groups: [
      {
        name: 'Click',
        id: '',
        items: [
          {
            name: 'Grab Cursor',
            attr: ATTR_GRAB_CURSOR,
            swiperDefault: 'false',
            value: '',
            description: 'If \'true\', the user will see the "grab" cursor when hovering on the slider.',
            icon: faHandPointer,

            type: 'boolean',
          },
          {
            name: 'Slide to Clicked Slide',
            attr: ATTR_SLIDE_TO_CLICKED_SLIDE,
            swiperDefault: 'false',
            value: '',
            description: 'Set to true and click on any slide will produce transition to this slide',

            type: 'boolean',
          },
          {
            name: 'Simulate Touch',
            attr: ATTR_SIMULATE_TOUCH,
            swiperDefault: 'true',
            value: '',
            description: 'If true, Swiper will accept mouse events like touch events (click and drag to change slides)',

            type: 'boolean',
          },
          {
            name: 'Prevent Clicks',
            attr: ATTR_PREVENT_CLICKS,
            swiperDefault: 'true',
            value: '',
            description: 'Set to true to prevent accidental unwanted clicks on links during swiping',

            type: 'boolean',
          },
        ],
      },
      {
        name: 'Swipe',
        id: 'swipes',
        items: [
          {
            name: 'Follow Finger',
            attr: ATTR_FOLLOW_FINGER,
            swiperDefault: 'true',
            value: '',
            description:
              "If 'false', then slider will be animated only when you release it, it will not move while you hold your finger on it",

            type: 'boolean',
          },
          {
            name: 'Resistance',
            attr: ATTR_RESISTANCE,
            swiperDefault: 'true',
            value: '',
            description: "If 'true' the slider will snap back with small or incomplete swipes",

            type: 'boolean',
          },
          {
            name: 'Short Swipes',
            attr: ATTR_SHORT_SWIPES,
            swiperDefault: 'true',
            value: '',
            description: '(Not working) Set to false if you want to disable short swipes',

            type: 'boolean',
          },
          {
            name: 'Long Swipes',
            attr: ATTR_LONG_SWIPES,
            swiperDefault: 'true',
            value: '',
            description: 'Set to false if you want to disable long swipes (ex. swiping multiple slides at a time)',
            icon: faPersonRunning,

            type: 'boolean',
          },
          {
            name: 'Long Swipes ms',
            attr: ATTR_LONG_SWIPES_MS,
            swiperDefault: '300',
            value: '',
            description: 'Minimal duration (in ms) to trigger swipe to next/previous slide during long swipes',

            type: 'number',
          },
          {
            name: 'Long Swipes Ratio',
            attr: ATTR_LONG_SWIPES_RATIO,
            swiperDefault: '0.5',
            value: '',
            description: 'Ratio to trigger swipe to next/previous slide during long swipes',

            type: 'number',
          },
          {
            name: 'Swipe Handler',
            attr: ATTR_SWIPE_HANDLER,
            swiperDefault: '',
            value: '',
            description:
              'String with CSS selector or HTML element of the container with pagination that will work as only available handler for swiping',

            type: 'string',
          },
        ],
      },
      {
        name: 'Edge Swipes',
        id: 'edge-swipes',
        items: [
          {
            name: 'Edge Swipe Detection',
            attr: ATTR_EDGE_SWIPE_DETECTION,
            swiperDefault: 'false',
            value: '',
            description:
              "If set to 'true' the slider will capture touch events and prevent system swipe-back navigation on iOS/Android.",

            type: 'boolean',
          },
          {
            name: 'Edge Swipe Threshold',
            attr: ATTR_EDGE_SWIPE_THRESHOLD,
            swiperDefault: '20',
            value: '',
            description:
              'Area (in px) from left edge of the screen to release touch events for swipe-back navigation on iOS/Android. (This has a minor, if any, effect)',

            type: 'number',
          },
          {
            name: 'Touch Release on Edges',
            attr: ATTR_TOUCH_RELEASE_ON_EDGES,
            swiperDefault: 'false',
            value: '',
            description:
              'Release touch events on slider when it reaches the beginning or end to allow for page scrolling outside of the swiper container. This feature works only with "touch" events (and not pointer events). Also threshold parameter must be set to 0.',

            type: 'boolean',
          },
        ],
      },
      {
        name: 'No Swiping',
        id: 'no-swiping',
        items: [
          {
            name: 'No Swiping',
            attr: ATTR_NO_SWIPING,
            swiperDefault: 'true',
            value: '',
            description:
              'Enable/disable swiping on elements matched to class specified in noSwipingClass or noSwipingSelector',

            type: 'boolean',
          },
          {
            name: 'No Swiping Class',
            attr: ATTR_NO_SWIPING_CLASS,
            swiperDefault: 'swiper-no-swiping',
            value: '',
            description: "Specify noSwiping's element css class",

            type: 'string',
          },
          {
            name: 'No Swiping Selector',
            attr: ATTR_NO_SWIPING_SELECTOR,
            swiperDefault: '',
            value: '',
            description:
              "Can be used instead of noSwipingClass to specify elements to disable swiping on. For example 'input' will disable swiping on all inputs",

            type: 'string',
          },
        ],
      },
      {
        name: 'Advanced',
        id: 'advanced-touch',
        items: [
          {
            name: 'Threshold',
            attr: ATTR_THRESHOLD,
            swiperDefault: '5',
            value: '',
            description:
              '(Not Working?) Threshold value in px. If "touch distance" will be lower than this value then swiper will not move',

            type: 'number',
          },
          {
            name: 'Touch Angle',
            attr: ATTR_TOUCH_ANGLE,
            swiperDefault: '45',
            value: '',
            description: '(Untested) Allowable angle (in degrees) to trigger touch move',

            type: 'number',
          },
          {
            name: 'Touch Events Target',
            attr: ATTR_TOUCH_EVENTS_TARGET,
            swiperDefault: 'wrapper',
            value: '',
            description:
              "Target element to listen touch events on. Can be 'container' (to listen for touch events on swiper) or 'wrapper'(to listen for touch events on swiper-wrapper)",

            type: 'string',
          },
          {
            name: 'Touch Ratio',
            attr: ATTR_TOUCH_RATIO,
            swiperDefault: '1',
            value: '',
            description: "Touch ratio (don't blame me, this is the real documentation note)",

            type: 'number',
          },
          {
            name: 'Touch Move Stop Propagation',
            attr: ATTR_TOUCH_MOVE_STOP_PROPAGATION,
            swiperDefault: 'false',
            value: '',
            description: 'If enabled, then propagation of "touchmove" will be stopped',

            type: 'boolean',
          },
          {
            name: 'Touch Start Force Prevent Default',
            attr: ATTR_TOUCH_START_FORCE_PREVENT_DEFAULT,
            swiperDefault: 'false',
            value: '',
            description: 'Force to always prevent default for touchstart (pointerdown) event',

            type: 'boolean',
          },
          {
            name: 'Touch Start Prevent Default',
            attr: ATTR_TOUCH_START_PREVENT_DEFAULT,
            swiperDefault: 'true',
            value: '',
            description: "If disabled, pointerdown event won't be prevented",

            type: 'boolean',
          },
          {
            name: 'Prevent Clicks Propagation',
            attr: ATTR_PREVENT_CLICKS_PROPAGATION,
            swiperDefault: 'true',
            value: '',
            description: 'Set to true to stop clicks event propagation on links during swiping',

            type: 'boolean',
          },
          {
            name: 'Resistance Ratio',
            attr: ATTR_RESISTANCE_RATIO,
            swiperDefault: '0.85',
            value: '',
            description: 'This option allows you to control resistance ratio.',

            type: 'number',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Allow Touch Move',
        attr: ATTR_ALLOW_TOUCH_MOVE,
        swiperDefault: 'true',
        value: '',
        description:
          'If false, then the only way to switch the slide is use buttons or functions like slidePrev or slideNext',
        icon: faBan,

        type: 'boolean',
      },
      {
        name: 'One Way Movement',
        attr: ATTR_ONE_WAY_MOVEMENT,
        swiperDefault: 'false',
        value: '',
        description: "If 'true', will swipe slides only forward (one-way) regardless of swipe direction",
        icon: faArrowsTurnRight,

        type: 'boolean',
      },
      {
        name: 'Prevent Interaction on Transition',
        attr: ATTR_PREVENT_INTERACTION_ON_TRANSITION,
        swiperDefault: 'false',
        value: '',
        description: "If 'true' swiping and navigation/pagination buttons will be disabled during transition",

        type: 'boolean',
      },
      {
        name: 'Nested',
        attr: ATTR_NESTED,
        swiperDefault: 'false',
        value: '',
        description:
          'Set to true on Swiper for correct touch events interception. Use only on swipers that use same direction as the parent one',

        type: 'boolean',
      },
    ],
  };
  return config;
}
