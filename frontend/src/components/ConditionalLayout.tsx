'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { isAuthenticated as checkIsAuthenticated, clearSession } from '@/lib/auth';

// Layout wrapper that conditionally shows/hides the Navbar and Footer
// based on the current route, and drives the Navbar's authenticated
// state from the real session stored by src/lib/auth.ts.
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Re-derived on every route change so the Navbar flips to the
  // authenticated view immediately after signin/signup saves a session
  // and redirects, without needing a full page reload.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(checkIsAuthenticated());
  }, [pathname]);

  // Hide Navbar and Footer on signup and signin pages
  const hideNavFooter = ['/signup', '/signin'].includes(pathname);

  const handleLogout = () => {
    clearSession();
    setAuthed(false);
    router.push('/signin');
  };

  return (
    <>
      {/* Show Navbar unless on a hidden route */}
      {!hideNavFooter && <Navbar isAuthenticated={authed} onLogout={handleLogout} />}
      <main className="min-h-screen">
        {children}
      </main>
      {/* Show Footer unless on a hidden route */}
      {!hideNavFooter && <Footer />}
    </>
  );
}
