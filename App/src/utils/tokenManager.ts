// utils/tokenManager.ts
import axios from 'axios';

const SESSION_TOKEN_NAME = 'wf_hybrid_user';
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export interface SessionData {
  sessionToken: string;
  firstName: string;
  email: string;
  exp: number;
}

export interface SessionUser {
  firstName: string;
  email: string;
}

export const getStoredSession = (): SessionData | null => {
  const raw = localStorage.getItem(SESSION_TOKEN_NAME);
  return raw ? JSON.parse(raw) : null;
};

export const storeSession = (sessionData: any) => {
  localStorage.setItem(SESSION_TOKEN_NAME, JSON.stringify(sessionData));
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_TOKEN_NAME);
};

export const isTokenValid = (exp: number) => Date.now() < exp * 1000;

export const fetchSessionToken = async (idToken: string, siteId: string) => {
  const response = await axios.post(AUTH_URL + '/token', {
    idToken,
    siteId,
  });
  return response.data;
};
