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
 * Get or Create Combo Style
 * Gets the combo class `name` sitting under `path`, creating it if it doesn't exist.
 * Webflow ties a combo class to the chain it combines with, so `.swiper.my-slider` and
 * `.swiper-slide.my-slider` are two different styles that happen to share a name — one
 * style object cannot be applied under both bases.
 *
 * Returns null when the class can't be resolved, rather than throwing: it is only a
 * styling convenience, so callers apply the base class on its own instead of failing.
 * @param path The chain the combo sits under, root style first
 * @param name The combo class name
 * @returns The combo style whose ancestor chain is `path`, or null
 */
export async function getOrCreateComboStyle(path: Style[], name: string): Promise<Style | null> {
  const parent = path[path.length - 1];
  const stylePath = [...path.map((style) => style.name), name];

  // A style at this path that isn't a combo can't be applied under it, so treat it as absent
  const existing = await webflow.getStyleByName(stylePath);
  if (existing?.type === 'combo') return existing;

  try {
    return await webflow.createStyle(name, { parent });
  } catch (error) {
    // Webflow rejects a name that collides with an existing style case-insensitively, and
    // two saves can race to create the same combo. Either way one exists now, so look again.
    const found = await webflow.getStyleByName(stylePath);
    if (found?.type === 'combo') return found;

    // getStyleByName matches case-sensitively, so a combo differing only in case is
    // invisible to it — the collision above. Find it the slow way.
    const lowered = name.toLowerCase();
    for (const style of await webflow.getAllStyles()) {
      if (style.type !== 'combo' || style.name.toLowerCase() !== lowered) continue;
      if ((await style.getParent())?.id === parent.id) return style;
    }

    console.warn(`Could not get or create the combo class "${name}" under "${parent.name}":`, error);
    return null;
  }
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

export async function hasAttributes(el: AnyElement) {
  if (el && el.customAttributes) return true;
  if (el.type === 'DOM') return true;
  return false;
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
 * @param value The value to set the attribute to (will be converted to string)
 */
export async function setAttribute(
  el: AnyElement,
  attr: string,
  value: string | number | boolean | null | undefined
) {
  const stringValue = value?.toString() ?? '';
  if (el.customAttributes) await el.setCustomAttribute(attr, stringValue);
  if (el.type === 'DOM') await el.setAttribute(attr, stringValue);
}
