// src/app/api/auth/oauth/[provider]/url/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/oauth/${provider}/url`, {
      method: 'GET',
    });
  } catch (err) {
    console.error(`[api/auth/oauth/${provider}/url] proxy error:`, err);
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