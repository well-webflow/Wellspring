import { WaterfallMode } from '../utils/createElements';
import { LoadedWaterfall } from './waterfall-types';

export const websiteBreakpoints = ['lmobile', 'tablet', 'desktop', 'large', 'xlarge'] as const;

export type Breakpoints = (typeof websiteBreakpoints)[number];

export type BreakpointObject = {
  [key in Breakpoints]: string;
};

export type Action = {
  label: string;
  func: () => Promise<void>;
};

export type SettingType = 'boolean' | 'string' | 'number' | 'select' | 'waterfall' | 'waterfall-multiple';

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

export interface WaterfallGroup {
  name: string;
  id: string;
  icon?: IconDefinition;
  description?: string;
  actions?: Action[];
  items: WaterfallSetting[];
}

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
export type LoadedWaterfall = {
  name: string | null;
  el: AnyElement | null;
}; // Define the shape of the context state
interface WaterfallState {
  waterfalls: AnyElement[];
  waterfallNames: string[];
  waterfallSettings: WaterfallCategory[] | null;
  setWaterfallSettings: (value: WaterfallCategory[]) => void;
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
