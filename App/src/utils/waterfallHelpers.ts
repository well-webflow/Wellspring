import { WaterfallCategory, WaterfallSetting } from '../../types/waterfall-types';
import { createNavigation } from './modules/navigation';
import { createPagination } from './modules/pagination';
import { createScrollbar } from './modules/scrollbar';
import { addDefaultSettings, getOrCreateStyle } from './webflowHelpers';

/**
 * Find Waterfall Setting
 * Searches A Waterfall Category for a Setting
 * @param category The category to search
 * @param baseAttr The attribute without any screen size modifiers such as mobile- tablet- etc.
 * @returns The matching WaterfallSetting or undefined if not found
 */
export function findWaterfallSetting(category: WaterfallCategory, baseAttr: string): WaterfallSetting | undefined {
  // Search in top-level items if they exist
  if (category.items) {
    const foundInItems = category.items.find((item) => item.attr === baseAttr);
    if (foundInItems) return foundInItems;
  }

  // Search in groups if they exist
  if (category.groups) {
    for (const group of category.groups) {
      const foundInGroup = group.items.find((item) => item.attr === baseAttr);
      if (foundInGroup) return foundInGroup;
    }
  }

  // Return undefined if no match is found
  return undefined;
}

export type WaterfallMode = 'static' | 'cms';

export const createWaterfallElement = async (
  defaultWaterfallSettings: WaterfallCategory[],
  mode: WaterfallMode = 'static'
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

  addDefaultSettings(defaultWaterfallSettings, waterfallDiv);
  webflow.setSelectedElement(waterfallDiv);

  createNavigation();
  createPagination();
  createScrollbar();

  return true;
};
