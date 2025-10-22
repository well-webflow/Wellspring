import {
  ATTR_WATERFALL_ELEMENT,
  EL_NAVIGATION_NEXT,
  EL_NAVIGATION_PREV,
  EL_PAGINATION,
  EL_PAGINATION_BULLET,
  EL_PAGINATION_BULLET_ACTIVE,
  EL_SCROLLBAR,
  EL_SCROLLBAR_DRAG,
  EL_SLIDE_COUNT,
} from 'well-waterfall';
import { getOrCreateStyle } from '../../../utils/webflowHelpers';
import { WaterfallCategory, WaterfallContentType } from '../waterfall';
import { addDefaultSettings } from './waterfallHelpers';

export const createWaterfallElement = async (
  waterfallConfig: WaterfallCategory[],
  mode: WaterfallContentType = 'static'
) => {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return false;

  // Ensure required styles exist
  const waterfall = await getOrCreateStyle('waterfall');
  const swiper = await getOrCreateStyle('swiper');
  const swiperWrapper = await getOrCreateStyle('swiper-wrapper');
  const swiperSlide = await getOrCreateStyle('swiper-slide');

  const waterfallDiv = await parentEl.prepend(webflow.elementPresets.DOM);
  waterfallDiv.setStyles([waterfall]);
  waterfallDiv.setTag('div');

  if (mode === 'cms') {
    // Append DynamoWrapper (Collection List Wrapper)
    const waterfallCMS = await waterfallDiv.append(webflow.elementPresets.DynamoWrapper);
    await waterfallCMS.setStyles([swiper]);

    // Set Collection List class to swiper-wrapper
    const [collectionList] = await waterfallCMS.getChildren();
    if (collectionList?.styles) {
      await collectionList.setStyles([swiperWrapper]);
    }

    // Set Collection Item class to swiper-slide
    if (!collectionList.children || !collectionList.getChildren) return false;
    const [collectionItem] = (await collectionList.getChildren()) ?? [];
    if (collectionItem?.styles) {
      await collectionItem.setStyles([swiperSlide]);
    }
  } else {
    const waterfallSwiper = await waterfallDiv.append(webflow.elementPresets.DOM);
    waterfallSwiper.setTag('div');
    waterfallSwiper.setStyles([swiper]);

    const waterfallWrapper = await waterfallSwiper.append(webflow.elementPresets.DOM);
    waterfallWrapper.setTag('div');
    waterfallWrapper.setStyles([swiperWrapper]);

    const waterfallSlide = await waterfallWrapper.append(webflow.elementPresets.DOM);
    waterfallSlide.setTag('div');
    waterfallSlide.setStyles([swiperSlide]);
  }

  addDefaultSettings(waterfallConfig, waterfallDiv);
  webflow.setSelectedElement(waterfallDiv);

  return true;
};

export async function createNavigation() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const navigationClass = await getOrCreateStyle('Navigation');
  const prevClass = await getOrCreateStyle('Prev Button');
  const nextClass = await getOrCreateStyle('Next Button');

  const navigation = await parentEl.prepend(webflow.elementPresets.DOM);
  navigation.setTag('div');
  navigation.setStyles([navigationClass]);

  const prevButton = await navigation.prepend(webflow.elementPresets.DOM);
  prevButton.setTag('button');
  prevButton.setAttribute(ATTR_WATERFALL_ELEMENT, EL_NAVIGATION_PREV);
  prevButton.setStyles([prevClass]);

  const nextButton = await navigation.prepend(webflow.elementPresets.DOM);
  nextButton.setTag('button');
  nextButton.setAttribute(ATTR_WATERFALL_ELEMENT, EL_NAVIGATION_NEXT);
  nextButton.setStyles([nextClass]);

  webflow.notify({
    type: 'Success',
    message: 'Added Navigation Elements',
  });
}

export async function convertElementToNextButton() {
  convertElementTo(EL_NAVIGATION_NEXT, 'Next Button');
}

