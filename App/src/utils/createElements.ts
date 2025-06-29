import { WaterfallCategory } from '../../types/waterfall-types';
import { addDefaultSettings, getOrCreateStyle } from './webflowHelpers';

export async function createPagination() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const paginationClass = await getOrCreateStyle('Pagination');
  const paginationBulletActiveClass = await getOrCreateStyle('Pagination Bullet Active');
  const paginationBulletClass = await getOrCreateStyle('Pagination Bullet');

  const pagination = await parentEl.prepend(webflow.elementPresets.DOM);
  pagination.setTag('div');
  pagination.setAttribute('waterfall-el', 'pagination');
  pagination.setStyles([paginationClass]);

  const paginationBulletActive = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBulletActive.setTag('button');
  paginationBulletActive.setAttribute('waterfall-el', 'pagination-bullet-active');
  paginationBulletActive.setStyles([paginationBulletActiveClass]);

  const paginationBullet = await pagination.prepend(webflow.elementPresets.DOM);
  paginationBullet.setTag('button');
  paginationBullet.setAttribute('waterfall-el', 'pagination-bullet');
  paginationBullet.setStyles([paginationBulletClass]);

  webflow.notify({
    type: 'Success',
    message: 'Added Pagination to DOM',
  });
}

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
  prevButton.setAttribute('waterfall-el', 'prev');
  prevButton.setStyles([prevClass]);

  const nextButton = await navigation.prepend(webflow.elementPresets.DOM);
  nextButton.setTag('button');
  nextButton.setAttribute('waterfall-el', 'next');
  nextButton.setStyles([nextClass]);

  webflow.notify({
    type: 'Success',
    message: 'Added Navigation to DOM',
  });
}

export async function createScrollbar() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const scrollbarClass = await getOrCreateStyle('Scrollbar');
  const scrollbarDragClass = await getOrCreateStyle('Scrollbar Drag');

  const scrollbar = await parentEl.prepend(webflow.elementPresets.DOM);
  scrollbar.setTag('div');
  scrollbar.setStyles([scrollbarClass]);
  scrollbar.setAttribute('waterfall-el', 'scrollbar');

  const scrollbarDrag = await scrollbar.prepend(webflow.elementPresets.DOM);
  scrollbarDrag.setTag('button');
  scrollbarDrag.setStyles([scrollbarDragClass]);
  scrollbarDrag.setAttribute('waterfall-el', 'scrollbar-drag');
}

export async function convertToPaginationBulletActive() {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute('waterfall-el', 'pagination-bullet-active');
    webflow.notify({
      type: 'Success',
      message: 'Element successfully converted to Pagination Bullet (Active).',
    });
  }
}

export async function convertToScrollbar() {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute('waterfall-el', 'scrollbar');
    webflow.notify({
      type: 'Success',
      message: 'Element successfully converted to Scrollbar.',
    });
  }
}

export async function convertToWaterfallEl(attr: string, name: string): Promise<void> {
  const el = await webflow.getSelectedElement();
  if (el?.customAttributes) {
    el.setCustomAttribute('waterfall-el', attr);
    webflow.notify({
      type: 'Success',
      message: `Element successfully converted to ${name}`,
    });
  }
}
export const createWaterfallElement = async (defaultWaterfallSettings: WaterfallCategory[]) => {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return false;

  const waterfallDiv = await parentEl.prepend(webflow.elementPresets.DOM);
  waterfallDiv.setTag('waterfall');

  // Ensure required styles exist
  const swiper = await getOrCreateStyle('swiper');
  const swiperWrapper = await getOrCreateStyle('swiper-wrapper');
  const swiperSlide = await getOrCreateStyle('swiper-slide');

  const waterfallSwiper = await waterfallDiv.append(webflow.elementPresets.DOM);
  waterfallSwiper.setTag('div');
  waterfallSwiper.setStyles([swiper]);

  const waterfallWrapper = await waterfallSwiper.append(webflow.elementPresets.DOM);
  waterfallWrapper.setTag('div');
  waterfallWrapper.setStyles([swiperWrapper]);

  const waterfallSlide = await waterfallWrapper.append(webflow.elementPresets.DOM);
  waterfallSlide.setTag('div');
  waterfallSlide.setStyles([swiperSlide]);

  addDefaultSettings(defaultWaterfallSettings, waterfallDiv);
  webflow.setSelectedElement(waterfallDiv);

  // Add modules
  createNavigation();
  createPagination();
  createScrollbar();

  return true;
};

export const createWaterfallCMSElement = async (defaultWaterfallSettings: WaterfallCategory[]) => {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return false;

  const waterfallDiv = await parentEl.prepend(webflow.elementPresets.DOM);
  waterfallDiv.setTag('waterfall');

  // Ensure required styles exist
  const swiper = await getOrCreateStyle('swiper');
  const swiperWrapper = await getOrCreateStyle('swiper-wrapper');
  const swiperSlide = await getOrCreateStyle('swiper-slide');

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

  addDefaultSettings(defaultWaterfallSettings, waterfallDiv);

  webflow.setSelectedElement(waterfallDiv);

  // Add modules
  createNavigation();
  createPagination();
  createScrollbar();
  return true;
};
