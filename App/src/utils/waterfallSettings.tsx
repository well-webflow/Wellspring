import { WaterfallCategory } from '../../types/waterfall-types';

import generalConfig from '../apps/waterfall/modules/general';
import layoutConfig from '../apps/waterfall/modules/layout';
import playbackCategory from '../apps/waterfall/modules/playback';
import navigationCategory from '../apps/waterfall/modules/navigation';
import paginationCategory from '../apps/waterfall/modules/pagination';
import freemodeCategory from '../apps/waterfall/modules/freeMode';
import touchClickCategory from '../apps/waterfall/modules/touchClick';
import effectCategory from '../apps/waterfall/modules/effect';
import thumbsCategory from '../apps/waterfall/modules/thumbs';
import keyboardCategory from '../apps/waterfall/modules/keyboard';
import mousewheelCategory from '../apps/waterfall/modules/mousewheel';
import memoryCategory from '../apps/waterfall/modules/memory';
import controllerCategory from '../apps/waterfall/modules/controller';
import a11yConfig from '../apps/waterfall/modules/a11y';
import classnamesCategory from '../apps/waterfall/modules/classNames';
import advancedCategory from '../apps/waterfall/modules/advanced';
import scrollbarCategory from '../apps/waterfall/modules/scrollbar';

export const defaultWaterfallSettings: WaterfallCategory[] = [
  generalConfig(),
  layoutConfig(),
  playbackCategory(),
  navigationCategory(),
  paginationCategory(),
  scrollbarCategory(),
  freemodeCategory(),
  touchClickCategory(),
  // PARALLAX (NOT IMPLEMENTED)
  effectCategory(),
  thumbsCategory(),
  // ZOOM (NOT IMPLEMENTED)
  keyboardCategory(),
  mousewheelCategory(),
  // VIRTUAL (NOT IMPLEMENTED)
  memoryCategory(),
  // HISTORY NAVIGATION (NOT IMPLEMENTED)
  controllerCategory(),
  a11yConfig(),
  classnamesCategory(),
  advancedCategory(),
];
