import { BreakpointObject } from '../../wellflow';

export type EditMode = 'new' | 'edit' | 'view';
export type WaterfallContentType = 'static' | 'cms';

export type WaterfallConfig = WaterfallCategory[];

export type CategoryScreen = {
  [key: string]: JSX.Element;
};

// Categories -- Large Groups of Settings (Pagination, Navigation, etc.)
export interface WaterfallCategory {
  name: string;
  id: string;
  icon?: IconDefinition;
  description?: string;
  summary?: string;
  groups?: WaterfallGroup[];
  items?: WaterfallSetting[];
  component?: React.ComponentType;
}

// Groups -- Groups of Settings within a Category (General, Advanced, etc.)
export interface WaterfallGroup {
  name: string;
  id: string;
  icon?: IconDefinition;
  description?: string;
  actions?: Action[];
  items: WaterfallSetting[];
}

// Settings
export type SettingType = 'boolean' | 'string' | 'number' | 'select' | 'waterfall' | 'waterfall-multiple';

export interface WaterfallSetting {
  name: string;
  attr: string;
  type: SettingType;
  swiperDefault: string;
  description: string;
  value: string;
  options?: string[];
  breakpoints?: BreakpointObject;
  icon?: IconDefinition;
}

// Actions
export type Action = {
  label: string;
  func: () => Promise<void>;
};

export type LoadedWaterfall = {
  name: string | null;
  el: AnyElement | null;
};

interface WaterfallState {
  waterfalls: AnyElement[];
  waterfallNames: string[];
  waterfallConfig: WaterfallCategory[] | null;
  initNewWaterfall: () => void;
  setWaterfallConfig: (value: WaterfallCategory[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  createWaterfall: () => void;
  loadWaterfall: () => Promise<string | null | undefined>;
  loadedWaterfall: LoadedWaterfall | null;
  unloadWaterfall: () => void;
  updateWaterfall: (propAttrName: string, newValue: string, breakpoint?: string) => void;
  saveWaterfall: () => Promise<void>;
  searchForWaterfalls: () => void;
  getWaterfallName: (el: AnyElement) => Promise<string | null>;
  findWaterfallByName: (name: string) => Promise<AnyElement | null>;
  waterfallSelected: string | null;
  isLoading: Boolean;
  setIsLoading: (value: Boolean) => void;
}
