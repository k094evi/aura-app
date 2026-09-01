'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { isAuthenticated as checkIsAuthenticated, clearSession } from '@/lib/auth';

// Routes that use the authenticated (logged-in) Navbar
const AUTHENTICATED_ROUTES = ['/dashboard', '/profile', '/analysis-history', '/settings'];
// "from" values on legal pages that mean the user arrived from an authenticated route.
const AUTHENTICATED_FROM_VALUES = ['dashboard', 'profile', 'analysis-history', 'settings'];
// Legal pages that have no fixed auth state of their own and instead
// borrow it from the "from" query param.
const LEGAL_ROUTES = ['/privacy', '/terms-of-service'];

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

  // Hide Navbar and Footer entirely on signup and signin pages
  const hideNavFooter = ['/signup', '/signin'].includes(pathname);

  // Legal pages (privacy/terms) have no fixed auth state of their own -
  // whether they show the authenticated or logged-out Navbar depends on
  // where the user came from (carried via the "from" query param).
  const isLegalRoute = LEGAL_ROUTES.includes(pathname);
  const isLegalFromAuth = isLegalRoute && !!from && AUTHENTICATED_FROM_VALUES.includes(from);
  const hideNavOnly = isLegalRoute && !isLegalFromAuth && !authed;

  // Authenticated if the real session says so, or if it's a legal page
  // reached from an authenticated route.
  const isAuthenticated =
    authed || (AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route))) || isLegalFromAuth;

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
    router.push('/signin');
  };

  return (
    <>
      {/* Show Navbar unless on a hidden route */}
      {!hideNavFooter && !hideNavOnly && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}
      <main className="min-h-screen">
        {children}
      </main>
      {/* Show Footer unless on a hidden route */}
      {!hideNavFooter && <Footer />}
    </>
  );
}