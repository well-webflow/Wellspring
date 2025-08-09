// context/authContext.tsx
import { createContext } from 'react';
import { SessionUser } from '../utils/tokenManager';
import { WebflowSiteInfo } from '../wellflow';

interface AuthContextType {
  idToken: string;
  sessionToken: string;
  user: SessionUser | null;
  isLoading: boolean;
  codeInstalled: boolean;
  siteData: WebflowSiteInfo | null;
  refetchAuth: () => void;
  openAuthWindow: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
