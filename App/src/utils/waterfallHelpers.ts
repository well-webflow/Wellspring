import {
  WaterfallCategory,
  WaterfallSetting,
} from '../../types/waterfall-types';

/**
 * Find Waterfall Setting
 * Searches A Waterfall Category for a Setting
 * @param category The category to search
 * @param baseAttr The attribute without any screen size modifiers such as mobile- tablet- etc.
 * @returns The matching WaterfallSetting or undefined if not found
 */
export function findWaterfallSetting(
  category: WaterfallCategory,
  baseAttr: string
): WaterfallSetting | undefined {
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
