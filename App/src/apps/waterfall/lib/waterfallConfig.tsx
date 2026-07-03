import a11yConfig from '../modules/a11y';
import advancedCategory from '../modules/advanced';
import classnamesCategory from '../modules/classNames';
import controllerCategory from '../modules/controller';
import effectCategory from '../modules/effect';
import freemodeCategory from '../modules/freeMode';
import keyboardMouseCategory from '../modules/keyboardMouse';
import layoutConfig from '../modules/layout';
import memoryCategory from '../modules/memory';
import navigationCategory from '../modules/navigation';
import ObserverCategory from '../modules/observer';
import paginationCategory from '../modules/pagination';
import playbackCategory from '../modules/playback';
import scrollbarCategory from '../modules/scrollbar';
import thumbsCategory from '../modules/thumbs';
import touchClickCategory from '../modules/touchClick';
import manipulationCategory from '../modules/manipulation';
import { WaterfallConfig } from '../waterfall';
import zoomCategory from '../modules/zoom';
import parallaxConfig from '../modules/parallax';

export const defaultWaterfallConfig: WaterfallConfig = [
  layoutConfig(),
  playbackCategory(),
  navigationCategory(),
  paginationCategory(),
  scrollbarCategory(),
  freemodeCategory(),
  touchClickCategory(),
  effectCategory(),
  parallaxConfig(),
  thumbsCategory(),
  keyboardMouseCategory(),
  memoryCategory(),
  manipulationCategory(),
  controllerCategory(),
  a11yConfig(),
  ObserverCategory(),
  zoomCategory(),
  classnamesCategory(),
  advancedCategory(),
  // VIRTUAL (NOT IMPLEMENTED)
];
