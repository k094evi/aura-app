// src/features/dashboard/components/CompanySelector.tsx
'use client';

import { useState, useRef, useEffect, useLayoutEffect, useId, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Building2, ChevronDown, Check, Plus } from 'lucide-react';

// List of companies available for selection
const COMPANIES = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta',
  'Netflix', 'Tesla', 'Nvidia', 'Adobe', 'Salesforce',
  'Oracle', 'IBM', 'Intel', 'Cisco', 'SAP',
  'Uber', 'Airbnb', 'Spotify', 'Shopify', 'Stripe',
  'Dropbox', 'Slack', 'Zoom', 'LinkedIn', 'Twitter',
  'Reddit', 'Pinterest', 'Snapchat', 'TikTok', 'Discord',
  'PayPal', 'Square', 'Coinbase', 'Robinhood', 'Figma',
  'Notion', 'Atlassian', 'GitHub', 'GitLab', 'MongoDB',
  'Snowflake', 'Databricks', 'Cloudflare', 'Twilio', 'Okta',
  'ServiceNow', 'Workday', 'HubSpot', 'Zendesk', 'Splunk',
];

interface CompanySelectorProps {
  selectedCompanies: string[];
  onSelectionChange: (companies: string[]) => void;
  // Locks the field while an analysis is running
  disabled?: boolean;
  label?: string;
}

// Where the (portaled) dropdown should sit, computed from the trigger
// field's own bounding box rather than CSS `absolute` positioning.
type MenuRect = { top: number; left: number; width: number };

