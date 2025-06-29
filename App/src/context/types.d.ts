export interface AuthContextType {
  idToken: string;
  sessionToken: string;
  user: User | null;
  isLoading: boolean;
  codeInstalled: boolean;
  siteData: WebflowSiteInfo | null;
  refetchAuth: () => void;
  openAuthWindow: () => void;
}

// Define the shape of the context state
interface WaterfallState {
  waterfalls: AnyElement[];
  waterfallNames: string[];
  waterfallSettings: WaterfallCategory[] | null;
  setWaterfallSettings: (value: WaterfallCategory[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  createWaterfall: () => void;
  createWaterfallCMS: () => void;
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

export type LoadedWaterfall = {
  name: string | null;
  el: AnyElement | null;
};

export interface WebflowSiteInfo {
  siteId: string;
  siteName: string;
  shortName: string;
}
