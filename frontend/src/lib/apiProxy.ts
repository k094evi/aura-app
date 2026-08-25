// src/lib/apiProxy.ts

import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

/**
 * Forwards a JSON body to a FastAPI endpoint and relays its response
 * (status + body) back as-is. Used for auth endpoints that don't need
 * any special handling (forgot-password, reset-password).
 *
 * signin/signup have their own route handlers instead of this helper
 * because they also need to set session cookies on success.
 */
export async function proxyJsonPost(backendPath: string, body: unknown) {
  try {
    const res = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[proxy] ${backendPath} error:`, err);
    return NextResponse.json(
      {
        detail:
          'Could not reach the authentication server. Make sure the backend is running on port 8000.',
      },
      { status: 502 }
    );
  }
}