// src/app/api/auth/mfa/challenge/route.ts
//
// Second step of sign-in for accounts with 2FA enabled. Forwards the 6-digit
// authenticator code (plus the aal1 session from the password step) to
// FastAPI, then stores the upgraded aal2 tokens as httpOnly cookies so the
// cookie-based proxies (/api/analysis-history, /api/analyze) start working.

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.code !== 'string') {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  // Prefer the headers the client sends (localStorage session); fall back to
  // the httpOnly cookies set during the password step.
  const authorization =
    req.headers.get('authorization') ??
    (req.cookies.get('sb_access_token')?.value
      ? `Bearer ${req.cookies.get('sb_access_token')!.value}`
      : null);
  const refreshToken =
    req.headers.get('x-refresh-token') ?? req.cookies.get('sb_refresh_token')?.value ?? null;

  if (!authorization) {
    return NextResponse.json(
      { detail: 'Your session has expired. Please sign in again.' },
      { status: 401 }
    );
  }

  const headers = new Headers({
    Authorization: authorization,
    'Content-Type': 'application/json',
  });
  if (refreshToken) headers.set('X-Refresh-Token', refreshToken);

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/mfa/challenge`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code: body.code }),
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[api/auth/mfa/challenge] proxy error:', err);
    return NextResponse.json(
      { detail: 'Could not reach the authentication server. Please try again.' },
      { status: 502 }
    );
  }

  const data = await backendRes.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: backendRes.status });
  if (!backendRes.ok) return response;

  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
  if (data.access_token) {
    response.cookies.set('sb_access_token', data.access_token, { ...base, maxAge: 60 * 60 });
  }
  if (data.refresh_token) {
    response.cookies.set('sb_refresh_token', data.refresh_token, {
      ...base,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
