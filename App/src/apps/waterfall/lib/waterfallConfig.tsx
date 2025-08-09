import a11yConfig from '../modules/a11y';
import advancedCategory from '../modules/advanced';
import classnamesCategory from '../modules/classNames';
import controllerCategory from '../modules/controller';
import effectCategory from '../modules/effect';
import freemodeCategory from '../modules/freeMode';
import generalConfig from '../modules/general';
import keyboardCategory from '../modules/keyboard';
import layoutConfig from '../modules/layout';
import memoryCategory from '../modules/memory';
import mousewheelCategory from '../modules/mousewheel';
import navigationCategory from '../modules/navigation';
import ObserverCategory from '../modules/observer';
import paginationCategory from '../modules/pagination';
import playbackCategory from '../modules/playback';
import scrollbarCategory from '../modules/scrollbar';
import thumbsCategory from '../modules/thumbs';
import touchClickCategory from '../modules/touchClick';
import { WaterfallConfig } from '../waterfall';

export const defaultWaterfallConfig: WaterfallConfig = [
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
  ObserverCategory(),
  classnamesCategory(),
  advancedCategory(),
];
