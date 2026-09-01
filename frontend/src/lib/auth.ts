// src/lib/auth.ts
'use client';

// Client-side storage for the Supabase session tokens our backend hands
// back from /api/auth/signin, /signup, and the OAuth callback. Nothing
// in the frontend persisted these before — without this, every call to
// a protected endpoint (e.g. POST /api/analyze) has no Authorization
// header and 401s against get_current_user in the backend.
//
// localStorage (not cookies) because there's no server-rendered route
// here that needs the token before hydration — everything reading it
// runs client-side.

const ACCESS_TOKEN_KEY = 'aura_access_token';
const REFRESH_TOKEN_KEY = 'aura_refresh_token';
const USER_KEY = 'aura_user';

export interface StoredUser {
  id: string;
  email?: string | null;
  full_name?: string | null;
}

/** Persists a session after a successful signin/signup/OAuth callback. */
export function saveSession(
  accessToken: string,
  refreshToken?: string | null,
  user?: StoredUser | null
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
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
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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