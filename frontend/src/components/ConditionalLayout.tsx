'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

// Routes that use the authenticated (logged-in) Navbar.
const AUTHENTICATED_ROUTES = ['/dashboard', '/profile', '/analysis-history', '/settings'];
// "from" values on /privacy that mean the user arrived from an authenticated route.
const AUTHENTICATED_FROM_VALUES = ['dashboard', 'profile', 'analysis-history', 'settings'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const hideNavFooter = ['/signup', '/signin'].includes(pathname);

  // /privacy has no fixed auth state of its own, so it borrows it from
  // wherever the user came from via the "from" query param.
  const isPrivacyFromAuth = pathname === '/privacy' && !!from && AUTHENTICATED_FROM_VALUES.includes(from);
  const hideNavOnly = pathname === '/privacy' && !isPrivacyFromAuth;

  // Authenticated if the route itself is authenticated, or if it's /privacy
  // reached from an authenticated route.
  const isAuthenticated =
    AUTHENTICATED_ROUTES.some((route) => pathname.startsWith(route)) || isPrivacyFromAuth;

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