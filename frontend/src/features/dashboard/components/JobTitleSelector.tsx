// src/features/dashboard/components/JobTitleSelector.tsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Check, ChevronDown, X } from 'lucide-react';

import { SUPPORTED_JOB_TITLES } from '@/features/dashboard/data/supportedJobs';

// Select-only field. The user can NOT type a job title: the only values this
// component can ever produce are the roles in SUPPORTED_JOB_TITLES (the roles
// the backend has a skill checklist for, see job_requirements.py) or an empty
// string (no title chosen). Anything else is therefore impossible to enter,
// so an unlisted title can never start an analysis.
//
// Keyboard: Arrow Up/Down, Home/End, Enter/Space to pick, Esc to close,
// and typing a letter jumps to the next title starting with it.

const TITLES: readonly string[] = SUPPORTED_JOB_TITLES;

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
  placeholder = 'Select a job title',
}: JobTitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  // Highlighted row while the list is open (keyboard and hover).
  const [activeIndex, setActiveIndex] = useState(0);
  // Portals need `document`, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);

  // wrapperRef: the trigger + clear button together (outside-click detection
  // and menu positioning). menuRef: the portaled list (lives under <body>).
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const selectedIndex = TITLES.indexOf(value);
  const hasValue = selectedIndex !== -1;

  const close = () => setIsOpen(false);

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  // Recomputes where the dropdown is drawn, anchored just below the field.
  // Re-runs on scroll/resize while open so it tracks the field.
  //
  // Rendered through a portal into <body> because the Upload card uses
  // `backdrop-blur`, which creates its own CSS stacking context, so nothing
  // nested inside it can paint above sibling cards that come later in the DOM.
  const updateMenuRect = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Field scrolled out of view: close the menu instead of leaving it stuck on screen.
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      close();
      return;
    }
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

  // Keep the highlighted row visible when navigating with the keyboard.
  useEffect(() => {
    if (!isOpen || !menuRect) return;
    menuRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex, menuRect]);

  const selectTitle = (title: string) => {
    onChange(title);
    close();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) openMenu();
        else setActiveIndex((i) => Math.min(i + 1, TITLES.length - 1));
        return;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) openMenu();
        else setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        return;
      case 'End':
        if (isOpen) {
          e.preventDefault();
          setActiveIndex(TITLES.length - 1);
        }
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) openMenu();
        else selectTitle(TITLES[activeIndex]);
        return;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          close();
        }
        return;
      case 'Tab':
        close();
        return;
    }

    // Type-ahead: jump to the next title that starts with the pressed letter.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const ch = e.key.toLowerCase();
      const n = TITLES.length;
      const base = isOpen ? activeIndex : selectedIndex;
      for (let step = 1; step <= n; step++) {
        const idx = (base + step) % n;
        if (TITLES[idx].toLowerCase().startsWith(ch)) {
          e.preventDefault();
          setActiveIndex(idx);
          setIsOpen(true);
          return;
        }
      }
    }
  };

  // Close on a click outside the field or the (portaled) menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) close();
  }, [disabled]);

  // Safety net: if the parent ever hands in a title that is not on the list,
  // reset it so an unlisted title can't be submitted.
  useEffect(() => {
    if (value && !hasValue) onChange('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#4b5563]">
        {label}
      </label>

      <div ref={wrapperRef} className="relative">
        {/* Trigger: a button, not a text input, so nothing can be typed in. */}
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
          disabled={disabled}
          onClick={() => (isOpen ? close() : openMenu())}
          onKeyDown={handleKeyDown}
          // pr-10 leaves room for the arrow; pr-16 also leaves room for the clear button
          className={`flex w-full items-center rounded-[10px] border border-[#e5e7eb] bg-white py-[12px] pl-[14px] text-left text-[14px] shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15 disabled:cursor-not-allowed disabled:opacity-60 ${
            hasValue ? 'pr-16 text-[#111827]' : 'pr-10 text-[#9ca3af]'
          }`}
        >
          <span className="min-w-0 flex-1 truncate">{hasValue ? value : placeholder}</span>
        </button>

        {hasValue && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Clear job title"
            // Keep focus on the trigger so clicking this doesn't blur it
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange('');
              close();
            }}
            className="absolute right-[38px] top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#9ca3af] transition hover:text-[#ef4444]"
          >
            <X className="size-3.5" />
          </button>
        )}

        {/* Dropdown arrow, same icon and look as the Target Companies field */}
        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute right-[14px] top-1/2 size-4 shrink-0 -translate-y-1/2 text-[#9ca3af] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />

        {mounted &&
          createPortal(
            <AnimatePresence>
              {isOpen && menuRect && (
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
                  {TITLES.map((title, index) => {
                    const selected = index === selectedIndex;
                    const active = index === activeIndex;
                    return (
                      <button
                        key={title}
                        id={`${id}-option-${index}`}
                        data-index={index}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => selectTitle(title)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[13px] transition-colors ${
                          active ? 'bg-[#7c3aed]/[0.05]' : ''
                        } ${selected ? 'font-semibold text-[#7c3aed]' : 'text-[#4b5563]'}`}
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
    </div>
  );
}