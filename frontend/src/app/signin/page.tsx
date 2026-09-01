'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Brain } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0c0a14] px-4 py-10">
      {/* Ambient background orbs, matching the rest of the app */}
      <div className="pointer-events-none absolute -left-[150px] top-[100px] size-[550px] rounded-full bg-fuchsia-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[180px] top-[150px] size-[600px] rounded-full bg-violet-600/25 blur-[125px]" />
      <div className="pointer-events-none absolute bottom-[50px] left-[40%] size-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Logo + brand link back to home */}
      <Link href="/" className="relative z-10 flex items-center gap-2 mb-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef]">
          <Brain className="size-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Aura</span>
      </Link>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-[470px] rounded-3xl border border-white/[0.07] bg-[#151221]/70 px-10 py-10 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20px]">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[1.75rem] font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/50 text-[0.95rem] leading-relaxed">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Login form */}
        <div className="space-y-5">
          {/* Email input */}
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
                className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none"
              />
            </div>
          </div>

          {/* Password input with show/hide toggle */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
              Password
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

          {/* Forgot password link */}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] py-4 flex items-center justify-center gap-2 text-base font-semibold text-white shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)] transition-opacity duration-150 mt-2 hover:opacity-90 active:opacity-80"
          >
            Sign In
            <span className="text-lg leading-none">→</span>
          </button>
        </div>

        {/* Divider between form and social login options */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Social login buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google sign-in */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* GitHub sign-in */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.06]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Link to sign up page */}
        <p className="text-center text-sm text-white/50 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-fuchsia-400 font-bold hover:text-fuchsia-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Footer with legal links */}
      <p className="relative z-10 text-xs text-white/30 mt-8 text-center max-w-sm leading-relaxed">
        By continuing, you agree to our{' '}
        <Link href="/terms-of-service?from=signin" className="underline hover:text-white/60">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy?from=signin" className="underline hover:text-white/60">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}