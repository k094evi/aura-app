'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

// Routes that use the authenticated (logged-in) Navbar
const AUTHENTICATED_ROUTES = ['/dashboard', '/profile', '/analysis-history', '/settings'];
// "from" values on legal pages that mean the user arrived from an authenticated route.
const AUTHENTICATED_FROM_VALUES = ['dashboard', 'profile', 'analysis-history', 'settings'];
// Legal pages that have no fixed auth state of their own and instead
// borrow it from the "from" query param.
const LEGAL_ROUTES = ['/privacy', '/terms-of-service'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const hideNavFooter = ['/signup', '/signin'].includes(pathname);

  const isLegalRoute = LEGAL_ROUTES.includes(pathname);
  const isLegalFromAuth = isLegalRoute && !!from && AUTHENTICATED_FROM_VALUES.includes(from);
  const hideNavOnly = isLegalRoute && !isLegalFromAuth;

  // Authenticated if the route itself is authenticated, or if it's a legal
  // page reached from an authenticated route.
  const isAuthenticated =
    AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route)) || isLegalFromAuth;

  return (
    <>
      {!hideNavFooter && !hideNavOnly && (
        <Navbar isAuthenticated={isAuthenticated} />
      )}
      <main className="min-h-screen">{children}</main>
      {!hideNavFooter && <Footer />}
    </>
  );
}