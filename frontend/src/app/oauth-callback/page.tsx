// src/app/oauth-callback/page.tsx
//

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
    // makes network calls and redirects, neither of which should
    // happen twice.
    if (handled.current) return;
    handled.current = true;

    (async () => {
      // Supabase appends the session to the URL fragment
      // (#access_token=...&refresh_token=...), so it is parsed client-side.
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      // Supabase reports provider/sign-up failures in the hash OR the query string.
      const query = new URLSearchParams(window.location.search);
      const oauthError =
        params.get('error_description') ||
        params.get('error') ||
        query.get('error_description') ||
        query.get('error');

      // Remove the tokens from the address bar / browser history right away.
      window.history.replaceState(null, '', window.location.pathname);

      if (oauthError) {
        setError(oauthError.replace(/\+/g, ' '));
        return;
      }

      if (!access_token) {
        // Logs which URL parts arrived (names only, no values) to help debugging.
        const hashKeys = Array.from(params.keys()).join(', ') || 'none';
        const queryKeys = Array.from(query.keys()).join(', ') || 'none';
        console.error('[oauth-callback] no access_token. hash keys:', hashKeys, '| query keys:', queryKeys);
        setError('This sign-in link is missing or no longer valid.');
        return;
      }

      try {
        // 1. Confirm the token with our backend and fetch the profile.
        //    Supabase has already found-or-created the account for this
        //    Google/GitHub identity; a returning user gets the same account.
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` },
          cache: 'no-store',
        });
        const user = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(user.detail || 'Could not verify your session. Please try again.');
        }

        // 2. Store the session. saveSession clears the previous user's cached
        //    resume/analysis whenever the account is different.
        saveSession(access_token, refresh_token, user);

        // 3. Set the httpOnly cookie the dashboard/history proxies read, so
        //    they act as THIS user and not whoever signed in before.
        const sessionRes = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token, refresh_token }),
        });
        if (!sessionRes.ok) {
          const data = await sessionRes.json().catch(() => ({}));
          throw new Error(data.detail || 'Could not start your session. Please try again.');
        }

        // OAuth sessions start at aal1; accounts with 2FA continue to the challenge.
        router.push(user.mfa_enabled ? '/mfa-challenge' : '/dashboard');
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