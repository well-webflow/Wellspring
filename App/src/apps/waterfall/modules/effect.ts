import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../waterfall';
import {
  ATTR_CARDS_PER_SLIDE_OFFSET,
  ATTR_CARDS_PER_SLIDE_ROTATE,
  ATTR_CARDS_ROTATE,
  ATTR_CARDS_SLIDE_SHADOWS,
  ATTR_COVERFLOW_DEPTH,
  ATTR_COVERFLOW_MODIFIER,
  ATTR_COVERFLOW_ROTATE,
  ATTR_COVERFLOW_SCALE,
  ATTR_COVERFLOW_SLIDE_SHADOWS,
  ATTR_COVERFLOW_STRETCH,
  ATTR_CUBE_SHADOW,
  ATTR_CUBE_SHADOW_OFFSET,
  ATTR_CUBE_SHADOW_SCALE,
  ATTR_CUBE_SLIDE_SHADOWS,
  ATTR_EFFECT,
  ATTR_FLIP_LIMIT_ROTATION,
  ATTR_FLIP_SLIDE_SHADOWS,
} from 'well-waterfall';

export default function effectCategory() {
  let config: WaterfallCategory = {
    name: 'Effect',
    id: 'effect',
    icon: faBolt,
    summary: 'Set the slide transition effect',
    description: 'Set the slide transition effect',
    groups: [
      {
        name: 'Coverflow',
        id: 'coverflow',
        items: [
          {
            name: 'Coverflow Depth',
            attr: ATTR_COVERFLOW_DEPTH,
            swiperDefault: '100',
            value: '',
            description: 'Depth offset in px (slides translate in Z axis)',

            type: 'number',
          },
          {
            name: 'Coverflow Modifier',
            attr: ATTR_COVERFLOW_MODIFIER,
            swiperDefault: '1',
            value: '',
            description: 'Effect multiplier',

            type: 'number',
          },
          {
            name: 'Coverflow Rotate',
            attr: ATTR_COVERFLOW_ROTATE,
            swiperDefault: '50',
            value: '',
            description: 'Slide rotate in degrees',

            type: 'number',
          },
          {
            name: 'Coverflow Scale',
            attr: ATTR_COVERFLOW_SCALE,
            swiperDefault: '1',
            value: '',
            description: 'Slide scale effect',

            type: 'number',
          },
          {
            name: 'Coverflow Slide Shadows',
            attr: ATTR_COVERFLOW_SLIDE_SHADOWS,
            swiperDefault: 'true',
            value: '',
            description: 'Enables slides shadows',

            type: 'boolean',
          },
          {
            name: 'Coverflow Stretch',
            attr: ATTR_COVERFLOW_STRETCH,
            swiperDefault: '0',
            value: '',
            description: 'Stretch space between slides (in px)',

            type: 'number',
          },
        ],
      },
      {
        name: 'Flip',
        id: 'flip',
        items: [
          {
            name: 'Flip Limit Rotation',
            attr: ATTR_FLIP_LIMIT_ROTATION,
            swiperDefault: 'true',
            value: '',
            description: 'Limit edge slides rotation',

            type: 'boolean',
          },
          {
            name: 'Flip Slide Shadows',
            attr: ATTR_FLIP_SLIDE_SHADOWS,
            swiperDefault: 'true',
            value: '',
            description: 'Enables slides shadows',

            type: 'boolean',
          },
        ],
      },
      {
        name: 'Cube',
        id: 'cube',
        items: [
          {
            name: 'Cube Shadow',
            attr: ATTR_CUBE_SHADOW,
            swiperDefault: 'true',
            value: '',
            description: 'Enables main slider shadow',

            type: 'boolean',
          },
          {
            name: 'Cube Shadow Offset',
            attr: ATTR_CUBE_SHADOW_OFFSET,
            swiperDefault: '20',
            value: '',
            description: 'Main shadow offset in px',

            type: 'number',
          },
          {
            name: 'Cube Shadow Scale',
            attr: ATTR_CUBE_SHADOW_SCALE,
            swiperDefault: '0.94',
            value: '',
            description: 'Main shadow scale ratio',

            type: 'number',
          },
          {
            name: 'Cube Slide Shadows',
            attr: ATTR_CUBE_SLIDE_SHADOWS,
            swiperDefault: 'true',
            value: '',
            description: 'Enables slides shadows',

            type: 'boolean',
          },
        ],
      },
      {
        name: 'Cards',
        id: 'cards',
        items: [
          {
            name: 'Cards Per Slide Offset',
            attr: ATTR_CARDS_PER_SLIDE_OFFSET,
            swiperDefault: '8',
            value: '',
            description: 'Offset distance per slide (in px)',

            type: 'number',
          },
          {
            name: 'Cards Per Slide Rotate',
            attr: ATTR_CARDS_PER_SLIDE_ROTATE,
            swiperDefault: '2',
            value: '',
            description: 'Rotate angle per slide (in degrees)',

            type: 'number',
          },
          {
            name: 'Cards Rotate',
            attr: ATTR_CARDS_ROTATE,
            swiperDefault: 'true',
            value: '',
            description: 'Enables cards rotation',

            type: 'boolean',
          },
          {
            name: 'Cards Slide Shadows',
            attr: ATTR_CARDS_SLIDE_SHADOWS,
            swiperDefault: 'true',
            value: '',
            description: 'Enables slides shadows',

            type: 'boolean',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Effect',
        attr: ATTR_EFFECT,
        swiperDefault: 'slide',
        value: '',
        description: 'Select an effect for the slide transitions',
        type: 'select',
        options: ['slide', 'fade', 'cube', 'coverflow', 'flip', 'creative', 'cards'],
      },
    ],
  };
  return config;
}
