import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { WaterfallCategory } from '../../../../types/waterfall-types';
import { getOrCreateStyle } from '../../../utils/webflowHelpers';
import {
  ATTR_PAGINATION_CLICKABLE,
  ATTR_PAGINATION_CLICKABLE_CLASS,
  ATTR_PAGINATION_CURRENT_CLASS,
  ATTR_PAGINATION_DYNAMIC_BULLETS,
  ATTR_PAGINATION_DYNAMIC_MAIN_BULLETS,
  ATTR_PAGINATION_ENABLED,
  ATTR_PAGINATION_HIDDEN_CLASS,
  ATTR_PAGINATION_HIDE_ON_CLICK,
  ATTR_PAGINATION_HORIZONTAL_CLASS,
  ATTR_PAGINATION_LOCK_CLASS,
  ATTR_PAGINATION_MODIFIER_CLASS,
  ATTR_PAGINATION_PAGINATION_DISABLED_CLASS,
  ATTR_PAGINATION_PROGRESSBAR_FILL_CLASS,
  ATTR_PAGINATION_PROGRESSBAR_OPPOSITE,
  ATTR_PAGINATION_TOTAL_CLASS,
  ATTR_PAGINATION_TYPE,
  ATTR_PAGINATION_VERTICAL_CLASS,
  ATTR_WATERFALL_ELEMENT,
} from 'well-waterfall/src/lib/attributes';

