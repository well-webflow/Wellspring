import { createContext, useContext, useState } from 'react';

interface WellflowApp {
  id: string;
  name: string;
  imageSrc: string;
}

const approvedApps: WellflowApp[] = [
  {
    id: 'waterfall',
    name: 'Waterfall',
    imageSrc: '/brand/waterfall.png',
  },
];

interface WellflowContextType {
  activeApp: WellflowApp | null;
  changeActiveApp: (app: string) => void;
  appIcon: string;
  approvedApps: WellflowApp[];
}

export const WellflowContext = createContext<WellflowContextType | undefined>(undefined);

export function WellflowProvider({ children }: { children: React.ReactNode }) {
  const [activeApp, setActiveApp] = useState<WellflowApp | null>(null);
  const [appIcon, setAppIcon] = useState<string>('');

  const changeActiveApp = (app: string) => {
    const selectedApp = approvedApps.find((a) => a.name.toLowerCase() === app.toLowerCase());
    if (selectedApp) {
      setActiveApp(selectedApp);
      setAppIcon(selectedApp.imageSrc);
    } else {
      setActiveApp(null);
      setAppIcon('');
    }
  };

  return (
    <WellflowContext.Provider value={{ activeApp, changeActiveApp, appIcon, approvedApps }}>
      {children}
    </WellflowContext.Provider>
  );
}

export function useWellflow() {
  const context = useContext(WellflowContext);
  if (context === undefined) {
    throw new Error('useWellflow must be used within a WellflowProvider');
  }
  return context;
}
