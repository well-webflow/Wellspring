import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  EditMode,
  LoadedWaterfall,
  WaterfallCategory,
  WaterfallConfig,
  WaterfallContentType,
  WaterfallState,
} from '../waterfall';
import { getAttribute, getAttributes, removeAttribute, setAttribute } from '../../../utils/webflowHelpers';
import { createWaterfallElement } from '../lib/waterfallElements';
import { findWaterfallSetting } from '../lib/waterfallHelpers';
import { defaultWaterfallConfig } from '../lib/waterfallConfig';
import { getBaseAttr, getBreakpointAttr } from '../../../utils/attributes';
import { Breakpoints } from '../../../utils/breakpoints';
import { deepCloneWithFunctions } from '../utils/categoryParser';
import { ATTR_WATERFALL_CONTENT } from 'well-waterfall';

export function useWaterfallLogic(): WaterfallState {
  const [waterfalls, setWaterfalls] = useState<AnyElement[]>([]);
  const [mode, setMode] = useState<EditMode>('view');
  const [waterfallNames, setWaterfallNames] = useState<string[]>([]);
  const [waterfallConfig, setWaterfallConfig] = useState<WaterfallConfig | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [waterfallSelected, setWaterfallSelected] = useState<string | null>(null);
  const [loadedWaterfall, setLoadedWaterfall] = useState<LoadedWaterfall | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const navigate = useNavigate();

  // Check if a Waterfall has been selected
  const selectedElementCallback = async (element: AnyElement | null) => {
    if (!element) return;

    let waterfallName = await getAttribute(element, 'waterfall');

    if (waterfallName) setWaterfallSelected(waterfallName);
    else setWaterfallSelected(null);
  };

  // Subscribe to the selected element event
  useEffect(() => {
    const unsubscribeSelectedElement = webflow.subscribe('selectedelement', selectedElementCallback);
    return () => unsubscribeSelectedElement();
  }, []);

  async function searchForWaterfalls() {
    const els = await webflow.getAllElements();
    const waterfalls: AnyElement[] = [];
    const names: string[] = [];
    await Promise.all(
      els.map(async (el) => {
        let wtf = await getWaterfallName(el);
        if (wtf) {
          waterfalls.push(el);
          names.push(wtf);
        }
      })
    );
    setWaterfalls(waterfalls);
    setWaterfallNames(names);
  }

  async function findWaterfallByName(name: string) {
    const els = await webflow.getAllElements();
    for (const el of els) {
      let wtf = await getWaterfallName(el);
      if (wtf === name) return el;
    }
    return null;
  }

  async function getWaterfallName(el: AnyElement) {
    let name;
    if (el.customAttributes) {
      name = await el.getCustomAttribute('waterfall');
    }
    if (el.type === 'DOM') {
      name = await el.getAttribute('waterfall');
    }
    if (name) return name;
    else return null;
  }

  /**
   * INIT NEW WATERFALL
   * Initialize a new Waterfall with default settings for editing in New Mode
   */
  async function initNewWaterfall() {
    setIsLoading(true);

    setWaterfallConfig(defaultWaterfallConfig);
    setLoadedWaterfall({ name: 'New Waterfall', el: null });

    setIsLoading(false);
  }

  /**
   * CREATE WATERFALL
   * Create a new waterfall object with all of the default props
   */
  async function createWaterfall() {
    setIsLoading(true);
    if (!waterfallConfig) return;

    // Find the content mode (CMS or Static)
    const mode = (findWaterfallSetting(waterfallConfig, ATTR_WATERFALL_CONTENT)?.value ||
      'static') as WaterfallContentType;

    const success = await createWaterfallElement(waterfallConfig, mode);
    if (success) webflow.notify({ type: 'Success', message: 'Created new Waterfall' });

    const waterfallName = await loadWaterfall();

    setIsLoading(false);
    navigate(`/waterfall/edit/${waterfallName}`);
  }

  /**
   * LOAD WATERFALL
   * @returns The name of the loaded waterfall or undefined if no element selected
   */
  async function loadWaterfall(): Promise<string | null | undefined> {
    setIsLoading(true);
    const el = await webflow.getSelectedElement();
    if (!el) {
      setIsLoading(false);
      return undefined;
    }

    const waterfallName = await getWaterfallName(el);
    setLoadedWaterfall({ name: waterfallName, el });

    // Create a deep copy of the default waterfall props to update
    const updatedProps: WaterfallCategory[] = deepCloneWithFunctions(defaultWaterfallConfig);

    const customAttributes = await getAttributes(el);
    // Iterate through all custom attributes and map them to updatedProps
    customAttributes?.forEach((attr) => {
      // Takes an attribute and breaks apart the breakpoint from the baseAttr
      const { baseAttr, breakpoint } = getBaseAttr(attr.name);

      let item = findWaterfallSetting(updatedProps, baseAttr);
      if (item) {
        if (breakpoint) {
          // ✅ Directly assign value in the breakpoints object
          if (item.breakpoints && breakpoint in item.breakpoints) {
            item.breakpoints[breakpoint as keyof typeof item.breakpoints] = attr.value;
          }
        } else {
          // ✅ Update base value if no breakpoint prefix
          item.value = attr.value;
        }
      }
    });

    setWaterfallConfig(updatedProps); // Update state with transformed data
    await searchForWaterfalls();
    setIsLoading(false);
    return waterfallName;
  }

  /**
   * UNLOAD WATERFALL
   * Clear out all waterfall data from state
   */
  async function unloadWaterfall() {
    setWaterfallSelected(null);
    setWaterfallConfig(null);
    setSelectedCategory(null);
    setLoadedWaterfall(null);
  }

  /**
   * UPDATE WATERFALL
   * @param waterfallSettings The settings to update from
   * @param propAttrName The attribute to update
   * @param newValue The new attribute value
   * @param breakpoint Which breakpoint to apply this to, if applicable
   * @returns null
   */
  async function updateWaterfall(propAttrName: string, newValue: string, breakpoint?: string) {
    if (!waterfallConfig) return;

    const updatedData: WaterfallConfig = waterfallConfig.map((category) => {
      return {
        ...category,
        items: category.items?.map((item) => {
          if (item.attr === propAttrName) {
            if (breakpoint && item.breakpoints) {
              return {
                ...item,
                breakpoints: {
                  ...item.breakpoints,
                  [breakpoint]: newValue,
                },
              };
            }
            return { ...item, value: newValue };
          }
          return item;
        }),
        groups: category.groups?.map((group) => {
          return {
            ...group,
            items: group.items?.map((item) => {
              if (item.attr === propAttrName) {
                if (breakpoint && item.breakpoints) {
                  return {
                    ...item,
                    breakpoints: {
                      ...item.breakpoints,
                      [breakpoint]: newValue,
                    },
                  };
                }
                return { ...item, value: newValue };
              }
              return item;
            }),
          };
        }),
      };
    });

    setWaterfallConfig(updatedData);
    return updatedData;
  }

  async function saveWaterfall() {
    const el = loadedWaterfall?.el;
    if (!el) return;
    const attr = await getAttributes(el);
    if (!attr) return;

    const allSettings =
      waterfallConfig?.flatMap((category) => [
        ...(category.items ?? []),
        ...(category.groups?.flatMap((g) => g.items) ?? []),
      ]) ?? [];

    try {
      await Promise.all(
        allSettings.map(async (setting) => {
          if (!setting.attr) {
            console.warn(`Skipping invalid setting (missing attr):`, setting);
            return;
          }

          const shouldRemove = !setting.value || setting.value === setting.swiperDefault;

          if (shouldRemove) {
            await removeAttribute(el, setting.attr);
          } else {
            await setAttribute(el, setting.attr, setting.value);
          }

          if (setting.breakpoints) {
            await Promise.all(
              Object.entries(setting.breakpoints).map(async ([bp, val]) => {
                const attr = getBreakpointAttr(setting.attr, bp as Breakpoints);
                val ? await setAttribute(el, attr, val) : await removeAttribute(el, attr);
                return;
              })
            );
          }
        })
      );
    } catch (error) {
      console.log(error);
    }

    // Update the name
    const name = await getAttribute(el, 'waterfall');
    if (name) setLoadedWaterfall({ name, el });

    await webflow.notify({
      type: 'Success',
      message: `${name} has been saved!`,
    });

    await searchForWaterfalls();
  }

  return {
    waterfalls,
    mode,
    setMode,
    waterfallNames,
    waterfallConfig,
    initNewWaterfall,
    setWaterfallConfig,
    selectedCategory,
    setSelectedCategory,
    waterfallSelected,
    loadedWaterfall,
    isLoading,
    setIsLoading,
    createWaterfall,
    loadWaterfall,
    unloadWaterfall,
    updateWaterfall,
    saveWaterfall,
    searchForWaterfalls,
    getWaterfallName,
    findWaterfallByName,
  };
}
