import { createContext, useContext, useState } from 'react';

interface WellflowContextType {
  activeApp: string;
  setActiveApp: (app: string) => void;
}

export const WellflowContext = createContext<WellflowContextType | undefined>(undefined);

export function WellflowProvider({ children }: { children: React.ReactNode }) {
  const [activeApp, setActiveApp] = useState<string>('');

  return <WellflowContext.Provider value={{ activeApp, setActiveApp }}>{children}</WellflowContext.Provider>;
}

export function useWellflow() {
  const context = useContext(WellflowContext);
  if (context === undefined) {
    throw new Error('useWellflow must be used within a WellflowProvider');
  }
  return context;
}
