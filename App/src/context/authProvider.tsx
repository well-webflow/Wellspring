// context/authProvider.tsx
import { useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './authContext';
import { fetchSessionToken, getStoredSession, isTokenValid, SessionUser, storeSession } from '../utils/tokenManager';
import { WebflowSiteInfo } from '../wellflow';

const SESSION_TOKEN_NAME = 'wf_hybrid_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [idToken, setIdToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState<WebflowSiteInfo | null>(null);
  const [codeInstalled] = useState(true);

  const AUTH_URL = import.meta.env.VITE_AUTH_URL;

  /**
   * GET SESSION
   * This function gets the session token by sending the idToken and siteId to the server.
   */
  const getSession = async () => {
    console.log('Exchanging and verifying ID token...');
    try {
      setIsLoading(true);

      const idToken = await webflow.getIdToken();
      const siteInfo = await webflow.getSiteInfo();
      setIdToken(idToken);

      const data = await fetchSessionToken(idToken, siteInfo.siteId);
      const decodedToken = JSON.parse(atob(data.sessionToken.split('.')[1]));

      storeSession(data);
      setUser(decodedToken.user);
      setSessionToken(data.sessionToken);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * INITIALIZE LOCAL SESSION TOKEN
   * Looks for the session token in local storage. If it is not expired, sets the session token and user.
   * Otherwise, exchanges the ID token for a new session token.
   */
  const initializeLocalSessionToken = async () => {
    console.log('Initializing local session token...');

    const siteInfo = await webflow.getSiteInfo();
    setSiteData(siteInfo);

    // Check local storage for session token
    const localStorageUser = getStoredSession();
    if (localStorageUser) {
      // If the token is not expired, set session token and user
      if (localStorageUser.sessionToken && isTokenValid(localStorageUser.exp)) {
        if (!sessionToken) {
          console.log('Setting session token from local storage');
          setSessionToken(localStorageUser.sessionToken);
          setUser({
            firstName: localStorageUser.firstName,
            email: localStorageUser.email,
          });
        }
        console.log('Session token found and valid, using local storage token');
      } else {
        console.log('Session token expired or not found, exchanging ID token');
        localStorage.removeItem(SESSION_TOKEN_NAME);
        getSession();
      }
    } else {
      getSession();
    }
  };

  /**
   * INITIALIZE OAUTH CALLBACK
   * Sets up a listener for the OAuth window when it finishes authenticating to fetch the session token.
   */
  const initializeOAuthCallback = async () => {
    // Listen for message from the OAuth callback window
    const handleAuthComplete = (event: any) => {
      if (event.data === 'authComplete') {
        getSession(); // Once authenticated, fetch the session token
      }
    };

    window.addEventListener('message', handleAuthComplete);

    return () => {
      window.removeEventListener('message', handleAuthComplete);
    };
  };

  /**
   * OPEN AUTH WINDOW
   * Opens the Authentication window for OAuth 2.0 flow.
   */
  const openAuthWindow = () => {
    const authWindow = window.open(`${AUTH_URL}`, '_blank');
    if (!authWindow) {
      console.error('Failed to open authentication window');
      return;
    }
  };

  useEffect(() => {
    initializeLocalSessionToken();
    initializeOAuthCallback();
  }, [sessionToken]);

  return (
    <AuthContext.Provider
      value={{
        idToken,
        sessionToken,
        user,
        isLoading,
        siteData,
        codeInstalled,
        openAuthWindow,
        refetchAuth: getSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