export default function CompanySelector({
  selectedCompanies,
  onSelectionChange,
  disabled = false,
  label = 'Target Companies',
}: CompanySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  // Portals need `document`, which doesn't exist during SSR — only
  // render the portal once mounted on the client.
  const [mounted, setMounted] = useState(false);

  // fieldRef: the clickable trigger row. menuRef: the portaled dropdown
  // itself (lives under <body>, NOT under fieldRef in the DOM anymore).
  // Outside-click detection below checks both.
  const fieldRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  useEffect(() => setMounted(true), []);

  const query = searchQuery.trim();
  const lowerQuery = query.toLowerCase();

  // Companies matching the current search query
  const filteredCompanies = COMPANIES.filter((company) =>
    company.toLowerCase().includes(lowerQuery)
  );

  // Offer to add a company that isn't in the list (the old free-text field allowed any name)
  const alreadyKnown =
    COMPANIES.some((c) => c.toLowerCase() === lowerQuery) ||
    selectedCompanies.some((c) => c.toLowerCase() === lowerQuery);
  const canAddCustom = query.length > 0 && !alreadyKnown;

  const close = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  // Recomputes where the dropdown should be drawn, anchored just below
  // the trigger field. Re-runs on scroll/resize while open so it tracks
  // the field instead of drifting once the page scrolls under it.
  const updateMenuRect = () => {
    const el = fieldRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuRect({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuRect();
    window.addEventListener('scroll', updateMenuRect, true);
    window.addEventListener('resize', updateMenuRect);
    return () => {
      window.removeEventListener('scroll', updateMenuRect, true);
      window.removeEventListener('resize', updateMenuRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleOpen = () => {
    if (disabled) return;
    if (isOpen) close();
    else setIsOpen(true);
  };

  // Add or remove a company from the selection
  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      onSelectionChange(selectedCompanies.filter((c) => c !== company));
    } else {
      onSelectionChange([...selectedCompanies, company]);
    }
  };

  const addCustom = () => {
    onSelectionChange([...selectedCompanies, query]);
    setSearchQuery('');
  };

  const handleFieldKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Ignore keys pressed on the chip remove buttons inside the field
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen();
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (canAddCustom && filteredCompanies.length === 0) addCustom();
      else if (filteredCompanies.length > 0) toggleCompany(filteredCompanies[0]);
    }
  };

  // Close the dropdown on a click outside either the trigger field OR
  // the portaled menu (the menu no longer lives inside the field's DOM
  // subtree, so both refs need to be checked separately now).
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (fieldRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
      setSearchQuery('');
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If the field gets locked while open, close it
  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
      setSearchQuery('');
    }
  }, [disabled]);

  return (
    <div className="flex min-w-0 flex-col gap-[6px] sm:w-1/2">
      <span id={labelId} className="text-left text-[13px] font-semibold text-[#4b5563]">
        {label}
      </span>

      <div className="relative">
        {/* Selector field showing selected companies as removable chips */}
        <div
          ref={fieldRef}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          onClick={toggleOpen}
          onKeyDown={handleFieldKeyDown}
          className={`flex min-h-[46px] w-full cursor-pointer flex-wrap items-center gap-2 rounded-[10px] border bg-white px-[14px] py-[7px] shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] outline-none transition focus-visible:border-[#7c3aed] focus-visible:ring-2 focus-visible:ring-[#7c3aed]/15 ${
            isOpen ? 'border-[#7c3aed] ring-2 ring-[#7c3aed]/15' : 'border-[#e5e7eb]'
          } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {selectedCompanies.length === 0 ? (
            <div className="flex flex-1 items-center gap-2 text-[14px] text-[#9ca3af]">
              <Building2 className="size-4 shrink-0" />
              <span className="truncate">Select target companies</span>
            </div>
          ) : (
            <div className="flex flex-1 flex-wrap gap-2">
              {selectedCompanies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 px-[10px] py-[3px] text-[13px] font-medium text-[#7c3aed]"
                >
                  {company}

                  {/* Remove this company from the selection */}
                  <button
                    type="button"
                    aria-label={`Remove ${company}`}
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectionChange(selectedCompanies.filter((c) => c !== company));
                    }}
                    className="text-[#7c3aed]/60 hover:text-[#7c3aed] disabled:cursor-not-allowed"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <ChevronDown
            className={`size-4 shrink-0 text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/*
          Dropdown is rendered through a portal straight into <body>,
          positioned with `fixed` coordinates from the field's own
          bounding box (menuRect) instead of `absolute` inside the field.

          WHY: the Upload card (and every other card on this page) uses
          `backdrop-blur`, which creates its own CSS stacking context.
          A z-index set on something nested *inside* that card can only
          ever win against other things inside the SAME stacking context
          — it can never paint above a sibling card that comes later in
          the DOM (Jobs Targeted, Key Strengths, Smart Suggestions), no
          matter how high the z-index number is. That's why the dropdown
          was rendering underneath those cards. Escaping to <body> via a
          portal sidesteps the whole problem.
        */}
        {mounted &&
          createPortal(
            <AnimatePresence>
              {isOpen && menuRect && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'fixed',
                    top: menuRect.top,
                    left: menuRect.left,
                    width: menuRect.width,
                  }}
                  className="z-[999] overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white shadow-[0_16px_32px_rgba(17,24,39,0.12)]"
                >
                  <div className="p-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />

                      <input
                        type="text"
                        autoFocus
                        autoComplete="off"
                        placeholder="Search or type a company..."
                        aria-label="Search companies"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-10 pr-4 text-[14px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15"
                      />
                    </div>
                  </div>

                  {/* Scrollable list of filtered company options */}
                  <div role="listbox" aria-multiselectable="true" className="max-h-64 overflow-y-auto pb-2">
                    {canAddCustom && (
                      <button
                        type="button"
                        onClick={addCustom}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] font-semibold text-[#7c3aed] transition-colors hover:bg-[#7c3aed]/[0.05]"
                      >
                        <Plus className="size-4" />
                        Add &ldquo;{query}&rdquo;
                      </button>
                    )}

                    {filteredCompanies.map((company) => {
                      const selected = selectedCompanies.includes(company);
                      return (
                        <button
                          key={company}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => toggleCompany(company)}
                          className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[13px] transition-colors hover:bg-[#7c3aed]/[0.05] ${
                            selected ? 'font-semibold text-[#7c3aed]' : 'text-[#4b5563]'
                          }`}
                        >
                          {company}
                          {selected && <Check className="size-4 shrink-0" />}
                        </button>
                      );
                    })}

                    {filteredCompanies.length === 0 && !canAddCustom && (
                      <p className="px-4 py-2 text-[13px] text-[#9ca3af]">No companies found</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </div>
  );
}