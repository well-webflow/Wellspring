import { useEffect, useState } from 'react';
import { LoadedWaterfall, WaterfallState } from '../context/types';
import { WaterfallCategory } from '../../types/waterfall-types';
import { defaultWaterfallSettings } from '../utils/waterfallSettings.tsx';
import { findWaterfallSetting } from '../utils/waterfallHelpers.ts';
import { throwErrorIfWaterfallNotSelected } from '../utils/notices.ts';
import { getBaseAttr, getBreakpointAttr } from '../utils/attributes.ts';
import { createWaterfallCMSElement, createWaterfallElement } from '../utils/createElements.ts';
import { useNavigate } from 'react-router';

export function useWaterfallLogic(): WaterfallState {
  const [waterfalls, setWaterfalls] = useState<AnyElement[]>([]);
  const [waterfallNames, setWaterfallNames] = useState<string[]>([]);
  const [waterfallSettings, setWaterfallSettings] = useState<WaterfallCategory[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [elementSelected, setElementSelected] = useState<AnyElement | null>(null);
  const [waterfallSelected, setWaterfallSelected] = useState<string | null>(null);
  const [loadedWaterfall, setLoadedWaterfall] = useState<LoadedWaterfall | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const navigate = useNavigate();

  // Called to check if an element has been selected
  const selectedElementCallback = async (element: AnyElement | null) => {
    setElementSelected(element);
    if (!element) return;

    let waterfallName;
    if (element.type === 'DOM') {
      waterfallName = await element.getAttribute('waterfall');
    } else {
      if (!element?.customAttributes) return;
      waterfallName = await element.getCustomAttribute('waterfall');
    }

    if (waterfallName) {
      setWaterfallSelected(waterfallName);
    } else {
      setWaterfallSelected(null);
    }
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

  async function getWaterfallAttributes(el: AnyElement) {
    let attr;
    if (el.customAttributes) attr = await el.getAllCustomAttributes();
    if (el.type === 'DOM') attr = await el.getAllAttributes();
    return attr;
  }

  // Create a new waterfall object with all of the default props
  async function createWaterfall() {
    setIsLoading(true);
    const success = await createWaterfallElement(defaultWaterfallSettings);
    if (success) webflow.notify({ type: 'Success', message: 'Successfully Created new Waterfall' });
    await loadWaterfall();
    setIsLoading(false);
    navigate('/waterfall/edit');
  }

  async function createWaterfallCMS() {
    setIsLoading(true);
    const success = await createWaterfallCMSElement(defaultWaterfallSettings);
    if (success) webflow.notify({ type: 'Success', message: 'Successfully Created new CMS Waterfall' });
    await loadWaterfall();
    setIsLoading(false);
    navigate('/waterfall/edit');
  }

  //--- LOAD WATERFALL ---
  async function loadWaterfall() {
    setIsLoading(true);
    const el = await webflow.getSelectedElement();
    if (!el) return;
    const waterfallName = await getWaterfallName(el);

    setLoadedWaterfall({ name: waterfallName, el });
    const customAttributes = await getWaterfallAttributes(el);
    // Create a deep copy of the default waterfall props to update
    const updatedProps: WaterfallCategory[] = JSON.parse(JSON.stringify(defaultWaterfallSettings));

    // Iterate through all custom attributes and map them to updatedProps
    customAttributes?.forEach((attr) => {
      updatedProps.forEach((category) => {
        // Takes an attribute and breaks apart the breakpoint from the baseAttr
        const { baseAttr, breakpoint } = getBaseAttr(attr.name);

        let item = findWaterfallSetting(category, baseAttr);
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
    });

    setWaterfallSettings(updatedProps); // Update state with transformed data
    await searchForWaterfalls();
    setIsLoading(false);
  }

  async function loadAndEditWaterfall() {
    loadWaterfall();
    navigate('/waterfall/edit');
  }

  async function unloadWaterfall() {
    setWaterfallSelected(null);
    setWaterfallSettings(null);
    setSelectedCategory(null);
    setLoadedWaterfall(null);
  }

  /**
   * Update the Waterfall Settings
   * @param waterfallSettings The settings to update from
   * @param propAttrName The attribute to update
   * @param newValue The new attribute value
   * @param breakpoint Which breakpoint to apply this to, if applicable
   * @returns null
   */
  function updateWaterfall(propAttrName: string, newValue: string, breakpoint?: string) {
    if (!waterfallSettings) return;

    console.log('updating ', propAttrName, 'to ', newValue);

    const updatedData: WaterfallCategory[] = waterfallSettings.map((category) => {
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
            items: group.items.map((item) => {
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

    setWaterfallSettings(updatedData);
    return updatedData;
  }

  async function saveWaterfall() {
    const el = loadedWaterfall?.el;
    if (!el?.customAttributes) return;

    await throwErrorIfWaterfallNotSelected(el);

    const name = await el.getCustomAttribute('waterfall');
    setLoadedWaterfall({ name, el });

    const allSettings =
      waterfallSettings?.flatMap((category) => [
        ...(category.items ?? []),
        ...(category.groups?.flatMap((g) => g.items) ?? []),
      ]) ?? [];

    await Promise.all(
      allSettings.map(async (setting) => {
        const shouldRemove = !setting.value || setting.value === setting.swiperDefault;
        if (shouldRemove) {
          await el.removeCustomAttribute(setting.attr);
        } else {
          await el.setCustomAttribute(setting.attr, setting.value.toString());
        }

        if (setting.breakpoints) {
          await Promise.all(
            Object.entries(setting.breakpoints).map(async ([bp, val]) => {
              const attr = getBreakpointAttr(setting.attr, bp);
              if (!val) {
                await el.removeCustomAttribute(attr);
              } else {
                await el.setCustomAttribute(attr, val.toString());
              }
            })
          );
        }
      })
    );

    console.log('SAVE');

    await webflow.notify({
      type: 'Success',
      message: `Updated Waterfall '${name}' Successfully!`,
    });

    await searchForWaterfalls();
  }

  return {
    waterfalls,
    waterfallNames,
    waterfallSettings,
    setWaterfallSettings,
    selectedCategory,
    setSelectedCategory,
    elementSelected,
    waterfallSelected,
    loadedWaterfall,
    isLoading,
    setIsLoading,
    createWaterfall,
    createWaterfallCMS,
    loadWaterfall,
    loadAndEditWaterfall,
    unloadWaterfall,
    updateWaterfall,
    saveWaterfall,
    searchForWaterfalls,
    getWaterfallName,
  };
}
