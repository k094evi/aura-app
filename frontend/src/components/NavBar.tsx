// components/Navbar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';

const AUTH_NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'History', href: '/analysis-history' },
  { label: 'AI Mode', href: '/ai-mode' },
  { label: 'Settings', href: '/settings' },
];

const PUBLIC_NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact Us', href: '/#contact' },
];

// Sections of the home page (element ids) that the navbar highlights while you scroll.
// Order must match their order on the page, top to bottom.
const HOME_SECTION_IDS = ['features', 'faq', 'contact'];

// Pages that have their own full-screen layout (per the Figma design) and
// must NOT show the top navbar. Add any other auth-flow routes here.
const NAVBAR_HIDDEN_ROUTES = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/oauth-callback',
];

// Top navigation bar - shows user menu when authenticated, sign in/up links otherwise.
// If a page passes `isAuthenticated`, that wins; otherwise the stored session decides.
export const Navbar = ({
  isAuthenticated: isAuthenticatedProp,
  onLogout,
}: {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}) => {
  // Controls visibility of the user dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Ref used to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [userName, setUserName] = useState('Your Account');
  const [userEmail, setUserEmail] = useState('');
  // null = session not checked yet (prevents a flash of the public navbar)
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  // Which home-page section is being read: 'home' (top of the page) or one of HOME_SECTION_IDS
  const [activeSection, setActiveSection] = useState('home');

  // Read the session on the client (avoids hydration mismatch).
  // Re-runs on navigation so it stays correct after sign in/out.
  useEffect(() => {
    const stored = getStoredUser();
    setHasSession(!!stored);
    if (stored) {
      setUserName(stored.full_name || stored.email || 'Your Account');
      setUserEmail(stored.email || '');
    } else {
      setUserName('Your Account');
      setUserEmail('');
    }
  }, [pathname, isAuthenticatedProp]);

  // Prop wins if a page passes it explicitly; otherwise use the session
  const isAuthenticated = isAuthenticatedProp ?? hasSession === true;
  // We know which navbar to show if the prop was given or the session was checked
  const sessionReady = isAuthenticatedProp !== undefined || hasSession !== null;

  // Generate initials from the user's name (e.g. "John Doe" -> "JD")
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll-spy for the home page: highlight Home / Features / FAQ / Contact Us
  // depending on which section is currently being read.
  useEffect(() => {
    if (pathname !== '/') return;

    let frame = 0;

    const update = () => {
      const threshold = Math.max(160, window.innerHeight * 0.35);
      let current = 'home';

      // The last section whose top has scrolled past the threshold is the current one
      for (const id of HOME_SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) current = id;
      }

      // At the very bottom of the page, the last section counts as current
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = HOME_SECTION_IDS[HOME_SECTION_IDS.length - 1];

      setActiveSection(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Hide the navbar on auth pages. This must stay *after* all hooks above so
  // the hook order never changes between renders.
  const hideNavbar =
    !!pathname &&
    NAVBAR_HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (hideNavbar) return null;

  const navLinks = isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;

  // On the home page the section links follow the scroll position;
  // everywhere else a link is active when it matches the current path.
  const isLinkActive = (href: string) => {
    if (pathname === '/') {
      if (href === '/') return activeSection === 'home';
      if (href.startsWith('/#')) return activeSection === href.slice(2);
    }
    return pathname === href;
  };

  return (
    <nav className="fixed top-6 inset-x-4 sm:inset-x-8 lg:inset-x-20 z-50 font-['DM_Sans',_sans-serif]">
      <div className="relative flex items-center justify-between gap-4 rounded-full border border-white bg-white/80 backdrop-blur-[10px] pl-6 pr-3.5 py-3.5 shadow-[0px_2px_8px_0px_rgba(31,41,55,0.04),0px_8px_32px_0px_rgba(31,41,55,0.06)]">
        {/* Logo / brand link */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#06b6d4] rounded-lg flex items-center justify-center">
            <Brain className="text-white w-4 h-4" />
          </div>
          <span className="text-[22px] font-bold tracking-tight text-[#111827]">Aura</span>
        </Link>

        {/* Centered nav links (hidden until we know which set to show) */}
        {sessionReady && (
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? 'font-semibold text-[#111827]'
                      : 'font-medium text-[#4b5563] hover:text-[#111827] transition-colors'
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {!sessionReady ? (
          // Placeholder while the session is being checked, keeps the navbar height stable
          <div className="h-10 w-40 shrink-0" aria-hidden="true" />
        ) : isAuthenticated ? (
          // Authenticated state: show user avatar with dropdown menu
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-black/[0.03] transition-colors"
            >
              {/* Avatar showing user initials */}
              <div className="w-8 h-8 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-[#111827]">{userName}</span>
              <ChevronDown className={`w-4 h-4 text-[#9ca3af] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Animated dropdown menu with user info and account actions */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0px_15px_40px_0px_rgba(17,24,39,0.12)] border border-white/80 overflow-hidden"
                >
                  {/* User info header */}
                  <div className="p-3 border-b border-[#f3f4f6] bg-[#faf9ff]">
                    <p className="text-sm font-bold text-[#111827]">{userName}</p>
                    <p className="text-xs text-[#9ca3af]">{userEmail}</p>
                  </div>

                  {/* Logout action */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setHasSession(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Unauthenticated state: show Sign In / Get Started links
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/signin" className="text-sm font-semibold text-[#4b5563] hover:text-[#111827] transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-[22px] py-[11px] bg-[#111827] text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity drop-shadow-[0px_4px_6px_rgba(17,24,39,0.1)]"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};