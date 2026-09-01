'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, User, Settings, LogOut, ChevronDown, FileBarChart, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const Navbar = ({ isAuthenticated = false, onLogout }: { isAuthenticated?: boolean, onLogout?: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@email.com');
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#151221]/70 backdrop-blur-[20px] border-b border-white/[0.07] shadow-[0px_10px_24px_0px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / brand link */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-xl flex items-center justify-center">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Aura</span>
        </Link>

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-8 h-8 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{initials}</span>
              </div>
              <span className="text-sm font-medium text-white/90">{userName}</span>
              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-[#151221] rounded-xl shadow-2xl border border-white/[0.08] overflow-hidden"
                >
                  {/* User info header  */}
                  <div className="p-3 border-b border-white/[0.07] bg-white/[0.03]">
                    <p className="text-sm font-bold text-white">{userName}</p>
                    <p className="text-xs text-white/50">{userEmail}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-fuchsia-400 transition-colors flex items-center gap-3"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/analysis-history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-fuchsia-400 transition-colors flex items-center gap-3"
                    >
                      <FileBarChart className="w-4 h-4" />
                      My Analysis History
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-fuchsia-400 transition-colors flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <Link
                      href="/billing"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-fuchsia-400 transition-colors flex items-center gap-3"
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-white/[0.07] py-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
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
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0px_4px_6px_0px_rgba(139,92,246,0.25)]">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};