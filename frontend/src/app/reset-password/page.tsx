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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0c0a14] px-4 py-10">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -left-[150px] top-[100px] size-[550px] rounded-full bg-fuchsia-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[180px] top-[150px] size-[600px] rounded-full bg-violet-600/25 blur-[125px]" />
      <div className="pointer-events-none absolute bottom-[50px] left-[40%] size-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />

      <Link href="/" className="relative z-10 flex items-center gap-2 mb-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef]">
          <Brain className="size-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Aura</span>
      </Link>

      <div className="relative z-10 w-full max-w-[470px] rounded-3xl border border-white/[0.07] bg-[#151221]/70 px-10 py-10 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        {!tokensChecked ? (
          <p className="text-center text-white/40 py-8">Loading…</p>
        ) : !tokens ? (
          <div className="text-center">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Invalid or expired link</h1>
            <p className="text-white/50 text-[0.95rem] leading-relaxed mb-6">
              This password reset link is missing or no longer valid. Request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold hover:opacity-90 transition-opacity"
            >
              Request New Link
            </Link>
          </div>
        ) : success ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Password updated</h1>
            <p className="text-white/50 text-[0.95rem] leading-relaxed">
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-[1.75rem] font-bold text-white mb-2 tracking-tight">
                Set a new password
              </h1>
              <p className="text-white/50 text-[0.95rem] leading-relaxed">
                Choose a new password for your account.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition focus-within:border-fuchsia-500/50 focus-within:ring-2 focus-within:ring-fuchsia-500/20">
                  <Lock size={18} className="text-white/30 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/30 hover:text-white/60 transition flex-shrink-0"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition focus-within:border-fuchsia-500/50 focus-within:ring-2 focus-within:ring-fuchsia-500/20">
                  <Lock size={18} className="text-white/30 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] py-4 flex items-center justify-center gap-2 text-base font-semibold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity duration-150 mt-2 hover:opacity-90 active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
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