'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

// Layout wrapper that conditionally shows/hides the Navbar and Footer
// based on the current route
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  // Get the current route path
  const pathname = usePathname();
  // Hide Navbar and Footer on signup and signin pages
  const hideNavFooter = ['/signup', '/signin'].includes(pathname);

  return (
    <>
      {/* Show Navbar unless on a hidden route */}
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {/* Show Footer unless on a hidden route */}
      {!hideNavFooter && <Footer />}
    </>
  );
}