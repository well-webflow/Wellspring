import { faFileImage } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_THUMBS_AUTO_SCROLL_OFFSET,
  ATTR_THUMBS_CONTAINER_CLASS,
  ATTR_THUMBS_MULTIPLE_ACTIVE_THUMBS,
  ATTR_THUMBS,
  ATTR_THUMBS_SLIDE_THUMB_ACTIVE_CLASS,
} from 'well-waterfall';

export default function thumbsCategory() {
  let config: WaterfallCategory = {
    name: 'Thumbs',
    id: 'thumbs',
    icon: faFileImage,
    summary: 'Add thumbnails that are linked to another Waterfall',
    description: 'Add thumbnails to the waterfall',
    items: [
      {
        name: 'Thumbs Swiper',
        attr: ATTR_THUMBS,
        swiperDefault: '--',
        type: 'waterfall',
        description: 'Select the Waterfall this slider will use as Thumbnails',
        value: '',
      },
      {
        name: 'Auto Scroll Offset',
        attr: ATTR_THUMBS_AUTO_SCROLL_OFFSET,
        swiperDefault: '0',
        description:
          'Allows to set on which thumbs active slide from edge it should automatically move scroll thumbs. For example, if set to 1 and last visible thumb will be activated (1 from edge) it will auto scroll thumbs',
        value: '',

        type: 'number',
      },
      {
        name: 'Multiple Active Thumbs',
        attr: ATTR_THUMBS_MULTIPLE_ACTIVE_THUMBS,
        swiperDefault: 'true',
        description: 'When enabled multiple thumbnail slides may get activated',
        value: '',

        type: 'boolean',
      },
      {
        name: 'Slide Thumb Active Class',
        attr: ATTR_THUMBS_SLIDE_THUMB_ACTIVE_CLASS,
        swiperDefault: 'swiper-slide-thumb-active',
        description: 'Additional class that will be added to activated thumbs swiper slide',
        value: '',
        type: 'string',
      },
      {
        name: 'Thumbs Container Class',
        attr: ATTR_THUMBS_CONTAINER_CLASS,
        swiperDefault: 'swiper-thumbs',
        description: 'Additional class that will be added to thumbs swiper',
        value: '',

        type: 'string',
      },
    ],
  };
  return config;
}
