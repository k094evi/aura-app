'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Site-wide footer with copyright notice and legal/contact links
export const Footer = () => {
  const pathname = usePathname();

  // Maps the current route to the "from" value /privacy and
  // /terms-of-service expect, so their back links point to wherever the
  // user came from.
  const fromMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/signin': 'signin',
    '/signup': 'signup',
    '/upload': 'upload',
  };

  const from = fromMap[pathname];
  const privacyHref = from ? `/privacy?from=${from}` : '/privacy';
  const termsHref = from ? `/terms-of-service?from=${from}` : '/terms-of-service';
  const contactHref = from ? `/contact-us?from=${from}` : '/contact-us';

  return (
    <footer className="border-t border-white/[0.07] bg-[#0c0a14] py-9">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 text-sm text-white/40 md:flex-row">
        <div className="mb-4 md:mb-0">
          © 2026 Aura. All rights reserved.
        </div>

        <div className="flex gap-8">
          <Link href={privacyHref} className="transition-colors hover:text-white/60">
            Privacy Policy
          </Link>
          <Link href={termsHref} className="transition-colors hover:text-white/60">
            Terms of Service
          </Link>
          <Link href={contactHref} className="transition-colors hover:text-white/60">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};