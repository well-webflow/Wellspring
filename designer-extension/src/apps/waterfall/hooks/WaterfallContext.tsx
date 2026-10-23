import React, { createContext, useContext } from 'react';
import { WaterfallState } from '../waterfall';
import { useWaterfallLogic } from './useWaterfallLogic';

// Create the context with an initial value of undefined
const WaterfallContext = createContext<WaterfallState | undefined>(undefined);

// Create the context provider
export const WaterfallProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useWaterfallLogic();

  return <WaterfallContext.Provider value={value}>{children}</WaterfallContext.Provider>;
};

// Hook to use Waterfall
export const useWaterfall = (): WaterfallState => {
  const context = useContext(WaterfallContext);
  if (!context) {
    // During development hot-reload, log warning instead of throwing
    if (process.env.NODE_ENV === 'development') {
      console.warn('useWaterfallContext must be used within a Waterfall Provider - this may be a hot-reload issue');
      // Return a minimal fallback to prevent crash during HMR
      return {
        waterfalls: [],
        waterfallNames: [],
        waterfallConfig: null,
        initNewWaterfall: () => {},
        setWaterfallConfig: () => {},
        selectedCategory: null,
        setSelectedCategory: () => {},
        contentType: 'static',
        setContentType: () => {},
        createWaterfall: () => {},
        loadWaterfall: async () => null,
        loadedWaterfall: null,
        unloadWaterfall: () => {},
        updateWaterfall: () => {},
        saveWaterfall: async () => {},
        searchForWaterfalls: () => {},
        getWaterfallName: async () => null,
        findWaterfallByName: async () => null,
        waterfallSelected: null,
        isLoading: false,
        setIsLoading: () => {},
        activeBreakpoint: null,
        setActiveBreakpoint: () => {},
      } as WaterfallState;
    }
    throw new Error('useWaterfallContext must be used within an Waterfall Provider');
  }
  return context;
};
