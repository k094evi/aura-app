// src/app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import { Mail, Brain, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // The backend always returns success here (by design — it never
      // reveals whether the email has an account), so we just show the
      // confirmation screen on any 2xx response.
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Something went wrong. Please try again.');
      }

      setSent(true);
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
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-white/50 text-[0.95rem] leading-relaxed mb-6">
              If an account exists for <span className="font-semibold text-gray-700">{email}</span>,
              we&apos;ve sent a link to reset your password.
            </p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold hover:opacity-90 transition-opacity"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-[1.75rem] font-bold text-white mb-2 tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-white/50 text-[0.95rem] leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 transition focus-within:border-fuchsia-500/50 focus-within:ring-2 focus-within:ring-fuchsia-500/20">
                  <Mail size={18} className="text-white/30 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-white/50 mt-6">
              Remembered it?{' '}
              <Link href="/signin" className="text-fuchsia-400 font-bold hover:text-fuchsia-300 hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}