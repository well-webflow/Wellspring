import { WaterfallCategory } from '../../types/waterfall-types';
import { WebflowSiteInfo } from '../../types/types';
import axiosInstance from './axios';

/**
 * Check if the Wellflow script is installed for the given site.
 * @param siteData Webflow site info
 * @param sessionToken Auth token
 * @returns `true` if installed, otherwise `false`
 */
export const isWellflowScriptInstalled = async (
  siteData: WebflowSiteInfo | null,
  sessionToken: string
): Promise<boolean> => {
  if (!siteData?.siteId) return false;

  try {
    const response = await axiosInstance.get('/custom-code/installed', {
      headers: { Authorization: `Bearer ${sessionToken}` },
      params: { siteId: siteData.siteId },
    });

    return Boolean(response.data.installed);
  } catch (error) {
    console.error('Error checking if Wellflow script is installed:', error);
    return false;
  }
};

// Load and add Waterfall Settings as attributes
export function addDefaultSettings(defaultWaterfallSettings: WaterfallCategory[], waterfallDiv: DOMElement) {
  defaultWaterfallSettings.forEach((group) => {
    group.items?.forEach((prop) => {
      waterfallDiv.setAttribute(prop.attr, prop.value?.toString());
    });
    group.groups?.forEach((group) => {
      group.items?.forEach((prop) => {
        waterfallDiv.setAttribute(prop.attr, prop.value?.toString());
      });
    });
  });
  return waterfallDiv;
}

/**
 * Get or Create Style
 * Gets a Webflow Style by name. If it doesn't exist, creates one and returns it.
 * @param style The class (style)
 * @returns A webflow style
 */
export async function getOrCreateStyle(style: string) {
  let webflowStyle = await webflow.getStyleByName(style);

  //FIXME - Webflow cannot correctly check if the style exists because it isn't checking case sensitive, but throws an issue if there is a case insensitive match
  if (!webflowStyle) webflowStyle = await webflow.getStyleByName(style.toLowerCase());

  if (!webflowStyle) webflowStyle = await webflow.createStyle(style);
  return webflowStyle;
}

/**
 * Get Attributes
 * Retrieves attributes from an AnyElement regardless of its type
 * @param el AnyElement
 * @returns Attributes of an AnyElement, or null
 */
export async function getAttributes(el: AnyElement | null) {
  let attr;
  if (el && el.customAttributes) attr = await el.getAllCustomAttributes();
  if (el && el.type === 'DOM') attr = await el.getAllAttributes();
  return attr;
}

/**
 * Get Attribute
 * Retrieves an attribute by name from an AnyElement regardless of its type
 * @param el AnyElement
 * @param attr The name of the attribute to get
 * @returns
 */
export async function getAttribute(el: AnyElement, attr: string) {
  let a;
  if (el && el.customAttributes) a = await el.getCustomAttribute(attr);
  if (el.type === 'DOM') a = await el.getAttribute(attr);
  return a;
}

/**
 * Remove Attribute
 * Removes an attribute by name from an AnyElement regardless of its type
 * @param el AnyElement
 * @param attr The name of the attribute to remove
 */
export async function removeAttribute(el: AnyElement, attr: string) {
  if (el.customAttributes) await el.removeCustomAttribute(attr);
  if (el.type === 'DOM') await el.removeAttribute(attr);
}

/**
 * Set Attribute
 * Sets the value of an attribute by name from an AnyElement regardless of its type
 * @param el AnyElement
 * @param attr The name of the attribute to set
 * @param value The value to set the attribute to
 */
export async function setAttribute(el: AnyElement, attr: string, value: any) {
  if (el.customAttributes) await el.setCustomAttribute(attr, value.toString());
  if (el.type === 'DOM') await el.setAttribute(attr, value.toString());
}
