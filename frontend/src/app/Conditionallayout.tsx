'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide Navbar and Footer on auth pages, loading screen, and dashboard
  const hideNavFooter = ['/signup', '/signin', '/loading', '/dashboard'].includes(pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideNavFooter && <Footer />}
    </>
  );
}