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

  const setting = allSettings.find(
    (item) => item.attr === baseAttr || Object.values(item.exclusiveAttrs ?? {}).includes(baseAttr)
  );

  return setting;
}

// Load and add Waterfall Settings as attributes
export function addDefaultSettings(defaultWaterfallSettings: WaterfallConfig, waterfallDiv: DOMElement) {
  const processItem = (prop: WaterfallSetting) => {
    // Mutually-exclusive group: only the attribute the chosen option names is set
    if (prop.exclusiveAttrs) {
      const attr = prop.exclusiveAttrs[prop.value];
      if (attr) waterfallDiv.setAttribute(attr, 'true');
      return;
    }

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

/**
 * Waterfall Name To Class
 * Converts a waterfall's name into the kebab-case class that identifies its
 * swiper, swiper-wrapper and swiper-slide elements, so each slider on a page can
 * be styled on its own (`.swiper.my-slider`, `.swiper-slide.my-slider`, ...).
 * @param name The waterfall name, as stored in the `waterfall` attribute
 * @returns The class name, or '' when the name has no usable characters
 */
export function waterfallNameToClass(name: string): string {
  return name
    .replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, '$1-$2') // split camelCase before lowercasing
    .replace(/[^\p{L}\p{N}]+/gu, '-') // keep accented letters rather than dropping them
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}
