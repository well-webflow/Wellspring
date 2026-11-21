import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { checkStatus, type Release, type SiteStatus, type UpdateKind } from '../lib/api';
import { SKIP_AUTH } from '../lib/devMode';

export type SelectedElementInfo = {
  type: string;
  classes: string[] | null;
};

interface WebflowContextType {
  elementSelected: AnyElement | null;
  elementInfo: SelectedElementInfo | null;
  isAuthorized: boolean | null;
  isCodeInstalled: boolean | null;
  /** The Waterfall version on the site. null until the status check answers. */
  installedVersion: string | null;
  /** The version this app pins. null until the status check answers. */
  latestVersion: string | null;
  /** null while unknown, matching the isAuthorized/isCodeInstalled convention. */
  updateKind: UpdateKind | null;
  /** Releases between the installed version and the pinned one. Newest first. */
  updateReleases: Release[];
  checkAuthStatus: () => Promise<SiteStatus>;
}

export const WebflowContext = createContext<WebflowContextType | undefined>(undefined);

export function WebflowProvider({ children }: { children: React.ReactNode }) {
  const [elementSelected, setElementSelected] = useState<AnyElement | null>(null);
  const [elementInfo, setElementInfo] = useState<SelectedElementInfo | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCodeInstalled, setIsCodeInstalled] = useState<boolean | null>(null);
  const [installedVersion, setInstalledVersion] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [updateKind, setUpdateKind] = useState<UpdateKind | null>(null);
  const [updateReleases, setUpdateReleases] = useState<Release[]>([]);

  const lastCheckedAt = useRef(0);

  // Only touches setState and a ref, so it never needs to change identity.
  const applyStatus = useCallback((status: SiteStatus) => {
    setIsAuthorized(status.authorized);
    setIsCodeInstalled(status.installed);
    setInstalledVersion(status.installedVersion);
    setLatestVersion(status.latestVersion);
    setUpdateKind(status.updateKind);
    setUpdateReleases(status.updateReleases);
    lastCheckedAt.current = Date.now();
    return status;
  }, []);

  // Check authorization and installation status
  const checkAuthStatus = useCallback(async () => {
    // Dev only: report the site as ready without calling the API, so the Designer-side
    // features can be used in a test environment that cannot complete authorization.
    // The version fields have to be filled in too, or dev mode reports a phantom update.
    if (SKIP_AUTH) {
      return applyStatus({
        authorized: true,
        installed: true,
        installedVersion: null,
        latestVersion: null,
        updateKind: 'none',
        updateReleases: [],
      });
    }

    return applyStatus(await checkStatus());
  }, [applyStatus]);

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

  // Check auth status on initialization. checkAuthStatus is stable, so this runs once.
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Re-check when the user comes back to the Designer, so a publish made in another
  // tab clears the "publish to go live" reminder without reopening the panel.
  // Throttled, because focus fires often and the check costs a Webflow API call.
  useEffect(() => {
    const recheckIfStale = () => {
      if (document.visibilityState === 'hidden') return;
      if (Date.now() - lastCheckedAt.current < 30_000) return;
      checkAuthStatus();
    };

    window.addEventListener('focus', recheckIfStale);
    document.addEventListener('visibilitychange', recheckIfStale);
    return () => {
      window.removeEventListener('focus', recheckIfStale);
      document.removeEventListener('visibilitychange', recheckIfStale);
    };
  }, [checkAuthStatus]);

  return (
    <WebflowContext.Provider
      value={{
        elementSelected,
        elementInfo,
        isAuthorized,
        isCodeInstalled,
        installedVersion,
        latestVersion,
        updateKind,
        updateReleases,
        checkAuthStatus,
      }}
    >
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
