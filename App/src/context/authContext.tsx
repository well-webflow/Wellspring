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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [idToken, setIdToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const exchangeAndVerifyIdToken = async () => {
    console.log('Exchanging and verifying ID token...');
    try {
      setIsLoading(true);
      const idToken = await webflow.getIdToken();
      const siteInfo = await webflow.getSiteInfo();
      setIdToken(idToken);

      console.log('Site ID: ', siteInfo);
      console.log('URL:', API_URL);

      const response = await axios.post(API_URL + 'token', {
        idToken,
        siteId: siteInfo.siteId,
      });

      const sessionToken = response.data.sessionToken;
      const expAt = response.data.exp;
      const decodedToken = JSON.parse(atob(sessionToken.split('.')[1]));
      const { firstName, email } = decodedToken.user;

      localStorage.setItem(
        'wf_hybrid_user',
        JSON.stringify({ sessionToken, firstName, email, exp: expAt })
      );
      setUser({ firstName, email });
      setSessionToken(sessionToken);
      console.log(`Session Token: ${sessionToken}`);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeLocalSessionToken = () => {
    // Check local storage for session token
    const localStorageUser = localStorage.getItem('wf_hybrid_user');
    if (localStorageUser) {
      // Parse the token
      const userParse = JSON.parse(localStorageUser);
      const userStoredSessionToken = userParse.sessionToken;
      const userStoredTokenExp = userParse.exp;
      // If the token is not expired, set session token and user
      // Otherwise, exchange and verify the ID token
      if (userStoredSessionToken && Date.now() < userStoredTokenExp) {
        if (!sessionToken) {
          setSessionToken(userStoredSessionToken);
          setUser({ firstName: userParse.firstName, email: userParse.email });
        }
      } else {
        localStorage.removeItem('wf_hybrid_user');
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
    exchangeAndVerifyIdToken();
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
