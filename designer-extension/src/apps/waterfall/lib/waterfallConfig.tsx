import a11yConfig from '../modules/a11y';
import advancedCategory from '../modules/advanced';
import controllerCategory from '../modules/controller';
import effectCategory from '../modules/effect';
import freemodeCategory from '../modules/freeMode';
import keyboardMouseCategory from '../modules/keyboardMouse';
import layoutConfig from '../modules/layout';
import manipulationCategory from '../modules/manipulation';
import memoryCategory from '../modules/memory';
import navigationCategory from '../modules/navigation';
import ObserverCategory from '../modules/observer';
import paginationCategory from '../modules/pagination';
import playbackCategory from '../modules/playback';
import scrollbarCategory from '../modules/scrollbar';
import slideCountCategory from '../modules/slideCount';
import thumbsCategory from '../modules/thumbs';
import touchClickCategory from '../modules/touchClick';
import { WaterfallConfig } from '../waterfall';
import zoomCategory from '../modules/zoom';

export const defaultWaterfallConfig: WaterfallConfig = [
  layoutConfig(),
  playbackCategory(),
  navigationCategory(),
  paginationCategory(),
  scrollbarCategory(),
  slideCountCategory(),
  manipulationCategory(),
  freemodeCategory(),
  touchClickCategory(),
  effectCategory(),
  thumbsCategory(),
  keyboardMouseCategory(),
  memoryCategory(),
  controllerCategory(),
  a11yConfig(),
  ObserverCategory(),
  zoomCategory(),
  advancedCategory(),
  // VIRTUAL (NOT IMPLEMENTED)
];
