import Link from 'next/link';

// Site-wide footer with copyright notice and legal/contact links
export const Footer = () => {
  return (
    <footer className="mt-20 py-10 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">

        {/* Copyright notice */}
        <div className="mb-4 md:mb-0">
          © 2026 Aura. All rights reserved.
        </div>

        {/* Legal and contact links */}
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">
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