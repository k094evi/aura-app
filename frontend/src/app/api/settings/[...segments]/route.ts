import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
const ALLOWED_PATHS: Record<string, string[]> = {
  GET: ['account', 'mfa'],
  PATCH: ['account'],
  POST: [
    'email/request',
    'email/verify',
    'password',
    'mfa/enroll',
    'mfa/verify',
    'sign-out-others',
  ],
  DELETE: ['account'],
};

type RouteContext = { params: Promise<{ segments: string[] }> };

async function proxySettingsRequest(req: NextRequest, context: RouteContext, method: string) {
  const { segments } = await context.params;
  const path = segments.join('/');
  if (!ALLOWED_PATHS[method]?.includes(path)) {
    return NextResponse.json({ detail: 'Settings action not found.' }, { status: 404 });
  }

  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return NextResponse.json({ detail: 'You must be signed in to manage settings.' }, { status: 401 });
  }

  const headers = new Headers({ Authorization: authorization });
  const refreshToken = req.headers.get('x-refresh-token');
  if (refreshToken) headers.set('X-Refresh-Token', refreshToken);

  let body: string | undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    body = await req.text();
    headers.set('Content-Type', 'application/json');
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/settings/${path}`, {
      method,
      headers,
      body,
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`[api/settings] ${method} ${path} proxy error:`, error);
    return NextResponse.json(
      { detail: 'Could not reach the account service. Please try again.' },
      { status: 502 }
    );
  }

  const data = await backendRes.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: backendRes.status });
  if (!backendRes.ok) return response;

  const isSessionUpdate = path === 'email/verify' || path === 'mfa/verify';
  if (isSessionUpdate && data.access_token) {
    const base = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    response.cookies.set('sb_access_token', data.access_token, { ...base, maxAge: 60 * 60 });
    if (data.refresh_token) {
      response.cookies.set('sb_refresh_token', data.refresh_token, {
        ...base,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }
  if (method === 'DELETE' && path === 'account') {
    response.cookies.delete('sb_access_token');
    response.cookies.delete('sb_refresh_token');
  }
  return response;
}

export function GET(req: NextRequest, context: RouteContext) {
  return proxySettingsRequest(req, context, 'GET');
}

export function PATCH(req: NextRequest, context: RouteContext) {
  return proxySettingsRequest(req, context, 'PATCH');
}

export function POST(req: NextRequest, context: RouteContext) {
  return proxySettingsRequest(req, context, 'POST');
}

export function DELETE(req: NextRequest, context: RouteContext) {
  return proxySettingsRequest(req, context, 'DELETE');
}
