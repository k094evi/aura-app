// src/lib/auth.ts
'use client';

// Client-side storage for the Supabase session tokens our backend hands
// back from /api/auth/signin, /signup, and the OAuth callback. Nothing
// in the frontend persisted these before — without this, every call to
// a protected endpoint (e.g. POST /api/analyze) has no Authorization
// header and 401s against get_current_user in the backend.
//
// sessionStorage (not localStorage): the session lives only as long as the
// browser tab. Closing the tab ends it and the user must sign in again.
// Not cookies, because nothing server-rendered needs the token before
// hydration — everything reading it runs client-side.

const ACCESS_TOKEN_KEY = 'aura_access_token';
const REFRESH_TOKEN_KEY = 'aura_refresh_token';
const USER_KEY = 'aura_user';
export const AUTH_CHANGE_EVENT = 'aura:auth-change';

// Older versions kept the session in localStorage, where it survived closing
// the tab. Remove those leftovers so a stale "last account" never shows.
if (typeof window !== 'undefined') {
  try {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY].forEach((key) =>
      window.localStorage.removeItem(key)
    );
  } catch {
    // Storage unavailable: nothing to purge.
  }
}
const JOTFORM_AGENT_ROOT_ID = 'JotformAgent-01a108ada8687000814d4e82b99ffcaab47d';
const JOTFORM_AUTH_GATE_STYLE_ID = 'aura-jotform-auth-gate';

export function setJotformAgentVisible(isVisible: boolean) {
  if (typeof document === 'undefined') return;

  const existingStyle = document.getElementById(JOTFORM_AUTH_GATE_STYLE_ID);
  if (isVisible) {
    existingStyle?.remove();
    return;
  }

  if (existingStyle) return;
  const style = document.createElement('style');
  style.id = JOTFORM_AUTH_GATE_STYLE_ID;
  style.textContent = `#${JOTFORM_AGENT_ROOT_ID} { display: none !important; }`;
  document.head.appendChild(style);
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export interface StoredUser {
  id: string;
  email?: string | null;
  full_name?: string | null;
  mfa_enabled?: boolean;
}

declare global {
  interface Window {
    _jfAgentIdentifiedUser?: {
      metadata: Record<string, string>;
      userID: string;
      userHash: string;
    };
    AgentClientSDK?: {
      resetUser?: () => void;
    };
  }
}

/**
 * Removes everything cached for the previous user: the dashboard's last
 * analysis and resume counter (sessionStorage 'aura:*') and any other
 * 'aura:*' cache. Auth tokens use 'aura_*' keys and are handled separately.
 */
export function clearCachedAnalysisData() {
  if (typeof window === 'undefined') return;
  for (const store of [window.sessionStorage, window.localStorage]) {
    try {
      Object.keys(store)
        .filter((key) => key.startsWith('aura:'))
        .forEach((key) => store.removeItem(key));
    } catch {
      // Storage unavailable: nothing to clear.
    }
  }
}

/** Persists a session after a successful signin/signup/OAuth callback. */
export function saveSession(
  accessToken: string,
  refreshToken?: string | null,
  user?: StoredUser | null
) {
  if (typeof window === 'undefined') return;
  // A different account (or no previous account) is signing in: drop the
  // previous user's cached resume/analysis so it never shows on their dashboard.
  if (user) {
    const previous = getStoredUser();
    if (!previous || previous.id !== user.id) clearCachedAnalysisData();
  }
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  setJotformAgentVisible(true);
  notifyAuthChange();
}

function isTokenExpired(token: string): boolean {
  try {
    let payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  return token && !isTokenExpired(token) ? token : null;
}

export function saveUser(user: StoredUser) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  if (!getAccessToken()) return null; // no valid session -> no account shown
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/** Clears the stored session — call this on logout or a 401 from the API. */
export function clearSession() {
  if (typeof window === 'undefined') return;

  // End the session on the server: revokes the Supabase session and expires
  // the httpOnly sb_access_token cookie (JS can't delete that cookie itself).
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  try {
    void fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'same-origin',
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Logout must never throw; local cleanup below still runs.
  }

  try {
    window.AgentClientSDK?.resetUser?.();
  } catch (error) {
    console.error('Failed to reset the Jotform agent identity:', error);
  }
  delete window._jfAgentIdentifiedUser;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  clearCachedAnalysisData();
  setJotformAgentVisible(false);
  notifyAuthChange();
}

/**
 * Returns a Headers object with `Authorization: Bearer <token>` set if a
 * session exists, merged on top of any headers passed in. Use this when
 * calling any endpoint that depends on get_current_user in the backend
 * (e.g. POST /api/analyze).
 */
export function authHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

export function authSessionHeaders(extra?: HeadersInit): Headers {
  const headers = authHeaders(extra);
  const refreshToken = getRefreshToken();
  if (refreshToken) headers.set('X-Refresh-Token', refreshToken);
  return headers;
}

/**
 * Reads the Supabase "authenticator assurance level" claim from the stored
 * access token: "aal1" = password only, "aal2" = password + 2FA code.
 * This only decides which screen to show; the backend is the real authority
 * and re-checks the token on every protected request.
 */
export function getAssuranceLevel(): 'aal1' | 'aal2' | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    let payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - (payload.length % 4)) % 4);
    const claims = JSON.parse(atob(payload));
    return claims.aal === 'aal2' ? 'aal2' : 'aal1';
  } catch {
    return null;
  }
}