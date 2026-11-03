import {
  ATTR_WATERFALL,
  ATTR_WATERFALL_ELEMENT,
  EL_NAVIGATION_NEXT,
  EL_NAVIGATION_PREV,
  EL_PAGINATION,
  EL_PAGINATION_BULLET,
  EL_SCROLLBAR,
  EL_SCROLLBAR_DRAG,
  EL_SLIDE_COUNT,
  EL_AUTOPLAY_CONTROL,
  EL_AUTOPLAY_CONTROL_PAUSE,
  EL_AUTOPLAY_CONTROL_PLAY,
} from 'well-waterfall/attributes';
import {
  getAttribute,
  getOrCreateComboStyle,
  getOrCreateStyle,
  hasAttributes,
  setAttribute,
} from '../../../utils/webflowHelpers';
import { WaterfallCategory, WaterfallContentType } from '../waterfall';
import { addDefaultSettings, waterfallNameToClass } from './waterfallHelpers';

// The three elements that carry a waterfall's name class, by their base class
const STRUCTURAL_CLASSES = ['swiper', 'swiper-wrapper', 'swiper-slide'];
const isStructural = (name: string) => STRUCTURAL_CLASSES.includes(name);

// What the wrapper was classed before it took the waterfall's name
const LEGACY_WRAPPER_CLASS = 'waterfall';

export const createWaterfallElement = async (
  waterfallConfig: WaterfallCategory[],
  mode: WaterfallContentType = 'static',
  waterfallName?: string
) => {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return false;

  // Ensure required styles exist
  const swiper = await getOrCreateStyle('swiper');
  const swiperWrapper = await getOrCreateStyle('swiper-wrapper');
  const swiperSlide = await getOrCreateStyle('swiper-slide');

  // Each slider's three structural elements also carry a class named after the
  // waterfall, so one page can style its sliders separately. It is a combo class, so
  // each base needs its own — see getOrCreateComboStyle. Kept in sync by
  // syncWaterfallNameClass when the name changes.
  const nameClass = waterfallName ? waterfallNameToClass(waterfallName) : '';
  const withName = async (base: Style) => {
    if (!nameClass) return [base];
    const combo = await getOrCreateComboStyle([base], nameClass);
    return combo ? [base, combo] : [base];
  };

  // The wrapper is classed with the waterfall's own name. Without a usable name it keeps
  // the generic class, so the element is never left without one.
  const wrapperStyle = await getOrCreateStyle(nameClass || LEGACY_WRAPPER_CLASS);

  const waterfallDiv = await parentEl.prepend(webflow.elementPresets.DOM);
  waterfallDiv.setStyles([wrapperStyle]);
  waterfallDiv.setTag('div');

  if (mode === 'cms') {
    // Append DynamoWrapper (Collection List Wrapper)
    const waterfallCMS = await waterfallDiv.append(webflow.elementPresets.DynamoWrapper);
    await waterfallCMS.setStyles(await withName(swiper));

    // Set Collection List class to swiper-wrapper
    const [collectionList] = await waterfallCMS.getChildren();
    if (collectionList?.styles) {
      await collectionList.setStyles(await withName(swiperWrapper));
    }

    // Set Collection Item class to swiper-slide
    if (!collectionList.children || !collectionList.getChildren) return false;
    const [collectionItem] = (await collectionList.getChildren()) ?? [];
    if (collectionItem?.styles) {
      await collectionItem.setStyles(await withName(swiperSlide));
    }
  } else {
    const waterfallSwiper = await waterfallDiv.append(webflow.elementPresets.DOM);
    waterfallSwiper.setTag('div');
    waterfallSwiper.setStyles(await withName(swiper));

    const waterfallWrapper = await waterfallSwiper.append(webflow.elementPresets.DOM);
    waterfallWrapper.setTag('div');
    waterfallWrapper.setStyles(await withName(swiperWrapper));

    const waterfallSlide = await waterfallWrapper.append(webflow.elementPresets.DOM);
    waterfallSlide.setTag('div');
    waterfallSlide.setStyles(await withName(swiperSlide));
  }

  addDefaultSettings(waterfallConfig, waterfallDiv);

  // Set the waterfall name if provided
  if (waterfallName) {
    waterfallDiv.setAttribute(ATTR_WATERFALL, waterfallName);
  }

  webflow.setSelectedElement(waterfallDiv);

  return true;
};

