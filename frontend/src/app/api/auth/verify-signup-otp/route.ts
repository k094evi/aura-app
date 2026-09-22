import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/verify-signup-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[api/auth/verify-signup-otp] proxy error:', err);
    return NextResponse.json(
      { detail: 'Could not reach the authentication server. Make sure the backend is running on port 8000.' },
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
  if (data.access_token) response.cookies.set('sb_access_token', data.access_token, { ...base, maxAge: 60 * 60 });
  if (data.refresh_token) response.cookies.set('sb_refresh_token', data.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 30 });

  return response;
}