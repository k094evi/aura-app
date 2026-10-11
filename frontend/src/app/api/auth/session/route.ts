// src/app/api/auth/session/route.ts
//
// Called by /oauth-callback after Google/GitHub sign-in. Verifies the token
// with the backend, then sets the httpOnly `sb_access_token` cookie that
// /api/analyze and /api/analysis-history read. Without this, an OAuth login
// only filled localStorage and the proxy routes kept using an old (or no)
// cookie — i.e. the previous user's data.

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const ACCESS_COOKIE = 'sb_access_token';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const accessToken: string | undefined =
    typeof body?.access_token === 'string' ? body.access_token : undefined;

  if (!accessToken) {
    return NextResponse.json({ detail: 'Missing access token.' }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[api/auth/session] proxy error:', err);
    return NextResponse.json(
      {
        detail:
          'Could not reach the authentication server. Make sure the backend is running on port 8000.',
      },
      { status: 502 }
    );
  }

  if (!backendRes.ok) {
    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      { detail: data.detail || 'Could not verify your session. Please sign in again.' },
      { status: backendRes.status }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // No maxAge/expires: a session cookie, dropped when the browser closes.
  });
  return res;
}