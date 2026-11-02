'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

export type TocItem = { id: string; label: string };

type Props = {
  items: TocItem[];
};

// Safety net only: the lock is released on 'scrollend' (or when this expires).
const CLICK_LOCK_MS = 1200;
// Sections get scroll-mt-32 (8rem) so they clear the fixed navbar.
const NAVBAR_OFFSET = 128;

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');
  const navRef = useRef<HTMLElement>(null);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);

  // Highlight rule: the section at the MIDDLE of the screen, i.e. the last
  // section whose top edge has passed the middle line. At the very bottom of
  // the page the last section is highlighted, since a short last section may
  // never reach the middle line.
  const updateActive = useCallback(() => {
    if (items.length === 0) return;

    const middle = window.innerHeight / 2;
    let current = items[0].id;

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= middle) current = item.id;
    }

    const doc = document.documentElement;
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= doc.scrollHeight - 4;
    if (atBottom) current = items[items.length - 1].id;

    setActiveId(current);
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      if (lockedRef.current) return;
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateActive();
      });
    };

    updateActive();
    // Capture on document so we also catch scrolling if a layout wrapper (not
    // the window) is the scroll container. Passive for smoothness.
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [updateActive]);

  // The sidebar itself can scroll on short screens, so keep the highlighted
  // item visible inside it. Only the sidebar moves, never the page.
  useEffect(() => {
    const box = navRef.current?.closest('aside');
    const button = navRef.current?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!box || !button) return;

    const c = box.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    if (b.top < c.top) box.scrollTop -= c.top - b.top + 8;
    else if (b.bottom > c.bottom) box.scrollTop += b.bottom - c.bottom + 8;
  }, [activeId]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    // Highlight right away and hold it until the smooth scroll ends.
    setActiveId(id);
    lockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);

    const unlock = () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      lockedRef.current = false;
      updateActive(); // re-sync with the middle-of-screen rule
    };
    lockTimerRef.current = setTimeout(unlock, CLICK_LOCK_MS);
    window.addEventListener('scrollend', unlock, { once: true });

    // Bring the section to the MIDDLE of the screen so the clicked item and
    // the "middle of screen" rule agree. Sections taller than the visible
    // area are aligned to the top (below the navbar) instead.
    const rect = target.getBoundingClientRect();
    const visible = window.innerHeight - NAVBAR_OFFSET;
    const top =
      rect.height < visible
        ? rect.top + window.scrollY - (window.innerHeight - rect.height) / 2
        : rect.top + window.scrollY - NAVBAR_OFFSET;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Table of contents"
      className="flex flex-col gap-1 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-4 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]"
    >
      <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">
        Table of Contents
      </p>

      <ul className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                onClick={(e) => handleClick(e, item.id)}
                className={`block rounded-[10px] border px-3 py-1.5 text-[13px] leading-[18px] transition-colors ${
                  active
                    ? 'border-[#7c3aed]/20 bg-[#7c3aed]/[0.08] font-bold text-[#7c3aed]'
                    : 'border-transparent font-medium text-[#4b5563] hover:bg-[#7c3aed]/[0.05]'
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}