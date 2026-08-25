// src/app/reset-password/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Brain, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string } | null>(
    null
  );
  const [tokensChecked, setTokensChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Supabase appends the recovery session to the URL fragment
  // (#access_token=...&refresh_token=...&type=recovery) rather than a
  // query string, so it must be parsed client-side — it never reaches
  // the server.
  useEffect(() => {
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      setTokens({ access_token, refresh_token });
    }
    setTokensChecked(true);
  }, []);

  const handleSubmit = async () => {
    if (!tokens) return;

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          new_password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || 'Could not reset password. Please try again.');
      }

      setSuccess(true);
      setTimeout(() => router.push('/signin'), 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="text-white w-7 h-7" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">Aura</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[470px] px-10 py-10">
        {!tokensChecked ? (
          <p className="text-center text-gray-400 py-8">Loading…</p>
        ) : !tokens ? (
          <div className="text-center">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or expired link</h1>
            <p className="text-gray-500 text-[0.95rem] leading-relaxed mb-6">
              This password reset link is missing or no longer valid. Request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        ) : success ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password updated</h1>
            <p className="text-gray-500 text-[0.95rem] leading-relaxed">
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-[1.75rem] font-bold text-gray-900 mb-2 tracking-tight">
                Set a new password
              </h1>
              <p className="text-gray-500 text-[0.95rem] leading-relaxed">
                Choose a new password for your account.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition">
                  <Lock size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition">
                  <Lock size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-base rounded-xl py-4 flex items-center justify-center gap-2 transition-colors duration-150 mt-2 shadow-sm shadow-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}