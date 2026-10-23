import { createContext, useContext, useEffect, useState } from 'react';
import { checkStatus } from '../lib/api';

export type SelectedElementInfo = {
  type: string;
  classes: string[] | null;
};

interface WebflowContextType {
  elementSelected: AnyElement | null;
  elementInfo: SelectedElementInfo | null;
  isAuthorized: boolean | null;
  isCodeInstalled: boolean | null;
  checkAuthStatus: () => Promise<{ authorized: boolean; installed: boolean }>;
}

export const WebflowContext = createContext<WebflowContextType | undefined>(undefined);

export function WebflowProvider({ children }: { children: React.ReactNode }) {
  const [elementSelected, setElementSelected] = useState<AnyElement | null>(null);
  const [elementInfo, setElementInfo] = useState<SelectedElementInfo | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCodeInstalled, setIsCodeInstalled] = useState<boolean | null>(null);

  // Check authorization and installation status
  const checkAuthStatus = async () => {
    const { authorized, installed } = await checkStatus();
    console.log('Status check:', { authorized, installed });
    setIsAuthorized(authorized);
    setIsCodeInstalled(installed);
    return { authorized, installed };
  };

  // Set the selected Element and a list of its styles
  const selectedElementCallback = async (element: AnyElement | null) => {
    // Immediately set the element (this triggers render)
    setElementSelected(element);

    if (element) {
      const t = element?.type || 'Unknown';

      if (element.styles) {
        const styles = await element.getStyles();
        const styleDetails = (
          await Promise.all(
            styles?.map(async (style) => {
              if (!style) return null;
              const styleName = await style.getName();
              return styleName;
            }) ?? []
          )
        ).filter((name): name is string => !!name); // <- This ensures string[]

        setElementInfo({ type: t, classes: styleDetails });
      } else {
        // Element has no styles, just set the type
        setElementInfo({ type: t, classes: null });
      }
    } else {
      setElementInfo(null);
    }
  };

  // Subscribe to the selected element event
  useEffect(() => {
    const unsubscribeSelectedElement = webflow.subscribe('selectedelement', selectedElementCallback);
    return () => unsubscribeSelectedElement();
  }, []);

  // Check auth status on initialization
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <WebflowContext.Provider value={{ elementSelected, elementInfo, isAuthorized, isCodeInstalled, checkAuthStatus }}>
      {children}
    </WebflowContext.Provider>
  );
}

export function useWebflow() {
  const context = useContext(WebflowContext);
  if (context === undefined) {
    throw new Error('useWebflow must be used within an WebflowProvider');
  }
  return context;
}
