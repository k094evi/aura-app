import { NextRequest, NextResponse } from "next/server";

// Proxies the resume upload from the Next.js frontend to the FastAPI backend.
// This is needed because the browser can't call localhost:8000 directly in
// production, and to avoid CORS issues in development.
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    // The access token lives in an httpOnly cookie (set by
    // /api/auth/signin and /api/auth/signup), so it's invisible to
    // client-side JS — that's intentional, it protects against XSS
    // stealing the token. But it means THIS server-side route has to
    // read it from the cookie jar and forward it manually; fetch()
    // does not do this automatically.
    const accessToken = req.cookies.get("sb_access_token")?.value;

    if (!accessToken) {
      // No point calling the backend if we already know it'll 401 —
      // return a clean error the frontend can react to (e.g. redirect
      // to /signin) instead of surfacing FastAPI's generic message.
      return NextResponse.json(
        { detail: "You must be signed in to analyze a resume." },
        { status: 401 }
      );
    }

    // Forward the raw FormData (file + fields) straight to FastAPI
    const formData = await req.formData();

    const backendRes = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      // Do NOT set Content-Type — fetch sets it automatically with the
      // correct multipart boundary when body is FormData
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[api/analyze] proxy error:", err);
    return NextResponse.json(
      { detail: "Could not reach the analysis server. Make sure the backend is running on port 8000." },
      { status: 502 }
    );
  }
}