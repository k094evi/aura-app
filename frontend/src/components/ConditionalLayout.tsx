'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavFooter = ['/signup', '/signin'].includes(pathname);
  const hideNavOnly = ['/privacy'].includes(pathname);
  const authenticatedRoutes = ['/dashboard', '/profile', '/analysis-history', '/settings'];
  const isAuthenticated = authenticatedRoutes.some(route => pathname.startsWith(route));

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