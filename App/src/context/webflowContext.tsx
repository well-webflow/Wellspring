import { createContext, useContext, useEffect, useState } from 'react';

export type SelectedElementInfo = {
  type: string;
  classes: string[] | null;
};

interface WebflowContextType {
  elementSelected: AnyElement | null;
  elementInfo: SelectedElementInfo | null;
}

export const WebflowContext = createContext<WebflowContextType | undefined>(undefined);

export function WebflowProvider({ children }: { children: React.ReactNode }) {
  const [elementSelected, setElementSelected] = useState<AnyElement | null>(null);
  const [elementInfo, setElementInfo] = useState<SelectedElementInfo | null>(null);

  // Set the selected Element and a list of its styles
  const selectedElementCallback = async (element: AnyElement | null) => {
    setElementSelected(element);
    if (element && element.styles) {
      const styles = await element.getStyles();
      const t = element?.type || 'Unknown';

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
    }
  };

  // Subscribe to the selected element event
  useEffect(() => {
    const unsubscribeSelectedElement = webflow.subscribe('selectedelement', selectedElementCallback);
    return () => unsubscribeSelectedElement();
  }, []);

  return <WebflowContext.Provider value={{ elementSelected, elementInfo }}>{children}</WebflowContext.Provider>;
}

export function useWebflow() {
  const context = useContext(WebflowContext);
  if (context === undefined) {
    throw new Error('useWebflow must be used within an WebflowProvider');
  }
  return context;
}
