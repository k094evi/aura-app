// components/Footer.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Site-wide footer with copyright notice and legal links
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

  return (
    <footer className="w-full font-['DM_Sans',_sans-serif]">
      {/* Gradient separator line */}
      <div
        className="h-px w-full"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.188) 30%, rgba(6, 182, 212, 0.188) 70%, rgba(6, 182, 212, 0) 100%)',
        }}
      />

      <div className="flex flex-col items-center gap-4 bg-white/[0.38] px-6 py-6 text-[13px] sm:px-10 md:flex-row md:items-center md:justify-between md:gap-0 md:px-20">
        <p className="font-normal text-[#9ca3af]">
          © 2026 Aura. All rights reserved.
        </p>

        <div className="flex items-center gap-8 font-medium text-[#4b5563]">
          <Link href={privacyHref} className="transition-colors hover:text-[#111827]">
            Privacy Policy
          </Link>
          <Link href={termsHref} className="transition-colors hover:text-[#111827]">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};