/**
 * Sync Waterfall Name Class
 * Keeps the class named after a waterfall in step with its name: on the wrapper, where it
 * is the element's own class, and on the three structural elements — the swiper, the
 * swiper-wrapper and every swiper-slide — where it is a combo class.
 *
 * A slider that already has the class is handled by renaming the style itself, which keeps
 * every property, breakpoint and pseudo-state the designer set on it, and keeps it applied
 * wherever it is used. Creating a class under the new name instead would leave all of that
 * behind on the old one. A slider that never had the class — one built before it existed —
 * gains it.
 * @param el The waterfall element
 * @param oldName The name the waterfall had, if any
 * @param newName The name it is being saved under
 */
export async function syncWaterfallNameClass(el: AnyElement, oldName: string | null, newName: string) {
  const newClass = waterfallNameToClass(newName);
  if (!newClass) return;

  const oldClass = oldName ? waterfallNameToClass(oldName) : '';

  // Renaming is what preserves the designer's styling, so it is tried first everywhere the
  // class already exists. It fails if something else already holds the new name, since two
  // styles cannot merge; the caller then falls back to applying that existing class.
  const rename = async (style: Style) => {
    try {
      await style.setName(newClass);
      return true;
    } catch (error) {
      console.warn(
        `Could not rename the class "${style.name}" to "${newClass}" — a style of that name ` +
          `already exists, so the styling on "${style.name}" stays behind:`,
        error
      );
      return false;
    }
  };

  // The wrapper carries the name as its own class rather than as a combo
  if (el.styles) {
    const chain = ((await el.getStyles()) ?? []).filter((style): style is Style => style !== null);
    const [root, ...rest] = chain;
    // Only a lone root class is ours to touch: anything further in the chain is combined
    // with it, and extra classes are the designer's to manage.
    const lone = root && !rest.length;

    if (!chain.length) {
      await el.setStyles([await getOrCreateStyle(newClass)]);
    } else if (lone && root.name === oldClass && oldClass !== newClass) {
      if (!(await rename(root))) await el.setStyles([await getOrCreateStyle(newClass)]);
    } else if (lone && root.name === LEGACY_WRAPPER_CLASS) {
      // Every older slider shares this generic class, so it is swapped rather than
      // renamed — renaming it would rename it for all of them.
      await el.setStyles([await getOrCreateStyle(newClass)]);
    }
  }

  const visit = async (parent: AnyElement) => {
    if (!parent.children || !parent.getChildren) return;

    for (const child of await parent.getChildren()) {
      // A nested slider (a thumbs or controller waterfall) owns its own name, so
      // neither it nor its subtree takes this one's class
      if (await getAttribute(child, ATTR_WATERFALL)) continue;

      if (child.styles) {
        const chain = ((await child.getStyles()) ?? []).filter((style): style is Style => style !== null);
        const names = chain.map((style) => style.name);
        const last = chain[chain.length - 1];

        // The combo class can only be swapped where it sits at the end of the chain:
        // dropping one from the middle would orphan the combos defined under it.
        if (last?.name === newClass) {
          // already named
        } else if (oldClass && oldClass !== newClass && last?.name === oldClass) {
          if (!(await rename(last))) {
            const path = chain.slice(0, -1);
            const combo = await getOrCreateComboStyle(path, newClass);
            if (combo) await child.setStyles([...path, combo]);
          }
        } else if (!names.includes(oldClass) && !names.includes(newClass) && names.some(isStructural)) {
          const combo = await getOrCreateComboStyle(chain, newClass);
          if (combo) await child.setStyles([...chain, combo]);
        }
      }

      await visit(child);
    }
  };

  await visit(el);
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

  const prevButton = await navigation.append(webflow.elementPresets.DOM);
  prevButton.setTag('button');
  prevButton.setAttribute(ATTR_WATERFALL_ELEMENT, EL_NAVIGATION_PREV);
  prevButton.setStyles([prevClass]);

  const nextButton = await navigation.append(webflow.elementPresets.DOM);
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

  const paginationClass = await getOrCreateStyle('waterfall-pagination');
  // Swiper names the active bullet itself, so this style matches its default for
  // pagination.bulletActiveClass; override it with the Bullet Active Class setting.
  await getOrCreateStyle('swiper-pagination-bullet-active');
  // The bullet below donates its classes to every generated bullet, so start it on
  // Swiper's own class: its bundled CSS then styles the bullets out of the box, and
  // any class the designer adds alongside is donated too. The Bullet Class setting
  // overrides the whole lot.
  const paginationBulletClass = await getOrCreateStyle('swiper-pagination-bullet');

  const pagination = await parentEl.prepend(webflow.elementPresets.DOM);
  pagination.setTag('div');
  pagination.setAttribute(ATTR_WATERFALL_ELEMENT, EL_PAGINATION);
  pagination.setStyles([paginationClass]);

  // Donates its tag name and its classes to the generated bullets
  const paginationBullet = await pagination.append(webflow.elementPresets.DOM);
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

export async function createScrollbar() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const scrollbarClass = await getOrCreateStyle('Scrollbar');
  // Swiper builds the drag handle itself, but reuses the drag element below when it
  // carries the class the handle is given. Starting it on Swiper's own class means the
  // bundled CSS styles the handle out of the box, and any class the designer adds
  // alongside is donated too. The Drag Class setting overrides the whole lot.
  const scrollbarDragClass = await getOrCreateStyle('swiper-scrollbar-drag');

  const scrollbar = await parentEl.prepend(webflow.elementPresets.DOM);
  scrollbar.setTag('div');
  scrollbar.setStyles([scrollbarClass]);
  scrollbar.setAttribute(ATTR_WATERFALL_ELEMENT, EL_SCROLLBAR);

  // Donates its classes to the drag handle Swiper builds inside the track
  const scrollbarDrag = await scrollbar.append(webflow.elementPresets.DOM);
  scrollbarDrag.setTag('div');
  scrollbarDrag.setAttribute(ATTR_WATERFALL_ELEMENT, EL_SCROLLBAR_DRAG);
  scrollbarDrag.setStyles([scrollbarDragClass]);

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
  if (!el || !(await hasAttributes(el))) {
    webflow.notify({ type: 'Error', message: `Select an element that can hold attributes to convert it to ${name}.` });
    return;
  }

  await setAttribute(el, ATTR_WATERFALL_ELEMENT, elAttr);
  webflow.notify({
    type: 'Success',
    message: `Element successfully converted to ${name}.`,
  });
}

