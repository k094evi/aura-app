'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import SessionExpiryGuard from '@/components/SessionExpiryGuard';
import { isAuthenticated as checkIsAuthenticated, clearSession } from '@/lib/auth';

// Routes that use the authenticated (logged-in) Navbar
const AUTHENTICATED_ROUTES = ['/dashboard', '/profile', '/analysis-history', '/settings'];
// "from" values on legal pages that mean the user arrived from an authenticated route.
const AUTHENTICATED_FROM_VALUES = ['dashboard', 'profile', 'analysis-history', 'settings'];
// Legal pages that have no fixed auth state of their own and instead
// borrow it from the "from" query param.
const LEGAL_ROUTES = ['/privacy', '/terms-of-service'];
// Legal pages opened from these pages keep the Navbar hidden (they have none)
const NO_NAVBAR_FROM_VALUES = ['signup', 'signin', 'forgot-password', 'mfa-challenge'];
// "Back" button shown on the Privacy Policy / Terms pages, by where the visitor came from.
const LEGAL_BACK: Record<string, { href: string; label: string }> = {
  signup: { href: '/signup', label: 'Back to Sign Up' },
  signin: { href: '/signin', label: 'Back to Sign In' },
  'forgot-password': { href: '/forgot-password', label: 'Back to Forgot Password' },
  'mfa-challenge': { href: '/mfa-challenge', label: 'Back to Two-Factor Check' },
};
// Auth pages that draw their own full-screen layout (AuthShell / sign-in page),
// including their own footer, so the site-wide Navbar and Footer are hidden.
const HIDDEN_ROUTES = [
  '/signup',
  '/signin',
  '/forgot-password',
  '/reset-password',
  '/mfa-challenge',
  '/oauth-callback',
];

// Layout wrapper that conditionally shows/hides the Navbar and Footer
// based on the current route, and drives the Navbar's authenticated
// state from the real session stored by src/lib/auth.ts.
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  // Re-derived on every route change so the Navbar flips to the
  // authenticated view immediately after signin/signup saves a session
  // and redirects, without needing a full page reload.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(checkIsAuthenticated());
  }, [pathname]);

  // Hide Navbar and Footer entirely on the auth pages
  const hideNavFooter = HIDDEN_ROUTES.includes(pathname);

  // Legal pages (privacy/terms) have no fixed auth state of their own -
  // whether they show the authenticated or logged-out Navbar depends on
  // where the user came from (carried via the "from" query param).
  const isLegalRoute = LEGAL_ROUTES.includes(pathname);
  const isLegalFromAuth = isLegalRoute && !!from && AUTHENTICATED_FROM_VALUES.includes(from);

  // Only hide the Navbar on legal pages when the user came from an auth page
  // (those pages have no Navbar). From the upload page or a direct visit,
  // signed-out users get the public Navbar.
  // CHANGED: the Privacy Policy / Terms pages now always show the navigation bar,
  // even when opened from the sign-in / sign-up pages, so there is a way back.
  const hideNavOnly = false;
  const legalBack = isLegalRoute && from ? LEGAL_BACK[from] : undefined;

  // Authenticated if the real session says so, or if it's a legal page
  // reached from an authenticated route.
  const isAuthenticated =
    authed ||
    AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route)) ||
    isLegalFromAuth;

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
    router.push('/signin');
  };

  return (
    <>
      {/* Signs the user out after inactivity / token expiry (with a warning first) */}
      <SessionExpiryGuard />
      {/* Show Navbar unless on a hidden route */}
      {!hideNavFooter && !hideNavOnly && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}
      <main className="relative min-h-screen">
        {legalBack && (
          <Link
            href={legalBack.href}
            className="absolute left-4 top-28 z-30 flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-2 font-['DM_Sans',_sans-serif] text-[14px] font-medium text-[#374151] backdrop-blur-[8px] transition hover:bg-white sm:left-20"
          >
            <ArrowLeft className="size-4" />
            {legalBack.label}
          </Link>
        )}
        {children}
      </main>
      {/* Show Footer unless on a hidden route */}
      {!hideNavFooter && <Footer />}
    </>
  );
}