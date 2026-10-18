// src/app/api/auth/oauth/precheck/route.ts
//
// Called by /oauth-callback when a Google/GitHub flow started from the
// sign-in page. FastAPI tells us whether the account was just auto-created
// (and removes it) so the page can redirect to /signup instead of logging in.

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ detail: 'Missing authorization header.' }, { status: 401 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/oauth/precheck`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
  } catch (err) {
    console.error('[api/auth/oauth/precheck] proxy error:', err);
    return NextResponse.json(
      {
        detail:
          'Could not reach the authentication server. Make sure the backend is running on port 8000.',
      },
      { status: 502 }
    );
  }

  const data = await backendRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: backendRes.status });
}