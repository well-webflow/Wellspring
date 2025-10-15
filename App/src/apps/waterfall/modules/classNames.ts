import { faFont } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_CONTAINER_MODIFIER_CLASS,
  ATTR_EVENTS_PREFIX,
  ATTR_SLIDE_ACTIVE_CLASS,
  ATTR_SLIDE_BLANK_CLASS,
  ATTR_SLIDE_CLASS,
  ATTR_SLIDE_FULLY_VISIBLE_CLASS,
  ATTR_SLIDE_NEXT_CLASS,
  ATTR_SLIDE_PREV_CLASS,
  ATTR_SLIDE_VISIBLE_CLASS,
  ATTR_WRAPPER_CLASS,
} from 'well-waterfall';

export default function classnamesCategory() {
  let config: WaterfallCategory = {
    name: 'Class Names',
    id: 'class-names',
    icon: faFont,
    summary: 'Change the class names used by SwiperJS.',
    items: [
      {
        name: 'Slide Active Class',
        attr: ATTR_SLIDE_ACTIVE_CLASS,
        swiperDefault: 'swiper-slide-active',
        value: '',
        description:
          "CSS class name of currently active slide. By changing classes you will also need to change Swiper's CSS to reflect changed classes",

        type: 'string',
      },
      {
        name: 'Container Modifier Class',
        attr: ATTR_CONTAINER_MODIFIER_CLASS,
        swiperDefault: 'swiper-',
        value: '',
        description:
          'The beginning of the modifier CSS class that can be added to swiper container depending on different parameters',
        type: 'string',
      },
      {
        name: 'Events Prefix',
        attr: ATTR_EVENTS_PREFIX,
        swiperDefault: 'swiper',
        value: '',
        description: 'Event name prefix for all DOM events emitted by Swiper Element (web component)',
        type: 'string',
      },
      {
        name: 'Slide Blank Class',
        attr: ATTR_SLIDE_BLANK_CLASS,
        swiperDefault: 'swiper-slide-blank',
        value: '',
        description: 'CSS class name of the blank slide added by the loop mode (when loopAddBlankSlides is enabled)',

        type: 'string',
      },
      {
        name: 'Slide Class',
        attr: ATTR_SLIDE_CLASS,
        swiperDefault: 'swiper-slide',
        value: '',
        description:
          "CSS class name of slide. By changing classes you will also need to change Swiper's CSS to reflect changed classes",

        type: 'string',
      },
      {
        name: 'Slide Fully Visible',
        attr: ATTR_SLIDE_FULLY_VISIBLE_CLASS,
        swiperDefault: 'swiper-slide-fully-visible',
        value: '',
        description: 'CSS class name of fully (when whole slide is in the viewport) visible slide',

        type: 'string',
      },
      {
        name: 'Slide Next Class',
        attr: ATTR_SLIDE_NEXT_CLASS,
        swiperDefault: 'swiper-slide-next',
        value: '',
        description:
          "CSS class name of slide which is right after currently active slide. By changing classes you will also need to change Swiper's CSS to reflect changed classes",

        type: 'string',
      },
      {
        name: 'Slide Prev Class',
        attr: ATTR_SLIDE_PREV_CLASS,
        swiperDefault: 'swiper-slide-prev',
        value: '',
        description:
          "CSS class name of slide which is right before currently active slide. By changing classes you will also need to change Swiper's CSS to reflect changed classes.",

        type: 'string',
      },
      {
        name: 'Slide Visible Class',
        attr: ATTR_SLIDE_VISIBLE_CLASS,
        swiperDefault: 'swiper-slide-visible',
        value: '',
        description:
          "CSS class name of currently/partially visible slide. By changing classes you will also need to change Swiper's CSS to reflect changed classes.",

        type: 'string',
      },
      {
        name: 'Wrapper Class',
        attr: ATTR_WRAPPER_CLASS,
        swiperDefault: 'swiper-wrapper',
        value: '',
        description:
          "CSS class name of slides' wrapper. By changing classes you will also need to change Swiper's CSS to reflect changed classes",
        type: 'string',
      },
    ],
  };
  return config;
}
