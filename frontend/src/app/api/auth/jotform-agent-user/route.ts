import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

interface AuthenticatedUser {
  id: string;
  email?: string | null;
  full_name?: string | null;
}

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization) {
    return jsonResponse({ detail: 'Missing authorization header.' }, 401);
  }

  const secret = process.env.JOTFORM_AGENT_SECRET;
  if (!secret) {
    return jsonResponse(
      { detail: 'Personalized chat is not configured. Set JOTFORM_AGENT_SECRET on the server.' },
      503
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: { Authorization: authorization },
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[api/auth/jotform-agent-user] backend proxy error:', error);
    return jsonResponse({ detail: 'Could not reach the authentication server.' }, 502);
  }

  const user: AuthenticatedUser | null = await backendRes.json().catch(() => null);
  if (!backendRes.ok) {
    return jsonResponse(user ?? { detail: 'Authentication failed.' }, backendRes.status);
  }
  if (!user || typeof user.id !== 'string' || !user.id) {
    console.error('[api/auth/jotform-agent-user] authentication server returned an invalid user.');
    return jsonResponse({ detail: 'Could not identify the authenticated user.' }, 502);
  }

  const metadata: Record<string, string> = {};
  if (user.full_name) metadata.name = user.full_name;
  if (user.email) metadata.email = user.email;

  return jsonResponse(
    {
      metadata,
      userID: user.id,
      userHash: createHmac('sha256', secret).update(user.id).digest('hex'),
    },
    200
  );
}
