// context/authContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';

interface User {
  firstName: string;
  email: string;
}

interface AuthContextType {
  idToken: string;
  sessionToken: string;
  user: User | null;
  isLoading: boolean;
  refetchAuth: () => void;
  openAuthWindow: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TOKEN_NAME = 'wf_hybrid_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [idToken, setIdToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const openAuthWindow = () => {
    // Open a new window for OAuth authentication
    const authWindow = window.open(
      `${API_URL}auth`,
      '_blank',
    );

    if (!authWindow) {
      console.error('Failed to open authentication window');
      return;
    }

    // Polling to check if the authentication is complete
    // const interval = setInterval(() => {
    //   if (authWindow.closed) {
    //     clearInterval(interval);
    //     console.log('Authentication window closed');
    //   }
    // }, 1000);
  }

  const exchangeAndVerifyIdToken = async () => {
    console.log('Exchanging and verifying ID token...');
    try {
      setIsLoading(true);
      const idToken = await webflow.getIdToken();
      const siteInfo = await webflow.getSiteInfo();
      setIdToken(idToken);

      const response = await axios.post(API_URL + 'token', {
        idToken,
        siteId: siteInfo.siteId,
      });

      const sessionToken = response.data.sessionToken;
      const expAt = response.data.exp;
      const decodedToken = JSON.parse(atob(sessionToken.split('.')[1]));
      const { firstName, email } = decodedToken.user;

      console.log("SESSION TOKEN:", sessionToken);

      localStorage.setItem(
        SESSION_TOKEN_NAME,
        JSON.stringify({ sessionToken, firstName, email, exp: expAt })
      );
      setUser({ firstName, email });
      setSessionToken(sessionToken);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * INITIALIZE LOCAL SESSION TOKEN
   * Look for the session token in local storage. If it is not expired, sets the session token and user. 
   * Otherwise, exchanges the ID token for a new session token.
   */
  const initializeLocalSessionToken = () => {
    console.log('Initializing local session token...');
    // Check local storage for session token
    const localStorageUser = localStorage.getItem(SESSION_TOKEN_NAME);
    if (localStorageUser) {
      // Parse the token
      const userParse = JSON.parse(localStorageUser);
      const userStoredSessionToken = userParse.sessionToken;
      const userStoredTokenExp = userParse.exp;
      // If the token is not expired, set session token and user
      // Otherwise, exchange and verify the ID token
      const notExpired = Date.now() < (userStoredTokenExp * 1000); // convert exp to milliseconds
      if (userStoredSessionToken && notExpired) {
        if (!sessionToken) {
          console.log('Setting session token from local storage');
          setSessionToken(userStoredSessionToken);
          setUser({ firstName: userParse.firstName, email: userParse.email });
        }
      } else {
        console.log('Session token expired or not found, exchanging ID token');
        localStorage.removeItem(SESSION_TOKEN_NAME);
        exchangeAndVerifyIdToken();
      }
    } else {
      exchangeAndVerifyIdToken();
    }
  };

  const initializeOAuthCallback = () => {
    // Listen for message from the OAuth callback window
    const handleAuthComplete = (event: any) => {
      if (
        // event.origin === "http://localhost:3000" &&
        event.data === 'authComplete'
      ) {
        exchangeAndVerifyIdToken(); // Retry the token exchange
      }
    };

    window.addEventListener('message', handleAuthComplete);

    return () => {
      window.removeEventListener('message', handleAuthComplete);
    };
  };

  useEffect(() => {
    initializeLocalSessionToken();
    initializeOAuthCallback();
  }, [sessionToken]);

  // Handle request for site data
  const getSiteData = async () => {
    const sites = await axios.get(API_URL + 'sites', {
      headers: { authorization: `Bearer ${sessionToken}` },
    });
    setSiteData(sites.data.data.sites);
  };

  // Open OAuth screen
  // const openAuthScreen = () => {
  //   window.open(`http://localhost:${PORT}`, '_blank', 'width=600,height=400');
  // };

  return (
    <AuthContext.Provider
      value={{
        idToken,
        sessionToken,
        user,
        isLoading,
        openAuthWindow,
        refetchAuth: exchangeAndVerifyIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
