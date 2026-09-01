// src/app/oauth-callback/page.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { saveSession } from '@/lib/auth';

export default function OAuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode double-invocation — this flow
    // makes a network call and redirects, neither of which should
    // happen twice.
    if (handled.current) return;
    handled.current = true;

    (async () => {
      // Same pattern as /reset-password: Supabase appends the session
      // to the URL fragment (#access_token=...&refresh_token=...&...)
      // rather than a query string, so it must be parsed client-side —
      // it never reaches the server.
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const oauthError = params.get('error_description') || params.get('error');

      if (oauthError) {
        setError(oauthError.replace(/\+/g, ' '));
        return;
      }

      if (!access_token) {
        setError('This sign-in link is missing or no longer valid.');
        return;
      }

      try {
        // Confirm the token with our backend and fetch the user's
        // profile in one step (get_current_user verifies it against
        // Supabase — never trust anything from the URL as-is).
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const user = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(user.detail || 'Could not verify your session. Please try again.');
        }

        saveSession(access_token, refresh_token, user);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    })();
  }, [router]);

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="text-white w-7 h-7" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">Aura</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[470px] px-10 py-10 text-center">
        {error ? (
          <>
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign-in failed</h1>
            <p className="text-gray-500 text-[0.95rem] leading-relaxed mb-6">{error}</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Back to Sign In
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 text-indigo-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Finishing sign-in…</h1>
            <p className="text-gray-500 text-sm">Just a moment while we confirm your account.</p>
          </>
        )}
      </div>
    </div>
  );
}