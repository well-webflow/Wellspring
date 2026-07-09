/// <reference types="@webflow/designer-extension-typings" />

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

export interface WebflowSiteInfo {
  siteId: string;
  siteName: string;
  shortName: string;
}
