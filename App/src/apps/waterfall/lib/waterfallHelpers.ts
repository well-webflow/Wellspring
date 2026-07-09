import { WaterfallConfig, WaterfallSetting } from '../waterfall';
import { getBreakpointAttr } from '../../../utils/attributes';
import { Breakpoints } from '../../../utils/breakpoints';

/**
 * Find Waterfall Setting
 * Searches A Waterfall Category for a Setting
 * @param baseAttr The attribute without any screen size modifiers such as mobile- tablet- etc.
 * @returns The matching WaterfallSetting or undefined if not found
 */
export function findWaterfallSetting(waterfallConfig: WaterfallConfig, baseAttr: string): WaterfallSetting | undefined {
  if (!waterfallConfig) {
    return undefined;
  }
  const allSettings = waterfallConfig.flatMap((category) => [
    ...(category.items ?? []),
    ...(category.groups?.flatMap((g) => g.items) ?? []),
  ]);

  const setting = allSettings.find((item) => item.attr === baseAttr);

  return setting;
}

// Load and add Waterfall Settings as attributes
export function addDefaultSettings(defaultWaterfallSettings: WaterfallConfig, waterfallDiv: DOMElement) {
  const processItem = (prop: WaterfallSetting) => {
    // Only set attribute if value exists and is different from default
    const shouldSet = prop.value && prop.value !== prop.swiperDefault;
    if (shouldSet) {
      waterfallDiv.setAttribute(prop.attr, prop.value?.toString());
    }

    // Also set breakpoint attributes if they exist
    if (prop.breakpoints) {
      Object.entries(prop.breakpoints).forEach(([breakpoint, value]) => {
        if (value) {
          const attr = getBreakpointAttr(prop.attr, breakpoint as Breakpoints);
          waterfallDiv.setAttribute(attr, value.toString());
        }
      });
    }
  };

  defaultWaterfallSettings.forEach((group) => {
    group.items?.forEach(processItem);
    group.groups?.forEach((subgroup) => {
      subgroup.items?.forEach(processItem);
    });
  });
  return waterfallDiv;
}
