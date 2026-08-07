import { createContext, useContext, useEffect, useState } from 'react';

export type SelectedElementInfo = {
  type: string;
  classes: string[] | null;
};

interface WebflowContextType {
  elementSelected: AnyElement | null;
  elementInfo: SelectedElementInfo | null;
  isAuthorized: boolean | null;
  isCodeInstalled: boolean | null;
  checkAuthStatus: () => Promise<void>;
}

export const WebflowContext = createContext<WebflowContextType | undefined>(undefined);

export function WebflowProvider({ children }: { children: React.ReactNode }) {
  const [elementSelected, setElementSelected] = useState<AnyElement | null>(null);
  const [elementInfo, setElementInfo] = useState<SelectedElementInfo | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCodeInstalled, setIsCodeInstalled] = useState<boolean | null>(null);

  // Check authorization and installation status
  const checkAuthStatus = async () => {
    try {
      const siteInfo = await webflow.getSiteInfo();

      const res = await fetch(`https://wellspring.sirkevinicus.workers.dev/sites/${siteInfo.siteId}/status`, {
        method: 'GET',
      });

      console.log('Status check response:', res.status);

      if (res.status === 404) {
        setIsAuthorized(false);
        setIsCodeInstalled(false);
        return;
      }

      if (res.ok) {
        const data = await res.json() as { authorized: boolean; installed: boolean };
        console.log('Status data:', data);
        setIsAuthorized(data.authorized);
        setIsCodeInstalled(data.installed);
      } else {
        console.error('Status check failed:', res.status);
        setIsAuthorized(false);
        setIsCodeInstalled(false);
      }
    } catch (err) {
      console.error('Status check error:', err);
      setIsAuthorized(false);
      setIsCodeInstalled(false);
    }
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
