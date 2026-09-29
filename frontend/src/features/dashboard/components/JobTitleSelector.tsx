// src/features/dashboard/components/JobTitleSelector.tsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Check, ChevronDown } from 'lucide-react';

import { IT_JOB_TITLES, isItJobTitle } from '@/features/dashboard/data/itCatalog';

// The field is free-text: pick a suggestion or type any IT job title
// (e.g. "Senior React Developer"). Non-IT titles are flagged below the field
// and blocked when submitting.

interface JobTitleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  placeholder?: string;
}

type MenuRect = { top: number; left: number; width: number };

export default function JobTitleSelector({
  value,
  onChange,
  disabled = false,
  id = 'target-job-title',
  label = 'Target Job Title',
  placeholder = 'e.g. Backend Developer',
}: JobTitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  // True when the list was opened with the arrow: show every title instead of
  // filtering by whatever is already in the box. Reset as soon as the user types.
  const [showAll, setShowAll] = useState(false);
  // Portals need `document`, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);

  // wrapperRef: the input + arrow together (used for outside-click detection
  // and for positioning the menu). fieldRef: the actual <input>.
  // menuRef: the portaled suggestions list (lives under <body>).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const query = value.trim().toLowerCase();
  const suggestions =
    query && !showAll ? IT_JOB_TITLES.filter((t) => t.toLowerCase().includes(query)) : IT_JOB_TITLES;
  // Cap the list while typing so a short query doesn't dump 70+ rows at once.
  // When opened with the arrow, show everything (the menu scrolls).
  const visibleSuggestions = showAll ? suggestions : suggestions.slice(0, 8);
  const exactMatch = IT_JOB_TITLES.some((t) => t.toLowerCase() === query);
  // Text that is not (yet) an IT title, shown once the list is closed
  const invalid = query.length > 0 && !isItJobTitle(value) && !isOpen;

  const close = () => {
    setIsOpen(false);
    setShowAll(false);
  };

  // Recomputes where the dropdown should be drawn, anchored just below the
  // field. Re-runs on scroll/resize while open so it tracks the field.
  //
  // Rendered through a portal into <body> for the same reason
  // CompanySelector's dropdown is: the Upload card uses `backdrop-blur`,
  // which creates its own CSS stacking context, so nothing nested inside
  // it can ever paint above a sibling card that comes later in the DOM
  // (Jobs Targeted, Key Strengths, Smart Suggestions) no matter what
  // z-index it's given. Escaping to <body> sidesteps that entirely.
  const updateMenuRect = () => {
    const el = wrapperRef.current;
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

  const selectTitle = (title: string) => {
    onChange(title);
    close();
  };

  // The arrow toggles the list. Typing in the box still works as before.
  const toggleFromArrow = () => {
    if (disabled) return;
    if (isOpen) {
      close();
    } else {
      setShowAll(true);
      setIsOpen(true);
      fieldRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Enter' && isOpen) {
      e.preventDefault();
      if (isItJobTitle(value) || visibleSuggestions.length === 0) {
        // What's typed is already a valid IT title: keep it exactly as typed.
        close();
      } else {
        selectTitle(visibleSuggestions[0]);
      }
    }
  };

  // Close on a click outside the input/arrow or the (portaled) menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
      setShowAll(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) close();
  }, [disabled]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#4b5563]">
        {label}
      </label>

      <div ref={wrapperRef} className="relative">
        <input
          ref={fieldRef}
          id={id}
          type="text"
          // Suppress the browser's own history/autofill suggestions so
          // they can't show up alongside (or instead of) this dropdown.
          autoComplete="off"
          name={`${id}-field`}
          value={value}
          onChange={(e) => {
            setShowAll(false);
            onChange(e.target.value);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onClick={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          aria-invalid={invalid}
          // pr-10 leaves room for the arrow so long titles don't run under it
          className="w-full rounded-[10px] border border-[#e5e7eb] bg-white py-[12px] pl-[14px] pr-10 text-[14px] text-[#111827] shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {/* Dropdown arrow, same icon and look as the Target Companies field */}
        <button
          type="button"
          tabIndex={-1}
          aria-label={isOpen ? 'Hide job title suggestions' : 'Show job title suggestions'}
          disabled={disabled}
          // Keep focus in the input so clicking the arrow doesn't blur it
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleFromArrow}
          className="absolute right-[14px] top-1/2 -translate-y-1/2 disabled:cursor-not-allowed"
        >
          <ChevronDown
            className={`size-4 shrink-0 text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {mounted &&
          createPortal(
            <AnimatePresence>
              {isOpen && menuRect && visibleSuggestions.length > 0 && (
                <motion.div
                  ref={menuRef}
                  id={`${id}-listbox`}
                  role="listbox"
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
                  className="z-[999] max-h-64 overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white py-2 shadow-[0_16px_32px_rgba(17,24,39,0.12)]"
                >
                  {visibleSuggestions.map((title) => {
                    const selected = title.toLowerCase() === query;
                    return (
                      <button
                        key={title}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => selectTitle(title)}
                        className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[13px] transition-colors hover:bg-[#7c3aed]/[0.05] ${
                          selected ? 'font-semibold text-[#7c3aed]' : 'text-[#4b5563]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <Briefcase className="size-3.5 shrink-0 text-[#9ca3af]" />
                          <span className="truncate">{title}</span>
                        </span>
                        {selected && <Check className="size-4 shrink-0" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>

      {invalid && (
        <p role="alert" className="text-[12px] font-medium text-[#ef4444]">
          Enter an IT job title, e.g. Backend Developer.
        </p>
      )}
    </div>
  );
}