import { BreakpointObject } from '../../wellflow';

export type WaterfallMode = 'static' | 'cms';

export type WaterfallConfig = WaterfallCategory[];

// Categories -- Large Groups of Settings (Pagination, Navigation, etc.)
export interface WaterfallCategory {
  name: string;
  id: string;
  icon?: IconDefinition;
  description?: string;
  summary?: string;
  groups?: WaterfallGroup[];
  items?: WaterfallSetting[];
  actions?: Action[];
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
  setWaterfallConfig: (value: WaterfallCategory[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  createWaterfall: (mode: WaterfallMode) => void;
  loadWaterfall: () => void;
  loadAndEditWaterfall: () => void;
  loadedWaterfall: LoadedWaterfall | null;
  unloadWaterfall: () => void;
  updateWaterfall: (propAttrName: string, newValue: string, breakpoint?: string) => void;
  saveWaterfall: () => Promise<void>;
  searchForWaterfalls: () => void;
  getWaterfallName: (el: AnyElement) => Promise<string | null>;
  elementSelected: AnyElement | null;
  waterfallSelected: string | null;
  isLoading: Boolean;
  setIsLoading: (value: Boolean) => void;
}
