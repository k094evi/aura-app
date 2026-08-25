// src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { proxyJsonPost } from '@/lib/apiProxy';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }
  return proxyJsonPost('/api/auth/forgot-password', body);
}