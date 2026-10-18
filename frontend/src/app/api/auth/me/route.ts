// src/app/api/auth/me/route.ts
//
// GET  /api/auth/me  -> who am I (proxies FastAPI GET /api/auth/me)
// POST /api/auth/me  -> OAuth "new user?" check (proxies FastAPI
//                       POST /api/auth/oauth/precheck). Lives in this file so
//                       no extra route folder is needed.

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

async function proxy(req: NextRequest, method: 'GET' | 'POST', backendPath: string, tag: string) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json({ detail: 'Missing authorization header.' }, { status: 401 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}${backendPath}`, {
      method,
      headers: { Authorization: authHeader },
      cache: 'no-store',
    });
  } catch (err) {
    console.error(`[${tag}] proxy error:`, err);
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

export async function GET(req: NextRequest) {
  return proxy(req, 'GET', '/api/auth/me', 'api/auth/me');
}

export async function POST(req: NextRequest) {
  return proxy(req, 'POST', '/api/auth/oauth/precheck', 'api/auth/me (precheck)');
}