export async function addAttributeToSelectedElement(attr: string, value: string) {
  const el = await webflow.getSelectedElement();
  if (!el || !(await hasAttributes(el))) {
    webflow.notify({ type: 'Error', message: `Select an element that can hold attributes to add ${attr}.` });
    return false;
  }

  await setAttribute(el, attr, value);
  webflow.notify({
    type: 'Success',
    message: `Added ${attr} = ${value} to the Selected Element.`,
  });
}

/** AUTOPLAY CONTROL */

export async function createAutoplayControl() {
  const parentEl = await webflow.getSelectedElement();
  if (!parentEl?.children) return;

  const buttonClass = await getOrCreateStyle('Autoplay Button');
  const playIconClass = await getOrCreateStyle('Play Icon');
  const pauseIconClass = await getOrCreateStyle('Pause Icon');

  const button = await parentEl.prepend(webflow.elementPresets.DOM);
  button.setTag('button');
  button.setStyles([buttonClass]);
  button.setAttribute(ATTR_WATERFALL_ELEMENT, EL_AUTOPLAY_CONTROL);

  const pauseIcon = await button.append(webflow.elementPresets.DOM);
  pauseIcon.setTag('div');
  pauseIcon.setStyles([pauseIconClass]);
  pauseIcon.setAttribute(ATTR_WATERFALL_ELEMENT, EL_AUTOPLAY_CONTROL_PAUSE);
  pauseIcon.setTextContent('⏸');

  const playIcon = await button.append(webflow.elementPresets.DOM);
  playIcon.setTag('div');
  playIcon.setStyles([playIconClass]);
  playIcon.setAttribute(ATTR_WATERFALL_ELEMENT, EL_AUTOPLAY_CONTROL_PLAY);
  playIcon.setTextContent('▶');

  webflow.notify({
    type: 'Success',
    message: 'Added Autoplay Control',
  });
}

export async function convertElementToAutoplayButton() {
  convertElementTo(EL_AUTOPLAY_CONTROL, 'Autoplay Button');
}

export async function convertElementToAutoplayPlayIcon() {
  convertElementTo(EL_AUTOPLAY_CONTROL_PLAY, 'Play Icon');
}

export async function convertElementToAutoplayPauseIcon() {
  convertElementTo(EL_AUTOPLAY_CONTROL_PAUSE, 'Pause Icon');
}
