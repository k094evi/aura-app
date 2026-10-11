// src/app/api/auth/logout/route.ts
//
// Ends the session for real: revokes it in Supabase (via the backend) and
// expires the httpOnly cookies, which client-side JS cannot delete itself.
// Always returns 200 — logging out twice, or with an expired token, is fine.

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const COOKIES_TO_CLEAR = ['sb_access_token', 'sb_refresh_token'];

export async function POST(req: NextRequest) {
  const headerToken = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  const cookieToken = req.cookies.get('sb_access_token')?.value;

  // Revoke every distinct token we were handed (header and cookie can differ).
  const tokens = Array.from(new Set([headerToken, cookieToken].filter(Boolean))) as string[];
  await Promise.all(
    tokens.map(async (token) => {
      try {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
      } catch (err) {
        console.error('[api/auth/logout] backend unreachable:', err);
      }
    })
  );

  const res = NextResponse.json({ message: 'Signed out.' });
  for (const name of COOKIES_TO_CLEAR) {
    res.cookies.set(name, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
  }
  res.headers.set('Cache-Control', 'no-store');
  return res;
}