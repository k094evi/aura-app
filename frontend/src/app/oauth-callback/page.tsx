// src/app/oauth-callback/page.tsx
//

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { saveSession } from '@/lib/auth';
import AuthShell, { GRADIENT_BG } from '@/features/signin-signup/components/AuthShell';

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
    <AuthShell>
      {error ? (
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="size-8 text-[#ef4444]" />
          </div>
          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Sign-in failed</h1>
            <p role="alert" className="text-[14px] leading-[1.45] text-[#4b5563]">{error}</p>
          </div>
          <Link
            href="/signin"
            className={`flex w-full items-center justify-center rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105`}
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <Loader2 className="size-10 animate-spin text-[#7c3aed]" />
          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[24px] font-extrabold leading-tight text-[#111827]">Finishing sign-in…</h1>
            <p className="text-[14px] text-[#4b5563]">Just a moment while we confirm your account.</p>
          </div>
        </div>
      )}
    </AuthShell>
  );
}