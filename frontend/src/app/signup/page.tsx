// src/app/signup/page.tsx
// Sign-up page: account form plus Google and GitHub OAuth.
// Talks to the backend via /api/auth/signup and /api/auth/oauth/:provider/url.
// After a successful sign-up it either shows a "check your email" screen
// (when the account needs verification) or signs the user straight in.

'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { saveSession } from '@/lib/auth';
import { Footer } from '@/components/Footer';

// The Figma design uses DM Sans throughout.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Deliberately loose check ("something@something.tld"); it only catches typos.
// The backend is the real authority on whether the account can be created.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The Figma design collects first / middle / last name, but the existing
// /api/auth/signup request only accepts { email, password }. Flip this to
// `true` once the backend accepts the name fields — nothing else needs to change.
// (Typed as `boolean` so TypeScript doesn't narrow it to the literal `false`.)
const SEND_NAME_FIELDS: boolean = false;

type FieldName = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'terms';
type FieldErrors = Partial<Record<FieldName, string>>;

// Brand gradient (violet -> cyan) used by the primary buttons.
// Kept as a full class string so Tailwind can detect it.
const GRADIENT_BG = 'bg-[linear-gradient(90deg,#7c3aed_0%,#a78bfa_60%,#06b6d4_100%)]';

// Google and GitHub buttons share identical styling.
const OAUTH_BUTTON_CLASS =
  'flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#4b5563] shadow-[0_1px_1px_rgba(17,24,39,0.02)] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60';

// Shared input-wrapper styling (default / focus / error states from Figma).
// The wrapper, not the <input>, draws the border so a trailing button can sit inside it.
const inputWrapperClass = (hasError: boolean) =>
  [
    'flex w-full items-center gap-2 rounded-[10px] border bg-white px-[14px] py-[12px]',
    'shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] transition',
    hasError
      ? 'border-[#ef4444] focus-within:ring-2 focus-within:ring-[#ef4444]/15'
      : 'border-[#e5e7eb] focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/15',
  ].join(' ');

// Labelled text input with an optional error message and trailing slot
// (used for the show/hide password button). Defined at module level so it
// isn't re-created on every keystroke (which would steal input focus).
function Field({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-[6px]">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#4b5563]">
        {label}
      </label>
      <div className={inputWrapperClass(!!error)}>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-[#ef4444]">
          {error}
        </p>
      )}
    </div>
  );
}