export async function convertElementToPrevButton() {
  convertElementTo(EL_NAVIGATION_PREV, 'Prev Button');
}

export async function createPagination() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const paginationClass = await getOrCreateStyle('Pagination');
  const paginationBulletActiveClass = await getOrCreateStyle('Pagination Bullet Active');
  const paginationBulletClass = await getOrCreateStyle('Pagination Bullet');

  const pagination = await parentEl.prepend(webflow.elementPresets.DOM);
  pagination.setTag('div');
  pagination.setAttribute(ATTR_WATERFALL_ELEMENT, EL_PAGINATION);
  pagination.setStyles([paginationClass]);

  const paginationBulletActive = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBulletActive.setTag('button');
  paginationBulletActive.setAttribute(ATTR_WATERFALL_ELEMENT, EL_PAGINATION_BULLET_ACTIVE);
  paginationBulletActive.setStyles([paginationBulletActiveClass]);

  const paginationBullet = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBullet.setTag('button');
  paginationBullet.setAttribute(ATTR_WATERFALL_ELEMENT, EL_PAGINATION_BULLET);
  paginationBullet.setStyles([paginationBulletClass]);

  webflow.notify({
    type: 'Success',
    message: 'Added Pagination Elements',
  });
}

export async function convertElementToPaginationContainer() {
  convertElementTo(EL_PAGINATION, 'Pagination Container');
}

export async function convertElementToPaginationBullet() {
  convertElementTo(EL_PAGINATION_BULLET, 'Pagination Bullet');
}

export async function convertElementToPaginationBulletActive() {
  convertElementTo(EL_PAGINATION_BULLET_ACTIVE, 'Pagination Bullet Active');
}

export async function createScrollbar() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const scrollbarClass = await getOrCreateStyle('Scrollbar');
  const scrollbarDragClass = await getOrCreateStyle('Scrollbar Drag');

  const scrollbar = await parentEl.prepend(webflow.elementPresets.DOM);
  scrollbar.setTag('div');
  scrollbar.setStyles([scrollbarClass]);
  scrollbar.setAttribute(ATTR_WATERFALL_ELEMENT, EL_SCROLLBAR);

  const scrollbarDrag = await scrollbar.prepend(webflow.elementPresets.DOM);
  scrollbarDrag.setTag('button');
  scrollbarDrag.setStyles([scrollbarDragClass]);
  scrollbarDrag.setAttribute(ATTR_WATERFALL_ELEMENT, EL_SCROLLBAR_DRAG);

  webflow.notify({
    type: 'Success',
    message: 'Added Scrollbar Elements',
  });
}

export async function convertElementToScrollbarContainer() {
  convertElementTo(EL_SCROLLBAR, 'Scrollbar');
}

export async function convertElementToScrollbarDrag() {
  convertElementTo(EL_SCROLLBAR_DRAG, 'Scrollbar Drag');
}

/** SLIDE COUNT */

export async function convertElementToSlideCount() {
  convertElementTo(EL_SLIDE_COUNT, 'Slide Count');
}

export async function createSlideCount() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const slideCountClass = await getOrCreateStyle('Slide Count');

  const slideCount = await parentEl.prepend(webflow.elementPresets.DOM);
  slideCount.setTag('div');
  slideCount.setStyles([slideCountClass]);
  slideCount.setAttribute(ATTR_WATERFALL_ELEMENT, EL_SLIDE_COUNT);

  webflow.notify({
    type: 'Success',
    message: 'Added Slide Count',
  });
}

export async function convertElementTo(elAttr: string, name: string) {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute(ATTR_WATERFALL_ELEMENT, elAttr);
    webflow.notify({
      type: 'Success',
      message: `Element successfully converted to ${name}.`,
    });
  }
}

export async function addAttributeToSelectedElement(attr: string, value: string) {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute(attr, value);
  } else if (el?.type === 'DOM') {
    el.setAttribute(attr, value);
  } else {
    return false;
  }
  webflow.notify({
    type: 'Success',
    message: `Added ${attr} = ${value} to the Selected Element.`,
  });
}
