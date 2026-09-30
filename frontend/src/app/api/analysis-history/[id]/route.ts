// src/app/api/analysis-history/[id]/route.ts

import { NextRequest } from 'next/server';
import { proxyAuthedGet } from '@/lib/apiProxy';

// GET /api/analysis-history/:id -> FastAPI GET /api/analysis-history/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAuthedGet(req, `/api/analysis-history/${encodeURIComponent(id)}`);
}
