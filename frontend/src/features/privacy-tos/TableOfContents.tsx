// src/features/privacy-policy/TableOfContents.tsx

'use client';

import { useEffect, useState, type MouseEvent } from 'react';

type TocItem = { id: string; label: string };

// Sticky "Table of Contents" card. Highlights the section currently being
// read and smooth-scrolls to a section when its entry is clicked.
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the sections inside the "reading band", pick the top-most one.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Table of contents"
      className="flex w-full flex-col gap-4 rounded-[24px] border-[1.5px] border-white bg-white/[0.72] p-6 shadow-[0_10px_30px_rgba(17,24,39,0.03)] backdrop-blur-[12px]"
    >
      <p className="text-[12px] font-bold uppercase text-[#9ca3af]">Table of Contents</p>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a  
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`rounded-[12px] border px-4 py-[10px] text-[14px] transition-colors ${
                isActive
                  ? 'border-[#7c3aed]/20 bg-[#7c3aed]/[0.07] font-bold text-[#7c3aed]'
                  : 'border-transparent font-medium text-[#4b5563] hover:bg-[#7c3aed]/[0.04] hover:text-[#111827]'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}