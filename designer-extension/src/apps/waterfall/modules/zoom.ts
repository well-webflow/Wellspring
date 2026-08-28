import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_ZOOM_CONTAINER_CLASS,
  ATTR_ZOOM_LIMIT_TO_ORIGINAL_SIZE,
  ATTR_ZOOM_MAX_RATIO,
  ATTR_ZOOM_MIN_RATIO,
  ATTR_ZOOM_PAN_ON_MOUSE_MOVE,
  ATTR_ZOOM_TOGGLE,
  ATTR_ZOOMED_SLIDE_CLASS,
} from 'well-waterfall';

export default function zoomCategory() {
  let config: WaterfallCategory = {
    name: 'Zoom',
    id: 'zoom',
    icon: faMagnifyingGlass,
    description:
      'Allow items to be zoomed inside a swiper. Add class .swiper-zoom-container (or custom class) to a surrounding div to allow zoom. By default it expects to zoom an img, picture or canvas element. If you want to zoom on some other custom element, then just add swiper-zoom-target class to the element.',
    summary: 'Allow items to be zoomed inside a swiper',
    items: [
      {
        name: 'Zoom Container Class',
        attr: ATTR_ZOOM_CONTAINER_CLASS,
        type: 'string',
        swiperDefault: 'swiper-zoom-container',
        description: 'CSS class name of zoom container',
        value: '',
      },
      {
        name: 'Limit to Original Size',
        attr: ATTR_ZOOM_LIMIT_TO_ORIGINAL_SIZE,
        type: 'string',
        swiperDefault: 'false',
        description: 'When set to true, the image will not be scaled past 100% of its original size',
        value: '',
      },
      {
        name: 'Max Ratio',
        attr: ATTR_ZOOM_MAX_RATIO,
        type: 'string',
        swiperDefault: '3',
        description: 'Maximum image zoom multiplier',
        value: '',
      },
      {
        name: 'Min Ratio',
        attr: ATTR_ZOOM_MIN_RATIO,
        type: 'string',
        swiperDefault: '1',
        description: 'Minimal image zoom multiplier',
        value: '',
      },
      {
        name: 'Pan on Mouse Move',
        attr: ATTR_ZOOM_PAN_ON_MOUSE_MOVE,
        type: 'string',
        swiperDefault: 'false',
        description: 'When set to true, a zoomed in image will automatically pan while moving the mouse over the image',
        value: '',
      },
      {
        name: 'Zoom Toggle',
        attr: ATTR_ZOOM_TOGGLE,
        type: 'string',
        swiperDefault: 'true',
        description: "Enable/disable zoom-in by slide's double tap",
        value: '',
      },
      {
        name: 'Zoomed Slide Class',
        attr: ATTR_ZOOMED_SLIDE_CLASS,
        type: 'string',
        swiperDefault: 'swiper-slide-zoomed',
        description: 'CSS class name of zoomed in container',
        value: '',
      },
    ],
  };
  return config;
}
