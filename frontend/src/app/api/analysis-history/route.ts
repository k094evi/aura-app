// src/app/api/analysis-history/route.ts

import { NextRequest } from 'next/server';
import { proxyAuthedGet } from '@/lib/apiProxy';

// GET /api/analysis-history?page=1&page_size=6 -> FastAPI GET /api/analysis-history
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Only forward the two params the backend understands.
  const query = new URLSearchParams();
  for (const key of ['page', 'page_size']) {
    const value = searchParams.get(key);
    if (value) query.set(key, value);
  }
  const qs = query.toString();

  return proxyAuthedGet(req, `/api/analysis-history${qs ? `?${qs}` : ''}`);
}
