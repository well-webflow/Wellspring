import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../../types/waterfall-types';
import {
  ATTR_THUMBS,
  ATTR_THUMBS_AUTO_SCROLL_OFFSET,
  ATTR_THUMBS_CONTAINER_CLASS,
  ATTR_THUMBS_MULTIPLE_ACTIVE_THUMBS,
  ATTR_THUMBS_NAME,
  ATTR_THUMBS_SLIDE_THUMB_ACTIVE_CLASS,
  ATTR_WATERFALL_PRELOAD,
} from 'well-waterfall/src/lib/attributes';

export default function thumbsCategory() {
  let config: WaterfallCategory = {
    name: 'Thumbs',
    id: 'thumbs',
    icon: faFileImage,
    summary: 'Add thumbnails that are linked to another Waterfall',
    description: 'Add thumbnails to the waterfall',
    items: [
      {
        name: 'Thumbs',
        attr: ATTR_THUMBS,
        swiperDefault: 'false',
        value: '',
        description: 'If true, this slider will act as Thumbnails for another slider',
        type: 'boolean',
        tested: false,
      },
      {
        name: 'Enabled',
        attr: ATTR_WATERFALL_PRELOAD,
        swiperDefault: 'false',
        description: 'Set to true to enable the thumbnails',
        type: 'boolean',
        value: '',
        tested: false,
      },
      {
        name: 'Swiper',
        attr: ATTR_THUMBS_NAME,
        swiperDefault: '--',
        type: 'waterfall',
        description: 'The name of the Waterfall these thumbs are associated with',
        value: '',
        tested: true,
      },
      {
        name: 'Auto Scroll Offset',
        attr: ATTR_THUMBS_AUTO_SCROLL_OFFSET,
        swiperDefault: '0',
        description:
          'Allows to set on which thumbs active slide from edge it should automatically move scroll thumbs. For example, if set to 1 and last visible thumb will be activated (1 from edge) it will auto scroll thumbs',
        value: '',
        tested: false,
        type: 'number',
      },
      {
        name: 'Multiple Active Thumbs',
        attr: ATTR_THUMBS_MULTIPLE_ACTIVE_THUMBS,
        swiperDefault: 'true',
        description: 'When enabled multiple thumbnail slides may get activated',
        value: '',
        tested: false,
        type: 'boolean',
      },
      {
        name: 'Slide Thumb Active Class',
        attr: ATTR_THUMBS_SLIDE_THUMB_ACTIVE_CLASS,
        swiperDefault: 'swiper-slide-thumb-active',
        description: 'Additional class that will be added to activated thumbs swiper slide',
        value: '',
        tested: false,
        type: 'string',
      },
      {
        name: 'Thumbs Container Class',
        attr: ATTR_THUMBS_CONTAINER_CLASS,
        swiperDefault: 'swiper-thumbs',
        description: 'Additional class that will be added to thumbs swiper',
        value: '',
        tested: false,
        type: 'string',
      },
    ],
  };
  return config;
}