// Shared page chrome: background art, back pill, logo, card and footer.
// Used by both the sign-up form and the "check your email" screen.
function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${dmSans.className} relative flex min-h-screen w-full flex-col overflow-hidden bg-[#f0eeff]`}
    >
      {/* ───────────── Decorative background ───────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft colour orbs */}
        <div className="absolute -left-[220px] -top-[220px] size-[940px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.38)_0%,rgba(167,139,250,0.16)_38%,rgba(167,139,250,0)_70%)]" />
        <div className="absolute -right-[220px] top-[60px] size-[800px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.30)_0%,rgba(34,211,238,0.12)_40%,rgba(34,211,238,0)_70%)]" />
        <div className="absolute left-[calc(50%-250px)] top-[270px] size-[620px] rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.18)_0%,rgba(251,113,133,0.06)_40%,rgba(251,113,133,0)_70%)]" />
        <div className="absolute -bottom-[200px] left-[100px] size-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.24)_0%,rgba(251,191,36,0.09)_40%,rgba(251,191,36,0)_70%)]" />

        {/* Dot grid, kept faint (6% opacity) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#7c3aed_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.06]" />

        {/* Top accent line */}
        <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,#7c3aed_0%,#06b6d4_50%,rgba(139,92,246,0)_100%)]" />

        {/* Decorative rings: top right */}
        <div className="absolute -right-[120px] -top-[120px] size-[340px] rounded-full border border-[#8b5cf6]/20" />
        <div className="absolute -right-[80px] -top-[80px] size-[260px] rounded-full border border-[#8b5cf6]/20" />

        {/* Decorative rings: bottom left */}
        <div className="absolute -bottom-[60px] left-[60px] size-[180px] rounded-full border border-emerald-400/20" />
        <div className="absolute -bottom-[20px] left-[100px] size-[100px] rounded-full border border-emerald-400/20" />
      </div>

      {/* Back to home pill (absolutely positioned so it doesn't push the card down) */}
      <Link
        href="/"
        className="absolute left-4 top-6 z-20 flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-3 py-2 text-[14px] font-medium text-[#374151] backdrop-blur-[8px] transition hover:bg-white/70 sm:left-20 sm:top-10"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      {/* ───────────── Main content ───────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12 pt-24">
        <div className="flex w-full max-w-[612px] flex-col items-center gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-[10px]">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
              <defs>
                <linearGradient id="aura-logo-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#aura-logo-grad)" />
              <circle cx="16" cy="16" r="7" fill="#c4b5fd" fillOpacity="0.85" />
            </svg>
            <span className="text-[24px] font-bold text-[#111827]">Aura</span>
          </Link>

          {/* Form card */}
          <div className="flex w-full flex-col gap-5 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] px-6 py-8 shadow-[0_4px_16px_rgba(124,58,237,0.05),0_20px_60px_rgba(17,24,39,0.09)] backdrop-blur-[12px] sm:px-10">
            {children}
          </div>
        </div>
      </main>

      {/* ───────────── Footer ─────────────
          ConditionalLayout hides the site-wide footer on /signup, so it is
          rendered here instead. The wrapper's z-10 keeps it above the
          decorative background. Footer adds ?from=signup to the legal links itself. */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  // Optional; only sent to the backend when SEND_NAME_FIELDS is true.
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Which OAuth button was clicked (drives its spinner); null when none is in flight.
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github' | null>(null);
  // Form-level error from the API / OAuth start. Field errors are kept separately below.
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // True when the backend created the account but it needs email verification first.
  const [confirmationSent, setConfirmationSent] = useState(false);
  const router = useRouter();

  // Disables every submit-type control while any sign-up attempt is running,
  // so the user can't start email and OAuth sign-up at the same time.
  const busy = isSubmitting || oauthProvider !== null;

  // Clears one field's error (and any general error) as the user edits it.
  const clearError = (field: FieldName) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    // Field-level validation (red error states from the Figma design)
    const nextErrors: FieldErrors = {};

    if (!firstName.trim()) nextErrors.firstName = 'This field is required';
    if (!lastName.trim()) nextErrors.lastName = 'This field is required';

    if (!email) nextErrors.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) nextErrors.email = 'Invalid email address';

    // Minimum length is checked on the client only; the backend has the final say.
    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters';

    if (!confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match';

    if (!agreed) nextErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';

    setFieldErrors(nextErrors);
    setError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          // Name fields are only included once the backend accepts them (see SEND_NAME_FIELDS).
          ...(SEND_NAME_FIELDS
            ? {
                first_name: firstName.trim(),
                middle_name: middleName.trim(),
                last_name: lastName.trim(),
              }
            : {}),
        }),
      });

      // The body may not be JSON on some failures; fall back to an empty object.
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || 'Sign up failed. Please try again.');
      }

      // Account exists but can't sign in until the email link is clicked,
      // so there is no session to save yet.
      if (data.email_confirmation_required) {
        setConfirmationSent(true);
        setIsSubmitting(false);
        return;
      }

      // Persist the session so subsequent authenticated calls (e.g.
      // resume analysis) can send it as a Bearer token.
      saveSession(data.access_token, data.refresh_token, data.user);

      // On success isSubmitting is intentionally left true so the button
      // stays disabled until the navigation completes.
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Same OAuth kickoff as the sign-in page — see its comment for the
  // full redirect flow. Works identically for sign-up: Supabase creates
  // the account on first login for a given provider automatically.
  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    setOauthProvider(provider);
    try {
      const res = await fetch(`/api/auth/oauth/${provider}/url`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        throw new Error(data.detail || `Could not start ${provider} sign-in. Please try again.`);
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      // Only reset on failure; on success the page is navigating away and the spinner should stay.
      setOauthProvider(null);
    }
  };

  // Show a confirmation screen instead of the form once the account
  // is created but needs email verification before it can sign in.
  if (confirmationSent) {
    return (
      <AuthShell>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-8 text-emerald-500" />
          </div>

          <div className="flex flex-col items-center gap-[6px]">
            <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Check your email</h1>
            <p className="text-[14px] leading-[1.45] text-[#4b5563]">
              We sent a confirmation link to{' '}
              <span className="break-all font-semibold text-[#111827]">{email}</span>. Click it to activate
              your account, then sign in.
            </p>
          </div>

          <Link
            href="/signin"
            className={`flex w-full items-center justify-center rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95`}
          >
            Go to Sign In
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-[28px] font-extrabold leading-tight text-[#111827]">Create Account</h1>
        <p className="text-[14px] text-[#4b5563]">Start optimizing your resume today</p>
      </div>

      {/* noValidate: use our own error messages instead of the browser's popups */}
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex flex-col gap-3">
          {/* First + last name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              id="signup-first-name"
              label="First Name"
              autoComplete="given-name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(v) => {
                setFirstName(v);
                clearError('firstName');
              }}
              error={fieldErrors.firstName}
            />
            <Field
              id="signup-last-name"
              label="Last Name"
              autoComplete="family-name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(v) => {
                setLastName(v);
                clearError('lastName');
              }}
              error={fieldErrors.lastName}
            />
          </div>

          {/* Middle name (optional, so no validation or error state) */}
          <Field
            id="signup-middle-name"
            label="Middle Name"
            autoComplete="additional-name"
            placeholder="Enter your middle name"
            value={middleName}
            onChange={setMiddleName}
          />

          <Field
            id="signup-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(v) => {
              setEmail(v);
              clearError('email');
            }}
            error={fieldErrors.email}
          />

          {/* Password with show/hide toggle (the toggle controls both password fields).
              Editing it also clears the confirm-password error, since "do not match"
              may no longer be true. */}
          <Field
            id="signup-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(v) => {
              setPassword(v);
              clearError('password');
              clearError('confirmPassword');
            }}
            error={fieldErrors.password}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex-shrink-0 text-[#9ca3af] transition hover:text-[#4b5563]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Field
            id="signup-confirm-password"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              clearError('confirmPassword');
            }}
            error={fieldErrors.confirmPassword}
          />
        </div>

        {/* Terms agreement. Custom checkbox: the real input is visually hidden (sr-only)
            but stays focusable; the sibling span draws the box and picks up the focus ring
            via `peer`. The legal links open in a new tab so the form isn't lost. */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-start gap-2">
            <label className="mt-[1px] flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  clearError('terms');
                }}
                aria-label="I agree to the Terms of Service and Privacy Policy"
                className="peer sr-only"
              />
              <span
                className={`flex size-4 items-center justify-center rounded-[4px] border bg-white transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#7c3aed]/30 ${
                  fieldErrors.terms ? 'border-[#ef4444]' : 'border-[#e5e7eb]'
                }`}
              >
                {agreed && <Check className="size-[10px] text-[#7c3aed]" strokeWidth={3.5} />}
              </span>
            </label>
            <p className="flex-1 text-[12px] leading-[1.4] text-[#4b5563]">
              I agree to the{' '}
              <Link
                href="/terms-of-service?from=signup"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7c3aed] hover:underline"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy?from=signup"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7c3aed] hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          {fieldErrors.terms && <p className="text-[12px] text-[#ef4444]">{fieldErrors.terms}</p>}
        </div>

        {/* API / OAuth error (anything that isn't tied to a single field) */}
        {error && (
          <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className={`flex w-full items-center justify-center gap-2 rounded-full ${GRADIENT_BG} px-8 py-[14px] text-[15px] font-bold text-white shadow-[0_2px_3px_rgba(124,58,237,0.1),0_8px_12px_rgba(124,58,237,0.25)] transition hover:brightness-105 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-[18px] animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e5e7eb]" />
        <span className="text-[12px] font-medium text-[#9ca3af]">or continue with</span>
        <div className="h-px flex-1 bg-[#e5e7eb]" />
      </div>

      {/* Social sign-up. Each button swaps its logo for a spinner while its own request is running. */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          disabled={busy}
          className={OAUTH_BUTTON_CLASS}
        >
          {oauthProvider === 'google' ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('github')}
          disabled={busy}
          className={OAUTH_BUTTON_CLASS}
        >
          {oauthProvider === 'github' ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#111827]" aria-hidden>
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          )}
          GitHub
        </button>
      </div>

      <p className="text-center text-[14px] text-[#4b5563]">
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold text-[#7c3aed] hover:text-[#6d28d9] hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}