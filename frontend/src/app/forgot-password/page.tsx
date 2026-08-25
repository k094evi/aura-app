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
    <div className="bg-gray-50 flex flex-col items-center justify-center px-4 py-10 min-h-screen">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="text-white w-7 h-7" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900">Aura</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[470px] px-10 py-10">
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-[0.95rem] leading-relaxed mb-6">
              If an account exists for <span className="font-semibold text-gray-700">{email}</span>,
              we&apos;ve sent a link to reset your password.
            </p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-[1.75rem] font-bold text-gray-900 mb-2 tracking-tight">
                Forgot your password?
              </h1>
              <p className="text-gray-500 text-[0.95rem] leading-relaxed">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition">
                  <Mail size={18} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remembered it?{' '}
              <Link href="/signin" className="text-indigo-600 font-bold hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}