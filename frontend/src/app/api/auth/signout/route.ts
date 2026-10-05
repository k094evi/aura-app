// src/app/api/auth/signout/route.ts
// Clears the httpOnly session cookies set by signin / the 2FA challenge.
// (Client-side clearSession() can't touch httpOnly cookies.)

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out.' });
  response.cookies.delete('sb_access_token');
  response.cookies.delete('sb_refresh_token');
  return response;
}