export default function paginationCategory() {
  let config: WaterfallCategory = {
    name: 'Pagination',
    id: 'pagination',
    icon: faEllipsis,
    summary: 'Add pagination bullets or progress bar to the slider',
    description: 'Add pagination bullets or progress bar to the slider',
    groups: [
      {
        name: 'Dynamic',
        id: 'pagination-dynamic',
        items: [
          {
            name: 'Dynamic Bullets',
            attr: ATTR_PAGINATION_DYNAMIC_BULLETS,
            swiperDefault: 'false',
            value: '',
            description:
              'Good to enable if you use bullets pagination with a lot of slides. So it will keep only few bullets visible at the same time.',
            tested: false,
            type: 'boolean',
          },
          {
            name: 'Dynamic Main Bullets',
            attr: ATTR_PAGINATION_DYNAMIC_MAIN_BULLETS,
            swiperDefault: '1',
            value: '',
            description: 'The number of main bullets visible when dynamicBullets enabled.',
            tested: false,
            type: 'number',
          },
        ],
      },
      {
        name: 'Class Names',
        id: 'pagination-class-names',
        items: [
          {
            name: 'Clickable Class',
            attr: ATTR_PAGINATION_CLICKABLE_CLASS,
            swiperDefault: 'swiper-pagination-clickable',
            value: '',
            description: 'CSS class name set to pagination when it is clickable',
            tested: false,
            type: 'string',
          },
          {
            name: 'Current Class',
            attr: ATTR_PAGINATION_CURRENT_CLASS,
            swiperDefault: 'swiper-pagination-current',
            value: '',
            description: 'CSS class name of the element with currently active index in "fraction" pagination',
            tested: false,
            type: 'string',
          },
          {
            name: 'Hidden Class',
            attr: ATTR_PAGINATION_HIDDEN_CLASS,
            swiperDefault: 'swiper-pagination-hidden',
            value: '',
            description: 'CSS class name of pagination when it becomes inactive',
            tested: false,
            type: 'string',
          },
          {
            name: 'Horizontal Class',
            attr: ATTR_PAGINATION_HORIZONTAL_CLASS,
            swiperDefault: 'swiper-pagination-horizontal',
            value: '',
            description: 'CSS class name set to pagination in horizontal Swiper',
            tested: false,
            type: 'string',
          },
          {
            name: 'Lock Class',
            attr: ATTR_PAGINATION_LOCK_CLASS,
            swiperDefault: 'swiper-pagination-lock',
            value: '',
            description: 'CSS class name added to navigation button when it is disabled',
            tested: false,
            type: 'string',
          },
          {
            name: 'Modifier Class',
            attr: ATTR_PAGINATION_MODIFIER_CLASS,
            swiperDefault: 'swiper-pagination-',
            value: '',
            description:
              'The beginning of the modifier CSS class name that will be added to pagination depending on parameters',
            tested: false,
            type: 'string',
          },
          {
            name: 'Pagination Disabled Class',
            attr: ATTR_PAGINATION_PAGINATION_DISABLED_CLASS,
            swiperDefault: 'swiper-pagination-disabled',
            value: '',
            description:
              'CSS class name added on swiper container and pagination element when pagination is disabled by breakpoint',
            tested: false,
            type: 'string',
          },
          {
            name: 'Progressbar Fill Class',
            attr: ATTR_PAGINATION_PROGRESSBAR_FILL_CLASS,
            swiperDefault: 'swiper-pagination-progressbar-fill',
            value: '',
            description: 'CSS class name of pagination progressbar fill element',
            tested: false,
            type: 'string',
          },
          {
            name: 'Progressbar Opposite Class',
            attr: ATTR_PAGINATION_PROGRESSBAR_OPPOSITE,
            swiperDefault: 'swiper-pagination-progressbar-opposite',
            value: '',
            description: 'CSS class name of pagination progressbar opposite',
            tested: false,
            type: 'string',
          },
          {
            name: 'Total Class',
            attr: ATTR_PAGINATION_TOTAL_CLASS,
            swiperDefault: 'swiper-pagination-total',
            value: '',
            description: 'CSS class name of the element with total number of "snaps" in "fraction" pagination',
            tested: false,
            type: 'string',
          },
          {
            name: 'Vertical Class',
            attr: ATTR_PAGINATION_VERTICAL_CLASS,
            swiperDefault: 'swiper-pagination-vertical',
            value: '',
            description: 'CSS class name set to pagination in vertical Swiper',
            tested: false,
            type: 'string',
          },
        ],
      },
    ],
    items: [
      {
        name: 'Type',
        attr: ATTR_PAGINATION_TYPE,
        swiperDefault: 'bullets',
        value: 'bullets',
        description:
          "String with type of pagination. Can be 'bullets', 'numberBullets', 'fraction', 'progressbar' or 'custom'",
        options: ['bullets', 'numberBullets', 'fraction', 'progressbar', 'custom'],
        type: 'select',
        tested: false,
      },
      {
        name: 'Clickable',
        attr: ATTR_PAGINATION_CLICKABLE,
        swiperDefault: 'false',
        value: '',
        description:
          'If true then clicking on pagination button will cause transition to appropriate slide. Only for bullets pagination type',
        type: 'boolean',
        tested: false,
      },
      {
        name: 'Enabled',
        attr: ATTR_PAGINATION_ENABLED,
        swiperDefault: '',
        value: '',
        type: 'boolean',
        description: 'Boolean property to use with breakpoints to enable/disable pagination on certain breakpoints',
        tested: false,
      },
      {
        name: 'Hide on Click',
        attr: ATTR_PAGINATION_HIDE_ON_CLICK,
        swiperDefault: 'true',
        value: '',
        type: 'boolean',
        description: "Toggle (hide/show) pagination container visibility after click on Slider's container",
        tested: false,
      },
      {
        name: 'Progressbar Opposite',
        attr: ATTR_PAGINATION_PROGRESSBAR_OPPOSITE,
        swiperDefault: 'false',
        value: '',
        description:
          "Makes pagination progressbar opposite to Swiper's direction parameter, means vertical progressbar for horizontal swiper direction and horizontal progressbar for vertical swiper direction",
        tested: false,
        type: 'boolean',
      },
    ],
    actions: [
      {
        label: 'Pagination',
        func: createPagination,
      },
    ],
  };
  return config;
}

export async function convertToPaginationBulletActive() {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute(ATTR_WATERFALL_ELEMENT, 'pagination-bullet-active');
    webflow.notify({
      type: 'Success',
      message: 'Element successfully converted to Pagination Bullet (Active).',
    });
  }
}

export async function createPagination() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const paginationClass = await getOrCreateStyle('Pagination');
  const paginationBulletActiveClass = await getOrCreateStyle('Pagination Bullet Active');
  const paginationBulletClass = await getOrCreateStyle('Pagination Bullet');

  const pagination = await parentEl.prepend(webflow.elementPresets.DOM);
  pagination.setTag('div');
  pagination.setAttribute(ATTR_WATERFALL_ELEMENT, 'pagination');
  pagination.setStyles([paginationClass]);

  const paginationBulletActive = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBulletActive.setTag('button');
  paginationBulletActive.setAttribute(ATTR_WATERFALL_ELEMENT, 'pagination-bullet-active');
  paginationBulletActive.setStyles([paginationBulletActiveClass]);

  const paginationBullet = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBullet.setTag('button');
  paginationBullet.setAttribute(ATTR_WATERFALL_ELEMENT, 'pagination-bullet');
  paginationBullet.setStyles([paginationBulletClass]);

  webflow.notify({
    type: 'Success',
    message: 'Added Pagination Elements',
  });
}
