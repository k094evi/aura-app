// src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[api/auth/signin] proxy error:', err);
    return NextResponse.json(
      {
        detail:
          'Could not reach the authentication server. Make sure the backend is running on port 8000.',
      },
      { status: 502 }
    );
  }

  const data = await backendRes.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: backendRes.status });

  if (!backendRes.ok) {
    return response;
  }

  // This is the part that was missing: the frontend page just does
  // router.push('/dashboard') on a 200, assuming the cookie is already
  // set. Without this, sign-in "succeeds" but no session is ever stored,
  // so every subsequent request (like /api/analyze) sees no
  // sb_access_token cookie and rejects it as unauthenticated.
  if (data.access_token) {
    response.cookies.set('sb_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  }
  if (data.refresh_token) {
    response.cookies.set('sb_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}