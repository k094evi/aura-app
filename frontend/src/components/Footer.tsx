'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Site-wide footer with copyright notice and legal/contact links
export const Footer = () => {
  const pathname = usePathname();

  // Maps the current route to the "from" value /privacy expects, so its
  // back link points to wherever the user came from.
  const fromMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/signin': 'signin',
    '/signup': 'signup',
    '/upload': 'upload',
  };

  const from = fromMap[pathname];
  const privacyHref = from ? `/privacy?from=${from}` : '/privacy';

  return (
    <footer className="mt-20 py-10 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
        <div className="mb-4 md:mb-0">
          © 2026 Aura. All rights reserved.
        </div>

        <div className="flex gap-8">
          <Link href={privacyHref} className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};