import React, { createContext, useContext } from 'react';
import { WaterfallState } from './types';
import { useWaterfallLogic } from '../handlers/useWaterfallLogic';

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
    throw new Error('useWaterfallContext must be used within an Waterfall Provider');
  }
  return context;
};
