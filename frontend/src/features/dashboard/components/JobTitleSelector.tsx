// src/features/dashboard/components/JobTitleSelector.tsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Check } from 'lucide-react';

// Common job titles offered as suggestions. The field stays fully free-text —
// picking one just fills the input, and anything the user types that isn't
// on this list is kept exactly as typed.
const JOB_TITLES = [
  'Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer',
  'Mobile Developer', 'DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer',
  'QA Engineer', 'Software Tester', 'Database Administrator', 'Systems Administrator',
  'Network Engineer', 'Cybersecurity Analyst', 'Machine Learning Engineer', 'AI Engineer',
  'Data Scientist', 'Data Analyst', 'Business Analyst', 'Business Intelligence Analyst',
  'Product Manager', 'Product Designer', 'UX/UI Designer', 'Graphic Designer',
  'Project Manager', 'Program Manager', 'Scrum Master', 'Operations Manager',
  'IT Support Specialist', 'Technical Support Representative', 'Customer Service Representative',
  'Customer Support Specialist', 'Call Center Agent', 'BPO Team Leader', 'Virtual Assistant',
  'Marketing Manager', 'Digital Marketing Specialist', 'Social Media Manager', 'SEO Specialist',
  'Content Writer', 'Copywriter', 'Video Editor', 'Photographer',
  'Sales Executive', 'Sales Representative', 'Business Development Manager', 'Account Manager',
  'Human Resources Manager', 'Recruiter', 'Talent Acquisition Specialist', 'Training Specialist',
  'Accountant', 'Bookkeeper', 'Financial Analyst', 'Auditor',
  'Administrative Assistant', 'Executive Assistant', 'Office Manager',
  'Supply Chain Manager', 'Logistics Coordinator', 'Warehouse Supervisor',
  'Retail Store Manager', 'Restaurant Manager', 'Chef',
  'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Industrial Engineer',
  'Architect', 'Construction Manager',
  'Registered Nurse', 'Medical Technologist', 'Pharmacist', 'Physical Therapist',
  'Teacher', 'Research Analyst', 'Legal Assistant', 'Paralegal',
];

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
  placeholder = 'e.g. Senior Product Designer',
}: JobTitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<MenuRect | null>(null);
  // Portals need `document`, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);

  // fieldRef: the actual <input>. menuRef: the portaled suggestions list
  // (lives under <body>, not nested under the input in the DOM).
  const fieldRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const query = value.trim().toLowerCase();
  const suggestions = query
    ? JOB_TITLES.filter((t) => t.toLowerCase().includes(query))
    : JOB_TITLES;
  // Cap the visible list so a blank/short query doesn't dump 70+ rows at once.
  const visibleSuggestions = suggestions.slice(0, 8);
  const exactMatch = JOB_TITLES.some((t) => t.toLowerCase() === query);

  const close = () => setIsOpen(false);

  // Recomputes where the dropdown should be drawn, anchored just below the
  // input. Re-runs on scroll/resize while open so it tracks the field.
  //
  // Rendered through a portal into <body> for the same reason
  // CompanySelector's dropdown is: the Upload card uses `backdrop-blur`,
  // which creates its own CSS stacking context, so nothing nested inside
  // it can ever paint above a sibling card that comes later in the DOM
  // (Jobs Targeted, Key Strengths, Smart Suggestions) no matter what
  // z-index it's given. Escaping to <body> sidesteps that entirely.
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

  const selectTitle = (title: string) => {
    onChange(title);
    close();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Enter' && isOpen && visibleSuggestions.length > 0 && !exactMatch) {
      // Only auto-pick on Enter when the current text isn't already an
      // exact title — otherwise Enter should just confirm what's typed.
      e.preventDefault();
      selectTitle(visibleSuggestions[0]);
    }
  };

  // Close on a click outside either the input or the (portaled) menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (fieldRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
      <label htmlFor={id} className="text-[13px] font-semibold text-[#4b5563]">
        {label}
      </label>

      <div className="relative">
        <input
          ref={fieldRef}
          id={id}
          type="text"
          // Suppress the browser's own history/autofill suggestions so
          // they can't show up alongside (or instead of) this dropdown.
          autoComplete="off"
          name={`${id}-field`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          className="w-full rounded-[10px] border border-[#e5e7eb] bg-white px-[14px] py-[12px] text-[14px] text-[#111827] shadow-[0_1px_1.5px_rgba(17,24,39,0.04)] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/15 disabled:cursor-not-allowed disabled:opacity-60"
        />

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
    </div>
  );
}